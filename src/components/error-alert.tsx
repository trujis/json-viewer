"use client"

import React from "react"

type ErrorAlertProps = {
  message: string
  title?: string
  onRetry?: () => void
  onClose?: () => void
  className?: string
}

export default function ErrorAlert({
  message,
  title = "An error occurred",
  onRetry,
  onClose,
  className = "",
}: ErrorAlertProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${className}`}
    >
      <div className="w-full max-w-lg rounded-xl border border-red-500/30 bg-[#1f2937] text-white shadow-2xl">
        <div className="flex items-start gap-3 p-4">
          <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">
            {/* Exclamation icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l8.157 19.62A1.25 1.25 0 0 1 20.25 25H3.75a1.25 1.25 0 0 1-1.12-2.17l8.158-19.62ZM12 8.75a.75.75 0 0 0-.75.75v5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-.75-.75Zm0 9.75a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-red-300">{title}</h2>
            <p className="mt-1 text-sm text-red-200/90">{message}</p>
          </div>
          {onClose && (
            <button
              aria-label="Cerrar"
              onClick={onClose}
              className="rounded-md p-2 text-gray-300 hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M6.225 4.811a1 1 0 0 1 1.414 0L12 9.172l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 10.586l4.361 4.361a1 1 0 1 1-1.414 1.414L12 12l-4.361 4.361a1 1 0 1 1-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 0 1 0-1.414Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-white/5 p-3">
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
            >
              Close
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-md border border-red-500/30 bg-red-600/80 px-3 py-1.5 text-sm text-white hover:bg-red-600"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
