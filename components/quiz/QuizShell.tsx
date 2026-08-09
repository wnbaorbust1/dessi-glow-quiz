"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QUIZ_QUESTIONS } from "@/lib/quiz-data";
import type { QuizAnswers, WriteInAnswers, QuizResult, LeadTemperature } from "@/lib/quiz-types";
import QuizIntro from "./QuizIntro";
import QuizQuestion from "./QuizQuestion";
import LeadCaptureForm from "./LeadCaptureForm";
import QuizResultView from "./QuizResultView";

type Step = "intro" | "question" | "lead_capture" | "result";

interface ResultData {
  result: QuizResult;
  leadTemp: LeadTemperature;
  matchedAnswers: string[];
  leadId: string | null;
}

function makeSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function QuizShell() {
  const searchParams = useSearchParams();
  const [sessionId] = useState(makeSessionId);

  const [step, setStep] = useState<Step>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [writeIns, setWriteIns] = useState<WriteInAnswers>({});
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utm = {
    utmSource: searchParams.get("utm_source") ?? "",
    utmMedium: searchParams.get("utm_medium") ?? "",
    utmCampaign: searchParams.get("utm_campaign") ?? "",
    utmContent: searchParams.get("utm_content") ?? "",
    refCode: (searchParams.get("ref") ?? "").toUpperCase(),
  };

  const track = useCallback(
    async (event: string, payload: Record<string, unknown> = {}) => {
      try {
        await fetch("/api/quiz/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event, sessionId, payload, ...utm }),
        });
      } catch {
        // analytics failures are non-fatal
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    track("landing_view", { ref: utm.refCode, utm_source: utm.utmSource });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleStart() {
    track("quiz_start");
    setStep("question");
    setQuestionIndex(0);
  }

  /** Toggle a single answer ID in the answers array for this question */
  function handleToggleAnswer(questionId: string, answerId: string) {
    const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
    if (!question) return;

    if (question.allowMultiple) {
      // Multi-select: toggle the answerId in the array
      setAnswers((prev) => {
        const current = prev[questionId] ?? [];
        const updated = current.includes(answerId)
          ? current.filter((id) => id !== answerId)
          : [...current, answerId];
        return { ...prev, [questionId]: updated };
      });
    } else {
      // Single-select: replace
      setAnswers((prev) => ({ ...prev, [questionId]: [answerId] }));
    }
  }

  /** Called when user clicks "Continue" on multi-select or auto-advances on single-select */
  function handleNext(writeInText: string) {
    const question = QUIZ_QUESTIONS[questionIndex];

    track("question_answered", {
      question_id: question.id,
      answer_ids: answers[question.id] ?? [],
      question_index: questionIndex,
      has_write_in: writeInText.length > 0,
    });

    if (writeInText.trim()) {
      setWriteIns((prev) => ({ ...prev, [question.id]: writeInText.trim() }));
    }

    const isLast = questionIndex === QUIZ_QUESTIONS.length - 1;
    if (isLast) {
      track("lead_capture_view");
      setStep("lead_capture");
    } else {
      setQuestionIndex((i) => i + 1);
    }
  }

  function handleBack() {
    if (step === "lead_capture") {
      setStep("question");
      setQuestionIndex(QUIZ_QUESTIONS.length - 1);
    } else if (step === "question" && questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else if (step === "question" && questionIndex === 0) {
      setStep("intro");
    }
  }

  async function handleLeadSubmit(leadData: {
    firstName: string;
    email: string;
    phone: string;
    zip: string;
    marketingConsent: boolean;
  }) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadData,
          answers,
          writeIns,
          sessionId,
          ...utm,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      const json = await res.json();
      if (!json.ok) throw new Error("Submission error");

      setResultData({
        result: json.result,
        leadTemp: json.leadTemp,
        matchedAnswers: json.matchedAnswers,
        leadId: json.leadId ?? null,
      });

      track("result_viewed", {
        result: json.result?.key,
        lead_temp: json.leadTemp,
        lead_id: json.leadId,
      });

      setStep("result");
    } catch (err) {
      console.error("[quiz] submission error:", err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBookingClick() {
    if (resultData?.leadId) {
      fetch("/api/quiz/event", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: resultData.leadId }),
      }).catch(() => {});
    }
    track("booking_clicked", { result: resultData?.result?.key });
  }

  const currentQuestion = QUIZ_QUESTIONS[questionIndex];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {step === "intro" && (
        <QuizIntro onStart={handleStart} refCode={utm.refCode} />
      )}

      {step === "question" && (
        <QuizQuestion
          question={currentQuestion}
          questionIndex={questionIndex}
          totalQuestions={QUIZ_QUESTIONS.length}
          selectedAnswerIds={answers[currentQuestion.id] ?? []}
          writeInValue={writeIns[currentQuestion.id] ?? ""}
          onAnswer={handleToggleAnswer}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {step === "lead_capture" && (
        <LeadCaptureForm
          onSubmit={handleLeadSubmit}
          onBack={handleBack}
          isSubmitting={isSubmitting}
        />
      )}

      {step === "result" && resultData && (
        <QuizResultView
          result={resultData.result}
          leadTemp={resultData.leadTemp}
          matchedAnswers={resultData.matchedAnswers}
          leadId={resultData.leadId}
          onBookingClick={handleBookingClick}
          sessionId={sessionId}
          utm={utm}
        />
      )}
    </div>
  );
}
