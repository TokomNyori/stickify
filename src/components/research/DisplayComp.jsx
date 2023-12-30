import Lottie from 'lottie-react'
import orbOne from '@/assets/others/orb1.json'
import { Prompt } from 'next/font/google'
import PromptCards from './PromptCards'

const DisplayComp = () => {
  return (
    <div className='flex flex-col justify-start items-center gap-16 sm:gap-16 mb-5 w-full'>
      {/* Cyra Orb */}
      <div className='flex flex-col justify-center items-center' >
        <div className="">
          <Lottie className="rounded-full w-[8rem]" animationData={orbOne} loop={true} />
        </div>
        <h1 className=' text-lg font-bold'>Hi, I'm Cyra—your research assistant!</h1>
      </div>

      {/* Prompt Cards */}
      <PromptCards />
    </div>
  )
}

export default DisplayComp