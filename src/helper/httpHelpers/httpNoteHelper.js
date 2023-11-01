import { NextResponse } from "next/server"

export const getNoteHelper = async ({ method, headers }) => {
    const res = await fetch(`api/notes/get-user-notes/`, {
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
    const res = await fetch(`api/notes/${noteid}/`, {
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

export const editNoteHelper = async ({ method, headers, noteid, body }) => {
    const res = await fetch(`api/notes/${noteid}/`, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    })
    console.log(res)
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}

export const editStatusNoteHelper = async ({ method, headers, noteid, body }) => {
    const res = await fetch(`api/notes/${noteid}/change-status`, {
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
    const res = await fetch(`api/notes/${noteid}/update-likes`, {
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
