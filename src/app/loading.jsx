'use client'
import { useTheme } from "next-themes";
import ClipLoader from "react-spinners/GridLoader";
import ClipLoader2 from "react-spinners/SquareLoader";
const Loading = () => {
    const { theme, setTheme } = useTheme()

    return (
        <div className="flex justify-center items-center text-gray-200 h-screen w-full -mt-20">
            <div
                className={`loader-gpt w-full h-full inset-0 backdrop-blur-[2px] flex justify-center 
                                items-center flex-col flex-wrap gap-y-10`}
            >
                <div className="">
                    <ClipLoader2
                        color="#3f3f46"
                        loading='loading...'
                        //cssOverride={override}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                </div>
            </div>
        </div>
    )
}

export default Loading