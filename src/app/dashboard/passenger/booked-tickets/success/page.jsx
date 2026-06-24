import { stripe } from "@/lib/stripe";
import Link from "next/link";

async function getSession(sessionId) {
  if (!sessionId) return null;

  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}

async function markBookingPaid(bookingId, transactionId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${bookingId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "paid",
        transactionId
      }),
      cache: "no-store",
    }
  );

  const data = await res.json();

  console.log("PATCH STATUS:", data);

  return data;
}

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  const session = await getSession(session_id);

  if (!session || session.payment_status !== "paid") {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          Payment Verification Failed
        </h1>
        <p className="mt-2">
          We could not confirm your booking.
        </p>
      </div>
    );
  }

  const bookingId = session.metadata?.bookingId;

  if (bookingId) {
    const result = await markBookingPaid(
      bookingId,
      session.payment_intent
    );

    console.log("UPDATE RESULT:", result);
  }
  return (
    <div className="mx-auto my-12 max-w-md rounded-lg bg-white p-6 text-center shadow-md">
      <h1 className="mb-4 text-3xl font-bold text-green-600">
        Thank You!
      </h1>

      <p className="mb-6 text-gray-600">
        Your payment was successful and your ticket is confirmed.
      </p>

      <div className="mb-6 rounded bg-gray-50 p-4 text-left">
        <p className="text-sm text-gray-500">
          Transaction ID: {session.payment_intent}
        </p>
        <p className="text-sm text-gray-500">
          Booking ID: {bookingId}
        </p>

        <p className="text-sm text-gray-500">
          Amount Paid: {(session.amount_total / 100).toFixed(2)} BDT
        </p>
      </div>

      <Link
        href="/dashboard/passenger/booked-tickets"
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        View My Tickets
      </Link>
    </div>
  );
}