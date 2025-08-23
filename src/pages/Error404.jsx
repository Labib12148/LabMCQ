import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => (
  <main className="p-8 text-center text-gray-700 dark:text-gray-200">
    <h1 className="text-4xl font-bold mb-4">404: পেজ খুঁজে পাওয়া যায়নি</h1>
    <h2 className="text-2xl mb-4">আপনি যে পেজটি খুঁজছেন তা নেই</h2>
    <p className="mb-6">
      লিংকটি হয় ভেঙে গেছে অথবা পেজটি সরিয়ে ফেলা হয়েছে। নিচের লিংকটি ব্যবহার করে মূল পেজে ফিরে যান।
    </p>
    <Link to="/" className="text-indigo-600 hover:underline">
      হোম পেজে ফিরে যান
    </Link>
  </main>
);

export default Error404;
