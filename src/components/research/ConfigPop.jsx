'use client'
import { useEffect, useRef } from 'react';
import { IoChatboxOutline } from "react-icons/io5";

const ConfigPop = ({ configPopState, toggleConfigState, handleConfigChange, cyraConfig }) => {

    const configPopRef = useRef(null)

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (configPopRef.current && !configPopRef.current.contains(event.target)) {
                toggleConfigState()
            }
        };

        if (configPopState) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [configPopState]);

    console.log(cyraConfig.emoji)

    return (
        <div className={`${configPopState ? "flex flex-col" : "hidden"} absolute top-[102%] border border-zinc-600 
        dark:border-zinc-400 rounded-2xl h-auto backdrop-blur-[10px] px-4 py-3 pr-6`}
            ref={configPopRef}
        >
            {/* <div className=" font-bold">Configure Cyra</div> */}
            {/* <div className="font-bold">Mode: </div>
            <div className="cyras-mode pl-2">
                <div className='flex justify-start items-center gap-1'>
                    <input type="radio" id="assistant" name="mode"
                        className=""
                        value="#fac0b1" />
                    <label htmlFor="assistant" className="cursor-pointer">
                        Assistant
                    </label>
                </div>
                <div className='flex justify-start items-center gap-1'>
                    <input type="radio" id="friend" name="mode" className="" value="#fac0b1" />
                    <label htmlFor="friend" className="cursor-pointer">
                        Friend
                    </label>
                </div>
            </div> */}
            <div className=" font-bold text-[1.1rem] sm:text-[1rem] mb-1">Response:</div>
            <div className="cyras-mode pl-2 text-[1.8] sm:text-[1rem] flex flex-col justify-start items-start gap-1">
                <div className='flex justify-start items-center gap-2'>
                    <input type="radio" id="creative"
                        name="response"
                        className=""
                        value="Creative"
                        checked={cyraConfig.response === 'Creative'}
                        onChange={handleConfigChange}
                    />
                    <label htmlFor="creative" className="cursor-pointer text-[1.1rem] sm:text-[1rem]">
                        Creative ✨
                    </label>
                </div>
                <div className='flex justify-start items-center gap-2'>
                    <input type="radio" id="balance"
                        name="response"
                        className=""
                        value="Balance"
                        checked={cyraConfig.response === 'Balance'}
                        onChange={handleConfigChange}
                    />
                    <label htmlFor="balance" className="cursor-pointer text-[1.1rem] sm:text-[1rem]">
                        Balance 🧘🏻‍♂️
                    </label>
                </div>
                <div className='flex justify-start items-center gap-2'>
                    <input type="radio" id="accurate"
                        name="response"
                        className="cursor-pointer"
                        value="Accurate"
                        checked={cyraConfig.response === 'Accurate'}
                        onChange={handleConfigChange}
                    />
                    <label htmlFor="accurate" className="cursor-pointer text-[1.1rem] sm:text-[1rem]">
                        Accurate 🎯
                    </label>
                </div>
            </div>
            <div className='mt-3 flex justify-start items-center gap-2 mb-1'>
                <label class="relative inline-flex items-center cursor-pointer" htmlFor='emoji'>
                    <input type="checkbox" class="sr-only peer" id='emoji' name='emoji' checked={cyraConfig.emoji}
                        onChange={handleConfigChange} />
                    <div
                        class="w-11 h-6 sm:w-9 sm:h-5 bg-zinc-400 dark:bg-zinc-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                    dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full 
                    rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white dark:peer-checked:after:border-zinc-900
                    after:content-[''] after:absolute 
                    after:top-[2px] after:start-[2px] sm:after:top-[4px] sm:after:start-[2px] after:bg-white dark:after:bg-zinc-900 after:border-gray-300 
                    dark:after:border-zinc-900
                    after:border after:rounded-full after:h-5 after:w-5 sm:after:h-4 sm:after:w-4 after:transition-all
                     dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-400">
                    </div>
                    <span class="ms-2 font-bold">
                        Emoji 
                    </span>
                </label>
            </div>
            {/* <div className='mt-2 flex justify-start items-center gap-2 font-bold border-t border-zinc-400 dark:border-zinc-600 pt-2
                cursor-pointer'>
                <IoChatboxOutline className='inline text-xl' />
                New chat
            </div> */}
        </div>
    )
}

export default ConfigPop