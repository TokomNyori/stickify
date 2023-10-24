'use client'
import { useTheme } from "next-themes";
import ClipLoader from "react-spinners/GridLoader";
const loading = () => {
    const { theme, setTheme } = useTheme()

    return (
        <div className="flex justify-center items-center text-gray-200 h-screen w-full -mt-20">
            <div
                className={`loader-gpt w-full h-full inset-0 backdrop-blur-[2px] flex justify-center 
                                items-center flex-col flex-wrap gap-y-10`}
            >
                <div className="">
                    <ClipLoader
                        color={`${theme === 'dark' ? '#e2e8f0' : '#1f2937'}`}
                        loading='Generating...'
                        //cssOverride={override}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                </div>
                <div className="text-3xl mt-8 text-[#1f2937] dark:text-[#e2e8f0]">
                    Loading...
                </div>
            </div>
        </div>
    )
}

export default loading