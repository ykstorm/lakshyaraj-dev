"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface TextGenerateEffectProps {
  words: string
  className?: string
  delay?: number
}

export function TextGenerateEffect({ words, className = "", delay = 0 }: TextGenerateEffectProps) {
  const [visibleWords, setVisibleWords] = useState(0)
  const wordsArray = words.split(" ")

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        i++
        setVisibleWords(i)
        if (i >= wordsArray.length) clearInterval(interval)
      }, 100)
      return () => clearInterval(interval)
    }, delay * 1000 + 300)

    return () => clearTimeout(timer)
  }, [delay, wordsArray.length])

  return (
    <div className={`flex flex-wrap justify-center gap-x-2 ${className}`}>
      {wordsArray.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: i < visibleWords ? 1 : 0, y: i < visibleWords ? 0 : 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}