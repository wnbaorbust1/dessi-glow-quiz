"use client";

import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import type { QuizQuestion as QuizQuestionType } from "@/lib/quiz-types";

interface Props {
  question: QuizQuestionType;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswerIds: string[];
  writeInValue: string;
  onAnswer: (questionId: string, answerId: string) => void;
  onNext: (writeIn: string) => void;
  onBack: () => void;
}

export default function QuizQuestion({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswerIds,
  writeInValue,
  onAnswer,
  onNext,
  onBack,
}: Props) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;
  const [writeIn, setWriteIn] = useState(writeInValue);

  const isMulti = question.allowMultiple;
  const canAdvance = isMulti
    ? selectedAnswerIds.length > 0 || writeIn.trim().length > 0
    : false; // single-select auto-advances

  return (
    <div className="animate-reveal">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs font-medium text-rose">
            {Math.round(progress)}%
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-rose/10"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Quiz progress: question ${questionIndex + 1} of ${totalQuestions}`}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #d9a493 0%, #c6a06b 100%)",
            }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="mb-1 font-serif text-2xl leading-snug text-ink sm:text-3xl">
        {question.question}
      </h2>
      {question.subtitle && (
        <p className="mb-6 text-sm text-muted">{question.subtitle}</p>
      )}
      {!question.subtitle && <div className="mb-6" />}

      {/* Answer options */}
      <fieldset>
        <legend className="sr-only">{question.question}</legend>
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswerIds.includes(option.id);
            return (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-4 rounded-xl px-5 py-4 transition-all duration-150"
                style={{
                  background: isSelected ? "rgba(193,126,108,0.10)" : "rgba(255,255,255,0.7)",
                  border: isSelected
                    ? "1.5px solid var(--color-rose)"
                    : "1.5px solid rgba(193,126,108,0.2)",
                  boxShadow: isSelected ? "0 2px 12px rgba(193,126,108,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {/* Checkbox (multi) or radio (single) indicator */}
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center"
                  style={{
                    borderRadius: isMulti ? "5px" : "50%",
                    border: isSelected
                      ? "2px solid var(--color-rose)"
                      : "2px solid rgba(193,126,108,0.3)",
                    background: isSelected ? "var(--color-rose)" : "#fff",
                  }}
                  aria-hidden="true"
                >
                  {isSelected && isMulti && <Check size={11} color="#fff" strokeWidth={3} />}
                  {isSelected && !isMulti && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>

                <input
                  type={isMulti ? "checkbox" : "radio"}
                  name={question.id}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => {
                    onAnswer(question.id, option.id);
                    if (!isMulti) {
                      // single-select auto-advances after brief delay
                      setTimeout(() => onNext(""), 220);
                    }
                  }}
                  className="sr-only"
                />

                <span className="text-sm leading-relaxed text-ink sm:text-base">{option.text}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Write-in field */}
      {question.allowWriteIn && (
        <div className="mt-3">
          <label
            className="block rounded-xl px-5 py-3 transition-all duration-150"
            style={{
              background: writeIn ? "rgba(193,126,108,0.06)" : "rgba(255,255,255,0.7)",
              border: writeIn ? "1.5px solid rgba(193,126,108,0.4)" : "1.5px solid rgba(193,126,108,0.2)",
            }}
          >
            <span className="mb-1 block text-xs text-muted">Other — describe your goal:</span>
            <input
              type="text"
              value={writeIn}
              onChange={(e) => setWriteIn(e.target.value)}
              placeholder="Type anything…"
              maxLength={200}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/50"
            />
          </label>
        </div>
      )}

      {/* Next button (multi-select only) */}
      {isMulti && (
        <button
          onClick={() => onNext(writeIn)}
          disabled={!canAdvance}
          className="mt-6 w-full rounded-xl py-4 text-sm font-bold uppercase tracking-widest transition-all duration-150"
          style={{
            background: canAdvance
              ? "linear-gradient(135deg, var(--color-rose) 0%, #b86e5c 100%)"
              : "rgba(193,126,108,0.15)",
            color: canAdvance ? "#fff" : "rgba(193,126,108,0.5)",
            boxShadow: canAdvance ? "0 4px 18px rgba(193,126,108,0.25)" : "none",
          }}
        >
          {canAdvance
            ? `Continue${selectedAnswerIds.length > 1 ? ` (${selectedAnswerIds.length} selected)` : ""}`
            : "Select at least one"}
        </button>
      )}

      {/* Back button */}
      <button
        onClick={onBack}
        className="mt-6 flex items-center gap-1.5 text-xs text-muted transition-opacity hover:opacity-70"
      >
        <ChevronLeft size={14} aria-hidden="true" />
        Back
      </button>
    </div>
  );
}
