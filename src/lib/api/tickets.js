const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getVendorTickets = async (vendorEmail) => {
  const res = await fetch(`${baseUrl}/api/tickets?vendorEmail=${vendorEmail}`);
  return res.json();
}


export const getAdvertisements = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/advertisements`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    return await res.json();
  } catch {
    return [];
  }
};

export const getApprovedTickets = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/tickets?status=approved`);

    if (!res.ok) return [];

    return await res.json();
  } catch {
    return [];
  }
};

export const toggleAdvertiseTicket = async (id, isAdvertised) => {
  try {
    const res = await fetch(`${baseUrl}/api/tickets/${id}/advertise`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isAdvertised }),
    });

    if (!res.ok) {
      throw new Error("Failed to update advertisement");
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
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