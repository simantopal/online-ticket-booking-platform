import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


export const authHeader = async () =>{
    const token = await getUserToken();

    console.log("TOKEN:", token);

    const header = token ? {
        authorization: `Bearer ${token}`
    } : {};
    return header;
}

export const protectedFetch = async (path) =>{
    const res = await fetch(`${baseUrl}${path}`,
        {
            headers: await authHeader()
        }
    );
    return res.json();
}


export const serverMutation = async (path, data, method = "POST")=>{
    const res = await fetch(`${baseUrl}${path}`, {
        method: method,
        headers: {
            'Content-Type' : 'application/json',
            ... await authHeader()
        },
        body: JSON.stringify(data)
    })
    return res.json();
}