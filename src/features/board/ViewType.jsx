import React, { useEffect, useRef } from 'react';
import { BookOpen, Edit, Eye } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import './ViewType.css';

// Animation variants for the overlay
const modalOverlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
};

// Animation variants for the modal content panel
const modalContentVariants = {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 250, damping: 30 } },
    exit: { y: "100%", opacity: 0, transition: { ease: 'easeIn', duration: 0.2 } },
};

const ViewType = ({ board, onSelectMode, onClose, autoFocus }) => {
    const firstBtnRef = useRef();
    const modalRef = useRef();

    // Focus trap and keyboard support
    useEffect(() => {
        if (autoFocus && firstBtnRef.current) {
            firstBtnRef.current.focus();
        }
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose, autoFocus]);

    return (
        <Motion.div
            className="modal-overlay"
            onClick={onClose}
            variants={modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="বোর্ড মোড নির্বাচন"
        >
            <Motion.div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                ref={modalRef}
                variants={modalContentVariants}
                // The variants are inherited, so we don't need initial/animate/exit here again
            >
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                    {board.name}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    <button ref={firstBtnRef} onClick={() => onSelectMode('practice')} className="option-button" aria-label="অনুশীলন করুন">
                        <BookOpen size={24} className="mr-3" />
                        <span>অনুশীলন করুন</span>
                    </button>
                    <button onClick={() => onSelectMode('exam')} className="option-button" aria-label="পরীক্ষা দিন">
                        <Edit size={24} className="mr-3" />
                        <span>পরীক্ষা দিন</span>
                    </button>
                    <button onClick={() => onSelectMode('view')} className="option-button" aria-label="প্রশ্ন দেখুন">
                        <Eye size={24} className="mr-3" />
                        <span>প্রশ্ন দেখুন</span>
                    </button>
                </div>
                <button onClick={onClose} className="close-button" aria-label="বন্ধ করুন">
                    বন্ধ করুন
                </button>
            </Motion.div>
        </Motion.div>
    );
};

export default ViewType;
