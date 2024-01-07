'use client'

import { useRef, useEffect } from "react";


const WarningModal = ({ warningModalState, action, modalType, noteid, isItOriginal, currentOriginId }) => {
    let modalBody;
    const warningModalRef = useRef(null)

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (warningModalRef.current && !warningModalRef.current.contains(event.target)) {
                action({
                    operation: 'no'
                })
            }
        };

        if (warningModalState) {
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [warningModalState]);

    if (modalType === 'delete') {
        modalBody = (
            <div
                className={`gpt-modal-blur inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-[2px] 
                            ${warningModalState ? "gpt-fix-modal" : "hidden"} flex-wrap`}
            >
                <div className='text-2xl bg-white/70 dark:bg-zinc-800/80 w-[80%] sm:w-[20%] h-auto 
                    shadow-lg px-4 py-5 pb-8 rounded-2xl text-center' ref={warningModalRef}>
                    <div className="mb-4">
                        Delete note?
                    </div>
                    <div className="flex justify-center items-center gap-5">
                        <button className="border border-green-500/80 px-4 py-1 rounded-xl"
                            onClick={(e) => action({
                                operation: 'yes', noteid: noteid,
                                isItOriginalNote: isItOriginal, originNoteId: currentOriginId
                            })}
                        >
                            Yes
                        </button>
                        <button className="border border-red-500/80 px-4 py-1 rounded-xl"
                            onClick={(e) => action({
                                operation: 'no'
                            })}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        )
    } else if (modalType === 'saveChanges') {
        modalBody = (
            <div
                className={`gpt-modal-blur inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center items-center
                            ${warningModalState ? "gpt-fix-modal" : "hidden"} flex-wrap`}
            >
                <div className='text-2xl bg-white/80 dark:bg-zinc-800/80 w-[80%] sm:w-[25%] h-auto 
                text-zinc-700 dark:text-zinc-100 shadow-lg px-4 py-5 pb-8 rounded-2xl text-center'>
                    <div className="mb-4">
                        Save changes?
                    </div>
                    <div className="flex justify-center items-center gap-5">
                        <button className="bg-green-500/80 px-4 py-1 rounded-xl"
                            onClick={(e) => action(e, 'yes')}
                        >
                            Yes
                        </button>
                        <button className="bg-red-500/80 px-4 py-1 rounded-xl"
                            onClick={(e) => action(e, 'no')}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return modalBody
}

export default WarningModal