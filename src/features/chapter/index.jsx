import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import Seo from '@/components/Seo';
import AdSlot from '@/components/AdSlot';

import { chapterNames, loadChaptersForSubject, subjectConfig } from '../../components/ChapterClassifications';
import ChapterQuestions from './ChapterQuestions';
import './ChapterWise.css';

/* ===== Animations ===== */
const pageTransition = { type: 'spring', stiffness: 220, damping: 26 };
const pageVariants = { initial: { opacity: 0, x: 24 }, in: { opacity: 1, x: 0 }, out: { opacity: 0, x: -24 } };
const listContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const listItemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

/* ===== LocalStorage hook (unchanged) ===== */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const v = value instanceof Function ? value(storedValue) : value;
      setStoredValue(v);
      if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(v));
    } catch { /* ignore */ }
  };
  return [storedValue, setValue];
};

/* ===== Keys ===== */
const selectionKey = (subject) => `cw:selected:${subject}`;
const prefsKey = (subject) => `cw:prefs:${subject}`;

/* ================= Main ================= */
const ChapterWise = () => {
  const { subject, chapters: chapterParams, mode } = useParams();

  let currentView = 'subjects';
  if (subject && chapterParams && mode) currentView = 'questions';
  else if (subject) currentView = 'chapters';

  const isIndexable = currentView === 'subjects';

  return (
    <div className="cw-container">
      <Seo
        title="অধ্যায়ভিত্তিক MCQ অনুশীলন"
        description="SSC পরীক্ষার প্রতিটি অধ্যায়ের MCQ সমাধান করো ও নিজের দক্ষতা বাড়াও।"
        canonical="https://labmcq.example.com/chapter-wise"
        noIndex={!isIndexable}
        noAds={!isIndexable}
      />
      <AnimatePresence mode="wait">
        {currentView === 'subjects' && <SubjectSelection key="subjects" />}
        {currentView === 'chapters' && (
          <ChapterSelection key="chapters" subject={subject} />
        )}
        {currentView === 'questions' && (
          <Motion.div key="questions" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
            <QuestionSession subject={subject} chapterParams={chapterParams} routeMode={mode} />
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/*********************************
 * 1) Subject Selection
 *********************************/
const SubjectSelection = () => {
  const navigate = useNavigate();
  return (
    <Motion.main className="cw-page" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
      <header className="cw-hero">
        <h1 className="cw-hero-title">অধ্যায়ভিত্তিক অনুশীলন</h1>
        <p className="cw-hero-subtitle">বিষয় বেছে নিন → অধ্যায় নির্বাচন করুন → অনুশীলন শুরু করুন।</p>
      </header>
      
      <Motion.div className="subject-grid" variants={listContainerVariants} initial="hidden" animate="visible">
        {Object.entries(subjectConfig).map(([key, { icon, displayName }]) => (
          <Motion.button
            key={key}
            className="subject-card"
            variants={listItemVariants}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/chapter-wise/${key}`)}
          >
            <div className="subject-icon">{icon}</div>
            <span className="subject-name">{displayName}</span>
          </Motion.button>
        ))}
      </Motion.div>
      <AdSlot slotId="chapter-1" className="mt-6" height={250} />
    </Motion.main>
    
  );
};

/*********************************
 * 2) Chapter Selection
 *********************************/
const ChapterSelection = ({ subject }) => {
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);       // normalized: array of string ids
  const [isLoading, setIsLoading] = useState(true);

  const [selected, setSelected] = useLocalStorage(selectionKey(subject), []);
  const [prefs, setPrefs] = useLocalStorage(prefsKey(subject), { mode: 'practice', count: 25 });

  const { mode, count } = prefs;
  const setMode = (m) => setPrefs((p) => ({ ...p, mode: m }));
  const setCount = (n) => setPrefs((p) => ({ ...p, count: n }));

  // ---- support sync OR async loaders, and normalize ids ----
  useEffect(() => {
    setIsLoading(true);

    const normalize = (input) => {
      if (!input) return [];
      return input.map((c) => {
        if (typeof c === 'object' && c !== null) return String(c.id ?? c.value ?? c.key);
        return String(c);
      });
    };

    try {
      const res = loadChaptersForSubject(subject);
      if (res && typeof res.then === 'function') {
        res
          .then((data) => setChapters(normalize(data)))
          .catch((err) => console.error('Failed to load chapters:', err))
          .finally(() => setIsLoading(false));
      } else {
        setChapters(normalize(res || []));
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Failed to load chapters:', err);
      setChapters([]);
      setIsLoading(false);
    }

    window.scrollTo(0, 0);
  }, [subject]);

  const toggleChapter = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const selectAll = () => setSelected(chapters.slice());
  const clearAll = () => setSelected([]);

  const startSession = () => {
    if (!selected.length) {
      alert('অনুশীলন শুরু করার জন্য কমপক্ষে একটি অধ্যায় নির্বাচন করুন।');
      return;
    }
    const chapterString = [...selected].sort((a, b) => Number(a) - Number(b)).join(',');
    navigate(`/chapter-wise/${subject}/${chapterString}/${mode}?count=${encodeURIComponent(count)}`);
  };

  const ModePill = ({ value, label }) => (
    <button
      type="button"
      className={`cw-mode-pill ${mode === value ? 'active' : ''}`}
      onClick={() => setMode(value)}
      aria-pressed={mode === value}
    >
      {label}
    </button>
  );

  return (
    <Motion.section
      className={`cw-page ${selected.length > 0 ? 'with-cta' : ''}`}
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
    >
      <h1 className="sr-only">অধ্যায় নির্বাচন</h1>
      <header className="cw-header">
        <button className="back-button" onClick={() => navigate('/chapter-wise')}>
          <ArrowLeft size={18} />
          <span>সকল বিষয়</span>
        </button>
        <div className="cw-header-content">
          <h2 className="view-title">{subjectConfig[subject]?.displayName}</h2>
          <p className="view-subtitle">অধ্যায় বাছাই করুন, তারপর মোড ও MCQ সংখ্যা সেট করুন।</p>
        </div>
        {/* theme toggle removed – navbar controls theme */}
      </header>

      <div className="cw-toolbar">
        <div className="cw-toolbar-group">
          <div className="cw-mode-row" role="tablist" aria-label="মোড নির্বাচন">
            <ModePill value="practice" label="প্র্যাকটিস" />
            <ModePill value="fast" label="দ্রুত অনুশীলন" />
          </div>

          <div className="cw-count-control">
            <label htmlFor="cwCount" className="cw-count-label">প্রশ্ন সংখ্যা</label>
            <input
              id="cwCount"
              type="number"
              min={1}
              max={200}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(200, Number(e.target.value) || 1)))}
            />
          </div>
        </div>

        <div className="cw-toolbar-group">
          <div className="cw-bulk-actions">
            <button className="cw-btn-secondary" onClick={selectAll}>সবগুলো বাছাই</button>
            <button className="cw-btn-secondary" onClick={clearAll}>বাতিল</button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="cw-loading-indicator">লোড হচ্ছে...</div>
      ) : (
        <Motion.div className="chapter-grid" variants={listContainerVariants} initial="hidden" animate="visible">
          {chapters.map((cid) => {
            const isSelected = selected.includes(cid);
            return (
              <Motion.button
                key={cid}
                className={`chapter-card ${isSelected ? 'selected' : ''}`}
                variants={listItemVariants}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleChapter(cid)}
                aria-pressed={isSelected}
              >
                <div className={`checkbox-icon ${isSelected ? 'checked' : ''}`}>
                  {isSelected && <Check size={16} strokeWidth={3} />}
                </div>
                <span className="chapter-name">
                  {chapterNames[subject]?.[cid] || `অধ্যায় ${cid}`}
                </span>
              </Motion.button>
            );
          })}
        </Motion.div>
      )}

      <AnimatePresence>
        {selected.length > 0 && (
          <Motion.div
            className="cw-cta-dock"
            initial={{ y: '120%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '120%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="cw-cta-summary">
              <strong>{selected.length}</strong> অধ্যায় • <strong>{count}</strong> MCQ • {mode === 'practice' ? 'প্র্যাকটিস মোড' : 'দ্রুত অনুশীলন'}
            </div>
            <button className="cw-cta-button" onClick={startSession}>
              অনুশীলন শুরু করুন
            </button>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.section>
  );
};

/*********************************
 * 3) Question Session
 *********************************/
const QuestionSession = ({ subject, chapterParams, routeMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedChapters, count } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const chapters = (chapterParams || '').split(',').map((s) => s.trim()).filter(Boolean);
    const q = Number(params.get('count'));
    return {
      selectedChapters: chapters,
      count: Number.isFinite(q) && q > 0 ? q : 25,
    };
  }, [chapterParams, location.search]);

  return (
    <>
      <h1 className="sr-only">প্রশ্নসমূহ</h1>
      <ChapterQuestions
        subject={subject}
        selectedChapters={selectedChapters}
        mode={routeMode}
        count={count}
        onBack={() => navigate(`/chapter-wise/${subject}`)}
      />
    </>
  );
};

export default ChapterWise;
