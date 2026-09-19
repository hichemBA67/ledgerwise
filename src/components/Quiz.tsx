"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/content/types";
import { recordQuiz, useProgress } from "@/lib/progress";

export function Quiz({ slug, questions }: { slug: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const progress = useProgress();
  const best = progress.quiz[slug];
  const answered = answers.filter((a) => a !== null).length;
  const score = answers.filter((a, i) => a === questions[i].answer).length;
  const done = answered === questions.length;

  function choose(qi: number, oi: number) {
    if (answers[qi] !== null) return;
    const next = answers.map((a, i) => (i === qi ? oi : a));
    setAnswers(next);
    if (next.every((a) => a !== null)) {
      recordQuiz(slug, next.filter((a, i) => a === questions[i].answer).length, questions.length);
    }
  }

  return (
    <section id="quiz" className="scroll-mt-24 rounded-2xl border border-line bg-surface p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-2xl font-medium text-ink">Check your understanding</h2>
        <p className="font-mono text-[12px] text-muted">
          {answered}/{questions.length} answered
          {best ? ` · best ${best.score}/${best.total}` : ""}
        </p>
      </div>
      <ol className="mt-5 space-y-6">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <li key={qi}>
              <p className="font-medium text-ink">
                <span className="mr-2 font-mono text-[13px] text-faint">Q{qi + 1}</span>
                {q.q}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.options.map((o, oi) => {
                  const isAnswer = oi === q.answer;
                  const state =
                    chosen === null ? "idle" : isAnswer ? "correct" : chosen === oi ? "wrong" : "dim";
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={chosen !== null}
                      onClick={() => choose(qi, oi)}
                      className={`rounded-lg border px-3.5 py-2.5 text-left text-[14.5px] transition ${
                        state === "idle"
                          ? "border-line bg-bg hover:border-accent/60 hover:bg-accent-soft/40"
                          : state === "correct"
                            ? "border-good/50 bg-token-soft text-ink"
                            : state === "wrong"
                              ? "border-bad/50 bg-warn-soft text-ink"
                              : "border-line bg-bg text-faint"
                      }`}
                    >
                      {state === "correct" ? "✓ " : state === "wrong" ? "✗ " : ""}
                      {o}
                    </button>
                  );
                })}
              </div>
              {chosen !== null ? (
                <p className="mt-2.5 rounded-lg bg-surface-2 px-3.5 py-2.5 text-[14px] leading-relaxed text-muted">
                  <span className={`font-semibold ${chosen === q.answer ? "text-good" : "text-bad"}`}>
                    {chosen === q.answer ? "Correct. " : "Not quite. "}
                  </span>
                  {q.explain}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
      {done ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-bg px-4 py-3">
          <p className="text-ink">
            You scored <strong>{score}/{questions.length}</strong>
            {score === questions.length ? ". Perfect!" : "."}
          </p>
          <button
            type="button"
            onClick={() => setAnswers(questions.map(() => null))}
            className="rounded-lg border border-line px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-surface-2"
          >
            Retry
          </button>
        </div>
      ) : null}
    </section>
  );
}
