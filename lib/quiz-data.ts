import type { QuizQuestion, QuizResult, ResultKey } from "./quiz-types";

/**
 * The Dollhouse Glow Quiz — 6 questions
 * Questions 1–4 and 6 contribute scoring weights toward the 9 result types.
 * Question 5 captures lead temperature (booking timeframe) only.
 *
 * To edit questions or answers: update this file only.
 * Scoring logic lives in lib/quiz-scoring.ts (separate from UI).
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "What's your main beauty goal right now?",
    subtitle: "Select all that apply",
    allowMultiple: true,
    allowWriteIn: true,
    options: [
      {
        id: "q1_a",
        text: "Fuller, more defined lips",
        weights: { pout: 3, subtle_lip: 1 },
      },
      {
        id: "q1_b",
        text: "A subtle lip enhancement — not too dramatic",
        weights: { subtle_lip: 3, pout: 1 },
      },
      {
        id: "q1_c",
        text: "Smoother, more refreshed skin",
        weights: { refresh: 3, smooth: 2 },
      },
      {
        id: "q1_d",
        text: "Sculpting or defining my body shape",
        weights: { sculpt: 2, curves: 3 },
      },
      {
        id: "q1_e",
        text: "A sparkly, unique smile accessory",
        weights: { sparkle: 3 },
      },
      {
        id: "q1_f",
        text: "Correcting or removing previous filler",
        weights: { reset: 3 },
      },
    ],
  },
  {
    id: "q2",
    question: "Which area are you most focused on?",
    subtitle: "Select all that apply",
    allowMultiple: true,
    options: [
      {
        id: "q2_a",
        text: "My lips — I want more volume or a better shape",
        weights: { pout: 2, subtle_lip: 2 },
      },
      {
        id: "q2_b",
        text: "My face — lines, texture, or facial volume",
        weights: { refresh: 2, smooth: 2 },
      },
      {
        id: "q2_c",
        text: "My body — hips, curves, or stubborn fat",
        weights: { curves: 2, sculpt: 2 },
      },
      {
        id: "q2_d",
        text: "My smile and teeth",
        weights: { sparkle: 3 },
      },
      {
        id: "q2_e",
        text: "An area where I've had filler I want dissolved",
        weights: { reset: 3 },
      },
      {
        id: "q2_f",
        text: "Multiple areas — I want a custom plan",
        weights: { custom: 3 },
      },
    ],
  },
  {
    id: "q3",
    question: "How would you describe your ideal results?",
    subtitle: "Select all that apply",
    allowMultiple: true,
    options: [
      {
        id: "q3_a",
        text: "Subtle and natural — a better version of myself",
        weights: { subtle_lip: 2, refresh: 2 },
      },
      {
        id: "q3_b",
        text: "Noticeably enhanced — results that turn heads",
        weights: { pout: 2, curves: 3, sculpt: 1 },
      },
      {
        id: "q3_c",
        text: "Defined and sculpted — a real change in my shape",
        weights: { sculpt: 3, curves: 1 },
      },
      {
        id: "q3_d",
        text: "A fresh start — I want to undo or correct something",
        weights: { reset: 3 },
      },
      {
        id: "q3_e",
        text: "Something uniquely me — unexpected and expressive",
        weights: { sparkle: 2, custom: 2 },
      },
    ],
  },
  {
    id: "q4",
    question: "Have you had aesthetic treatments before?",
    options: [
      {
        id: "q4_a",
        text: "No — this would be my first time",
        weights: { subtle_lip: 1, refresh: 1, custom: 1 },
      },
      {
        id: "q4_b",
        text: "Yes — I've had treatments and loved the results",
        weights: { pout: 2, curves: 2, sculpt: 1 },
      },
      {
        id: "q4_c",
        text: "Yes — I have filler I'd like dissolved or corrected",
        weights: { reset: 3 },
      },
      {
        id: "q4_d",
        text: "Yes — but I'm still figuring out what works best for me",
        weights: { custom: 2, smooth: 1 },
      },
    ],
  },
  {
    id: "q5",
    question: "When are you hoping to book your next beauty appointment?",
    isLeadTempQuestion: true,
    options: [
      {
        id: "q5_a",
        text: "As soon as possible — I'm ready now",
        weights: {},
        leadTemp: "hot",
      },
      {
        id: "q5_b",
        text: "Within the next 30 days",
        weights: {},
        leadTemp: "warm",
      },
      {
        id: "q5_c",
        text: "In the next 1–3 months",
        weights: {},
        leadTemp: "nurture",
      },
      {
        id: "q5_d",
        text: "Just researching for now",
        weights: {},
        leadTemp: "education",
      },
    ],
  },
  {
    id: "q6",
    question: "What matters most to you about your beauty results?",
    options: [
      {
        id: "q6_a",
        text: "Looking naturally refreshed — not overdone",
        weights: { refresh: 2, smooth: 2, subtle_lip: 1 },
      },
      {
        id: "q6_b",
        text: "Bold, visible change that speaks for itself",
        weights: { pout: 2, curves: 2, sculpt: 1 },
      },
      {
        id: "q6_c",
        text: "Correcting or improving something that bothers me",
        weights: { reset: 2, smooth: 2 },
      },
      {
        id: "q6_d",
        text: "Getting personalized guidance on where to start",
        weights: { custom: 3, refresh: 1 },
      },
    ],
  },
];

/**
 * The 9 Dollhouse result profiles.
 * To edit result copy, update this object only.
 */
