import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckSquare, Square, PlayCircle } from 'lucide-react';

import { subjectConfig } from '@/config/subjectConfig';
import MockTest from './MockTest';

const useChapters = (subject) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!subject) {
        setData([]);
        return;
      }

      const raw = subjectConfig[subject]?.path || '';
      const base = (`/${String(raw).replace(/^\/?/, '')}`).replace(/\\/g, '/');
      const modules = await Promise.all(
        Object.entries(import.meta.glob('/src/data/**/*.json'))
          .filter(([path]) => String(path).replace(/\\/g, '/').startsWith(base))
          .map(([path, loader]) => loader().then((module) => ({ path, data: module }))),
      );

      const counts = new Map();
      modules.forEach(({ data: module }) => {
        const questions = module?.default?.questions || [];
        questions.forEach((question) => {
          const chapterId = (question.chapter ?? '').toString();
          counts.set(chapterId, (counts.get(chapterId) || 0) + 1);
        });
      });

      const list = Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => {
        const numericA = Number(a.name);
        const numericB = Number(b.name);
        if (!Number.isNaN(numericA) && !Number.isNaN(numericB)) return numericA - numericB;
        return a.name.localeCompare(b.name, 'bn');
      });

      if (alive) setData(list);
    })();

    return () => {
      alive = false;
    };
  }, [subject]);

  return data;
};

const MockTestIndex = () => {
  const [step, setStep] = useState('pick');
  const [subject, setSubject] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [count, setCount] = useState(25);
  const [minutes] = useState(0);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));

  const chapters = useChapters(subject);
  const title = useMemo(
    () => (subject ? `${subjectConfig[subject]?.displayName} — মক টেস্ট` : 'মক টেস্ট'),
    [subject],
  );

  const toggle = (name) =>
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const selectAll = () => setSelected(new Set(chapters.map((chapter) => chapter.name)));
  const clearAll = () => setSelected(new Set());

  return (
    <div className="cw-container">
      {step === 'pick' && (
        <main className="cw-page">
          <header className="cw-header">
            <div />
            <div className="cw-header-content">
              <h2 className="view-title">মক টেস্ট</h2>
              <p className="view-subtitle">বিষয় নির্বাচন করুন</p>
            </div>
            <div />
          </header>
          <div className="subject-grid">
            {Object.entries(subjectConfig).map(([key, { icon, displayName }]) => (
              <button
                key={key}
                className="subject-card"
                onClick={() => {
                  setSubject(key);
                  setStep('setup');
                }}
              >
                <div className="subject-icon">{icon}</div>
                <span className="subject-name">{displayName}</span>
              </button>
            ))}
          </div>
        </main>
      )}

      {step === 'setup' && subject && (
        <section className="cw-page">
          <header className="cw-header">
            <button
              className="back-button"
              onClick={() => {
                setSubject(null);
                setSelected(new Set());
                setStep('pick');
              }}
            >
              <ArrowLeft size={16} /> <span>সকল বিষয়</span>
            </button>
            <div className="cw-header-content">
              <h2 className="view-title">{title}</h2>
              <p className="view-subtitle">অধ্যায় বাছাই করুন ও প্রশ্ন সংখ্যা দিন</p>
            </div>
            <div />
          </header>

          <div className="setup-topbar">
            <div className="setup-group">
              <button className="cw-btn-secondary" onClick={selectAll}>
                <CheckSquare size={16} /> সবগুলো বাছাই
              </button>
              <button className="cw-btn-secondary" onClick={clearAll}>
                <Square size={16} /> বাতিল
              </button>
            </div>
            <div className="setup-group">
              <div className="count-field">
                <label htmlFor="mtCount">প্রশ্ন সংখ্যা</label>
                <input
                  id="mtCount"
                  className="count-input"
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
          </div>

          <div className="ch-grid">
            {chapters.map((chapter) => (
              <label key={chapter.name} className="ch-card">
                <input
                  type="checkbox"
                  checked={selected.has(chapter.name)}
                  onChange={() => toggle(chapter.name)}
                />
                <span className="ch-name">অধ্যায় {chapter.name}</span>
              </label>
            ))}
          </div>

          <div className="bottom-bar">
            <button className="bottom-cta" onClick={() => setStep('run')}>
              <PlayCircle size={18} /> টেস্ট শুরু করুন
            </button>
          </div>
        </section>
      )}

      {step === 'run' && subject && (
        <MockTest
          key={`${subject}:${Array.from(selected).sort().join(',')}:${count}:${minutes}:${seed}`}
          subject={subject}
          chapters={[...selected]}
          count={count}
          minutes={minutes}
          seed={seed}
          onExit={() => setStep('setup')}
          onNewTest={() => {
            setSeed(Math.floor(Math.random() * 1e9));
            setStep('setup');
          }}
        />
      )}
    </div>
  );
};

export default MockTestIndex;
