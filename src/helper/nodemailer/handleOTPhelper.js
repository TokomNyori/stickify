export async function generateAndsendOTP({ method, headers, body }) {
    const res = await fetch("api/send-otp", {
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

// export async function verifyOTP({ method, headers, body }) {
//     const res = await fetch("api/handle-otp", {
//         method: method,
//         headers: headers,
//         body: JSON.stringify(body)
//     })

//     if (!res.ok) {
//         const errorData = await res.json();
//         console.log(errorData)
//         throw new Error(errorData.message)
//     }

//     return res.json()
// }

// New user email verification
export async function newUserOtpVerify({ method, headers, body }) {
    const res = await fetch("/api/send-otp-newusers/", {
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

// New user email verification
export async function existingUserOtpVerify({ method, headers, body }) {
    const res = await fetch("/api/send-otp-existingusers/", {
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