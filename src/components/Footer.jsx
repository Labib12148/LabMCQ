import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <nav className="flex justify-center gap-6 mb-2">
        <Link to="/" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Home</Link>
        <Link to="/chapter-wise" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Chapters</Link>
        <Link to="/about" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">About</Link>
        <Link to="/contact" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Contact</Link>
        <Link to="/privacy" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Privacy</Link>
      </nav>
      <p>&copy; {new Date().getFullYear()} LabMCQ</p>
    </footer>
  );
}
