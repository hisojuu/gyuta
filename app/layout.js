import './globals.css'

export const metadata = {
  title: 'GymTrackerAI',
  description: 'Minimalist fitness and nutrition tracker with AI meal analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 antialiased">
        {children}
      </body>
    </html>
  )
}
