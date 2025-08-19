import React from 'react';
import Seo from '@/components/Seo';

const Error404 = () => (
  <div className="p-8 text-center text-2xl text-gray-700 dark:text-gray-200">
    <Seo
      title="পৃষ্ঠা পাওয়া যায়নি"
      description="আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি।"
      canonical="https://labmcq.example.com/404"
      noIndex
      noAds
    />
    <h1>পৃষ্ঠা খুঁজে পাওয়া যায়নি</h1>
  </div>
);

export default Error404;
