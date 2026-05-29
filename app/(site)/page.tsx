"use client"

import { AuroraBackground } from "@/components/ui/aurora-background"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Home() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center min-h-screen px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 tracking-tight text-white">
          Lakshyaraj Singh Rao
        </h1>
        <TextGenerateEffect
          words="Full-Stack Engineer. AI Systems. Backend. DevOps."
          className="text-xl md:text-2xl text-zinc-400 text-center mb-12 max-w-2xl"
          delay={0.5}
        />
        <div className="flex gap-4">
          <Link
            href="/projects"
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-medium text-white"
          >
            See projects
          </Link>
          <Link
            href="mailto:raolakshyaraj@gmail.com"
            className="px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 transition font-medium text-zinc-300"
          >
            Get in touch
          </Link>
        </div>
      </motion.div>
    </AuroraBackground>
  )
}