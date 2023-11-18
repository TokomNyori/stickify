'use client'
const WarningModal = ({ warningModalState, action, modalType, noteid }) => {
    let modalBody;
    if (modalType === 'delete') {
        modalBody = (
            <div
                className={`gpt-modal-blur inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center items-center
                            ${warningModalState ? "gpt-fix-modal" : "hidden"} flex-wrap`}
            >
                <div className='text-2xl bg-white/80 dark:bg-zinc-800/80 w-[80%] sm:w-[25%] h-auto 
                text-zinc-700 dark:text-zinc-100 shadow-lg px-4 py-5 pb-8 rounded-2xl text-center'>
                    <div className="mb-4">
                        Confirm Delete
                    </div>
                    <div className="flex justify-center items-center gap-5">
                        <button className="bg-green-500/80 px-4 py-1 rounded-xl"
                            onClick={(e) => action('yes', noteid)}
                        >
                            Yes
                        </button>
                        <button className="bg-red-500/80 px-4 py-1 rounded-xl"
                            onClick={(e) => action('no', noteid)}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    if (modalType === 'saveChanges') {
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