// src/BoardQuestions/ResultMCQItem.jsx
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MathText from '../components/MathText';
import { getAssetPath } from '../components/AssetFinder';

const ResultMCQItem = ({ question, userAnswer, index }) => {
    const [showExplanation, setShowExplanation] = useState(false);

    const getOptionClass = (optionLetter) => {
        const isCorrect = optionLetter === question.answer;
        const isUserChoice = optionLetter === userAnswer;

        if (isCorrect) return 'correct';
        if (isUserChoice && !isCorrect) return 'incorrect';
        return 'default';
    };

    return (
        <motion.div
            className="result-item-card"
            role="group"
            aria-label={`Result for question ${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="question-container">
                <div className="mcq-number-circle">{index.toLocaleString('bn-BD')}</div>
                <div className="question-text">
                    <MathText text={question.question} />
                    {question.image && <img src={getAssetPath(question.image)} alt="Question" className="question-image mt-2" />}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm" role="listbox">
                {['A', 'B', 'C', 'D'].map((opt, idx) => (
                    <div key={opt} className={`result-option-btn ${getOptionClass(opt)}`} role="option" aria-selected={userAnswer === opt}>
                        <div className="option-label-circle">{['ক', 'খ', 'গ', 'ঘ'][idx]}</div>
                        <div className="option-text">
                            <MathText text={question[`option${opt}`]} />
                            {question[`option${opt}_img`] && <img src={getAssetPath(question[`option${opt}_img`])} alt={`Option ${opt}`} className="option-image mt-2" />}
                        </div>
                    </div>
                ))}
            </div>

            {question.explanation && (
                <div className="mt-2">
                    <button onClick={() => setShowExplanation(!showExplanation)} className="explanation-toggle" aria-expanded={showExplanation}>
                        <span>ব্যাখ্যা দেখুন</span>
                        {showExplanation ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <AnimatePresence>
                        {showExplanation && (
                            <motion.div
                                className="explanation-content"
                                style={{ transformOrigin: 'top' }} // Crucial for correct animation direction
                                // FIX: Using scaleY for a smooth, performant animation
                                initial={{ scaleY: 0, opacity: 0 }}
                                animate={{ scaleY: 1, opacity: 1 }}
                                exit={{ scaleY: 0, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                            >
                                <div className="explanation-body">
                                    <HelpCircle size={18} className="mr-2 mt-0.5 flex-shrink-0 text-sky-500"/>
                                    <div className="flex-1">
                                        <span className="font-semibold mr-1">ব্যাখ্যা:</span>
                                        <MathText text={question.explanation} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default ResultMCQItem;