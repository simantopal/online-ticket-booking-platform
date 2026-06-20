'use server'

import { serverMutation } from "../core/server"

export const addTicket = async (newTicketData) => {
    return serverMutation('/api/tickets', newTicketData);
}


// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// export const addTicket = async(newTicketData) =>{
//     const res = await fetch(`${baseUrl}/api/tickets`, {
//         method: "POST",
//         headers: {
//             'Content-Type' : 'application/json',
//         },
//         body: JSON.stringify(newTicketData),
//     })
//     return res.json();
// }