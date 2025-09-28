import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

import { chapterNames, subjectConfig } from '@/config/subjectConfig';
import { loadChaptersForSubject } from '@/utils';
import { useLocalStorage } from '@/hooks';

export const pageTransition = { type: 'spring', stiffness: 220, damping: 26 };
export const pageVariants = {
  initial: { opacity: 0, x: 24 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -24 },
};
export const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
export const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const selectionKey = (subject) => `cw:selected:${subject}`;
const prefsKey = (subject) => `cw:prefs:${subject}`;

export const SubjectSelection = () => {
  const navigate = useNavigate();

  return (
    <Motion.main
      className="cw-page"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
    >
      <header className="cw-hero">
        <h1 className="cw-hero-title">অধ্যায়ভিত্তিক অনুশীলন</h1>
        <p className="cw-hero-subtitle">বিষয় বেছে নিন → অধ্যায় নির্বাচন করুন → অনুশীলন শুরু করুন।</p>
      </header>
      <Motion.div
        className="subject-grid"
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
      >
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
    </Motion.main>
  );
};

export const ChapterSelection = ({ subject }) => {
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selected, setSelected] = useLocalStorage(selectionKey(subject), []);
  const [prefs, setPrefs] = useLocalStorage(prefsKey(subject), {
    mode: 'practice',
    count: 25,
  });

  const { mode, count } = prefs;
  const setMode = (value) => setPrefs((previous) => ({ ...previous, mode: value }));
  const setCount = (value) => setPrefs((previous) => ({ ...previous, count: value }));

  useEffect(() => {
    setIsLoading(true);

    const normalize = (input) => {
      if (!input) return [];
      return input.map((chapter) => {
        if (typeof chapter === 'object' && chapter !== null) {
          return String(chapter.id ?? chapter.value ?? chapter.key);
        }
        return String(chapter);
      });
    };

    const run = async () => {
      try {
        const result = await loadChaptersForSubject(subject);
        setChapters(normalize(result));
      } catch (error) {
        console.error('Failed to load chapters:', error);
        setChapters([]);
      } finally {
        setIsLoading(false);
      }
    };

    run();
    window.scrollTo(0, 0);
  }, [subject]);

  const toggleChapter = (id) => {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((chapterId) => chapterId !== id)
        : [...previous, id],
    );
  };

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
      <header className="cw-header">
        <button className="back-button" onClick={() => navigate('/chapter-wise')}>
          <ArrowLeft size={18} />
          <span>সকল বিষয়</span>
        </button>
        <div className="cw-header-content">
          <h2 className="view-title">{subjectConfig[subject]?.displayName}</h2>
          <p className="view-subtitle">অধ্যায় বাছাই করুন, তারপর মোড ও MCQ সংখ্যা সেট করুন।</p>
        </div>
      </header>

      <div className="cw-toolbar">
        <div className="cw-toolbar-group">
          <div className="cw-mode-row" role="tablist" aria-label="মোড নির্বাচন">
            <ModePill value="practice" label="প্র্যাকটিস" />
            <ModePill value="fast" label="দ্রুত অনুশীলন" />
          </div>

          <div className="cw-count-control">
            <label htmlFor="cwCount" className="cw-count-label">
              প্রশ্ন সংখ্যা
            </label>
            <input
              id="cwCount"
              type="number"
              min={1}
              max={200}
              value={count}
              onChange={(event) =>
                setCount(Math.max(1, Math.min(200, Number(event.target.value) || 1)))
              }
            />
          </div>
        </div>

        <div className="cw-toolbar-group">
          <div className="cw-bulk-actions">
            <button type="button" className="cw-btn-secondary" onClick={selectAll}>
              সবগুলো বাছাই
            </button>
            <button type="button" className="cw-btn-secondary" onClick={clearAll}>
              বাতিল
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="cw-loading-indicator">লোড হচ্ছে...</div>
      ) : (
        <Motion.div
          className="chapter-grid"
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {chapters.map((chapterId) => {
            const isSelected = selected.includes(chapterId);
            return (
              <Motion.button
                key={chapterId}
                type="button"
                className={`chapter-card ${isSelected ? 'selected' : ''}`}
                variants={listItemVariants}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleChapter(chapterId)}
                aria-pressed={isSelected}
              >
                <div className={`checkbox-icon ${isSelected ? 'checked' : ''}`}>
                  {isSelected && <Check size={16} strokeWidth={3} />}
                </div>
                <span className="chapter-name">
                  {chapterNames[subject]?.[chapterId] || `অধ্যায় ${chapterId}`}
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
              <strong>{selected.length}</strong> অধ্যায় • <strong>{count}</strong> MCQ •{' '}
              {mode === 'practice' ? 'প্র্যাকটিস মোড' : 'দ্রুত অনুশীলন'}
            </div>
            <button type="button" className="cw-cta-button" onClick={startSession}>
              অনুশীলন শুরু করুন
            </button>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.section>
  );
};
