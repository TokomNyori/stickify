import NotePage from "@/components/notes_container/NotePage"

export const metadata = {
    title: 'stickify',
}

const Note = ({ params }) => {
    return (
        <main className="sm:px-16 lg:px-52">
            <NotePage params={params} />
        </main>
    )
}

export default Note