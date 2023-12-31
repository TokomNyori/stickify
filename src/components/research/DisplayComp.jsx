import Lottie from 'lottie-react'
import orbOne from '@/assets/others/orb1.json'
import { Prompt } from 'next/font/google'
import PromptCards from './PromptCards'
import { LuSettings2 } from "react-icons/lu";

const DisplayComp = () => {
  return (
    <div className='flex flex-col justify-start items-center gap-16 sm:gap-16 mb-5 w-full'>
      {/* Cyra Orb */}
      <div className='flex flex-col justify-center items-center' >
        <div className="">
          <Lottie className="rounded-full w-[8rem]" animationData={orbOne} loop={true} />
        </div>
        <h1 className=' text-lg font-bold mb-2'>I'm Cyra—your research assistant!</h1>
        <div className='flex justify-center items-center gap-2 glow-texts cursor-pointer'>
          <LuSettings2 className='text-2xl' />
          <span>Configure Cyra</span>
        </div>
      </div>
      {/* Prompt Cards */}
      <PromptCards />
    </div>
  )
}

export default DisplayComp