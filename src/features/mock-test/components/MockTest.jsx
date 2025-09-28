import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MathText } from '@/components';
import { subjectConfig } from '@/config/subjectConfig';
import { getAssetPath } from '@/utils';

/* —— util —— */
const bnDigits = (n)=> n.toLocaleString('bn-BD');
const BN = ['ক','খ','গ','ঘ'];

/* —— PRNG —— */
const makeRng = (seed)=>{ let x=(seed>>>0)||123456789; return ()=> (x=(x*1664525+1013904223)>>>0)/4294967296; };
const shuffle = (a,rng)=>{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

/* —— Load pool from selected chapters (no storage) —— */
function usePool(subject, chapters, count, seed){
  const [pool,setPool] = useState([]);
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{
        setLoading(true);
        const raw = subjectConfig[subject]?.path || '';
        const base = ('/' + String(raw).replace(/^\/?/, '')).replace(/\\/g,'/');
        const mods = await Promise.all(
          Object.entries(import.meta.glob('/src/data/**/*.json'))
            .filter(([p])=> String(p).replace(/\\/g,'/').startsWith(base))
            .map(([p,loader])=> loader().then(m=>({path:p,data:m})))
        );
        const all=[];
        mods.forEach(({path,data})=>{
          const arr = data?.default?.questions || [];
          const baseDir = path.slice(0, path.lastIndexOf('/')+1);
          arr.forEach((q)=>{
            if(chapters?.length){
              const name = (q.chapter??'').toString();
              if(!chapters.includes(name)) return;
            }
            all.push({ ...q, __baseDir: baseDir });
          });
        });
        const rng = makeRng(seed);
        shuffle(all, rng);
        const take = all.slice(0, Math.min(count, all.length)).map((q,i)=>{
          const src=['A','B','C','D']; shuffle(src,rng);
          const mapped={ number: i+1, question:q.question, image:q.image, answer:'A' };
          src.forEach((L,idx)=>{ const P=['A','B','C','D'][idx]; mapped[`option${P}`]=q[`option${L}`]; mapped[`option${P}_img`]=q[`option${L}_img`]; if(String(q.answer).toUpperCase()===L) mapped.answer=P; });
          mapped.explanation = q.explanation || '';
          return mapped;
        });
        if(alive) setPool(take);
      } finally { if(alive) setLoading(false); }
    })();
    return ()=>{alive=false};
  },[subject, chapters, count, seed]);
  return { pool, loading };
}

