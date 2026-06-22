import { Car, ShieldCheck, Clock, CreditCard } from "@gravity-ui/icons";

export function WhyChooseUs() {
  const features = [
    {
      icon: <Clock size={28} />,
      title: "Fast Booking",
      desc: "Book tickets in under 1 minute with smooth UX.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Secure Payments",
      desc: "Your payments are fully protected via Stripe.",
    },
    {
      icon: <Car size={28} />,
      title: "All Transport",
      desc: "Bus, train, and more in one platform.",
    },
    {
      icon: <CreditCard size={28} />,
      title: "Easy Refunds",
      desc: "Hassle-free refund system for cancellations.",
    },
  ];

  return (
    <section className="py-12 px-4 md:px-10 bg-zinc-950">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Why Choose Us
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="p-6 border rounded-xl bg-zinc-900 hover:shadow-md transition text-center"
          >
            <div className="flex justify-center mb-3 text-blue-600">
              {item.icon}
            </div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}