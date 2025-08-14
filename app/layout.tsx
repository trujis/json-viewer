import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "JSON Viewer",
  description: "Created by Guillem Trujillo",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <head></head>
      <body>{children}</body>
    </html>
  )
}