export default function MockTest({ subject, chapters, count=50, minutes=0, seed=123, onExit, onNewTest }){
  const { pool, loading } = usePool(subject, chapters, count, seed);

  // exam state
  const [phase,setPhase] = useState('active'); // active | review
  const [current,setCurrent] = useState(1);
  const [answers,setAnswers] = useState({}); // number -> A|B|C|D

  // timer
  const total = minutes>0 ? minutes*60 : 0;
  const [left,setLeft] = useState(total);
  useEffect(()=> setLeft(total),[total]);
  useEffect(()=>{
    if(!total || phase!=='active') return; const t=setInterval(()=>{
      setLeft(s=>{ if(s<=1){ clearInterval(t); setPhase('review'); return 0; } return s-1; });
    },1000); return ()=> clearInterval(t);
  },[total,phase]);

  const summary = useMemo(()=>{
    let correct=0, wrong=0; pool.forEach(q=>{ const a=answers[q.number]; if(!a) return; if(a===q.answer) correct++; else wrong++; });
    const totalQ=pool.length; return { correct, wrong, total: totalQ, unattempted: totalQ - correct - wrong };
  },[pool,answers]);

  if(loading){
    return (
      <div className="cw-page">
        <header className="cw-header"><button className="back-button" onClick={onExit}><ArrowLeft size={16}/> সেটিংসে ফেরত</button><div className="cw-header-content"><h2 className="view-title">লোড হচ্ছে…</h2></div><div/></header>
        <div className="loading-skeleton" style={{height:120}} />
      </div>
    );
  }
  if(!pool.length){
    return (
      <div className="cw-page">
        <header className="cw-header"><button className="back-button" onClick={onExit}><ArrowLeft size={16}/> সেটিংসে ফেরত</button><div className="cw-header-content"><h2 className="view-title">কোনো প্রশ্ন পাওয়া যায়নি</h2></div><div/></header>
      </div>
    );
  }

  return (
    <div className="cw-page">
      {phase==='active' && (
        <>
          {/* header + progress */}
          <div className="exam-header" role="region" aria-label="পরীক্ষা অবস্থা">
            <div className="header-title">{subjectConfig[subject]?.displayName} — মক টেস্ট</div>
            <div className="header-progress">{bnDigits(Object.values(answers).filter(Boolean).length)}/{bnDigits(pool.length)}</div>
          </div>
          {/* sticky bar: timer + palette */}
          <div className="exam-sticky">
            {minutes>0 && <div className="timer-chip">⏱ {String(Math.floor(left/60)).padStart(2,'0')}:{String(left%60).padStart(2,'0')}</div>}
            <nav className="exam-palette">
              {pool.map((q)=> (
                <button key={q.number} type="button" className={`${answers[q.number]? 'is-answered':''} ${current===q.number? 'is-current':''}`} onClick={()=> setCurrent(q.number)} title={`প্রশ্ন ${q.number}`}>{bnDigits(q.number)}</button>
              ))}
            </nav>
          </div>

          {/* questions */}
          <section className="practice-list">
            {pool.map((q,idx)=> (
              <article key={q.number} id={`q-${q.number}`} className="mcq-card" style={{scrollMarginTop: '140px'}}>
                <div className="mcq-header">
                  <div className="mcq-question-number">{bnDigits(idx+1)}</div>
                  <div className="mcq-question-text">
                    <MathText text={q.question} />
                    {q.image && (
                      <div className="media-wrap"><img className="question-image" src={getAssetPath(q.image)} alt="Question illustration" loading="lazy" width="600" height="400" /></div>
                    )}
                  </div>
                </div>
                <div className="option-grid" role="radiogroup" aria-label="Options">
                  {['A','B','C','D'].map((L,i)=> (
                    <button key={L} type="button" className={`option-button ${answers[q.number]===L? 'selected':''}`} onClick={()=> setAnswers(p=> ({...p, [q.number]: L}))} aria-pressed={answers[q.number]===L}>
                      <span className="option-label">{BN[i]}</span>
                      <div className="option-text">
                        <MathText text={q[`option${L}`]} />
                        {q[`option${L}_img`] && (<div className="media-wrap"><img className="option-image" src={getAssetPath(q[`option${L}_img`])} alt={`Option ${L} illustration`} loading="lazy" width="600" height="400" /></div>)}
                      </div>
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <div className="center">
            <button className="cw-cta-button" onClick={()=> setPhase('review')}>জমা দিন</button>
          </div>
        </>
      )}

      {phase==='review' && (
        <div className="results-container">
          <h2 className="results-title">পরীক্ষার ফলাফল</h2>
          <div className="summary-stats">
            <div className="stat"><div className="stat-label">স্কোর</div><div className="stat-value">{bnDigits(summary.correct)}/{bnDigits(summary.total)}</div></div>
            <div className="stat"><div className="stat-label">সঠিক</div><div className="stat-value">{bnDigits(summary.correct)}</div></div>
            <div className="stat"><div className="stat-label">ভুল</div><div className="stat-value">{bnDigits(summary.wrong)}</div></div>
            <div className="stat"><div className="stat-label">অউত্তরিত</div><div className="stat-value">{bnDigits(summary.unattempted)}</div></div>
          </div>
          <div className="ch-toolbar">
            <button className="back-button" onClick={onExit}><ArrowLeft size={16}/> সেটিংসে ফেরত</button>
            <button className="cw-cta-button" onClick={onNewTest}>নতুন টেস্ট</button>
          </div>

          <div className="practice-list">
            {pool.map((q,idx)=>{
              const your = answers[q.number]; const ok = your===q.answer;
              return (
                <article key={q.number} className="mcq-card">
                  <div className="mcq-header">
                    <div className="mcq-question-number">{bnDigits(idx+1)}</div>
                    <div className="mcq-question-text">
                      <div className={`pill ${!your? 'pill-muted': (ok? 'pill-ok':'pill-err')}`}>{!your? 'উত্তর দেওয়া হয়নি': (ok? 'সঠিক':'ভুল')}</div>
                      <MathText text={q.question} />
                      {q.image && <img className="question-image mt-2" src={getAssetPath(q.image)} alt="Question illustration" loading="lazy" width="600" height="400" />}
                    </div>
                  </div>

                  <div className="option-grid">
                    {['A','B','C','D'].map((L,i)=>{
                      const isCorrect=L===q.answer; const chosen=L===your;
                      return (
                        <div key={L} className={`result-option-btn ${isCorrect? 'correct': (chosen&&!isCorrect? 'incorrect':'')}`}>
                          <div className="option-label-circle">{BN[i]}</div>
                          <div className="option-text">
                            <MathText text={q[`option${L}`]} />
                            {q[`option${L}_img`] && <img className="option-image mt-2" alt={`Option ${L} illustration`} src={getAssetPath(q[`option${L}_img`])} loading="lazy" width="600" height="400" />}
                            {chosen && !isCorrect && <span className="badge-your">আপনার উত্তর</span>}
                            {isCorrect && !ok && <span className="badge-correct">সঠিক উত্তর</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <details className="mcq-explanation" style={{marginTop:'.5rem'}}>
                      <summary className="explanation-header">ব্যাখ্যা</summary>
                      <div className="explanation-body"><MathText text={q.explanation} /></div>
                    </details>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}