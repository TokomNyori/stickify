const PromptCards = () => {
    return (
        <div className='cards grid grid-cols-1 sm:grid-cols-2 gap-2 w-full px-1 sm:px-2 text-zinc-600 dark:text-zinc-300'>
            <div className='border border-zinc-400 dark:border-zinc-600 rounded-xl px-4 py-3'>
                <div className='font-bold'>Research Assistant</div>
                <div className='text-sm'>Have a research query? Let's explore it together!</div>
            </div>
            <div className='border border-zinc-400 dark:border-zinc-600 rounded-xl px-4 py-3'>
                <div className='font-bold'>Study Sidekick</div>
                <div className='text-sm'>Study snag? I'm here for fast, simple solutions!</div>
            </div>
            <div className='border border-zinc-400 dark:border-zinc-600 rounded-xl px-4 py-3'>
                <div className='font-bold'>Note Creator</div>
                <div className='text-sm'>Jotting ideas? Let's craft the perfect note!</div>
            </div>
            <div className={`hidden sm:block border border-zinc-400 dark:border-zinc-600 rounded-xl px-4 py-3`}>
                <div className='font-bold'>Feel-Good Friend</div>
                <div className='text-sm'>Feeling down? Let's talk and lift your spirits!</div>
            </div>
        </div>
    )
}

export default PromptCards