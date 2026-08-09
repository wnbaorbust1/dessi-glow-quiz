import { CalendarClock, Gem, Sparkles, Users } from "lucide-react";

// Careful, non-superlative language only: no claims of superior safety,
// guaranteed satisfaction, board certification, or clinical credentials
// unless those credentials have been verified and supplied by the client.
const REASONS = [
  {
    icon: Users,
    title: "Personalized attention",
    copy: "Each consultation is centered on your individual goals and questions.",
  },
  {
    icon: Gem,
    title: "Luxury client experience",
    copy: "A studio environment designed to feel calm, private, and high-end.",
  },
  {
    icon: CalendarClock,
    title: "Convenient booking",
    copy: "Request a consultation online or book directly through Square.",
  },
  {
    icon: Sparkles,
    title: "Multiple aesthetic services",
    copy: "Explore Liquid BBL, Botox, lip filler, and more — see the full menu below.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            Why Clients Choose Dessi Dollhouse
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="gold-border rounded-md bg-cream-surface p-6 text-center">
              <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-gold/30 bg-rose/10">
                <Icon size={20} className="text-rose" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-serif text-lg text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-warm">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
