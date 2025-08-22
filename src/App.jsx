// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar, Sidebar, ScrollTop } from '@/components';
import HomePage from '@/pages/Home';
import BoardQuestions from '@/features/board';
import ChapterWise from '@/features/chapter';
import Error404 from '@/pages/Error404';
import Error500 from '@/pages/Error500';
import MockTestIndex from '@/features/mock-test';

const AppLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="relative flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 fixed top-[64px] left-0 right-0 h-[calc(100vh-64px)]">
        <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:pl-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />

          {/* --- BoardQuestions Routes --- */}
          <Route path="/boards" element={<BoardQuestions />} />
          <Route path="/:subject-boards" element={<BoardQuestions />} />
          <Route path="/:boardId/:mode" element={<BoardQuestions />} />

          {/* --- ChapterWise Routes (UPDATED) --- */}
          <Route path="/chapter-wise" element={<ChapterWise />} />
          <Route path="/chapter-wise/:subject" element={<ChapterWise />} />
          <Route path="/chapter-wise/:subject/:chapters/:mode" element={<ChapterWise />} />

          {/* --- Mock Test Routes --- */}
          <Route path="/mock-test" element={<MockTestIndex />} />
          {/** If you later want deep-linking like /mock-test/:subject, you can map it to the same component: */}
          {/** <Route path="/mock-test/:subject" element={<MockTestIndex />} /> */}

          <Route path="/500" element={<Error500 />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
