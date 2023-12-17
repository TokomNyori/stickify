import ManageProfile from "@/components/ManageProfile"

export const metadata = {
    title: 'manage profile',
}

export default function ManageProfileRoute() {
    return (
        <main className="px-2 sm:px-20">
            <ManageProfile />
        </main>
    )
}