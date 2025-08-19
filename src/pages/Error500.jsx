import React from 'react';
import Seo from '@/components/Seo';

const Error500 = () => (
  <div className="p-8 text-center text-2xl text-gray-700 dark:text-gray-200">
    <Seo
      title="সার্ভার ত্রুটি"
      description="সার্ভারে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।"
      canonical="https://labmcq.example.com/500"
      noIndex
      noAds
    />
    <h1>সার্ভার ত্রুটি</h1>
  </div>
);

export default Error500;
