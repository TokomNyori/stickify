import Navbar from '@/components/Navbar'
import './globals.css'
import './app.css'
import { Nunito } from 'next/font/google'
import Footer from '@/components/Footer'
import ReduxProvider from '@/components/redux/ReduxProvider'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata = {
  title: 'stickify',
  description: 'Created using Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nunito.className} flex flex-col min-h-screen`}>
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
