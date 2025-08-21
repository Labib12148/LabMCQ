import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import DisplayQuestions from './DisplayQuestions';
import ExamView from './ExamView';
import ViewType from './ViewType';
import Seo from '@/components/Seo';
import './BoardQuestions.css';
import {
    subjectConfig,
    generateBoardList,
    parseUrlState,
    findSubjectFromBoardId
} from './classifications';
import { setImageBasePath } from '@/utils';

const modules = import.meta.glob('/src/data/**/*.json');

// --- Reusable Animation Variants ---
const pageVariants = {
    initial: { opacity: 0, x: 30 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -30 },
};
const pageTransition = { type: 'spring', stiffness: 200, damping: 25 };
const listContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const listItemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const BoardQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [selectedBoard, setSelectedBoard] = useState(null);

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [view, setView] = useState('subjects');
    const [subject, setSubject] = useState(null);
    const [boardId, setBoardId] = useState(null);
    const [mode, setMode] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const state = parseUrlState(pathname);
        setView(state.view || 'subjects');
        const decodedBoardId = state.boardId ? decodeURIComponent(state.boardId) : null;
        setBoardId(decodedBoardId);
        setMode(state.mode);

        if (state.subject) {
            setSubject(state.subject);
        } else if (state.view === 'questions' && decodedBoardId) {
            const foundSubjectKey = Object.keys(subjectConfig).find(key => {
                const kebabKey = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
                return decodedBoardId.toLowerCase().startsWith(kebabKey);
            });
            
            if (foundSubjectKey) {
                setSubject(foundSubjectKey);
            } else {
                const fallbackSubject = findSubjectFromBoardId(decodedBoardId, modules);
                setSubject(fallbackSubject);
            }
        } else {
            setSubject(null);
        }
    }, [pathname]);

    const currentBoardList = useMemo(() => {
        if (!subject) return {};
        return generateBoardList(subject, modules);
    }, [subject]);

    const currentBoard = useMemo(() => {
        if (!boardId || !currentBoardList || Object.keys(currentBoardList).length === 0) return null;
        const allBoards = Object.values(currentBoardList).flat();
        
        const normalizedBoardIdFromUrl = boardId.normalize();

        return allBoards.find(b => 
            b.boardId.normalize().toLowerCase() === normalizedBoardIdFromUrl.toLowerCase()
        ) || null;
    }, [boardId, currentBoardList]);

    useEffect(() => {
        if (view === 'questions' && currentBoard) {
            setIsLoading(true);
            setQuestions([]);
            modules[currentBoard.id]().then(data => {
                setQuestions(data.default?.questions || data.questions || []);
            }).catch(err => {
                console.error("❌ Load failed:", err);
                setQuestions([]);
            }).finally(() => setIsLoading(false));
        } else if (view !== 'questions') {
            setQuestions([]);
        }
    }, [view, currentBoard]);

    const handleSubjectSelect = (subjectKey) => navigate(`/${subjectKey}-boards`);
    const handleBoardSelect = (board) => setSelectedBoard(board);
    const handleModeSelect = (selectedMode) => {
        if (selectedBoard) {
            navigate(`/${selectedBoard.boardId}/${selectedMode}`);
            setSelectedBoard(null);
        }
    };
    const goBackToSubjects = () => navigate('/boards');
    const goBackToBoards = () => { if (subject) navigate(`/${subject}-boards`); };

    const filteredBoardGroups = useMemo(() => {
        if (!currentBoardList) return [];
        return Object.entries(currentBoardList)
            .map(([group, boards]) => ({
                group,
                boards: boards.filter(b =>
                    (!selectedFilter || group === selectedFilter) &&
                    (b.name.toLowerCase().includes(searchTerm.toLowerCase()) || (b.searchableName && b.searchableName.includes(searchTerm.toLowerCase())))
                )
            }))
            .filter(item => item.boards.length > 0);
    }, [currentBoardList, selectedFilter, searchTerm]);

    // --- RENDER FUNCTIONS ---
    const renderQuestionView = () => {
        if (!currentBoard || !subject) {
            return (
                <div className="center-message" role="alert" aria-live="polite">
                    <p className="text-xl text-gray-600 dark:text-gray-400">বোর্ড খুঁজে পাওয়া যায়নি</p>
                    <button type="button" onClick={goBackToSubjects} className="action-button">সকল বিষয় দেখুন</button>
                </div>
            );
        }

        const subjectFolder = subject.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        setImageBasePath(`data/${subjectFolder}-mcq/`);

        return (
            <div className="p-4 md:p-6 h-full flex flex-col">
                <button type="button" onClick={goBackToBoards} className="back-button">
                    <ArrowLeft size={18} className="mr-2" />
                    <span className="capitalize">{subjectConfig?.[subject]?.displayName}</span>
                    &nbsp;বোর্ডের তালিকা
                </button>
                {isLoading ? (
                    <div className="center-message"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>
                ) : questions.length === 0 ? (
                    <div className="center-message">
                        <p className="text-lg text-gray-500 dark:text-gray-400">এই বোর্ডের জন্য কোনো প্রশ্ন পাওয়া যায়নি।</p>
                        <button type="button" onClick={goBackToBoards} className="action-button">বোর্ডের তালিকায় ফিরে যান</button>
                    </div>
                ) : mode === 'exam' ? (
                    <ExamView questions={questions} boardName={currentBoard.name} onTryAgain={goBackToBoards} />
                ) : (
                    <DisplayQuestions questions={questions} boardName={currentBoard.name} mode={mode} />
                )}
            </div>
        );
    };

    const renderBoardView = () => (
        <div className="p-4 md:p-6 h-full flex flex-col">
            <button type="button" onClick={goBackToSubjects} className="back-button" aria-label="সকল বিষয় দেখুন">
                <ArrowLeft size={18} className="mr-2" /> সকল বিষয়
            </button>
            <h2 className="board-list-header">{subjectConfig?.[subject]?.displayName}</h2>
            <p className="board-list-subheader">অনুশীলনের জন্য বোর্ড বাছাই করুন।</p>
            <div className="filter-controls">
                <div className="search-input-wrapper">
                    <input type="text" placeholder="বোর্ড বা সাল দিয়ে খুঁজুন..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="search-input" aria-label="বোর্ড বা সাল দিয়ে খুঁজুন"/>
                    <Search className="search-input-icon" size={20} />
                </div>
                <select value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)} className="filter-select" aria-label="বোর্ড ফিল্টার করুন">
                    <option value="">সকল বোর্ড / স্কুল</option>
                    {Object.keys(currentBoardList).map(group => (
                        <option key={group} value={group}>{group}</option>
                    ))}
                </select>
            </div>
            {filteredBoardGroups.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">কোনো বোর্ড খুঁজে পাওয়া যায়নি।</div>
            ) : (
                <Motion.div variants={listContainerVariants} initial="hidden" animate="visible">
                    {filteredBoardGroups.map(({ group, boards }) => (
                        <div key={group} className="mb-8">
                            <h3 className="board-group-title">{group}</h3>
                            <Motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto" variants={listContainerVariants}>
                                {boards.map(board => (
                                    <Motion.button type="button" key={board.id} onClick={() => handleBoardSelect(board)} className="board-button w-full" variants={listItemVariants}>
                                        {board.name}
                                    </Motion.button>
                                ))}
                            </Motion.div>
                        </div>
                    ))}
                </Motion.div>
            )}
        </div>
    );

    const renderSubjectView = () => (
        <div className="w-full min-h-screen flex flex-col items-center p-4 md:p-6 pt-24">
            <div className="w-full max-w-6xl">
                <Motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="hero-section">
                    <h1 className="hero-title">বিষয় বাছাই করুন</h1>
                    <p className="hero-subtitle">অনুশীলন অথবা পরীক্ষার জন্য একটি বিষয় বাছাই করুন।</p>
                </Motion.div>
                
                <Motion.div 
                    className="subject-grid" 
                    variants={listContainerVariants} 
                    initial="hidden" 
                    animate="visible"
                >
                    {Object.entries(subjectConfig).map(([key, { icon, displayName }]) => (
                        <Motion.button
                            type="button"
                            key={key}
                            onClick={() => handleSubjectSelect(key)}
                            className="subject-card"
                            variants={listItemVariants}
                            whileTap={{ scale: 0.95 }}
                        >
                            {icon}
                            <span className="text-xl sm:text-2xl font-bold mt-4">{displayName}</span>
                        </Motion.button>
                    ))}
                </Motion.div>
            </div>
        </div>
    );

    const isIndexable = pathname === '/boards';

    return (
        <>
            <Seo
                title="বোর্ড প্রশ্ন"
                description="বিগত বছরের বোর্ড পরীক্ষার MCQ প্রশ্ন অনুশীলন করুন।"
                canonical="https://labmcq.example.com/boards"
                noIndex={!isIndexable}
                noAds={!isIndexable}
            />
            <h1>বোর্ড প্রশ্ন</h1>
            <section className="seo-intro">
                <p>
                    বোর্ড প্রশ্ন অংশে আমরা বিগত বছরের SSC পরীক্ষার বহুনির্বাচনী প্রশ্নগুলো যত্নসহকারে সংগ্রহ করেছি যাতে শিক্ষার্থীরা প্রকৃত পরীক্ষার ধাঁচ সম্পর্কে স্পষ্ট ধারণা পেতে পারে। বিভিন্ন শিক্ষা বোর্ডের প্রশ্ন একত্রে পাওয়ায় ছাত্রছাত্রীরা তুলনামূলক বিশ্লেষণ করতে সক্ষম হয় এবং জটিল বিষয়গুলো সহজে বুঝে নিতে পারে। প্রশ্নগুলোর সঙ্গে সঠিক উত্তর এবং প্রয়োজনে সংক্ষিপ্ত ব্যাখ্যা সংযুক্ত করা হয়েছে, যাতে ভুল উত্তর দিলেও শিক্ষার্থীরা কারণ বুঝতে পারে। পরীক্ষার পূর্বে যত বেশি প্রশ্ন অনুশীলন করা যায়, বোর্ড পরীক্ষায় ভালো ফলাফল তত বেশি নিশ্চিত হয়।
                </p>
                <p>
                    এই পৃষ্ঠায় বিষয়ভিত্তিক এবং বছরভিত্তিক ফিল্টার ব্যবহার করে কাঙ্ক্ষিত প্রশ্ন সহজেই খুঁজে নেওয়া যায়। ব্যবহারকারী চাইলে নির্দিষ্ট বোর্ডের প্রশ্ন আলাদা করে দেখতে পারে, আবার সব বোর্ডের প্রশ্নও একসাথে দেখে অনুশীলন করতে পারে। তাছাড়া দ্রুত অনুসন্ধানের জন্য সার্চ ফিচার রাখা হয়েছে যাতে প্রশ্নের মধ্যে নির্দিষ্ট শব্দ বা বিষয় খুঁজে পাওয়া যায়। প্রতিটি প্রশ্নের পাশে থাকা ট্যাগ এবং অধ্যায়ের নাম শিক্ষার্থীদের বিশদ ধারণা দেয় যে কোন অংশ থেকে প্রশ্ন এসেছে। এইসব সুবিধা বোর্ড প্রশ্ন অনুশীলনকে সুশৃঙ্খল এবং আকর্ষণীয় করে তোলে।
                </p>
                <p>
                    SSC পরীক্ষার প্রস্তুতিতে আত্মবিশ্বাস অর্জনের অন্যতম উপায় হচ্ছে আগের বছরের প্রশ্ন বারবার সমাধান করা। বোর্ড প্রশ্ন সেকশনের মাধ্যমে একজন শিক্ষার্থী নিজের দুর্বলতা বুঝতে পারে এবং দ্রুত সমাধান খুঁজে পায়। দৈনিক অনুশীলনের মাধ্যমে সময় নিয়ন্ত্রণের দক্ষতাও উন্নত হয়, কারণ অনেকে নির্দিষ্ট সময়ের মধ্যে কত প্রশ্ন সমাধান করতে পারছে তা এখানে নোট করতে পারে। ধারাবাহিক অনুশীলন পরীক্ষার চাপ কমিয়ে দেয় এবং মূল পরীক্ষার সময় মানসিক শান্তি বজায় রাখতে সাহায্য করে। এই পৃষ্ঠা ব্যবহার করে যারা নিয়মিত প্রস্তুতি নেবে তারা বোর্ড পরীক্ষায় অবশ্যই উন্নত ফলাফল অর্জন করতে পারবে।
                </p>
                <p>
                    এই সেকশনের লক্ষ্য শিক্ষার্থীদের স্বনিয়ন্ত্রিত অনুশীলনে উৎসাহিত করা এবং বোর্ড পরীক্ষার প্রকৃত ধাঁচ সম্পর্কে স্পষ্ট ধারণা দেওয়া। বারবার প্রশ্ন সমাধান করলে স্মৃতিশক্তি বৃদ্ধি পায় এবং কঠিন বিষয়গুলোও সহজ মনে হয়। আমরা নিয়মিত নতুন প্রশ্ন যুক্ত করছি যাতে প্রতিটি ভিজিটে নতুন কিছু শেখা যায়। শৃঙ্খলাবদ্ধভাবে অনুশীলন করলে SSC পরীক্ষায় অংশ নেওয়া আর ভীতিকর থাকে না, বরং একটি সার্থক অভিজ্ঞতা হয়ে ওঠে।
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
            <AnimatePresence>
                {selectedBoard && (
                    <ViewType
                        board={selectedBoard}
                        onSelectMode={handleModeSelect}
                        onClose={() => setSelectedBoard(null)}
                        autoFocus
                    />
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <Motion.main
                    key={view}
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                    transition={pageTransition}
                    className="h-full"
                >
                    {view === 'questions' && renderQuestionView()}
                    {view === 'boards' && subject && renderBoardView()}
                    {view === 'subjects' && renderSubjectView()}
                </Motion.main>
            </AnimatePresence>
        </>
    );
};

export default BoardQuestions;