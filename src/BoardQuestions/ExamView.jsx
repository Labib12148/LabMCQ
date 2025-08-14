// src/BoardQuestions/ExamView.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Clock, CheckCircle, XCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/styles.css';
import ResultMCQItem from './ResultMCQItem';
import MathText from '../components/MathText';
import { getAssetPath } from '../components/AssetFinder';
import CountdownTimer from '../components/CountdownTimer';

// --- Animation Variants ---
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const shakeVariant = { shake: { x: [0, -8, 8, -8, 8, 0], transition: { duration: 0.4 } } };

// --- Custom Confirmation Modal Component ---
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <motion.div className="modal-content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <HelpCircle size={48} className="text-indigo-400 mx-auto mb-4" />
                <h3 className="modal-title">আপনি কি নিশ্চিত?</h3>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="modal-button cancel">ফিরে যান</button>
                    <button onClick={onConfirm} className="modal-button confirm">জমা দিন</button>
                </div>
            </motion.div>
        </div>
    );
};

// --- Exam Start Screen Component ---
const ExamStartScreen = ({ boardName, onStartExam }) => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const handleStart = () => {
        const totalSeconds = minutes * 60 + seconds;
        if (totalSeconds <= 0) {
            alert('অনুগ্রহ করে ০ এর চেয়ে বড় একটি বৈধ সময় নির্ধারণ করুন।');
            return;
        }
        onStartExam(totalSeconds);
    };
    return (
        <div className="flex items-center justify-center h-full p-4">
            <motion.div className="exam-start-container" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-bold mb-4">{boardName} - পরীক্ষা</h2>
                <div className="my-6 space-y-4">
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">মোট সময়</label>
                    <div className="exam-time-inputs">
                        <input type="number" value={minutes} min="0" onChange={(e) => setMinutes(Number(e.target.value))} className="time-input" placeholder="মিনিট"/>
                        <span className="time-separator">:</span>
                        <input type="number" value={seconds} min="0" max="59" onChange={(e) => setSeconds(Number(e.target.value))} className="time-input" placeholder="সেকেন্ড"/>
                    </div>
                </div>
                <button type="button" onClick={handleStart} className="start-exam-button mt-6">পরীক্ষা শুরু করুন</button>
            </motion.div>
        </div>
    );
};

