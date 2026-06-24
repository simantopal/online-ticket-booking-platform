import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "../../../lib/stripe";
import { getUserSession } from "@/lib/core/session";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, ticketTitle, bookingId } = body;

    const headersList = await headers();
    const origin = headersList.get("origin");


    const user = await getUserSession();

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: ticketTitle || "Ticket Payment",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      metadata: {
        bookingId,
      },

      success_url: `${origin}/dashboard/passenger/booked-tickets/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/passenger/booked-tickets`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}