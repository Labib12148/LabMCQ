import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckSquare, Square, PlayCircle } from 'lucide-react';
import { subjectConfig } from '../../components/ChapterClassifications';
import { Seo } from '@/components';
import MockTest from './MockTest';
import './Mock.css';

/* Load chapters for a subject */
function useChapters(subject){
  const [data,setData] = useState([]);
  useEffect(()=>{
    let alive=true;
    (async()=>{
      if(!subject){ setData([]); return; }
      const raw = subjectConfig[subject]?.path || '';
      const base = ('/' + String(raw).replace(/^\/?/, '')).replace(/\\/g,'/');
      const mods = await Promise.all(
        Object.entries(import.meta.glob('/src/data/**/*.json'))
          .filter(([p])=> String(p).replace(/\\/g,'/').startsWith(base))
          .map(([p,loader])=> loader().then(m=>({path:p,data:m})))
      );
      const map = new Map();
      mods.forEach(({data})=>{
        const arr = data?.default?.questions || [];
        arr.forEach(q=>{ const ch=(q.chapter??'').toString(); map.set(ch,(map.get(ch)||0)+1); });
      });
      const list = Array.from(map, ([name,count])=>({name,count}))
        .sort((a,b)=>{ const na=+a.name, nb=+b.name; if(!isNaN(na)&&!isNaN(nb)) return na-nb; return a.name.localeCompare(b.name,'bn'); });
      if(alive) setData(list);
    })();
    return ()=>{alive=false};
  },[subject]);
  return data;
}

export default function MockIndex(){
  const [step,setStep] = useState('pick'); // pick -> setup -> run
  const [subject,setSubject] = useState(null);
  const [selected,setSelected] = useState(new Set());
  const [count,setCount] = useState(25); // default 25
  const [minutes] = useState(0); // timer optional (kept off)
  const [seed,setSeed] = useState(()=>Math.floor(Math.random()*1e9));

  const chapters = useChapters(subject);
  const _totalAvailable = useMemo(()=> chapters.reduce((s,c)=>s+c.count,0), [chapters]);
  const _selectedCount = useMemo(()=> chapters.filter(c=> selected.has(c.name)).reduce((s,c)=>s+c.count,0), [chapters,selected]);

  const title = useMemo(()=> subject? `${subjectConfig[subject]?.displayName} — মক টেস্ট` : 'মক টেস্ট', [subject]);

  const toggle = (name)=> setSelected(prev=>{ const n=new Set(prev); if(n.has(name)) n.delete(name); else n.add(name); return n; });
  const selectAll = ()=> setSelected(new Set(chapters.map(c=>c.name)));
  const clearAll = ()=> setSelected(new Set());

  return (
    <>
    <Seo title="মক টেস্ট – LabMCQ" description="মক টেস্টের জন্য অনুশীলন" canonical="https://labmcq.com/mock-test" noindex />
    <div className="cw-container">
      {/* SUBJECT PICK */}
      {step==='pick' && (
        <main className="cw-page">
          <header className="cw-header">
            <div/>
            <div className="cw-header-content">
              <h1 className="view-title">মক টেস্ট</h1>
              <p className="view-subtitle">বিষয় নির্বাচন করুন</p>
            </div>
            <div/>
          </header>
          <div className="subject-grid">
            {Object.entries(subjectConfig).map(([key,{icon,displayName}])=> (
              <button key={key} className="subject-card" onClick={()=>{ setSubject(key); setStep('setup'); }}>
                <div className="subject-icon">{icon}</div>
                <span className="subject-name">{displayName}</span>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* SETUP */}
      {step==='setup' && subject && (
        <section className="cw-page">
          <header className="cw-header">
            <button className="back-button" onClick={()=>{ setSubject(null); setSelected(new Set()); setStep('pick'); }}>
              <ArrowLeft size={16}/> <span>সকল বিষয়</span>
            </button>
            <div className="cw-header-content">
              <h2 className="view-title">{title}</h2>
              <p className="view-subtitle">অধ্যায় বাছাই করুন ও প্রশ্ন সংখ্যা দিন</p>
            </div>
            <div/>
          </header>

          <div className="setup-topbar">
            <div className="setup-group">
              <button className="cw-btn-secondary" onClick={selectAll}><CheckSquare size={16}/> সবগুলো বাছাই</button>
              <button className="cw-btn-secondary" onClick={clearAll}><Square size={16}/> বাতিল</button>
            </div>
            <div className="setup-group">
              <div className="count-field">
                <label htmlFor="mtCount">প্রশ্ন সংখ্যা</label>
                <input id="mtCount" className="count-input" type="number" min={1} max={200} value={count}
                  onChange={(e)=> setCount(Math.max(1, Math.min(200, Number(e.target.value)||1)))} />
              </div>
            </div>
          </div>

          <div className="ch-grid">
            {chapters.map(ch=> (
              <label key={ch.name} className="ch-card">
                <input type="checkbox" checked={selected.has(ch.name)} onChange={()=> toggle(ch.name)} />
                <span className="ch-name">অধ্যায় {ch.name}</span>
                {/* per‑chapter count removed as requested */}
              </label>
            ))}
          </div>

          <div className="bottom-bar">
            <button className="bottom-cta" onClick={()=> setStep('run')}>
              <PlayCircle size={18}/> টেস্ট শুরু করুন
            </button>
          </div>
        </section>
      )}

      {/* EXAM */}
      {step==='run' && subject && (
        <MockTest
          key={`${subject}:${Array.from(selected).sort().join(',')}:${count}:${minutes}:${seed}`}
          subject={subject}
          chapters={[...selected]}
          count={count}
          minutes={minutes}
          seed={seed}
          onExit={()=> setStep('setup')}
          onNewTest={()=>{ setSeed(Math.floor(Math.random()*1e9)); setStep('setup'); }}
        />
      )}
    </div>
    </>
  );
}