// --- Active Exam Screen Component ---
const ActiveExam = ({ questions, time, totalTime, answers, handleAnswer, submitExam }) => {
  return (
    <div>
      <div className="timer-bar">
        <div className="flex items-center gap-2">
          <Clock size={20} />
          <span>সময় বাকি: {String(Math.floor(time / 60)).padStart(2, '0').toLocaleString('bn-BD')}:{String(time % 60).padStart(2, '0').toLocaleString('bn-BD')}</span>
        </div>
        <div className="h-2 w-1/2 bg-gray-300 dark:bg-gray-700 rounded overflow-hidden">
          <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(time / totalTime) * 100}%` }}/>
        </div>
      </div>
      <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
        {questions.map((mcq, idx) => (
          <motion.div key={mcq.number} className="exam-question" variants={itemVariants}>
            <div className="question-container">
              <div className="mcq-number-circle">{(idx + 1).toLocaleString('bn-BD')}</div>
              <div className="question-text">
                <MathText text={mcq.question} />
                {mcq.image && <img src={getAssetPath(mcq.image)} alt="Question" className="question-image mt-2" />}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['A', 'B', 'C', 'D'].map((opt, optionIdx) => (
                <motion.button key={opt} type="button" onClick={() => handleAnswer(mcq.number, opt)} className={`exam-option-btn ${answers[mcq.number] === opt ? 'selected' : ''}`} variants={shakeVariant} animate={answers[mcq.number] === opt && answers[mcq.number] !== mcq.answer ? "shake" : ""} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <div className="option-label-circle">{['ক', 'খ', 'গ', 'ঘ'][optionIdx]}</div>
                  <div className="option-text">
                    <MathText text={mcq[`option${opt}`]} />
                    {mcq[`option${opt}_img`] && <img src={getAssetPath(mcq[`option${opt}_img`])} alt={`Option ${opt}`} className="option-image mt-2" />}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <div className="flex justify-center mt-8 mb-14">
        <button type="button" onClick={submitExam} className="submit-exam-button">পরীক্ষা জমা দিন</button>
      </div>
    </div>
  );
};

// --- Exam Results Screen Component ---
const ExamResults = ({ questions, answers, onTryAgain }) => {
    const correctAnswers = questions.filter(q => answers[q.number] === q.answer).length;
    const incorrectAnswers = questions.length - correctAnswers;
    const sortedQuestions = [...questions].sort((a, b) => a.number - b.number);
    const resultsRef = useRef(null);

    useEffect(() => {
        resultsRef.current?.scrollIntoView();
    }, []);

    return (
        <motion.div ref={resultsRef} className="results-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-center mb-4">পরীক্ষার ফলাফল</h2>
            <div className="flex justify-around mb-6">
                <div className="text-center">
                    <CheckCircle className="text-green-500 dark:text-green-400 mx-auto mb-2" size={40} />
                    <p className="font-bold text-xl">{correctAnswers.toLocaleString('bn-BD')}</p>
                    <p>সঠিক</p>
                </div>
                <div className="text-center">
                    <XCircle className="text-red-500 dark:text-red-400 mx-auto mb-2" size={40} />
                    <p className="font-bold text-xl">{incorrectAnswers.toLocaleString('bn-BD')}</p>
                    <p>ভুল</p>
                </div>
            </div>
            <div className="text-center my-6">
                <button type="button" onClick={onTryAgain} className="try-again-button">
                    <RefreshCw size={18} className="mr-2" />
                    অন্য বোর্ড চেষ্টা করুন
                </button>
            </div>
            <div className="border-t dark:border-gray-700 pt-6">
                <h3 className="text-xl font-bold text-center mb-4">বিস্তারিত ফলাফল</h3>
                <div className="space-y-4">
                    {sortedQuestions.map((q, idx) => (
                        <ResultMCQItem key={q.number} question={q} userAnswer={answers[q.number]} index={idx + 1}/>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// --- Main ExamView Component ---
const ExamView = ({ questions, boardName, onTryAgain }) => {
    const [examState, setExamState] = useState('notStarted');
    const [answers, setAnswers] = useState({});
    const [initialTime, setInitialTime] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTimerFinish = useCallback(() => setExamState('finished'), []);
    
    // FIX: Calling the timer as a hook (use...)
    const time = CountdownTimer(initialTime, handleTimerFinish);

    const startExam = useCallback((totalSeconds) => {
        setInitialTime(totalSeconds);
        setAnswers({});
        setExamState('active');
    }, []);

    const handleAnswer = (questionNumber, answer) => {
        if (examState !== 'active') return;
        setAnswers(prev => ({ ...prev, [questionNumber]: answer }));
    };

    const proceedToSubmit = () => {
        setIsModalOpen(false);
        setInitialTime(0);
        setExamState('finished');
    };

    const submitExam = () => {
        const unansweredCount = questions.filter(q => !answers[q.number]).length;
        if (unansweredCount > 0) {
            setIsModalOpen(true);
        } else {
            proceedToSubmit();
        }
    };
    
    const resetExam = () => {
        setExamState('notStarted');
        setAnswers({});
        setInitialTime(0);
        onTryAgain();
    };

    const unansweredCount = questions.filter(q => !answers[q.number]).length;
    const confirmationMessage = `আপনার এখনো ${unansweredCount.toLocaleString('bn-BD')} টি প্রশ্নের উত্তর বাকি আছে। আপনি কি জমা দিতে চান?`;

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div key={examState} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {examState === 'notStarted' && <ExamStartScreen boardName={boardName} onStartExam={startExam} />}
                    {examState === 'active' && <ActiveExam questions={questions} time={time} totalTime={initialTime} answers={answers} handleAnswer={handleAnswer} submitExam={submitExam} />}
                    {examState === 'finished' && <ExamResults questions={questions} answers={answers} onTryAgain={resetExam} />}
                </motion.div>
            </AnimatePresence>
            <AnimatePresence>
                {isModalOpen && (
                    <ConfirmationModal message={confirmationMessage} onConfirm={proceedToSubmit} onCancel={() => setIsModalOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
};

export default ExamView;