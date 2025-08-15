// src/BoardQuestions/ExamView.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Clock, CheckCircle, XCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import '@/styles/styles.css';
import ResultMCQItem from './ResultMCQItem';
import { MathText, CountdownTimer } from '@/components';
import { getAssetPath } from '@/utils';

// --- Animation Variants ---
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const shakeVariant = { shake: { x: [0, -8, 8, -8, 8, 0], transition: { duration: 0.4 } } };

// --- Custom Confirmation Modal Component ---
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <Motion.div className="modal-content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <HelpCircle size={48} className="text-indigo-400 mx-auto mb-4" />
                <h3 className="modal-title">আপনি কি নিশ্চিত?</h3>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="modal-button cancel">ফিরে যান</button>
                    <button onClick={onConfirm} className="modal-button confirm">জমা দিন</button>
                </div>
            </Motion.div>
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
            <Motion.div className="exam-start-container" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
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
            </Motion.div>
        </div>
    );
};

// --- Active Exam Screen Component ---
const ActiveExam = ({ boardName, questions, time, answers, handleAnswer, submitExam }) => {
    const answeredCount = Object.keys(answers).length;
    const formatTime = (t) => `${String(Math.floor(t / 60)).padStart(2, '0').toLocaleString('bn-BD')}:${String(t % 60).padStart(2, '0').toLocaleString('bn-BD')}`;
    return (
        <div>
            <div className="exam-header">
                <div className="font-bold">{boardName}</div>
                <div>{answeredCount.toLocaleString('bn-BD')}/{questions.length.toLocaleString('bn-BD')}</div>
                <div className="flex items-center gap-1"><Clock size={18} /><span>{formatTime(time)}</span></div>
                <button type="button" onClick={submitExam} className="submit-exam-button">জমা দিন</button>
            </div>
            <div className="exam-palette">
                {questions.map(q => (
                    <button key={q.number} type="button" className={answers[q.number] ? 'is-answered' : 'is-unattempted'}>
                        {q.number.toLocaleString('bn-BD')}
                    </button>
                ))}
            </div>
            <Motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                {questions.map((mcq, idx) => (
                    <Motion.div key={mcq.number} className="exam-question" variants={itemVariants}>
                        <div className="question-container">
                            <div className="mcq-number-circle">{(idx + 1).toLocaleString('bn-BD')}</div>
                            <div className="question-text">
                                <MathText text={mcq.question} />
                                {mcq.image && <img src={getAssetPath(mcq.image)} alt="Question" className="question-image mt-2" />}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {['A', 'B', 'C', 'D'].map((opt, optionIdx) => (
                                <Motion.button key={opt} type="button" onClick={() => handleAnswer(mcq.number, opt)} className={`exam-option-btn ${answers[mcq.number] === opt ? 'selected' : ''}`} variants={shakeVariant} animate={answers[mcq.number] === opt && answers[mcq.number] !== mcq.answer ? "shake" : ""} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                    <div className="option-label-circle">{['ক', 'খ', 'গ', 'ঘ'][optionIdx]}</div>
                                    <div className="option-text">
                                        <MathText text={mcq[`option${opt}`]} />
                                        {mcq[`option${opt}_img`] && <img src={getAssetPath(mcq[`option${opt}_img`])} alt={`Option ${opt}`} className="option-image mt-2" />}
                                    </div>
                                </Motion.button>
                            ))}
                        </div>
                    </Motion.div>
                ))}
            </Motion.div>
        </div>
    );
};

