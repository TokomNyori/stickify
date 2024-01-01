import Lottie from 'lottie-react'
import orbOne from '@/assets/others/orb1.json'
import loader1 from '@/assets/others/Loader1.json'

const CyraLoader = () => {
  return (
      <div className="mb-7">
          <div className="flex justify-start items-start rounded-full gap-3">
              <div className="">
                  <Lottie className="rounded-full w-[1.6rem] sm:w-[1.8rem]" animationData={orbOne} loop={true} />
              </div>
              <div className="font-bold text-[1.04rem]">Cyra</div>
          </div>
          <div className=" pl-[2.4rem] sm:pl-[2.5rem] -mt-1"
              style={{ whiteSpace: 'pre-line' }}
          >
              <Lottie className="rounded-full w-[1.8rem] sm:w-[2rem]" animationData={loader1} loop={true} />
          </div>
      </div>
  )
}

export default CyraLoader