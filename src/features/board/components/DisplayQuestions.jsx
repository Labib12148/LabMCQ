// src/BoardQuestions/DisplayQuestions.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle, HelpCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { MathText } from '@/components';
import { getAssetPath } from '@/utils';

// Animations
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const banglaMap = { A: 'ক', B: 'খ', C: 'গ', D: 'ঘ' };

// Shared class sets (match ChapterQuestions.jsx)
const gridWrapClasses = 'option-grid grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3';
const buttonBase = [
  'option-button w-full rounded-md border px-3 py-2 text-left transition',
  'flex items-start gap-2 min-w-0',
  'hover:border-slate-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500'
].join(' ');
const labelClasses = 'option-label shrink-0 grid place-items-center h-7 w-7 rounded-full border font-bold';
const textWrapClasses = 'option-text block min-w-0 whitespace-normal break-words leading-relaxed text-[15px]';

// Progress bar (kept)
const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="progress-bar-container" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
      <Motion.div
        className="progress-bar-fill"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
};

// One MCQ item (classes match ChapterQuestions)
const MCQItem = ({ mcq, index, onAnswer, selectedOption, mode }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const hasAnswered = selectedOption !== null;
  const displayAnswer = banglaMap[mcq.answer] || mcq.answer;

  const stateFor = (opt) => {
    if (!hasAnswered) return 'idle';
    if (opt === mcq.answer) return 'correct';
    if (opt === selectedOption) return 'wrong';
    return 'disabled';
  };

  return (
    <Motion.article className="mcq-card" variants={itemVariants} role="group" aria-label={`MCQ ${index}`}> 
      <div className="mcq-header">
        <div className="mcq-question-number">{index.toLocaleString('bn-BD')}</div>
        <div className="mcq-question-text">
          <MathText text={mcq.question} />
          {mcq.image && (
            <img
              src={getAssetPath(mcq.image)}
              alt="Question illustration"
              className="question-image"
              loading="lazy"
              width="600"
              height="400"
            />
          )}
        </div>
      </div>

      <div className={gridWrapClasses} role="radiogroup" aria-label="Options">
        {['A', 'B', 'C', 'D'].map((opt, idx) => (
          <button
            key={opt}
            type="button"
            className={buttonBase}
            data-state={stateFor(opt)}
            onClick={() => onAnswer(index - 1, opt)}
            disabled={hasAnswered}
            aria-pressed={hasAnswered && selectedOption === opt}
          >
            <span className={labelClasses}>{['ক', 'খ', 'গ', 'ঘ'][idx]}</span>
            <div className={textWrapClasses}>
              <MathText text={mcq[`option${opt}`]} />
              {mcq[`option${opt}_img`] && (
                <img
                  src={getAssetPath(mcq[`option${opt}_img`])}
                  alt={`Option ${opt} illustration`}
                  className="option-image"
                  loading="lazy"
                  width="600"
                  height="400"
                />
              )}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {hasAnswered && mode === 'practice' && (
      <Motion.div
            className="mcq-feedback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="mcq-feedback-text" data-correct={selectedOption === mcq.answer}>
              {selectedOption === mcq.answer ? (
                <>
                  <CheckCircle size={18} /> <span>সঠিক উত্তর!</span>
                </>
              ) : (
                <>
                  <XCircle size={18} /> <span>সঠিক উত্তর: <strong>{displayAnswer}</strong></span>
                </>
              )}
            </p>
          </Motion.div>
        )}
      </AnimatePresence>

      {hasAnswered && mcq.explanation && (
        <div className="mcq-explanation-wrap">
          <button
            onClick={() => setShowExplanation((s) => !s)}
            className="explanation-toggle"
            aria-expanded={showExplanation}
          >
            {showExplanation ? 'ব্যাখ্যা দেখুন ↑' : 'ব্যাখ্যা দেখুন ↓'}
          </button>

          <AnimatePresence>
            {showExplanation && (
          <Motion.div
                className="mcq-explanation"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <div className="explanation-header">
                  <HelpCircle size={16} className="mr-2" /> ব্যাখ্যা
                </div>
                <div className="explanation-body">
                  <MathText text={mcq.explanation} />
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Motion.article>
  );
};

// Main
const DisplayQuestions = ({ questions, boardName, mode }) => {
  const [answers, setAnswers] = useState({});

  const handleAnswerQuestion = (questionIndex, selectedOption) => {
    if (mode === 'practice' && answers[questionIndex] === undefined) {
      setAnswers((prev) => ({ ...prev, [questionIndex]: selectedOption }));
    }
  };

  // FIX: useEffect (not useState) to prefill answers in "view" mode
  useEffect(() => {
    if (mode === 'view' && questions?.length) {
      const viewAnswers = questions.reduce((acc, q, idx) => ({ ...acc, [idx]: q.answer }), {});
      setAnswers(viewAnswers);
    }
  }, [mode, questions]);

  const answeredCount = Object.keys(answers).length;
  const subtitle = useMemo(
    () => (mode === 'practice' ? 'অনুশীলনী ও সমাধান' : 'প্রশ্ন ও উত্তর'),
    [mode]
  );

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10" role="alert">
        এই বোর্ডের জন্য কোনো প্রশ্ন লোড করা যায়নি।
      </div>
    );
  }

  return (
    <div className="cq-theme-wrapper">
      <div className="chapter-questions-container">
        <header className="cq-header">
          <h2 className="cq-title">{boardName}</h2>
          <div className="cq-subtitle">{subtitle}</div>
        </header>

        {mode === 'practice' && <ProgressBar current={answeredCount} total={questions.length} />}

        <Motion.section initial="hidden" animate="visible" transition={{ staggerChildren: 0.08 }} className="practice-list">
          {questions.map((mcq, idx) => (
            <MCQItem
              key={`${boardName}-${mcq.number ?? idx}`}
              mcq={mcq}
              index={idx + 1}
              onAnswer={handleAnswerQuestion}
              selectedOption={answers[idx] !== undefined ? answers[idx] : null}
              mode={mode}
            />
          ))}
        </Motion.section>

        <div className="other-board-btn-wrapper">
          <a href="#" className="other-board-btn" onClick={(e) => e.preventDefault()}>
            {mode === 'practice' ? 'আরও বোর্ডের অনুশীলন করুন' : 'আরও বোর্ডের প্রশ্ন দেখুন'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default DisplayQuestions;
