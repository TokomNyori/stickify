import FeedsContainer from "@/components/notes_container/FeedsContainer"

export const metadata = {
    title: 'feeds',
}

export default function Feeds() {
    return (
        <main className="px-2 sm:px-20">
            <FeedsContainer />
        </main>
    )
}