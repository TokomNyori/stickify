import { NextResponse } from "next/server"

export const getNoteHelper = async ({ method, userId }) => {
    const res = await fetch(`api/notes/get-user-notes/`, {
        method: method,
    })
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const postNoteHelper = async ({ method, headers, body }) => {
    const res = await fetch(`api/notes`, {
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

export const deleteNoteHelper = async ({ method, headers, noteid }) => {
    const res = await fetch(`api/notes/${noteid}`, {
        method: method,
        headers: headers
    })
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const getGlobalNoteHelper = async ({ method }) => {
    const res = await fetch(`api/admin/managetasks/`, {
        method: method,
    })
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}


export async function openAiPostHelper({ method, headers, body }) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
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