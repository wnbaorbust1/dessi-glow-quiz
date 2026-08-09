"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Is a consultation required?",
    answer:
      "Yes. A consultation helps the provider learn about your goals, discuss eligibility, review possible risks and alternatives, and explain what to expect.",
  },
  {
    question: "How soon can I book?",
    answer:
      "Availability varies. Submit the consultation form or review current openings through the Square booking page.",
  },
  {
    question: "How much does the service cost?",
    answer:
      "Pricing depends on the treatment plan and the amount of product or number of sessions recommended. The team can discuss current pricing after learning more about your goals.",
  },
  {
    question: "How long do results last?",
    answer:
      "Duration varies by treatment method, product, individual response, lifestyle, and follow-up care. The provider can explain realistic expectations during your consultation.",
  },
  {
    question: "Is there downtime?",
    answer:
      "Recovery experiences vary. Your provider should explain possible swelling, tenderness, activity restrictions, aftercare, warning signs, and follow-up requirements before treatment.",
  },
  {
    question: "Am I guaranteed a specific result?",
    answer: "No. Results vary, and no specific outcome can be guaranteed.",
  },
  {
    question: "Can I book directly?",
    answer:
      "Yes. You may request a consultation through this page or view current availability through the Square booking link.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const idBase = useId();

  return (
    <section id="faqs" className="bg-cream">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">Frequently Asked Questions</h2>
        </div>

        <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const buttonId = `${idBase}-button-${index}`;
            const panelId = `${idBase}-panel-${index}`;

            return (
              <div key={item.question}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-medium text-ink transition-colors hover:text-rose sm:text-base"
                  >
                    {item.question}
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className={`shrink-0 text-rose transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-5 text-sm leading-relaxed text-muted-warm"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
