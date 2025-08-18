// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, Clock, Zap, Star, ListChecks } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { Seo, AdSlot } from '@/components';
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
        title="LabMCQ – এসএসসি MCQ প্রস্তুতি প্ল্যাটফর্ম"
        description="এসএসসি পরীক্ষার জন্য বোর্ড প্রশ্ন, অধ্যায়ভিত্তিক অনুশীলন ও মক টেস্টের বাংলা প্ল্যাটফর্ম।"
        canonical="https://labmcq.com/"
      />
      <AdSlot />
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

        {/* SEO Text Block */}
        <section className="mt-12 max-w-3xl mx-auto text-lg text-gray-700 dark:text-gray-300 space-y-4">
          <p>
            বাংলাদেশের এসএসসি পরীক্ষার্থীদের জন্য মানসম্মত এমসিকিউ অনুশীলনের উপযুক্ত পরিবেশ প্রায়ই খুঁজে পাওয়া কঠিন। অনেক সময় বই বা কোচিং নোটে থাকা প্রশ্নগুলো এক জায়গায় সুশৃঙ্খলভাবে সাজানো থাকে না, ফলে শিক্ষার্থীরা কার্যকর প্রস্তুতি নেওয়ার সুযোগ হারায়। LabMCQ তৈরির মূল উদ্দেশ্যই হল scattered প্রশ্নগুলোকে একটি আধুনিক ও ব্যবহারবান্ধব প্ল্যাটফর্মে নিয়ে আসা, যাতে যে কোনো শিক্ষার্থী নিজের গতিতে অনুশীলন করতে পারে। এখানে প্রতিটি প্রশ্নের সঙ্গে সংক্ষিপ্ত ব্যাখ্যা থাকে, যা দ্রুত বোঝার পাশাপাশি পুনরাবৃত্তি সহজ করে।
          </p>
          <p>
            তুমি যদি বোর্ড প্রশ্ন ঘেঁটে প্রস্তুতি নিতে চাও, তবে বোর্ড সেকশনে প্রবেশ করে সাম্প্রতিক বছরের প্রশ্নগুলো একত্রে দেখতে পারবে। আবার নির্দিষ্ট কোনো অধ্যায় দুর্বল হলে অধ্যায়ভিত্তিক অংশে গিয়ে সেই অধ্যায়ের প্রশ্নগুলো বারবার অনুশীলন করা যায়। প্রতিটি পাতায় আমরা চেষ্টা করেছি যে ভাষা ও ভিজ্যুয়াল উপস্থাপন সহজ হয়, যাতে সময় কম থাকলেও তুমি দ্রুত প্রয়োজনীয় তথ্য পেয়ে যাও। আমাদের টুলগুলো মোবাইল ও কম্পিউটার উভয় ডিভাইসে সমানভাবে ব্যবহার উপযোগী করে তৈরি করা হয়েছে।
          </p>
          <p>
            শুধু প্রশ্নের সংগ্রহ নয়, আমরা নিয়মিত নতুন কন্টেন্ট যোগ করছি যাতে পাঠ্যসূচির কোনো পরিবর্তন হলে তা দ্রুত আপডেট করা যায়। ভবিষ্যতে এখানে আরও মডেল টেস্ট, রিভিশন নোট ও অগ্রগতি ট্র্যাক করার সুবিধা যোগ হবে। তোমার মতামত ও প্রশ্ন সবসময় স্বাগত; তুমি যদি কোনো ভুল বা উন্নতির সুযোগ দেখতে পাও, আমাদের জানিও। এই প্ল্যাটফর্মের মাধ্যমে আমরা আশা করি প্রত্যেক শিক্ষার্থী আত্মবিশ্বাসের সাথে বোর্ড পরীক্ষার জন্য প্রস্তুতি নিতে পারবে এবং শিক্ষার প্রতি আগ্রহ আরও বাড়বে।
          </p>
        </section>

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
