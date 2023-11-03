import Navbar from '@/components/Navbar'
import './globals.css'
import './app.css'
import { Nunito } from 'next/font/google'
import Footer from '@/components/Footer'
import ReduxProvider from '@/components/redux/ReduxProvider'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata = {
  title: 'stickify',
  description: 'Your AI Sticker-notes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${nunito.className} flex flex-col min-h-screen bg-[#e6e9e7] text-gray-700 dark:bg-gray-700 dark:text-gray-100`}>
        <ReduxProvider>
          <Navbar />
          <div className='mt-16 mb-16 flex-grow'>
            {children}
          </div>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  )
}
