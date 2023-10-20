import GlobalContainer from "@/components/notes_container/GlobalContainer"

export const metadata = {
    title: 'Global: stickify',
}

export default function Global() {
    return (
        <main className="px-2 sm:px-20">
            <GlobalContainer />
        </main>
    )
}