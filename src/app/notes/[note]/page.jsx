import NotePage from "@/components/notes_container/NotePage"

const Note = ({ params }) => {
    return (
        <main className="sm:px-52">
            <NotePage params={params} />
        </main>
    )
}

export default Note