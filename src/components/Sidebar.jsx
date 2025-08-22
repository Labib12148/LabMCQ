import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Shield, BookOpen, ListChecks, X, Info } from 'lucide-react';
import './Layout.css'; // Import the final unified CSS

const SidebarLink = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
    end
  >
    {icon}
    <span className="ml-3">{text}</span>
  </NavLink>
);

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Overlay for mobile view */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden ${
          isSidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`sidebar transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="sidebar-header">
          <h1 className="sidebar-title">LabMCQ</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden navbar-button"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <SidebarLink to="/" icon={<Home size={20} />} text="ড্যাশবোর্ড" />
          <SidebarLink to="/boards" icon={<Shield size={20} />} text="বোর্ড প্রশ্ন" />
          <SidebarLink to="/chapter-wise" icon={<BookOpen size={20} />} text="অধ্যায়ভিত্তিক অনুশীলন" />
          {/* New: Mock Test */}
          <SidebarLink to="/mock-test" icon={<ListChecks size={20} />} text="মক টেস্ট" />
          <SidebarLink to="/about" icon={<Info size={20} />} text="About" />
          {/* TODO: Add Revision Notes section when content is ready */}
        </nav>

        <div className="sidebar-footer">
          <Link to="/privacy-policy" className="text-xs text-gray-500 dark:text-gray-400 hover:underline">
            Privacy Policy
          </Link>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} LabMCQ. All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;