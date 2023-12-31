export const getNoteHelper = async ({ method, userId, headers }) => {
    const res = await fetch(`/api/notes/get-user-notes/${userId}/`, {
        method: method,
        headers: headers,
    })

    if (!res.ok) {
        console.log(res.headers)
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const getSingleNoteHelper = async ({ method, noteid }) => {
    console.log('getSingleNoteHelper is called')
    const res = await fetch(`/api/notes/${noteid}/`, {
        method: method,
    })
    //console.log(res)
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const handleNonUserNoteHelper = async ({ method, noteid }) => {
    console.log('handleNonUserNoteHelper is called')
    const res = await fetch(`/api/notes/${noteid}/handle-nonusers/`, {
        method: method,
    })
    //console.log(res)
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const postNoteHelper = async ({ method, headers, body }) => {
    const res = await fetch(`/api/notes/`, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    })

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const editNoteHelper = async ({ method, headers, noteid, body }) => {
    const res = await fetch(`/api/notes/${noteid}/`, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    })
    //console.log(res)
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const deleteNoteHelper = async ({ method, headers, noteid, body }) => {
    const res = await fetch(`/api/notes/${noteid}/`, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const editStatusNoteHelper = async ({ method, headers, noteid, body }) => {
    const res = await fetch(`/api/notes/${noteid}/change-status/`, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const ytVideoNoteHelper = async ({ method, headers, noteid, body }) => {
    const res = await fetch(`/api/notes/${noteid}/manage-yt-videos/`, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const updateNoteLikesHelper = async ({ method, headers, noteid, body }) => {
    const res = await fetch(`/api/notes/${noteid}/update-likes/`, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const getFeedsNoteHelper = async ({ method }) => {
    const res = await fetch(`/api/admin/managetasks/`, {
        method: method,
        cache: 'no-store',
    })
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}


//Handles Copy
export const updateNoteCopiesHelper = async ({ method, headers, noteid, body }) => {
    const res = await fetch(`/api/notes/${noteid}/update-copies/`, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const handleCopyHelper = async ({ method, headers, body, noteid }) => {
    const res = await fetch(`/api/notes/${noteid}/handle-copy/`, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    })

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}