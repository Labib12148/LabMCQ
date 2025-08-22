// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, Clock, Zap, Star, ListChecks } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
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