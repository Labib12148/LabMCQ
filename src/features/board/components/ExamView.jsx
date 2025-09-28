import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { MathText } from "@/components";
import { useCountdown } from "@/hooks";
import { getAssetPath } from "@/utils";
import ResultMCQItem from "./ResultMCQItem";

// utils
const bn = (n) => n.toLocaleString("bn-BD");
const bnOpt = ["ক", "খ", "গ", "ঘ"];
const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// ──────────────────────────────────────────────────────────────────────────────
function StartScreen({ title, onStart }) {
  const [min, setMin] = useState(25);
  const [sec, setSec] = useState(0);
  const begin = () => {
    const total = min * 60 + sec;
    if (total <= 0) {
      alert("সময় ০ হতে পারে না");
      return;
    }
    onStart(total);
  };

  return (
    <motion.div
      className="chapter-questions-container start-screen"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
    >
      <motion.div
        className="exam-start-container"
        layout
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        <h2 className="start-title">{title}</h2>
        <p className="start-sub">সময় নির্ধারণ করে পরীক্ষা শুরু করুন</p>
        <div className="exam-time-inputs">
          <input
            className="time-input"
            type="number"
            min={0}
            value={min}
            onChange={(e) => setMin(+e.target.value || 0)}
            aria-label="মিনিট"
          />
          <span className="time-separator">:</span>
          <input
            className="time-input"
            type="number"
            min={0}
            max={59}
            value={sec}
            onChange={(e) =>
              setSec(Math.min(59, Math.max(0, +e.target.value || 0)))
            }
            aria-label="সেকেন্ড"
          />
        </div>
        <motion.button
          className="start-exam-button"
          onClick={begin}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
        >
          পরীক্ষা শুরু করুন
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function MCQItem({ q, index, selected, onSelect }) {
  return (
    <motion.article
      className="mcq-card"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
    >
      <div className="mcq-header">
        <div className="mcq-question-number">{bn(index)}</div>
        <div className="mcq-question-text">
          <MathText text={q.question} />
          {q.image && (
            <div className="media-wrap">
              <img
                className="question-image"
                src={getAssetPath(q.image)}
                alt="Question illustration"
                loading="lazy"
                width="600"
                height="400"
              />
            </div>
          )}
        </div>
      </div>
      <div className="option-grid" role="radiogroup" aria-label="Options">
        {["A", "B", "C", "D"].map((L, idx) => (
          <motion.button
            key={L}
            type="button"
            className={`option-button ${selected === L ? "selected" : ""}`}
            onClick={() => onSelect(q.number, L)}
            aria-pressed={selected === L}
            whileTap={{ scale: 0.985 }}
            whileHover={{ translateY: -1 }}
            layout
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <span className="option-label">{bnOpt[idx]}</span>
            <div className="option-text">
              <MathText text={q[`option${L}`]} />
              {q[`option${L}_img`] && (
                <div className="media-wrap">
                  <img
                    className="option-image"
                    src={getAssetPath(q[`option${L}_img`])}
                    alt={`Option ${L} illustration`}
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.article>
  );
}

// Simple header (title + progress). Timer lives in sticky palette below.
function Header({ title, answered, total }) {
  return (
    <header className="exam-header" role="region" aria-label="পরীক্ষা অবস্থা">
      <div className="header-title" title={title}>
        {title}
      </div>
      <div className="header-progress">
        {bn(answered)}/{bn(total)}
      </div>
    </header>
  );
}

// Sticky strip that floats while scrolling: small timer + compact palette
function StickyBar({ questions, current, answers, secsLeft, onJump }) {
  const paletteRef = useRef(null);

  // Keep current dot centered in the palette
  useEffect(() => {
    const el = paletteRef.current?.querySelector(
      `[data-num="${current}"]`
    );
    el?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [current]);

  return (
    <motion.div
      className="exam-sticky"
      role="navigation"
      aria-label="প্রশ্ন নেভিগেশন"
      initial={false}
      animate={{ backgroundColor: "var(--surface)" }}
    >
      <motion.div
        className="timer-chip"
        layout
        aria-live="polite"
        title="সময় বাকি"
      >
        ⏱ {fmt(secsLeft)}
      </motion.div>

      <nav className="exam-palette" ref={paletteRef}>
        {questions.map((q) => (
          <motion.button
            key={q.number}
            type="button"
            data-num={q.number}
            onClick={() => onJump(q.number)}
            className={`${answers[q.number] ? "is-answered" : "is-unattempted"} ${
              current === q.number ? "is-current" : ""
            }`}
            title={`প্রশ্ন ${q.number}`}
            aria-current={current === q.number ? "true" : "false"}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            layout
          >
            {bn(q.number)}
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
}

export default function ExamView({
  boardName = "বোর্ড পরীক্ষা",
  questions = [],
}) {
  const sorted = useMemo(
    () => [...questions].sort((a, b) => a.number - b.number),
    [questions]
  );

  const [phase, setPhase] = useState("setup"); // setup | active | review
  const [current, setCurrent] = useState(sorted[0]?.number || 1);
  const [answers, setAnswers] = useState({});
  const [startedAt, setStartedAt] = useState(null);
  const [submittedAt, setSubmittedAt] = useState(null);

  const [totalSeconds, setTotalSeconds] = useState(0);
  const countdown = useCountdown(0, () => setPhase("review"));

  // keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (phase !== "active") return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const idx = ["1", "2", "3", "4"].indexOf(e.key);
      if (idx >= 0) {
        const L = ["A", "B", "C", "D"][idx];
        setAnswers((p) => ({ ...p, [current]: L }));
        return;
      }
      if (e.key.toLowerCase() === "n") {
        const i = sorted.findIndex((q) => q.number === current);
        if (i < sorted.length - 1) setCurrent(sorted[i + 1].number);
      }
      if (e.key.toLowerCase() === "p") {
        const i = sorted.findIndex((q) => q.number === current);
        if (i > 0) setCurrent(sorted[i - 1].number);
      }
      if (e.key.toLowerCase() === "f") {
        submit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, current, sorted]);

  // ▶▶ Start exam
  const start = (sec) => {
    setTotalSeconds(sec);
    setAnswers({});
    setStartedAt(Date.now());
    countdown.start(sec);
    setPhase("active");
  };

  // ▶▶ Select answer
  const onSelect = (num, L) =>
    setAnswers((prev) => ({ ...prev, [num]: L }));

  // ▶▶ Jump with sticky-offset (fixes 10→10 scroll)
  const jumpTo = (num) => {
    setCurrent(num);
    const el = document.getElementById(`q-${num}`);
    if (!el) return;
    const header = document.querySelector(".exam-header");
    const sticky = document.querySelector(".exam-sticky");
    const offset =
      (header?.offsetHeight || 0) + (sticky?.offsetHeight || 0) + 12;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // ▶▶ Submit
  const submit = () => {
    const un = sorted.filter((q) => !answers[q.number]).length;
    const ok = window.confirm(
      un
        ? `আপনার ${bn(un)} টি প্রশ্ন বাকি। জমা দেবেন?`
        : "জমা দিতে চান?"
    );
    if (!ok) return;
    setSubmittedAt(Date.now());
    setPhase("review");
  };

  // Score/summary
  const summary = useMemo(() => {
    const total = sorted.length;
    let correct = 0,
      wrong = 0;
    sorted.forEach((q) => {
      const a = answers[q.number];
      if (!a) return;
      if (a === q.answer) correct++;
      else wrong++;
    });
    const unattempted = total - correct - wrong;
    const score = correct;
    const taken =
      submittedAt && startedAt
        ? Math.max(0, Math.floor((submittedAt - startedAt) / 1000))
        : totalSeconds - countdown.left;
    return { total, correct, wrong, unattempted, score, timeTaken: taken };
  }, [answers, sorted, submittedAt, startedAt, totalSeconds, countdown.left]);

  if (!sorted.length)
    return <div className="chapter-questions-container">ডেটা পাওয়া যায়নি</div>;

  return (
    <div className="cq-theme-wrapper">
      <div className="chapter-questions-container">
        <AnimatePresence mode="wait">
          {phase === "setup" && (
            <StartScreen key="start" title={boardName} onStart={start} />
          )}

          {phase === "active" && (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Header
                title={boardName}
                answered={Object.values(answers).filter(Boolean).length}
                total={sorted.length}
              />
              <StickyBar
                questions={sorted}
                current={current}
                answers={answers}
                secsLeft={countdown.left}
                onJump={jumpTo}
              />

              <section className="practice-list">
                {sorted.map((q, i) => (
                  <div
                    key={q.number}
                    id={`q-${q.number}`}
                    className="exam-question"
                    style={{ scrollMarginTop: "140px" }}
                  >
                    <MCQItem
                      q={q}
                      index={i + 1}
                      selected={answers[q.number]}
                      onSelect={onSelect}
                    />
                  </div>
                ))}
              </section>

              <div className="center">
                <motion.button
                  className="submit-exam-button"
                  onClick={submit}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                >
                  জমা দিন
                </motion.button>
              </div>
            </motion.div>
          )}

          {phase === "review" && (
            <motion.div
              key="review"
              className="results-container"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="results-title">পরীক্ষার ফলাফল</h2>

              <div className="summary-stats">
                <div className="stat score">
                  <div className="stat-label">স্কোর</div>
                  <div className="stat-value">
                    {bn(summary.score)}/{bn(summary.total)}
                  </div>
                </div>
                <div className="stat ok">
                  <div className="stat-label">সঠিক</div>
                  <div className="stat-value">{bn(summary.correct)}</div>
                </div>
                <div className="stat err">
                  <div className="stat-label">ভুল</div>
                  <div className="stat-value">{bn(summary.wrong)}</div>
                </div>
                <div className="stat mut">
                  <div className="stat-label">অউত্তরিত</div>
                  <div className="stat-value">
                    {bn(summary.unattempted)}
                  </div>
                </div>
                <div className="stat time">
                  <div className="stat-label">সময়</div>
                  <div className="stat-value">{fmt(summary.timeTaken)}</div>
                </div>
              </div>

              <div className="center">
                <motion.button
                  className="try-again-button start-exam-button"
                  onClick={() => {
                    setPhase("setup");
                    setAnswers({});
                    setStartedAt(null);
                    setSubmittedAt(null);
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  পুনরায় পরীক্ষা
                </motion.button>
              </div>

              <div className="result-list">
                {sorted.map((q, idx) => (
                  <ResultMCQItem
                    key={q.number}
                    question={q}
                    userAnswer={answers[q.number]}
                    index={idx + 1}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
