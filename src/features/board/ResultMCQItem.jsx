import React, { useState } from "react";
import { MathText } from "@/components";
import { getAssetPath } from "@/utils";

const bn = (n)=> n.toLocaleString("bn-BD");
const map = { A:"ক", B:"খ", C:"গ", D:"ঘ" };

export default function ResultMCQItem({ question, userAnswer, index }){
  const [open,setOpen] = useState(false);
  const answered = !!userAnswer; const correct = answered && userAnswer===question.answer;
  const pill = !answered ? 'উত্তর দেওয়া হয়নি' : (correct ? 'সঠিক' : 'ভুল');

  const optionClass = (L)=>{ const isCorrect=L===question.answer; const chosen=L===userAnswer; if(isCorrect) return 'correct'; if(chosen && !isCorrect) return 'incorrect'; return 'default'; };

  return (
    <div className="result-item-card">
      <div className="question-container">
        <div className="mcq-number-circle">{bn(index)}</div>
        <div className="question-text">
          <div className={`pill ${!answered? 'pill-muted': (correct? 'pill-ok':'pill-err')}`}>{pill}</div>
          {!correct && answered && (
            <div className="result-meta">আপনার উত্তর: <strong>{map[userAnswer]}</strong> • সঠিক: <strong>{map[question.answer]}</strong></div>
          )}
          <MathText text={question.question} />
          {question.image && <img className="question-image mt-2" src={getAssetPath(question.image)} alt="Question" loading="lazy" />}
        </div>
      </div>

      <div className="result-options" role="listbox">
        {["A","B","C","D"].map((L, idx)=> (
          <div key={L} className={`result-option-btn ${optionClass(L)}`} role="option" aria-selected={userAnswer===L}>
            <div className="option-label-circle">{["ক","খ","গ","ঘ"][idx]}</div>
            <div className="option-text">
              <MathText text={question[`option${L}`]} />
              {question[`option${L}_img`] && <img className="option-image mt-2" alt={`Option ${L}`} src={getAssetPath(question[`option${L}_img`])} loading="lazy" />}
              {userAnswer===L && !correct && <span className="badge-your">আপনার উত্তর</span>}
              {L===question.answer && !correct && <span className="badge-correct">সঠিক উত্তর</span>}
            </div>
          </div>
        ))}
      </div>

      {question.explanation && (
        <div className="explanation-wrap">
          <button className="explanation-toggle" onClick={()=> setOpen(o=>!o)} aria-expanded={open}>
            {open? 'ব্যাখ্যা লুকান ↑' : 'ব্যাখ্যা দেখুন ↓'}
          </button>
          {open && (
            <div className="explanation-content">
              <div className="explanation-body">
                <div className="label">ব্যাখ্যা:</div>
                <div className="flex-1"><MathText text={question.explanation} /></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}