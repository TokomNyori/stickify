import React from 'react'
//import { motion } from "framer-motion"

const HomePageSkeleton = ({ number }) => {
    let skeletonNotes = [];
    //style={{ transform: `rotate(${rotation}deg)` }}
    for (let i = 0; i < number; i++) {
        const random = Math.random();
        const sign = Math.random() < 0.5 ? -1 : 1;
        const rotation = random > 0.6 ? (Math.random() * (1.5 - 1.2) + 1.2).toFixed(1) * sign : 0
        skeletonNotes.push(
            <div
                className={`note-box flex flex-col px-3 py-3 rounded-xl skeleton`}
            >
                <div className='text-sm font-bold'>

                </div>
                <div className='line-clamp-6 text-sm mt-2 flex-grow'>

                </div>
                <div className='text-sm mt-3 flex justify-end items-center gap-2'>
                    <div>

                    </div>
                    <div>

                    </div>
                    <div>

                    </div>
                </div>
            </div>
        )
    }

    return skeletonNotes
}

export default HomePageSkeleton