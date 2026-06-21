export default function BookingModal({
  open,
  setOpen,
  ticket,
  qty,
  setQty,
  handleBooking,
}) {
  if (!open) return null;

  const total = Number(ticket?.price || 0) * Number(qty || 0);

  const onConfirm = () => {
    handleBooking({
      ticketId: ticket._id,
      ticketTitle: ticket.title,
      unitPrice: Number(ticket.price),
      quantity: Number(qty),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[320px] rounded-2xl bg-white p-6 text-black shadow-2xl">

        <h2 className="mb-3 text-lg font-bold">
          Book Ticket
        </h2>

        <div className="mb-4 space-y-2 rounded-xl bg-gray-100 p-3 text-sm">
          <div className="flex justify-between">
            <span>Price Per Ticket</span>
            <span>৳{ticket?.price}</span>
          </div>

          <div className="flex justify-between">
            <span>Available</span>
            <span>{ticket?.quantity}</span>
          </div>

          <div className="flex justify-between font-semibold text-green-600">
            <span>Total</span>
            <span>৳{total}</span>
          </div>
        </div>

        <input
          type="number"
          min={1}
          max={ticket?.quantity}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="mb-4 w-full rounded-xl border p-2"
        />

        <div className="flex gap-2">
          <button
            onClick={() => setOpen(false)}
            className="w-1/2 rounded-xl bg-gray-200 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="w-1/2 rounded-xl bg-blue-600 py-2 text-white"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
}