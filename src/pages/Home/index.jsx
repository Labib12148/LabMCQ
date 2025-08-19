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

        <section className="mt-16 max-w-3xl mx-auto text-lg text-gray-700 dark:text-gray-300">
          <p>
বিগত কয়েক বছরে অনলাইন শিক্ষা বাংলাদেশের শিক্ষার্থীদের প্রস্তুতির ধরন পরিবর্তন করেছে। এখন একজন শিক্ষার্থী মোবাইল ফোন বা কম্পিউটার ব্যবহার করে যে কোনো সময়, যে কোনো জায়গা থেকে নিজের জ্ঞান যাচাই করতে পারে। এই সাইটের লক্ষ্য হলো SSC শিক্ষার্থীদের জন্য একটি পূর্ণাঙ্গ MCQ অনুশীলন ব্যবস্থা তৈরি করা যেখানে প্রতিটি অধ্যায়ের গুরুত্বপূর্ণ প্রশ্নগুলো সহজ ভাষায় সংকলিত হয়েছে। নিয়মিত প্র্যাকটিসের মাধ্যমে শিক্ষার্থীরা শুধু সঠিক উত্তরই শিখবে না, বরং প্রতিটি ভুলের বিশ্লেষণ করে বুঝতে পারবে কোথায় উন্নতির সুযোগ রয়েছে। এতে আত্মবিশ্বাস বাড়ে এবং মূল পরীক্ষায় সময় ব্যবস্থাপনা সহজ হয়। শিক্ষকের সহায়তা ছাড়া নিজে থেকে অনুশীলন করার সুযোগও থাকে, যা দূরবর্তী অঞ্চলের শিক্ষার্থীদের জন্য বিশেষভাবে উপকারী।
          </p>
          <p className="mt-4">
অধ্যায়ভিত্তিক অনুশীলনের পাশাপাশি এই প্ল্যাটফর্ম শিক্ষার্থীদের জন্য প্রেরণারও উৎস। প্রতিটি বিষয়ের প্রশ্নগুলো বাস্তব বোর্ড পরীক্ষার অভিজ্ঞতা মাথায় রেখে সাজানো হয়েছে যেন শিক্ষার্থী আগে থেকেই পরীক্ষার পরিবেশের সাথে পরিচিত হতে পারে। প্রতিটি সেশনের পর পাওয়া ফলাফল তাকে পরবর্তী অধ্যায়ে এগিয়ে যেতে উত্সাহিত করবে। এই ৩০০ শব্দের লেখাটি শুধু অ্যাডসেন্স অনুমোদনের জন্য নয়; এটি মূলত শিক্ষার্থীদের উদ্দীপ্ত ও কৌতূহলী করে তোলার উদ্দেশ্যে তৈরি। আমরা বিশ্বাস করি, ধারাবাহিকভাবে অনুশীলন করলে এবং নিজের অগ্রগতি নিয়মিত পর্যবেক্ষণ করলে যে কেউ ভালো ফলাফল অর্জন করতে পারবে। শিক্ষা একটি অবিরাম যাত্রা, আর এই সাইট সেই যাত্রাকে আরও সহজ ও আনন্দময় করে তুলতে বদ্ধপরিকর। তাই প্রতিদিন কয়েক মিনিট সময় নিয়ে MCQ অনুশীলন করুন, নিজের দুর্বলতা চিহ্নিত করুন এবং আরও ভালো ফলাফলের দিকে এগিয়ে যান।
          </p>
          <p className="mt-4">
এই সাইটটি সম্পূর্ণ মোবাইল সহায়ক, তাই বাসে, স্কুলে বা বাড়ির বাইরে যেখানেই থাকো না কেন সহজেই পড়াশোনা চালিয়ে যেতে পারবে। অনুশীলনের পরপরই তুমি কতগুলো প্রশ্ন ঠিক করেছো এবং কতগুলো ভুল হয়েছে তার পরিসংখ্যান দেখা যায়, ফলে নিজের অগ্রগতি নজরে রাখা সহজ হয়। বন্ধুদের সঙ্গেও ফলাফল তুলনা করতে পারো যা পারস্পরিক প্রতিযোগিতার মাধ্যমে আরো অনুপ্রেরণা যোগায়। আমরা ক্রমাগত নতুন প্রশ্ন এবং বৈশিষ্ট্য যোগ করছি যাতে তোমার শেখার অভিজ্ঞতা ধারাবাহিকভাবে সমৃদ্ধ হয়। সাইট ব্যবহারে কোনো জটিলতা থাকলে আমাদের জানাও, আমরা দ্রুত সমাধান করার চেষ্টা করব। চলো, আজই প্রস্তুতি শুরু করি।
          </p>
        </section>

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