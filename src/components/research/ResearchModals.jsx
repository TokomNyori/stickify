'use client'
import { useEffect, useRef } from 'react'

const ResearchModals = ({ researchModalsState, action, toggleresearchModalsState, modalType }) => {

    const researchModalsStateRef = useRef(null)

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (researchModalsStateRef.current && !researchModalsStateRef.current.contains(event.target)) {
                toggleresearchModalsState()
            }
        };

        if (researchModalsState) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [researchModalsState]);

    return (
        <div
            className={`gpt-modal-blur inset-0 flex justify-center items-center
                            ${researchModalsState ? "warning-fix-modal" : "hidden"} flex-wrap`}
        >
            <div className='text-2xl border border-zinc-600 dark:border-zinc-400 backdrop-blur-[10px] w-[80%] sm:w-[25%] h-auto 
                    shadow-lg px-4 py-5 pb-8 rounded-2xl text-center' ref={researchModalsStateRef}>
                <div className="mb-4">
                    Start a new chat?
                </div>
                <div className="flex justify-center items-center gap-5">
                    <button className="border border-green-500/80 px-4 py-1 rounded-xl"
                        onClick={action}>
                        Yes
                    </button>
                    <button className="border border-blue-500/80 px-4 py-1 rounded-xl"
                        onClick={toggleresearchModalsState}>
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ResearchModals