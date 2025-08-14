import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import seedrandom from 'seedrandom';

// Shared components & utils
import MathText from '../components/MathText';
import { getAssetPath } from '../components/AssetFinder';

// Styles (same path as DisplayQuestions)
import '../styles/styles.css';

// Data
// (removed unused: const modules = import.meta.glob('/src/data/**/*.json');)
import { subjectConfig } from './ChapterClassifications';

const letters = ['A', 'B', 'C', 'D'];
const banglaMap = { A: 'ক', B: 'খ', C: 'গ', D: 'ঘ' };

/*************************************************
 * Utils
 *************************************************/
function stringHash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(16);
}

const rngFrom = (seed) => seedrandom(seed);

/* ---------- Image helper: baseDir-aware ---------- */
const SmartImage = ({ src, alt, className, baseDir }) => {
  const base = (import.meta?.env?.BASE_URL || '/').replace(/\/+$/, '/');
  const [activeSrc, setActiveSrc] = useState(null);
  const candidatesRef = useRef([]);
  const triedRef = useRef(new Set());

  const normalize = (s) => (typeof s === 'string' ? s.replace(/\\/g, '/').trim() : s);

  const buildCandidates = (s) => {
    if (!s) return [];
    const clean = normalize(s);
    const list = [];

    const isAbs = /^https?:\/\//i.test(clean) || /^data:/i.test(clean);
    if (isAbs) return [clean];

    try { list.push(getAssetPath(clean)); } catch (_) {}

    if (baseDir && !clean.startsWith('/')) {
      const bd = baseDir.endsWith('/') ? baseDir : baseDir + '/';
      list.push(bd + clean);
    }

    list.push(clean);
    if (!clean.startsWith('/')) list.push('/' + clean);
    list.push(base + clean.replace(/^\/+/, ''));

    return Array.from(new Set(list.filter(Boolean)));
  };

  useEffect(() => {
    const c = buildCandidates(src);
    candidatesRef.current = c;
    triedRef.current = new Set();
    setActiveSrc(c[0] || null);
  }, [src, baseDir]);

  const handleError = () => {
    const candidates = candidatesRef.current;
    if (activeSrc) triedRef.current.add(activeSrc);
    const idx = candidates.indexOf(activeSrc);
    const next = candidates.slice(idx + 1).find((c) => !triedRef.current.has(c));
    if (next) {
      triedRef.current.add(next);
      setActiveSrc(next);
    } else {
      setActiveSrc(null);
    }
  };

  if (!activeSrc) return null;
  return (
    <img
      key={activeSrc}
      src={activeSrc}
      alt={alt || ''}
      className={className}
      loading="lazy"
      onError={handleError}
      referrerPolicy="no-referrer"
    />
  );
};

/*************************************************
 * Random & helpers
 *************************************************/
function shuffleOptionsBalanced(q, targetLetter, rng) {
  const remaining = letters.filter((L) => L !== targetLetter);
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }

  const ans = String(q.answer || '').toUpperCase();
  const opt = (L) => q[`option${L}`] ?? '—';
  const img = (L) => q[`option${L}_img`] ?? '';

  const shuffledMap = {};
  shuffledMap[targetLetter] = opt(ans);
  shuffledMap[`${targetLetter}_img`] = img(ans);

  const otherSrc = letters.filter((L) => L !== ans);
  remaining.forEach((pos, i) => {
    const src = otherSrc[i];
    shuffledMap[pos] = opt(src);
    shuffledMap[`${pos}_img`] = img(src);
  });

  return {
    optionA: shuffledMap.A, optionA_img: shuffledMap.A_img,
    optionB: shuffledMap.B, optionB_img: shuffledMap.B_img,
    optionC: shuffledMap.C, optionC_img: shuffledMap.C_img,
    optionD: shuffledMap.D, optionD_img: shuffledMap.D_img,
    answer: targetLetter,
  };
}

