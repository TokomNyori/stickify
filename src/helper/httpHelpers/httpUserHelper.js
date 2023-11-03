export const signupHelper = async ({ method, headers, body, id }) => {
    const res = await fetch(`api/users/signup`, {
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

export const loginHelper = async ({ method, headers, body, id }) => {
    if (method === 'POST') {
        const res = await fetch(`api/users/login`, {
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
}

export const logOutHelper = async ({ method, headers }) => {
    if (method === 'POST') {
        const res = await fetch(`api/users/logout`, {
            method: method,
            headers: headers,
        })

        if (!res.ok) {
            const errorData = await res.json();
            console.log(errorData)
            throw new Error(errorData.message)
        }

        return res.json()
    }
}

export const editSelfHelper = async ({ method, headers, body, id }) => {
    const res = await fetch(`api/users/${id}/`, {
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

export const deleteSelfHelper = async ({ method, headers, body, id }) => {
    const res = await fetch(`api/users/${id}/`, {
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

export const getGlobalUsersHelper = async ({ method, headers }) => {
    const res = await fetch(`api/admin/manageusers`, {
        method: method,
        headers: headers,
        cache: 'no-store',
    })
    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message)
    }

    return res.json()
}