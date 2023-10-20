export async function CookieHelper() {
    const res = await fetch(`api/getcookie`, {
        method: 'GET',
    })

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}