function avoidAdjacentChapters(arr) {
  const res = [...arr];
  for (let i = 1; i < res.length; i++) {
    if (res[i].chapter === res[i - 1].chapter) {
      let j = i + 1;
      while (j < res.length && res[j].chapter === res[i - 1].chapter) j++;
      if (j < res.length) [res[i], res[j]] = [res[j], res[i]];
    }
  }
  return res;
}

// Keep explanation letters in sync with the current (shuffled) answer.
function adaptExplanationText(expl, answerLetter) {
  if (!expl) return expl;
  let s = String(expl);
  const bn = { A: 'ক', B: 'খ', C: 'গ', D: 'ঘ' };
  const outBn = bn[answerLetter] || answerLetter;

  // Bangla: “সঠিক উত্তর … A/ক” → replace with current
  const banglaPatterns = [
    /(সঠিক\s*উত্তর\s*(?:হল|হলো|:)\s*)([ABCDকখগঘ])/gi,
    /(উত্তর\s*[:]\s*)([ABCDকখগঘ])/gi,
  ];
  banglaPatterns.forEach((re) => {
    s = s.replace(re, (_m, p1) => p1 + outBn);
  });

  // English: “Correct answer/Answer/Ans: A” → replace with current
  const engPatterns = [
    /(Correct\s*answer\s*(?:is|:)\s*)([ABCD])/gi,
    /(Answer\s*[:]\s*)([ABCD])/gi,
    /(Ans\.?\s*[:]\s*)([ABCD])/gi,
  ];
  engPatterns.forEach((re) => {
    s = s.replace(re, (_m, p1) => p1 + answerLetter);
  });

  return s;
}

function preferUnseen(pool, subject, need) {
  const key = `cw:seen:${subject}`;
  const seen = new Set(JSON.parse(localStorage.getItem(key) || '[]'));
  const unseen = pool.filter((q) => !seen.has(q.questionId));
  const first = unseen.slice(0, need);
  if (first.length < need) {
    const remain = need - first.length;
    const seenPool = pool.filter((q) => seen.has(q.questionId));
    first.push(...seenPool.slice(0, remain));
  }
  const pickedIds = first.map((q) => q.questionId);
  const nextSeen = [...new Set([...pickedIds, ...seen])].slice(0, 2000);
  localStorage.setItem(key, JSON.stringify(nextSeen));
  return first;
}

/*************************************************
 * Question Selector — PURE (no local UI)
 *************************************************/
