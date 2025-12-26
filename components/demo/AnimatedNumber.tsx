'use client'

import { animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type AnimatedNumberProps = {
  value: number
  format: (value: number) => string
}

export default function AnimatedNumber({ value, format }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const currentRef = useRef(value)

  useEffect(() => {
    const controls = animate(currentRef.current, value, {
      duration: 0.6,
      ease: 'easeOut',
      onUpdate: (latest) => {
        currentRef.current = latest
        setDisplay(latest)
      },
    })

    return () => controls.stop()
  }, [value])

  return <span>{format(display)}</span>
}
