// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar, Sidebar, ScrollTop, Footer } from '@/components';
import HomePage from '@/pages/Home';
import BoardQuestions from '@/features/board';
import ChapterWise from '@/features/chapter';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import ContactSuccess from '@/pages/ContactSuccess';
import Privacy from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';

import '@/index.css';

const AppLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="relative flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 fixed top-[64px] left-0 right-0 h-[calc(100vh-64px)]">
        <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:pl-64">
          <main id="main" className="mb-8">
            <Outlet />
          </main>
          <Footer />
        </div>
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

          {/* --- Static Pages --- */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/success" element={<ContactSuccess />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* --- Placeholder Routes --- */}
          <Route path="/mock-tests" element={<div className="p-8 text-center text-2xl text-gray-700 dark:text-gray-200">Mock Tests Page (Coming Soon!)</div>} />
          <Route path="/revision-notes" element={<div className="p-8 text-center text-2xl text-gray-700 dark:text-gray-200">Revision Notes Page (Coming Soon!)</div>} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;