const useQuestionSelector = (subject, selectedChapters, count, mode) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const run = async () => {
      setIsLoading(true);

      const subjectPath = subjectConfig[subject]?.path;
      if (!subject || !subjectPath || !selectedChapters?.length) {
        if (isActive) { setQuestions([]); setIsLoading(false); }
        return;
      }

      const mods = await Promise.all(
        Object.entries(import.meta.glob('/src/data/**/*.json'))
          .filter(([path]) => path.startsWith(subjectPath))
          .map(([path, loader]) => loader().then((m) => ({ path, data: m })))
      );

      const chapterPools = new Map();
      selectedChapters.forEach((ch) => chapterPools.set(ch, []));

      mods.forEach(({ path, data }) => {
        const arr = data?.default?.questions || [];
        const baseDir = path.slice(0, path.lastIndexOf('/') + 1);
        arr.forEach((mcq, localIdx) => {
          const ch = mcq.chapter;
          if (!chapterPools.has(ch)) return;
          const base = {
            s: subject, p: path, ch,
            b: mcq.board || '', n: mcq.number ?? localIdx,
            q: mcq.question || '',
            A: mcq.optionA || '', B: mcq.optionB || '', C: mcq.optionC || '', D: mcq.optionD || '',
            Ai: mcq.optionA_img || '', Bi: mcq.optionB_img || '', Ci: mcq.optionC_img || '', Di: mcq.optionD_img || '',
            Qi: mcq.image || '',
          };
          const questionId = `q_${((h) => (h >>> 0).toString(16))(
            Array.from(JSON.stringify(base)).reduce((acc, c) => ((acc << 5) + acc) ^ c.charCodeAt(0), 5381)
          )}`;

          chapterPools.get(ch).push({ ...mcq, questionId, __baseDir: baseDir });
        });
      });

      const totalSize = Array.from(chapterPools.values()).reduce((s, a) => s + a.length, 0);
      if (totalSize === 0) { if (isActive) { setQuestions([]); setIsLoading(false); } return; }

      // Fast now uses the same finalCount logic as Practice
      const finalCount = Math.min(count || totalSize, totalSize);

      const quotas = new Map();
      let totalQuota = 0;
      chapterPools.forEach((mcqs, ch) => {
        const q = Math.round((mcqs.length / totalSize) * finalCount);
        quotas.set(ch, q); totalQuota += q;
      });
      let diff = finalCount - totalQuota;
      const chIds = [...chapterPools.keys()];
      while (diff !== 0) {
        const idx = Math.floor(Math.random() * chIds.length);
        const ch = chIds[idx];
        const cur = quotas.get(ch);
        if (diff > 0 && cur < chapterPools.get(ch).length) { quotas.set(ch, cur + 1); diff--; }
        else if (diff < 0 && cur > 0) { quotas.set(ch, cur - 1); diff++; }
      }

      const sessionSeedKey = `cq:seed:${subject}|${selectedChapters.join(',')}|${finalCount}|${mode}`;
      let seed = sessionStorage.getItem(sessionSeedKey);
      if (!seed) { seed = Date.now().toString(); sessionStorage.setItem(sessionSeedKey, seed); }
      const rng = seedrandom(seed);

      let selected = [];
      chapterPools.forEach((pool) => {
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        const picked = preferUnseen(pool, subject, quotas.get(pool[0]?.chapter) || 0);
        selected.push(...picked);
      });

      for (let i = selected.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [selected[i], selected[j]] = [selected[j], selected[i]];
      }

      // ✅ Better variety: avoid back-to-back same-chapter questions
      selected = avoidAdjacentChapters(selected);

      const letterCount = { A: 0, B: 0, C: 0, D: 0 };
      const withBalancedOptions = selected.map((q) => {
        const least = Object.entries(letterCount).sort((a, b) => a[1] - b[1])[0][0];
        const mapped = shuffleOptionsBalanced(q, least, rng);
        letterCount[least]++;
        return { ...q, ...mapped };
      });

      if (isActive) { setQuestions(withBalancedOptions); setIsLoading(false); }
    };

    run();
    return () => { isActive = false; };
  }, [subject, selectedChapters, count, mode]);

  return { questions, isLoading };
};

/*************************************************
 * Shared Tailwind-ish class sets (same as DisplayQuestions)
 *************************************************/
const gridWrapClasses = 'option-grid grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3';
const buttonBase = [
  'option-button w-full rounded-md border px-3 py-2 text-left transition',
  'flex items-start gap-2 min-w-0',
  'hover:border-slate-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500'
].join(' ');
const labelClasses = 'option-label shrink-0 grid place-items-center h-7 w-7 rounded-full border font-bold';
const textWrapClasses = 'option-text block min-w-0 whitespace-normal break-words leading-relaxed text-[15px]';

/*************************************************
 * Practice (FAST)
 *************************************************/
