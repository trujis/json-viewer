"use client"

import React from "react"

type LoadingOverlayProps = {
  message?: string
  className?: string
}

export default function LoadingOverlay({
  message = "Loading…",
  className = "",
}: LoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 ${className}`}
    >
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111827]/80 px-4 py-3 text-white shadow-xl backdrop-blur">
        <svg
          className="h-5 w-5 animate-spin text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}
