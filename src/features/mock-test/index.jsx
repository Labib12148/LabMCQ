import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckSquare, Square, PlayCircle } from 'lucide-react';
import { subjectConfig } from '../../components/ChapterClassifications';
import MockTest from './MockTest';
import Seo from '@/components/Seo';
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

  const title = useMemo(()=> subject? `${subjectConfig[subject]?.displayName} — মক টেস্ট` : 'মক টেস্ট', [subject]);

  const toggle = (name)=> setSelected(prev=>{ const n=new Set(prev); if(n.has(name)) n.delete(name); else n.add(name); return n; });
  const selectAll = ()=> setSelected(new Set(chapters.map(c=>c.name)));
  const clearAll = ()=> setSelected(new Set());

  return (
    <div className="cw-container">
      <Seo
        title="মক টেস্ট"
        description="সময় ধরে মক টেস্ট দিয়ে নিজের প্রস্তুতি মূল্যায়ন করুন।"
        canonical="https://labmcq.example.com/mock-test"
      />
      <h1>মক টেস্ট</h1>
      <section className="seo-intro">
        <p>
          মক টেস্ট সেকশনটি মূল পরীক্ষার পরিবেশ তৈরি করার উদ্দেশ্যে নির্মিত। এখানে শিক্ষার্থীরা নির্দিষ্ট সময়ের মধ্যে প্রশ্ন সমাধান করে নিজের দক্ষতা যাচাই করতে পারে। পরীক্ষার মতো চাপ অনুভব করার মাধ্যমে টাইম ম্যানেজমেন্ট শেখা হয় এবং আত্মবিশ্বাস বেড়ে যায়। বিষয় এবং অধ্যায় নির্বাচন করার সুযোগ থাকায় ব্যবহারকারী নিজের পছন্দ অনুযায়ী পরীক্ষার সেট তৈরি করতে পারে। প্রতিটি টেস্ট শেষে তাৎক্ষণিক ফলাফল পাওয়া যায়, যা থেকে ভুল অধ্যায় শনাক্ত করা সহজ হয়।
        </p>
        <p>
          মক টেস্ট শুরু করার আগে ব্যবহারকারীকে প্রশ্ন সংখ্যা, সময় এবং অধ্যায়ের তালিকা নির্ধারণ করতে হয়। নির্বাচিত তথ্যের উপর ভিত্তি করে সিস্টেম স্বয়ংক্রিয়ভাবে একটি সেট প্রস্তুত করে, যেখানে বোর্ড এবং অধ্যায়ভিত্তিক ডেটাবেস থেকে প্রশ্ন নেওয়া হয়। পরীক্ষার সময় উত্তর দেওয়া শেষে পরবর্তী প্রশ্নে যাওয়ার ব্যবস্থা সহজভাবে রাখা হয়েছে যাতে কোন বিভ্রান্তি না হয়। টেস্ট শেষ হলে সঠিক উত্তরগুলো দেখানো হয় এবং প্রয়োজনে ব্যাখ্যাও পড়া যায়। এভাবে একটি টেস্ট শেষ করলেই ছাত্রছাত্রী নিজের অগ্রগতি সম্পর্কে স্পষ্ট ধারণা লাভ করে।
        </p>
        <p>
          SSC পরীক্ষায় সর্বোচ্চ সফলতা পেতে হলে শুধু পড়াশোনা করাই যথেষ্ট নয়, বরং নির্দিষ্ট সময়ে সমস্যার সমাধান করার দক্ষতা তৈরি করা জরুরি। মক টেস্ট অংশটি সেই দক্ষতা বিকাশে বড় ভূমিকা রাখে। নিয়মিত মক টেস্ট দিলে পরীক্ষার ভীতি কমে যায় এবং বাস্তব পরীক্ষার প্রশ্নপত্র সহজ মনে হয়। প্রতিটি টেস্টের পর ফলাফল বিশ্লেষণ করে শিক্ষার্থী পরবর্তী পরিকল্পনা সাজাতে পারে এবং দুর্বল অংশগুলো আরও ভালোভাবে অনুশীলন করতে পারে। চূড়ান্ত প্রস্তুতির দিনগুলোতে এই অংশটি সার্বিক উন্নতির জন্য একটি নির্ভরযোগ্য সহায়ক হিসেবে কাজ করবে।
        </p>
        <p>
          এই মক টেস্ট ব্যবস্থার মাধ্যমে শিক্ষার্থীরা প্রতিটি পরীক্ষার পরে নিজের ভুল বিশ্লেষণ করতে পারে এবং পরবর্তী পরীক্ষা আরও উন্নতভাবে দেওয়ার পরিকল্পনা করতে পারে। অনুশীলনের ধারাবাহিকতা বজায় রাখলে অধ্যায়ভিত্তিক ও বোর্ড প্রশ্ন থেকে শেখা বিষয় বাস্তব পরীক্ষায় দ্রুত প্রয়োগ করা যায়। ধারাবাহিক পর্যালোচনার ফলে আত্মবিশ্বাস বাড়ে এবং সময়ের মূল্য বুঝে নেওয়া সম্ভব হয়। এই পদ্ধতিতে অভ্যাস গড়ে তুললে মূল পরীক্ষার দিন মানসিক চাপ অনেক কমে যায় এবং প্রশ্নগুলোর উত্তর দ্রুত নির্ভুলভাবে দেওয়া সম্ভব হয়, যা শেষ পর্যন্ত কাঙ্ক্ষিত গ্রেড অর্জনে সহায়ক ভূমিকা রাখে।
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
      {/* SUBJECT PICK */}
      {step==='pick' && (
        <main className="cw-page">
          <header className="cw-header">
            <div/>
            <div className="cw-header-content">
              <h2 className="view-title">মক টেস্ট</h2>
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
  );
}