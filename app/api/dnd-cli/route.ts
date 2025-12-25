import { NextResponse } from 'next/server'
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import path from 'path'
import fs from 'fs/promises'
import { z } from 'zod'

const PROMPT_DIRECTORY = path.join(process.cwd(), 'components/dnd-cli/prompts')
const PROMPT_FILES = {
  background: 'backgroundinfo.txt',
  safety: 'safeinstructions.txt',
} as const

const promptCache: Record<keyof typeof PROMPT_FILES, string | null> = {
  background: null,
  safety: null,
}

const requestSchema = z.object({
  message: z.string().min(1).max(800),
})

const suspiciousPhrases = [
  'ignore previous',
  'ignore all',
  'forget these instructions',
  'system prompt',
  'prompt injection',
  'jailbreak',
  'developer mode',
  'bypass',
  'backdoor',
  'exploit',
  'phishing',
  'malware',
  'sql injection',
  'drop table',
  'password dump',
]

const urlRegex = /(https?:\/\/|www\.)/i

const MIN_QUESTION_LENGTH = 8

export const dynamic = 'force-dynamic'

async function loadPrompt(key: keyof typeof PROMPT_FILES) {
  if (promptCache[key]) {
    return promptCache[key] as string
  }

  const filePath = path.join(PROMPT_DIRECTORY, PROMPT_FILES[key])
  const fileContents = await fs.readFile(filePath, 'utf8')
  promptCache[key] = fileContents.trim()
  return promptCache[key] as string
}

function sanitizeInput(raw: string) {
  const stripped = raw.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '')
  return stripped.replace(/\s+/g, ' ').trim()
}

function getPolicyViolationMessage(input: string) {
  const normalized = input.toLowerCase()

  if (urlRegex.test(input)) {
    return 'Links are not allowed. Please describe your request without URLs.'
  }

  if (suspiciousPhrases.some((phrase) => normalized.includes(phrase))) {
    return 'Your request was blocked because it appears to violate our safety guidelines.'
  }

  if (normalized.length < MIN_QUESTION_LENGTH) {
    return 'Please provide more detail so we can assist you.'
  }

  return null
}

function buildPromptDocument(background: string, safety: string, userQuestion: string) {
  return [
    safety,
    '',
    'REFERENCE DOCUMENT:',
    background,
    '',
    'USER QUESTION:',
    userQuestion,
    '',
    'Respond strictly according to the reference document and the safety rules.',
  ].join('\n')
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'Service is not configured correctly.' }, { status: 500 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 })
  }

  const parsed = requestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Please provide a message under 800 characters.' }, { status: 400 })
  }

  const sanitizedQuestion = sanitizeInput(parsed.data.message)

  if (!sanitizedQuestion) {
    return NextResponse.json({ error: 'Please provide a valid question.' }, { status: 400 })
  }

  const violationMessage = getPolicyViolationMessage(sanitizedQuestion)
  if (violationMessage) {
    return NextResponse.json({ error: violationMessage }, { status: 400 })
  }

  try {
    const [background, safety] = await Promise.all([loadPrompt('background'), loadPrompt('safety')])
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      ],
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 512,
      },
    })

    const compiledPrompt = buildPromptDocument(background, safety, sanitizedQuestion)
    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: compiledPrompt }],
        },
      ],
    })

    const outputText = response.response?.text()?.trim()

    if (!outputText) {
      throw new Error('Empty response from Gemini')
    }

    return NextResponse.json({ message: outputText })
  } catch (error) {
    console.error('DnD CLI error:', error)
    return NextResponse.json({ error: 'Unable to process your request right now. Please try again later.' }, { status: 500 })
  }
}
