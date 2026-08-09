import { ClipboardList, MessageCircleQuestion, Target } from "lucide-react";

const CARDS = [
  {
    icon: Target,
    title: "Your goals",
    copy: "Discuss the shape, balance, and overall look you want to explore.",
  },
  {
    icon: ClipboardList,
    title: "Your treatment plan",
    copy: "Review a personalized recommendation based on an individual assessment.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Your next steps",
    copy: "Receive information about preparation, aftercare, scheduling, and follow-up.",
  },
];

export default function ServiceOverview() {
  return (
    <section id="what-to-expect" className="border-y border-rose/10 bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            What Is a Liquid BBL Consultation?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            A consultation is the first step in determining whether this service may be
            appropriate for your goals. The provider can discuss the treatment approach, expected
            recovery considerations, possible risks, alternatives, and whether an in-person
            evaluation is required.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {CARDS.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="rounded-md border border-rose/20 bg-white/80 p-6 shadow-sm">
              <Icon size={26} className="text-rose" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#lead-form"
            className="inline-flex items-center justify-center rounded-sm border border-rose bg-rose px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-transform hover:scale-[1.02] hover:bg-rose-soft"
          >
            Talk With the Dessi Dollhouse Team
          </a>
        </div>
      </div>
    </section>
  );
}