export const QUIZ_RESULTS: Record<ResultKey, QuizResult> = {
  subtle_lip: {
    key: "subtle_lip",
    dollName: "The Subtle Lip Doll",
    serviceMatch: "Lip Flip",
    emoji: "💋",
    tagline: "Less is more — and yours is gorgeous.",
    description:
      "A lip flip uses a small amount of neurotoxin to relax the muscle along the upper lip border, causing the lip to gently roll outward. The result is a naturally fuller, more defined appearance — without any added volume. It's one of the most subtle and elegant enhancements available.",
    benefits: [
      "Quick appointment — typically under 15 minutes with no downtime",
      "Enhances your natural lip shape without filler or added volume",
      "Low commitment and a great first step into aesthetic treatments",
      "Results develop over 7–10 days and typically last 2–4 months",
    ],
    whyYouMatched:
      "Based on your beauty goals, a subtle enhancement sounds like the right direction for you. A lip flip is low-commitment, natural-looking, and a great way to explore aesthetic treatments.",
    nextStep:
      "Book a personalized consultation with Desi Dollhouse to discuss your goals and find out if a lip flip may be the right fit for you.",
  },
  pout: {
    key: "pout",
    dollName: "The Pout Doll",
    serviceMatch: "Lip Filler",
    emoji: "💋",
    tagline: "Pillowy. Defined. Unmistakably you.",
    description:
      "Lip filler uses hyaluronic acid — a substance naturally found in your body — to add volume, shape, and definition to the lips. The result can range from a subtle plump to a bold, sculpted pout, depending entirely on your vision. It's one of the most requested treatments in aesthetics, and for good reason: the results are immediate and customizable.",
    benefits: [
      "Hyaluronic acid filler is fully reversible with a dissolver if needed",
      "Can address thin lips, asymmetry, flat borders, or a fading cupid's bow",
      "Results typically last 6–12+ months depending on product and lifestyle",
      "Customizable in the chair — your provider works to your exact goal",
    ],
    whyYouMatched:
      "Your answers point toward a desire for fuller, more defined lips and visible results. Lip filler may be a strong option to explore during your consultation.",
    nextStep:
      "Book a personalized consultation with Desi Dollhouse to discuss what lip filler may look like for your unique features and goals.",
  },
  refresh: {
    key: "refresh",
    dollName: "The Refresh Doll",
    serviceMatch: "Botox Consultation",
    emoji: "✨",
    tagline: "Refreshed. Relaxed. Still 100% you.",
    description:
      "Botox (botulinum toxin) works by temporarily relaxing the small muscles responsible for dynamic expression lines — like forehead wrinkles, frown lines between the brows, and crow's feet. The result is a smoother, more rested appearance that still looks like you — just the well-rested, glowing version.",
    benefits: [
      "Targets forehead lines, frown lines, crow's feet, lip lines, and more",
      "Minimal downtime — most people return to normal activity the same day",
      "Results appear gradually over 7–14 days and typically last 3–4 months",
      "One of the most well-studied and widely performed aesthetic treatments",
    ],
    whyYouMatched:
      "Your answers suggest you're interested in a refreshed, natural look — and Botox is often the go-to for exactly that. A consultation is the best place to explore whether it aligns with your goals.",
    nextStep:
      "Book a personalized Botox consultation with Desi Dollhouse to learn what a refreshed version of you might look like.",
  },
  smooth: {
    key: "smooth",
    dollName: "The Smooth Doll",
    serviceMatch: "Smile Line Correction Consultation",
    emoji: "🌸",
    tagline: "Smooth lines. Soft confidence.",
    description:
      "Smile line correction addresses the nasolabial folds — the lines that run from the sides of your nose to the corners of your mouth. Using precisely placed filler, a skilled provider can restore lost volume, soften shadowing, and create a smoother, more youthful-looking lower face without changing the way your expressions move.",
    benefits: [
      "Restores volume lost in the mid-face to reduce the depth of smile lines",
      "Can improve overall facial balance and create a more lifted appearance",
      "Results are immediate and typically last 12–18 months",
      "Subtle enough that others may just think you look well-rested",
    ],
    whyYouMatched:
      "Based on your focus on facial smoothness and natural results, smile line correction may be worth discussing. Your provider can walk you through what options may be appropriate for your goals.",
    nextStep:
      "Book a consultation with Desi Dollhouse to explore what smile line correction might look like for your face and goals.",
  },
  reset: {
    key: "reset",
    dollName: "The Reset Doll",
    serviceMatch: "Filler Dissolver Consultation",
    emoji: "🔄",
    tagline: "Clean slate. Your terms.",
    description:
      "Filler dissolver (hyaluronidase) is an enzyme that breaks down hyaluronic acid filler — the most common type used in lips, cheeks, and other facial areas. Whether your previous filler has migrated, looks overfilled, or simply doesn't reflect who you are anymore, dissolving is a safe, well-established option when performed by an experienced provider.",
    benefits: [
      "Works on any hyaluronic acid-based filler (Juvederm, Restylane, and others)",
      "Results often visible within 24–48 hours; the area continues to settle",
      "Can target specific areas or fully dissolve, depending on your goal",
      "After a reset, you can re-filler with a clean canvas and a fresh plan",
    ],
    whyYouMatched:
      "Your answers indicate you may want to address previous filler. A filler dissolver consultation is the right first step — your provider can assess your situation and discuss what a reset could look like for you.",
    nextStep:
      "Book a filler dissolver consultation with Desi Dollhouse to discuss your options and what a fresh start may involve.",
  },
  sculpt: {
    key: "sculpt",
    dollName: "The Sculpt Doll",
    serviceMatch: "Fat Dissolving Consultation",
    emoji: "🔥",
    tagline: "Define your edges. Reveal your shape.",
    description:
      "Fat dissolving injections use deoxycholic acid — a substance that permanently destroys fat cells in targeted areas — to reduce localized pockets of fat and improve definition. Common treatment areas include the double chin, jowl area, bra fat, and inner thighs. Results are gradual, not immediate, allowing for a natural-looking transformation over several weeks.",
    benefits: [
      "Permanently destroys fat cells in targeted areas — they don't come back",
      "Popular for chin, jowl, bra line, inner thigh, and abdomen pockets",
      "Results develop over 4–6 weeks; multiple sessions may be recommended",
      "A non-surgical alternative for stubborn fat that diet and exercise won't shift",
    ],
    whyYouMatched:
      "Your answers point toward a desire to define and sculpt your shape. Fat dissolving may be a treatment to discuss during your consultation, depending on your goals and anatomy.",
    nextStep:
      "Book a fat dissolving consultation with Desi Dollhouse to explore how sculpting treatments may help you reach your shape goals.",
  },
  curves: {
    key: "curves",
    dollName: "The Curves Doll",
    serviceMatch: "Liquid BBL Consultation",
    emoji: "🍑",
    tagline: "Your curves. Amplified.",
    description:
      "A Liquid BBL (Brazilian Butt Lift) uses strategically placed filler injections to enhance the appearance of the hips, waist, and buttocks — creating the illusion of fuller, rounder, more sculpted curves without surgery. It's one of the most requested body treatments at Desi Dollhouse, delivering dramatic yet natural-looking results in a single session.",
    benefits: [
      "Non-surgical — no incisions, no general anesthesia, no lengthy recovery",
      "Enhances hip dip area, creates a more defined waist-to-hip ratio",
      "Results are immediate and typically last 12–18+ months",
      "Fully customizable to your body type, goals, and desired silhouette",
    ],
    whyYouMatched:
      "Your answers strongly suggest you're interested in enhancing your body's curves and silhouette. A Liquid BBL consultation is the perfect place to explore what may be possible for your unique shape.",
    nextStep:
      "Book a Liquid BBL consultation with Desi Dollhouse to discuss your body goals and find out what a customized approach may look like for you.",
  },
  sparkle: {
    key: "sparkle",
    dollName: "The Sparkle Doll",
    serviceMatch: "Teeth Gems",
    emoji: "💎",
    tagline: "Let your smile do the talking.",
    description:
      "Teeth gems are tiny crystals, rhinestones, or precious gems professionally adhered to the tooth surface using a dental-safe bonding agent. They're completely non-invasive — no drilling, no enamel damage — and can be gently removed by a professional whenever you're ready. Think of them as jewelry for your smile: instantly eye-catching and totally you.",
    benefits: [
      "Non-invasive and painless — no drilling, no damage to enamel",
      "Applied in one quick appointment; lasts weeks to months with proper care",
      "Choose from crystals, gems, or gold pieces — endless personalization",
      "Professionally removed whenever you're ready for a change",
    ],
    whyYouMatched:
      "Your answers show a love for unique, expressive beauty and a focus on your smile. Teeth gems are a fun, low-commitment way to add a little sparkle to your everyday look.",
    nextStep:
      "Book a teeth gems appointment with Desi Dollhouse and get ready to shine.",
  },
  custom: {
    key: "custom",
    dollName: "The Custom Doll",
    serviceMatch: "Personal Consultation",
    emoji: "👑",
    tagline: "You defy the box. Let's build your plan.",
    description:
      "Your beauty goals are unique — and a one-size-fits-all answer isn't going to cut it. A personal consultation with Desi Dollhouse is your opportunity to have a real, honest conversation about everything you want to achieve. No pressure, no sales pitch. Just an expert ear, personalized insight, and a clear plan built around you.",
    benefits: [
      "Explore multiple treatments in one session — lips, body, skin, and more",
      "Get honest guidance on what's realistic, what's not, and what order makes sense",
      "Ask every question you've been holding — nothing is too basic or too specific",
      "Walk away with a personalized roadmap, not a generic recommendation",
    ],
    whyYouMatched:
      "Your answers suggest you're still exploring, have multiple goals, or want a fully personalized approach. That's exactly what a custom consultation is for — no pressure, just real conversation about what may work for you.",
    nextStep:
      "Book a personal consultation with Desi Dollhouse to build a plan that's truly designed around you.",
  },
};

export const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;
