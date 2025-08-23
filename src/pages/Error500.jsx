import React from 'react';
import { Link } from 'react-router-dom';

const Error500 = () => (
  <main className="p-8 text-center text-gray-700 dark:text-gray-200">
    <h1 className="text-4xl font-bold mb-4">500: সার্ভার ত্রুটি</h1>
    <h2 className="text-2xl mb-4">কিছু একটা ভুল হয়েছে</h2>
    <p className="mb-6">
      এই সমস্যা আমাদের দিকে। দয়া করে পরে আবার চেষ্টা করুন অথবা নিচের লিংক দিয়ে হোম পেজে ফিরে যান।
    </p>
    <Link to="/" className="text-indigo-600 hover:underline">
      হোম পেজে ফিরে যান
    </Link>
  </main>
);

export default Error500;
