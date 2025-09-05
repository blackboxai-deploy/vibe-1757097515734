import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FitNutrition - Sua jornada de saúde e nutrição',
  description: 'Aplicativo moderno de nutrição para perda de gordura e ganho de massa muscular',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
          {children}
        </div>
      </body>
    </html>
  )
}