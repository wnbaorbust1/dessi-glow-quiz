import { Suspense } from "react";
import QuizShell from "@/components/quiz/QuizShell";

export default function GlowQuizPage() {
  return (
    <Suspense fallback={<QuizLoadingFallback />}>
      <QuizShell />
    </Suspense>
  );
}

function QuizLoadingFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full"
        style={{ border: "2px solid rgba(198,160,107,0.2)", borderTopColor: "var(--color-gold)" }}
        aria-label="Loading quiz"
      />
    </div>
  );
}
