const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getVendorTickets = async (vendorEmail) =>{
    const res = await fetch(`${baseUrl}/api/tickets?vendorEmail=${vendorEmail}`);
    return res.json();
}