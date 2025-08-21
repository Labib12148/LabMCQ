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
      <h1>অধ্যায়ভিত্তিক অনুশীলন</h1>
      <section className="seo-intro">
        <p>
          অধ্যায়ভিত্তিক অনুশীলন সেকশনে শিক্ষার্থীরা প্রতিটি বিষয়কে ছোট ছোট অধ্যায়ে ভাগ করে পড়ার সুযোগ পায়। SSC পরীক্ষার সিলেবাস বড় হওয়ায় এই পদ্ধতি অনুসরণ করলে প্রস্তুতি আরো সুন্দরভাবে পরিকল্পনা করা যায়। প্রতিটি অধ্যায়ে নির্বাচিত MCQ এবং গুরুত্বপূর্ণ ধারণা দেওয়া হয়েছে যাতে ছাত্রছাত্রীরা একটি নির্দিষ্ট লক্ষ্য নিয়ে পড়তে পারে। বোর্ডের পূর্ববর্তী প্রশ্ন থেকে শুরু করে নতুন সম্ভাব্য প্রশ্নও যুক্ত করা হয়েছে যাতে প্রস্তুতি সর্বাঙ্গীন হয়। অধ্যায় অনুযায়ী পড়লে ভুলভ্রান্তি দ্রুত ধরা পড়ে এবং পুনরাবৃত্তি সহজ হয়।
        </p>
        <p>
          এই পৃষ্ঠার ইন্টারফেসে প্রথমে বিষয় নির্বাচন করতে হয়, এরপর সংশ্লিষ্ট অধ্যায়গুলি তালিকা আকারে প্রদর্শিত হয়। শিক্ষার্থী যে অধ্যায় অনুশীলন করতে চায় সেইগুলো চেকবক্স দিয়ে বেছে নিয়ে অনুশীলন শুরু করতে পারে। অনুশীলন শেষে কতটি প্রশ্ন সঠিক হয়েছে এবং কোন অধ্যায়ে ভুল বেশি হয়েছে তা বিশ্লেষণ করা যায়। প্রতিটি অধ্যায়ের সঙ্গে ব্যাখ্যাসহ উত্তর দেওয়া থাকায় পড়াশোনার ফাঁকে ফাঁকে পুঙ্খানুপুঙ্খভাবে পুনরাবৃত্তি করা যায়। বিষয় বাছাই থেকে শুরু করে অধ্যায় অনুযায়ী ফলাফল দেখার সম্পূর্ণ প্রক্রিয়াটি ব্যবহারকারীর সুবিধার্থে ধারাবাহিকভাবে সাজানো হয়েছে।
        </p>
        <p>
          অধ্যায়ভিত্তিক অনুশীলনের গুরুত্ব বোঝাতে আমরা এই সেকশনে মোটিভেশনাল বার্তাও যুক্ত করেছি। একটি বড় লক্ষ্যকে যখন ছোট ছোট ধাপে ভাগ করে নেওয়া হয় তখন তা অর্জন করা সহজ হয়, এই ধারণাটিকে সামনে রেখে আমাদের এই ব্যবস্থা। প্রতিটি অধ্যায় আয়ত্ত করার পরে শিক্ষার্থীরা নিজের আত্মবিশ্বাস অনুভব করবে এবং পরবর্তী অধ্যায়ে যাওয়ার প্রেরণা পাবে। ধারাবাহিকভাবে অধ্যায়ভিত্তিক অনুশীলন করলে জটিল বিষয়ও সহজ মনে হয় এবং বোর্ড পরীক্ষায় সময় ব্যবস্থাপনা স্বাভাবিক হয়ে যায়। শেষ পর্যন্ত অধ্যায়ভিত্তিক অনুশীলনের উপর ভিত্তি করে গড়ে ওঠা দক্ষতাই বাস্তব পরীক্ষায় সর্বোচ্চ সাফল্য এনে দিতে পারে।
        </p>
        <p>
          প্রতিদিন নির্দিষ্ট সময়ে অধ্যায় অনুযায়ী অনুশীলন করলে শেখা বিষয়গুলো দ্রুত মনে থাকে। এই সেকশন সেই অভ্যাস তৈরি করতে সহায়তা করে এবং শিক্ষার্থীদের নিয়মিত অধ্যবসায়ী হতে উদ্বুদ্ধ করে। আমরা বিশ্বাস করি ছোট ছোট পদক্ষেপ একদিন বড় সাফল্যের পথ তৈরি করে। নিজের প্রয়োজনে বারবার অধ্যায় পরিবর্তন করে পরীক্ষা নেওয়ার সুবিধা থাকায় আত্মবিশ্বাস আরও মজবুত হয় এবং জ্ঞানের গভীরতা বাড়ে। নিয়মিত মূল্যায়নের তথ্য থেকে নিজের অগ্রগতি স্পষ্টভাবে বোঝা যায় এবং পরবর্তী ধাপ নির্ধারণ সহজ হয়।
        </p>
      </section>
      <nav className="seo-links">
        <a href="/chapter-wise">অধ্যায়ভিত্তিক</a>
        <a href="/boards">বোর্ড প্রশ্ন</a>
        <a href="/mock-test">মক টেস্ট</a>
      </nav>
      <noscript>
        <a href="/chapter-wise">অধ্যায়ভিত্তিক</a>
        <a href="/boards">বোর্ড প্রশ্ন</a>
        <a href="/mock-test">মক টেস্ট</a>
      </noscript>
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
