import { IoMove } from "react-icons/io5";
import { motion, useDragControls } from "framer-motion";
import { Courgette } from 'next/font/google'
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';

const caveat = Courgette(
    {
        subsets: ['latin'],
        weight: ['400'],
        display: 'swap',
    }
)

const TextFormatComp = ({ applyFormattingToSelectedText, parentRef }) => {
    const noteModalConfig = useSelector(state => state.noteModalConfig.noteModalConfig)

    return (
        <motion.div
            drag
            animate={{ y: !noteModalConfig.noteModalState && 0, x: !noteModalConfig.noteModalState && 0 }}
            whileDrag={{ scale: 1.05 }}
            dragConstraints={parentRef}
            dragElastic={0.3}
            className={`${'flex gap-2 bg-transparent'} z-10 absolute top-0`}>
            <div
                className='font-extrabold border border-gray-800 rounded-md px-1 py-0 cursor-pointer w-6 text-center
                backdrop-blur-[5px]'
                onClick={() => applyFormattingToSelectedText('bold')}>
                B
            </div>
            <div
                className={`${caveat.className} italic border border-gray-800 rounded-md px-1 py-0 cursor-pointer 
            w-6 text-center font-normal backdrop-blur-[5px]`}
                onClick={() => applyFormattingToSelectedText('italic')}>
                i
            </div>
            <div
                className=' underline border border-gray-800 rounded-md px-1 py-0 cursor-pointer w-6 text-center
            backdrop-blur-[5px]'
                onClick={() => applyFormattingToSelectedText('underline')}>
                U
            </div>
            <div className=' flex justify-center items-center border border-gray-800 rounded-md px-1 py-0 cursor-pointer 
            w-7 text-center backdrop-blur-[5px]'
                onClick={() => applyFormattingToSelectedText('bullet')}>
                <MdOutlineFormatListBulleted className='text-[1rem]' />
            </div>
            <div className=' border border-gray-800 rounded-md px-1 py-0 cursor-pointer w-7 text-center
            backdrop-blur-[5px]'
                onClick={() => applyFormattingToSelectedText('h1')}>
                h1
            </div>
            <div className=' border border-gray-800 rounded-md px-1 py-0 cursor-pointer w-7 text-center
            backdrop-blur-[5px]'
                onClick={() => applyFormattingToSelectedText('h2')}>
                h2
            </div>
            <div className=' border border-gray-800 rounded-md px-1 py-0 cursor-pointer w-7 text-center
            backdrop-blur-[5px]'
                onClick={() => applyFormattingToSelectedText('h3')}>
                h3
            </div>
            <div className='rounded-full px-1 py-0 cursor-move text-gray-800 backdrop-blur-[5px]
            text-center'
            >
                <IoMove className='text-[1.4rem] -ml-2' />
            </div>
        </motion.div>
    );
};

export default TextFormatComp;
