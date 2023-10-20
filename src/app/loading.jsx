import ClipLoader from "react-spinners/ClimbingBoxLoader";
const loading = () => {
    return (
        <div className="flex justify-center items-center text-gray-200 h-screen w-full -mt-20">
            <div
                className={`loader-gpt w-full h-full inset-0 bg-black bg-opacity-30 backdrop-blur-[1px] flex justify-center 
                                items-center flex-col flex-wrap gap-y-10`}
            >
                <div className="">
                    <ClipLoader
                        color='#e2e8f0'
                        loading='Generating...'
                        //cssOverride={override}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={2}
                    />
                </div>
                <div className="text-3xl mt-8">
                    Loading...
                </div>
            </div>
        </div>
    )
}

export default loading