// --- Exam Results Screen Component ---
const ExamResults = ({ questions, answers, timeTaken, onTryAgain }) => {
    const correctAnswers = questions.filter(q => answers[q.number] === q.answer).length;
    const incorrectAnswers = questions.filter(q => answers[q.number] && answers[q.number] !== q.answer).length;
    const unattempted = questions.length - correctAnswers - incorrectAnswers;
    const sortedQuestions = [...questions].sort((a, b) => a.number - b.number);
    const resultsRef = useRef(null);
    const [filter, setFilter] = useState('all');

    const formatTime = (t) => `${String(Math.floor(t / 60)).padStart(2, '0').toLocaleString('bn-BD')}:${String(t % 60).padStart(2, '0').toLocaleString('bn-BD')}`;
    const filtered = sortedQuestions.filter(q => {
        const isCorrect = answers[q.number] === q.answer;
        if (filter === 'correct') return isCorrect;
        if (filter === 'wrong') return answers[q.number] && !isCorrect;
        return true;
    });

    useEffect(() => {
        resultsRef.current?.scrollIntoView();
    }, []);

    return (
        <Motion.div ref={resultsRef} className="results-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-center mb-4">পরীক্ষার ফলাফল</h2>
            <div className="exam-summary">
                <div>স্কোর: {correctAnswers.toLocaleString('bn-BD')}/{questions.length.toLocaleString('bn-BD')}</div>
                <div>সঠিক: {correctAnswers.toLocaleString('bn-BD')}</div>
                <div>ভুল: {incorrectAnswers.toLocaleString('bn-BD')}</div>
                <div>অউত্তরিত: {unattempted.toLocaleString('bn-BD')}</div>
                <div>সময়: {formatTime(timeTaken)}</div>
            </div>
            <div className="exam-controls">
                <button type="button" onClick={() => setFilter('all')} className={filter === 'all' ? 'selected' : ''}>সব</button>
                <button type="button" onClick={() => setFilter('wrong')} className={filter === 'wrong' ? 'selected' : ''}>ভুল</button>
                <button type="button" onClick={() => setFilter('correct')} className={filter === 'correct' ? 'selected' : ''}>সঠিক</button>
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
                    {filtered.map((q, idx) => (
                        <ResultMCQItem key={q.number} question={q} userAnswer={answers[q.number]} index={idx + 1}/>
                    ))}
                </div>
            </div>
        </Motion.div>
    );
};

// --- Main ExamView Component ---
const ExamView = ({ questions, boardName, onTryAgain }) => {
    const [examState, setExamState] = useState('notStarted');
    const [answers, setAnswers] = useState({});
    const [initialTime, setInitialTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const storageKey = `board-exam-${boardName}`;

    // Timer
    const handleTimerFinish = useCallback(() => setExamState('finished'), []);
    const time = CountdownTimer(initialTime, handleTimerFinish);

    const proceedToSubmit = useCallback(() => {
        setIsModalOpen(false);
        setTimeTaken(totalTime - time);
        setInitialTime(0);
        setExamState('finished');
        localStorage.removeItem(storageKey);
    }, [time, totalTime, storageKey]);

    useEffect(() => {
        if (examState === 'finished' && time === 0) {
            proceedToSubmit();
        }
    }, [examState, time, proceedToSubmit]);

    // Autosave
    useEffect(() => {
        if (examState === 'active') {
            localStorage.setItem(storageKey, JSON.stringify({ answers, time, totalTime }));
        }
    }, [answers, time, totalTime, examState, storageKey]);

    // Resume prompt
    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved && examState === 'notStarted') {
            const data = JSON.parse(saved);
            if (window.confirm('সংরক্ষিত পরীক্ষা পুনরায় শুরু করবেন?')) {
                setAnswers(data.answers || {});
                setInitialTime(data.time || 0);
                setTotalTime(data.totalTime || 0);
                setExamState('active');
            } else {
                localStorage.removeItem(storageKey);
            }
        }
    }, [examState, storageKey]);

    const startExam = useCallback((totalSeconds) => {
        setInitialTime(totalSeconds);
        setTotalTime(totalSeconds);
        setAnswers({});
        localStorage.removeItem(storageKey);
        setExamState('active');
    }, [storageKey]);

    const handleAnswer = (questionNumber, answer) => {
        if (examState !== 'active') return;
        setAnswers(prev => ({ ...prev, [questionNumber]: answer }));
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
                <Motion.div key={examState} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {examState === 'notStarted' && <ExamStartScreen boardName={boardName} onStartExam={startExam} />}
                    {examState === 'active' && <ActiveExam boardName={boardName} questions={questions} time={time} answers={answers} handleAnswer={handleAnswer} submitExam={submitExam} />}
                    {examState === 'finished' && <ExamResults questions={questions} answers={answers} timeTaken={timeTaken} onTryAgain={resetExam} />}
                </Motion.div>
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