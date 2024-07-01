export const DOMAIN = 'http://localhost:8081/';

export const postJSON = (api: string, data: any) => {
    return fetch(new URL(api, DOMAIN), {
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        body: JSON.stringify(data)
    }).then(r => r.json())
}

export const getJSON = (api: string, data: any) => {
    return fetch(new URL(api + '?' + new URLSearchParams(data), DOMAIN)).then(r => r.json())
}
