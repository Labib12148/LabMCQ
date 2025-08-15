import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';

export default function ContactSuccess() {
  return (
    <div className="prose dark:prose-invert max-w-xl mx-auto text-center">
      <Seo title="ধন্যবাদ" description="ধন্যবাদ বার্তা" />
      <h1>ধন্যবাদ!</h1>
      <p>আপনার বার্তা আমরা পেয়েছি। শীঘ্রই যোগাযোগ করব।</p>
      <Link to="/" className="text-indigo-600">হোমে ফিরে যান</Link>
    </div>
  );
}
