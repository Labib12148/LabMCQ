import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';

export default function NotFound() {
  return (
    <div className="prose dark:prose-invert max-w-xl mx-auto text-center">
      <Seo title="পেজ পাওয়া যায়নি" description="Page not found" />
      <h1>পেজ পাওয়া যায়নি</h1>
      <p>দুঃখিত, আপনি যে পেজটি খুঁজছেন তা নেই।</p>
      <div className="flex justify-center gap-4">
        <Link to="/" className="text-indigo-600">হোমে যান</Link>
        <Link to="/chapter-wise" className="text-indigo-600">অধ্যায়ভিত্তিক</Link>
      </div>
      <p className="text-sm mt-4"><em>English:</em> The page you requested could not be found.</p>
    </div>
  );
}
