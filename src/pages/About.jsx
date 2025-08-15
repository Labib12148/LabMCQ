import React from 'react';
import Seo from '@/components/Seo';

export default function About() {
  return (
    <div className="prose dark:prose-invert max-w-3xl mx-auto">
      <Seo title="About | LabMCQ" description="LabMCQ সম্পর্কে জানুন" />
      <h1>আমাদের সম্পর্কে</h1>
      <p>
        LabMCQ একটি স্বেচ্ছাসেবী উদ্যোগ যা এসএসসি শিক্ষার্থীদের জন্য আধুনিক উপায়ে বহুনির্বাচনী প্রশ্ন অনুশীলনের সুযোগ দেয়।
        বিষয়ভিত্তিক ও অধ্যায়ভিত্তিক সেটের মাধ্যমে শিক্ষার্থীরা সহজ ব্যাখ্যা ও তাৎক্ষণিক ফিডব্যাক পায়।
      </p>
      <p>
        প্রকল্পটি পরিচালিত হয় কয়েকজন উদ্যমী শিক্ষক ও শিক্ষার্থীর সমন্বয়ে। আমরা বিশ্বাস করি যে প্রযুক্তির সঠিক ব্যবহার শিক্ষাকে আরও সহজলভ্য করতে পারে।
      </p>
      <p>
        আগামিতে আরও বিষয়, মডেল টেস্ট ও স্মার্ট অ্যানালিটিক্স যুক্ত করার পরিকল্পনা রয়েছে।
      </p>
      <h2>দল ও যোগাযোগ</h2>
      <p>কোনো পরামর্শ বা সহযোগিতার জন্য আমাদের সাথে ইমেইলে যোগাযোগ করুন: <a href="mailto:team@labmcq.com">team@labmcq.com</a></p>
      <hr />
      <p><em>English:</em> LabMCQ is a volunteer project offering SSC students chapter-wise MCQ practice with simple explanations. Contact: team@labmcq.com.</p>
    </div>
  );
}
