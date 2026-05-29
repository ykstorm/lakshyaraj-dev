"use client"

import { useEffect, useRef } from "react"

interface AuroraBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function AuroraBackground({ children, className = "" }: AuroraBackgroundProps) {
  return (
    <div className={`relative w-full min-h-screen overflow-hidden bg-[#0a0a0a] ${className}`}>
      <div className="aurora-bg absolute inset-0 z-0" />
      <div className="relative z-10">{children}</div>
      <style>{`
        .aurora-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .aurora-bg::before,
        .aurora-bg::after,
        .aurora-bg > span {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.6;
          animation: aurora-float 12s ease-in-out infinite;
        }
        .aurora-bg::before {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
          top: -20%;
          left: -10%;
          animation-delay: 0s;
        }
        .aurora-bg::after {
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%);
          top: 10%;
          right: -15%;
          animation-delay: -4s;
          animation-duration: 15s;
        }
        .aurora-bg > span:nth-child(3) {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
          bottom: -10%;
          left: 30%;
          animation-delay: -8s;
          animation-duration: 18s;
        }
        .aurora-bg > span:nth-child(4) {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 201, 246, 0.25) 0%, transparent 70%);
          top: 40%;
          left: 10%;
          animation-delay: -3s;
          animation-duration: 14s;
        }
        @keyframes aurora-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(40px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 40px) scale(0.95); }
          75% { transform: translate(30px, 20px) scale(1.05); }
        }
      `}</style>
    </div>
  )
}