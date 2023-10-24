'use client'
import { store } from "@/redux_store/store";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";

const ReduxProvider = ({ children }) => {
    // const [mounted, setMounted] = useState(false)
    // useEffect(() => {
    //     setMounted(true)
    // }, [])

    // if (!mounted) {
    //     return (
    //         <Provider store={store}>
    //             {children}
    //         </Provider>
    //     )
    // }

    return (
        <Provider store={store}>
            <ThemeProvider attribute="class">
                {children}
            </ThemeProvider>
        </Provider>
    )
}

export default ReduxProvider