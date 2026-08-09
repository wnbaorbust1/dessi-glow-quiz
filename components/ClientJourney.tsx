import { CalendarCheck, ClipboardCheck, MessagesSquare, Send, Stethoscope } from "lucide-react";

const STEPS = [
  { icon: Send, title: "Submit your request" },
  { icon: MessagesSquare, title: "Speak with the team" },
  { icon: Stethoscope, title: "Complete your consultation" },
  { icon: ClipboardCheck, title: "Review your personalized next steps" },
  { icon: CalendarCheck, title: "Schedule when ready" },
];

export default function ClientJourney() {
  return (
    <section className="border-y border-rose/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">The Client Journey</h2>
        </div>

        {/* Desktop: horizontal timeline */}
        <ol className="mt-14 hidden lg:grid lg:grid-cols-5 lg:gap-4">
          {STEPS.map(({ icon: Icon, title }, index) => (
            <li key={title} className="relative flex flex-col items-center text-center">
              {index < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="section-divider absolute left-1/2 top-6 w-full"
                />
              )}
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-rose bg-rose">
                <Icon size={20} className="text-white" aria-hidden="true" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold-soft">
                Step {index + 1}
              </p>
              <p className="mt-1 text-sm text-ink">{title}</p>
            </li>
          ))}
        </ol>

        {/* Mobile / tablet: stacked timeline */}
        <ol className="mt-10 space-y-6 lg:hidden">
          {STEPS.map(({ icon: Icon, title }, index) => (
            <li key={title} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-rose bg-rose">
                  <Icon size={18} className="text-white" aria-hidden="true" />
                </div>
                {index < STEPS.length - 1 && (
                  <div aria-hidden="true" className="mt-2 h-full w-px flex-1 bg-gold/25" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-soft">
                  Step {index + 1}
                </p>
                <p className="mt-1 text-sm text-ink">{title}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
