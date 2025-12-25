import { NextResponse } from 'next/server'
import tls from 'tls'

type ContactPayload = {
  fullName: string
  email: string
  company?: string
  services: string[]
  details: string
}

const encodeBase64 = (value: string) => Buffer.from(value).toString('base64')

const waitForResponse = (socket: tls.TLSSocket) =>
  new Promise<{ code: number; message: string }>((resolve, reject) => {
    const handleData = (chunk: Buffer) => {
      const message = chunk.toString()
      const lines = message.trim().split(/\r?\n/)
      const lastLine = lines[lines.length - 1]
      const code = parseInt(lastLine.slice(0, 3), 10)
      socket.off('error', handleError)
      resolve({ code, message })
    }

    const handleError = (error: Error) => {
      socket.off('data', handleData)
      reject(error)
    }

    socket.once('data', handleData)
    socket.once('error', handleError)
  })

async function sendCommand(socket: tls.TLSSocket, command?: string) {
  if (command) {
    socket.write(`${command}\r\n`)
  }
  const response = await waitForResponse(socket)
  if (!response.message) {
    throw new Error('Empty SMTP response')
  }
  return response
}

async function sendContactEmail(payload: ContactPayload) {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_APP_PASSWORD

  if (!user || !pass) {
    throw new Error('Email credentials are not configured.')
  }

  const socket = tls.connect({ host: 'smtp.gmail.com', port: 465 })

  try {
    await sendCommand(socket) // initial greeting
    await sendCommand(socket, 'EHLO dndsolutions.app')
    await sendCommand(socket, 'AUTH LOGIN')
    await sendCommand(socket, encodeBase64(user))
    await sendCommand(socket, encodeBase64(pass))
    await sendCommand(socket, `MAIL FROM:<${user}>`)
    await sendCommand(socket, `RCPT TO:<${user}>`)
    await sendCommand(socket, 'DATA')

    const body = [
      `Subject: New Contact Request from ${payload.fullName}`,
      `To: ${user}`,
      `From: ${user}`,
      'Content-Type: text/plain; charset="utf-8"',
      '',
      `Name: ${payload.fullName}`,
      `Email: ${payload.email}`,
      `Company: ${payload.company || '—'}`,
      `Services: ${payload.services.join(', ') || '—'}`,
      '',
      'Details:',
      payload.details,
      '',
      '--',
      'Sent from dndsolutions.app contact form.',
    ].join('\r\n')

    socket.write(`${body}\r\n.\r\n`)
    await waitForResponse(socket)
    await sendCommand(socket, 'QUIT')
  } finally {
    socket.end()
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload

    if (!payload.fullName || !payload.email || !payload.details || !payload.services?.length) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 })
    }

    await sendContactEmail(payload)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ message: 'Failed to send message.' }, { status: 500 })
  }
}

