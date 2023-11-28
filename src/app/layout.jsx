import Navbar from '@/components/Navbar'
import './globals.css'
import './app.css'
import './more.css'
import { Nunito, Caveat } from 'next/font/google'
import Footer from '@/components/Footer'
import ReduxProvider from '@/components/redux/ReduxProvider'

const nunito = Nunito(
  {
    subsets: ['latin'],
    display: 'swap',
  }
)

const caveat = Caveat(
  {
    subsets: ['latin'],
    display: 'swap',
  }
)

export const metadata = {
  title: 'stickify',
  description: 'Your AI Sticker-notes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // bg-[#e6e9e7]
        className={`${nunito.className} flex flex-col min-h-screen bg-zinc-100 text-gray-800 dark:bg-zinc-900 dark:text-gray-100`}>
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
