import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';

import { SubjectSelection, ChapterSelection, pageVariants, pageTransition } from './components/ChapterSelection';
import ChapterQuestions from './components/ChapterQuestions';

const ChapterWise = () => {
  const { subject, chapters: chapterParams, mode } = useParams();

  let currentView = 'subjects';
  if (subject && chapterParams && mode) currentView = 'questions';
  else if (subject) currentView = 'chapters';

  return (
    <div className="cw-container">
      <AnimatePresence mode="wait">
        {currentView === 'subjects' && <SubjectSelection key="subjects" />}
        {currentView === 'chapters' && <ChapterSelection key="chapters" subject={subject} />}
        {currentView === 'questions' && (
          <Motion.div
            key="questions"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <QuestionSession subject={subject} chapterParams={chapterParams} routeMode={mode} />
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const QuestionSession = ({ subject, chapterParams, routeMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedChapters, count } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const chapters = (chapterParams || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    const parsedCount = Number(params.get('count'));
    return {
      selectedChapters: chapters,
      count: Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 25,
    };
  }, [chapterParams, location.search]);

  return (
    <ChapterQuestions
      subject={subject}
      selectedChapters={selectedChapters}
      mode={routeMode}
      count={count}
      onBack={() => navigate(`/chapter-wise/${subject}`)}
    />
  );
};

export default ChapterWise;