const PracticeFast = ({ questions }) => {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const q = questions[idx];
  const answered = selected !== null;

  const choose = (opt) => { if (!answered) setSelected(opt); };
  const next = () => {
    if (idx < questions.length - 1) setIdx((i) => i + 1);
    else setIdx(0);
    setSelected(null);
    setShowExplanation(false);
  };

  return (
    <div className="mcq-card" role="group" aria-label="MCQ">
      <div className="mcq-header">
        <div className="mcq-question-number">{(idx + 1).toLocaleString('bn-BD')}</div>
        <div className="mcq-question-text">
          <MathText text={q.question} />
          {q.image?.trim?.() && (
            <SmartImage src={q.image} baseDir={q.__baseDir} alt="Question" className="question-image" />
          )}
        </div>
      </div>

      <div className={gridWrapClasses} role="radiogroup" aria-label="Options">
        {['A', 'B', 'C', 'D'].map((opt) => {
          const state = !answered ? 'idle' : (opt === q.answer ? 'correct' : (opt === selected ? 'wrong' : 'disabled'));
          return (
            <button
              key={opt}
              type="button"
              onClick={() => choose(opt)}
              className={buttonBase}
              data-state={state}
              disabled={answered}
              aria-pressed={answered && selected === opt}
            >
              <span className={labelClasses}>{banglaMap[opt]}</span>
              <div className={textWrapClasses}>
                <MathText text={q[`option${opt}`] ?? '—'} />
                {q[`option${opt}_img`]?.trim?.() && (
                  <SmartImage src={q[`option${opt}_img`]} baseDir={q.__baseDir} alt={`Option ${opt}`} className="option-image" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mcq-feedback">
          <p className="mcq-feedback-text" data-correct={selected === q.answer}>
            {selected === q.answer ? (
              <><CheckCircle size={18} /> <span>সঠিক উত্তর!</span></>
            ) : (
              <><XCircle size={18} /> <span>সঠিক উত্তর: <strong>{banglaMap[q.answer] || q.answer}</strong></span></>
            )}
          </p>
          {q.explanation && (
            <button onClick={() => setShowExplanation((v) => !v)} className="explanation-toggle" aria-expanded={showExplanation}>
              {showExplanation ? 'ব্যাখ্যা দেখুন ↑' : 'ব্যাখ্যা দেখুন ↓'}
            </button>
          )}
        </div>
      )}

      {answered && q.explanation && showExplanation && (
        <div className="mcq-explanation">
          <div className="explanation-header"><HelpCircle size={16} className="mr-2"/> ব্যাখ্যা</div>
          <div className="explanation-body"><MathText text={adaptExplanationText(q.explanation, q.answer)} /></div>
        </div>
      )}

      <div className="mcq-footer">
        <button type="button" className="action-button primary" onClick={next}>{answered ? 'পরবর্তী প্রশ্ন' : 'স্কিপ'}</button>
      </div>
    </div>
  );
};

/*************************************************
 * Practice (LIST)
 *************************************************/
const PracticeList = ({ questions, persistKey }) => {
  const [chosen, setChosen] = useState(() => {
    try { return persistKey ? JSON.parse(localStorage.getItem(persistKey) || '{}') : {}; }
    catch { return {}; }
  });
  const [showExp, setShowExp] = useState({});

  // Persist on changes
  useEffect(() => {
    try { if (persistKey) localStorage.setItem(persistKey, JSON.stringify(chosen)); } catch {}
  }, [persistKey, chosen]);

  // Load when key changes
  useEffect(() => {
    try {
      if (!persistKey) return;
      const saved = JSON.parse(localStorage.getItem(persistKey) || '{}');
      setChosen(saved);
    } catch { setChosen({}); }
  }, [persistKey]);

  return (
    <div className="practice-list">
      {questions.map((q, idx) => {
        const picked = chosen[q.questionId];
        const answered = picked === 'A' || picked === 'B' || picked === 'C' || picked === 'D';
        const correct = answered && picked === q.answer;
        return (
          <div key={q.questionId} className="mcq-card" role="group" aria-label={`MCQ ${idx + 1}`}>
            <div className="mcq-header">
              <div className="mcq-question-number">{(idx + 1).toLocaleString('bn-BD')}</div>
              <div className="mcq-question-text">
                <MathText text={q.question} />
                {q.image?.trim?.() && <SmartImage src={q.image} baseDir={q.__baseDir} alt="Question" className="question-image" />}
              </div>
            </div>

            <div className={gridWrapClasses} role="radiogroup" aria-label="Options">
              {['A','B','C','D'].map((opt) => {
                const state = !answered ? 'idle' : (opt === q.answer ? 'correct' : (opt === picked ? 'wrong' : 'disabled'));
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setChosen((prev) => ({ ...prev, [q.questionId]: opt }))}
                    className={buttonBase}
                    data-state={state}
                    disabled={answered}
                    aria-pressed={answered && picked === opt}
                  >
                    <span className={labelClasses}>{banglaMap[opt]}</span>
                    <div className={textWrapClasses}>
                      <MathText text={q[`option${opt}`] ?? '—'} />
                      {q[`option${opt}_img`]?.trim?.() && (
                        <SmartImage src={q[`option${opt}_img`]} baseDir={q.__baseDir} alt={`Option ${opt}`} className="option-image" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mcq-feedback">
                <p className="mcq-feedback-text" data-correct={correct}>
                  {correct ? (
                    <><CheckCircle size={18} /> <span>সঠিক উত্তর!</span></>
                  ) : (
                    <><XCircle size={18} /> <span>সঠিক উত্তর: <strong>{banglaMap[q.answer] || q.answer}</strong></span></>
                  )}
                </p>
                {q.explanation && (
                  <button
                    onClick={() => setShowExp((prev) => ({ ...prev, [q.questionId]: !prev[q.questionId] }))}
                    className="explanation-toggle"
                    aria-expanded={!!showExp[q.questionId]}
                  >
                    {showExp[q.questionId] ? 'ব্যাখ্যা দেখুন ↑' : 'ব্যাখ্যা দেখুন ↓'}
                  </button>
                )}
              </div>
            )}

            {answered && q.explanation && showExp[q.questionId] && (
              <div className="mcq-explanation">
                <div className="explanation-header"><HelpCircle size={16} className="mr-2"/> ব্যাখ্যা</div>
                <div className="explanation-body"><MathText text={adaptExplanationText(q.explanation, q.answer)} /></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/*************************************************
 * Main
 *************************************************/
const ChapterQuestions = ({ subject, selectedChapters = [], mode = 'practice', count = 25 }) => {
  const { questions, isLoading } = useQuestionSelector(subject, selectedChapters, count, mode);

  // Persist key for LIST mode (practice). Fast mode is ephemeral.
  const persistKey = useMemo(
    () => `cq:answers:${subject}:${(selectedChapters || []).join(',')}:${mode}`,
    [subject, selectedChapters, mode]
  );

  if (isLoading) {
    return (
      <div className="cq-theme-wrapper">
        <div className="chapter-questions-container"><div className="loading-skeleton" /></div>
      </div>
    );
  }
  if (!questions?.length) {
    return (
      <div className="cq-theme-wrapper">
        <div className="chapter-questions-container">
          <h2 className="board-title">{subjectConfig[subject]?.displayName}</h2>
          <p className="board-subtitle">দুঃখিত, এই অধ্যায়ের জন্য কোনো প্রশ্ন পাওয়া যায়নি।</p>
          <div className="cq-topline">
            <Link to={`/chapter-wise/${subject}`} className="cq-toplink">অন্যান্য অধ্যায় দেখুন</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cq-theme-wrapper">
      <div className="chapter-questions-container">
        <div className="cq-topline">
          <Link to={`/chapter-wise/${subject}`} className="cq-toplink">সকল অধ্যায় দেখুন</Link>
        </div>
        <div className="cq-header">
          <h2 className="cq-title">{subjectConfig[subject]?.displayName}</h2>
          <p className="cq-subtitle">{questions.length.toLocaleString('bn-BD')} টি প্রশ্ন</p>
        </div>

        {mode === 'practice' && <PracticeList questions={questions} persistKey={persistKey} />}
        {mode === 'fast' && <PracticeFast questions={questions} />}
      </div>

      <footer className="cq-footer-nav">
        <Link to={`/chapter-wise/${subject}`} className="action-button secondary">
          আরও অনুশীলন করুন
        </Link>
      </footer>
    </div>
  );
};

export default ChapterQuestions;
