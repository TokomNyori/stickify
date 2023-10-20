import NotesContainer from '@/components/notes_container/NotesContainer';

export const metadata = {
  title: 'Home: stickify',
}

export default function Home() {
  return (
    <main className="px-2 sm:px-20">
      <NotesContainer />
    </main>
  )
}
