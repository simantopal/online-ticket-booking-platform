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

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;
  const session = await getSession(session_id);

  if (!session || session.payment_status !== "paid") {
    return (
      <div className="p-8 text-center">
        <h1 className="text-red-500 text-2xl font-bold">Payment Verification Failed</h1>
        <p className="mt-2">We could not confirm your booking. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-green-600 text-3xl font-bold mb-4">Thank You!</h1>
      <p className="text-gray-600 mb-6">Your payment was successful and your ticket is confirmed.</p>
      <div className="bg-gray-50 p-4 rounded text-left mb-6">
        <p className="text-sm text-gray-500">Booking ID: {session.metadata?.bookingId}</p>
        <p className="text-sm text-gray-500">Amount Paid: {(session.amount_total / 100).toFixed(2)} BDT</p>
      </div>
      <Link href="/dashboard/passenger/booked-tickets" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        View My Tickets
      </Link>
    </div>
  );
}