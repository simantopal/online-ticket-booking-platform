const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getVendorTickets = async (vendorEmail) =>{
    const res = await fetch(`${baseUrl}/api/tickets?vendorEmail=${vendorEmail}`);
    return res.json();
}


export const getAdvertisements = async () => {
  const res = await fetch(`${baseUrl}/api/advertisements`, {
    cache: "no-store",
  });

  return res.json();
};

export const getLatestTickets = async () => {
  const res = await fetch(`${baseUrl}/api/latest-tickets`);

  return res.json();
};

export const getAllTickets = async () => {
  const res = await fetch(`${baseUrl}/api/tickets`);

  if (!res.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return res.json();
};

export const getBookingsTickets = async () => {
  const res = await fetch(`${baseUrl}/api/bookings`);

  return res.json();
};