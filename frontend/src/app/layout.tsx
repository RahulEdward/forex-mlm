import './globals.css'

export const metadata = {
  title: 'Next.js + FastAPI',
  description: 'Full-stack application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
