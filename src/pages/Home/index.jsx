// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, Clock, Zap, Star, ListChecks } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import Seo from '@/components/Seo';
import AdSlot from '@/components/AdSlot';
import './Home.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const HighlightStat = ({ icon, text }) => (
  <div className="flex items-center gap-2 bg-indigo-50 dark:bg-gray-800 px-4 py-1.5 rounded-full font-semibold shadow text-indigo-600 dark:text-indigo-300 text-base mb-2 animate-pulse">
    {icon}
    <span>{text}</span>
  </div>
);

const ActionCard = ({ icon, title, description, link }) => (
  <Motion.div variants={itemVariants} className="h-full">
    <Link to={link} className="action-card">
      <div className="action-card-icon">{icon}</div>
      <div>
        <h3 className="action-card-title">{title}</h3>
        <p className="action-card-description">{description}</p>
      </div>
      <div className="action-card-link">
        <span>শুরু করুন</span> &rarr;
      </div>
    </Link>
  </Motion.div>
);

const HomePage = () => {
  return (
    <main className="home-container min-h-screen py-20 px-6 md:px-12">
      <Seo
        title="LabMCQ – SSC MCQ প্রস্তুতির জন্য তোমার সহায়ক"
        description="SSC পরীক্ষার জন্য বোর্ড প্রশ্ন, অধ্যায়ভিত্তিক অনুশীলন এবং মক টেস্ট।"
        canonical="https://labmcq.example.com/"
      />
      <h1>LabMCQ — SSC MCQ Practice</h1>
      <section className="seo-intro">
        <p>
          LabMCQ শিক্ষার্থীদের জন্য একটি নির্ভরযোগ্য অনলাইন প্ল্যাটফর্ম, যেখানে SSC পরীক্ষার প্রস্তুতি আরম্ভ করতে আগ্রহী সবাই সহজেই সম্পূর্ণ সহায়তা পায়। এই হোম পৃষ্ঠাটি থেকে আমরা পরীক্ষার জন্য প্রয়োজনীয় সবকিছু একত্রে উপস্থাপন করার চেষ্টা করেছি। প্রতিদিনের অনুশীলন থেকে শুরু করে চূড়ান্ত পুনরাবৃত্তি পর্যন্ত প্রতিটি স্তরের জন্য পর্যাপ্ত উপকরণ রাখা হয়েছে। শিক্ষার্থীরা নিজেদের স্তর অনুযায়ী বোর্ড প্রশ্ন খুঁজে পেতে পারে এবং একই সঙ্গে অধ্যায়ভিত্তিক অনুশীলনের মাধ্যমে দুর্বল অংশগুলো আলাদা করে কাজ করতে পারে। নিয়মিত ব্যবহারে এই প্ল্যাটফর্ম শিক্ষার্থীদের মধ্যে আত্মবিশ্বাস বাড়াতে এবং সময় ব্যবস্থাপনা শিখতে সহায়ক ভূমিকা পালন করে।
        </p>
        <p>
          হোম পৃষ্ঠা থেকে একজন শিক্ষার্থী সরাসরি তিনটি প্রধান অধ্যায়ে প্রবেশ করতে পারে। বোর্ড প্রশ্ন অংশে পূর্ববর্তী পরীক্ষাগুলোর নির্বাচিত MCQ খুঁজে পাওয়া যায়, যা বোর্ডের প্রকৃত প্রশ্নপত্রের সঠিক ধারণা দেয়। অধ্যায়ভিত্তিক অনুশীলন অংশে প্রত্যেক বিষয়ের আলাদা আলাদা অধ্যায় সাজানো রয়েছে, যাতে প্রতিটি ধারণা ধীরে ধীরে গড়ে ওঠে। মক টেস্ট অংশে নির্দিষ্ট সময়ের পরীক্ষার পরিবেশে নিজের দক্ষতা যাচাই করা যায় এবং অবিলম্বে ফলাফল দেখা যায়। এইসব সুবিধা একটি কেন্দ্রীয় হোম পৃষ্ঠায় একত্রিত করায় ব্যবহারকারীরা খুব সহজে পরিকল্পনা তৈরি করে দিনের অনুশীলন শুরু করতে পারেন।
        </p>
        <p>
          SSC পরীক্ষায় সফল হতে হলে কেবল বই পড়লেই হয় না, নিয়মিত MCQ অনুশীলন করে জ্ঞান যাচাই করা অত্যন্ত জরুরি। এই প্ল্যাটফর্মের হোম পৃষ্ঠায় আমরা শিক্ষার্থীদের জন্য উৎসাহব্যঞ্জক বার্তা, সহজ নেভিগেশন এবং প্রাসঙ্গিক তথ্য তুলে ধরেছি যাতে সবাই অনায়াসে সব সুবিধা খুঁজে পায়। প্রতিটি সেকশনে দেওয়া নির্দেশনা অনুসরণ করে শিক্ষার্থী নিজের লক্ষ্য নির্ধারণ করতে পারবে এবং নিরন্তর চর্চার মাধ্যমে সেই লক্ষ্য অর্জন করতে পারবে। সময়মতো পরিকল্পনা বদলানো এবং দুর্বলতা শনাক্ত করার সুযোগ থাকায় LabMCQ এর ব্যবহার শিক্ষার্থীদের জন্য একটি সক্রিয় শেখার অভিজ্ঞতা তৈরি করে।
        </p>
        <p>
          বিষয়ভিত্তিক পড়াশোনার পাশাপাশি এই প্ল্যাটফর্ম শিক্ষার্থীদের স্বনিয়ন্ত্রিত অনুশীলনের অভ্যাস গড়ে তোলে। প্রতিদিন নির্দিষ্ট সময় বরাদ্দ করে এখানে প্রবেশ করলে ধারাবাহিকতার সাথে অধ্যায়গুলো অগ্রসর করা যায়। সহপাঠীদের সাথে আলোচনা করার সুযোগ না থাকলেও প্রতিটি প্রশ্নের ব্যাখ্যা পড়ে শেখা সম্ভব হয় এবং নিজের ভুল নিজেই সংশোধন করা যায়। আমরা বিশ্বাস করি, নিয়মিত চর্চা এবং সঠিক দিকনির্দেশনার মাধ্যমে যে কোনো শিক্ষার্থী নিজের স্বপ্নের ফলাফল অর্জন করতে সক্ষম হবে।
        </p>
      </section>
      <nav className="seo-links">
        <a href="/chapter-wise">অধ্যায়ভিত্তিক</a>
        <a href="/boards">বোর্ড প্রশ্ন</a>
        <a href="/mock-test">মক টেস্ট</a>
      </nav>
      <noscript>
        <a href="/chapter-wise">অধ্যায়ভিত্তিক</a>
        <a href="/boards">বোর্ড প্রশ্ন</a>
        <a href="/mock-test">মক টেস্ট</a>
      </noscript>
      <div className="relative z-10">
        {/* Hero Section */}
        <Motion.section
          className="max-w-4xl mx-auto text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Motion.h1 variants={itemVariants} className="hero-title">
            <span className="gradient-text font-extrabold">SSC MCQ</span> প্রস্তুতির জন্য
            <span className="block gradient-text">তোমার সেরা সহায়ক</span>
          </Motion.h1>
          <Motion.p variants={itemVariants} className="hero-subtitle mt-2 text-xl">
            শুধুমাত্র নবম-দশম শ্রেণির শিক্ষার্থীদের জন্য বোর্ড প্রশ্ন, অধ্যায়ভিত্তিক প্রস্তুতি এবং দ্রুত রিভিশন—সব কিছু একসাথে।
          </Motion.p>
        </Motion.section>

        {/* Floating Highlights */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <HighlightStat icon={<Shield size={18} />} text="৩,০০০+ বোর্ড প্রশ্ন" />
          <HighlightStat icon={<BookOpen size={18} />} text="অধ্যায়ভিত্তিক MCQ" />
          <HighlightStat icon={<Star size={18} />} text="সহজ ভাষায় ব্যাখ্যা" />
        </div>

        {/* Features Grid */}
        <Motion.section
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <ActionCard
            icon={<Shield size={40} className="text-blue-400" />}
            title="বোর্ড প্রশ্ন"
            description="SSC-তে আসা বিগত বছরের বোর্ড প্রশ্ন দিয়ে নিজের প্রস্তুতি পরীক্ষা করো।"
            link="/boards"
          />
          <ActionCard
            icon={<BookOpen size={40} className="text-purple-400" />}
            title="অধ্যায়ভিত্তিক অনুশীলন"
            description="প্রতিটি অধ্যায় আলাদাভাবে চর্চা করো—যে অধ্যায় দুর্বল, সেটাই বেশি বার চর্চা করো।"
            link="/chapter-wise"
          />
          {/* New: Mock Test */}
          <ActionCard
            icon={<ListChecks size={40} className="text-emerald-400" />}
            title="মক টেস্ট"
            description="বোর্ডের মতো সময় ধরে মক টেস্ট দিয়ে পূর্ণাঙ্গ মূল্যায়ন করো—বিষয়, প্রশ্ন সংখ্যা ও টাইমার বেছে নাও।"
            link="/mock-test"
          />
        </Motion.section>

        {/* Why Use Section */}
        <Motion.section
          className="info-section mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="info-section-title text-2xl mb-3">কেন এই সাইট ব্যবহার করবে?</h2>
          <ul className="text-left max-w-xl mx-auto list-inside list-disc text-lg text-gray-700 dark:text-gray-300 grid gap-2">
            <li>সব বোর্ড ও অধ্যায়ভিত্তিক প্রশ্ন এক প্ল্যাটফর্মে</li>
            <li>সহজ ভাষায় ব্যাখ্যা—সব MCQ-র জন্য</li>
            <li>একদম বোর্ড পরীক্ষার মতো পরিবেশ</li>
            <li>অভ্যাসের জন্য মডেল টেস্ট ও দ্রুত অনুশীলন</li>
          </ul>
        </Motion.section>


        <AdSlot slotId="home-1" className="mt-8" height={250} />

        {/* One-click Start / CTA */}
        <Motion.section
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/boards" className="cta-button text-xl px-10 py-4">
            <Zap size={24} className="inline-block mr-2" />
            <span>বোর্ড প্রশ্নে যাও</span>
          </Link>
        </Motion.section>
      </div>
    </main>
  );
};

export default HomePage;