import React from 'react';
import { Sparkles, TestTube, Dna, Calculator, Pi } from 'lucide-react';

// Data Imports (using Vite's glob import)
const modules = import.meta.glob('/src/data/**/*.json');

// Subject Configurations with Bangla Display Names
export const subjectConfig = {
    physics: {
        icon: <Sparkles size={56} className="text-blue-300"/>,
        path: '/src/data/physics-mcq/',
        displayName: 'পদার্থবিজ্ঞান'
    },
    chemistry: {
        icon: <TestTube size={56} className="text-purple-300"/>,
        path: '/src/data/chemistry-mcq/',
        displayName: 'রসায়ন'
    },
    biology: {
        icon: <Dna size={56} className="text-green-300"/>,
        path: '/src/data/biology-mcq/',
        displayName: 'জীববিজ্ঞান'
    },
    higherMath: {
        icon: <Calculator size={56} className="text-orange-300"/>,
        path: '/src/data/higher-math-mcq/',
        displayName: 'উচ্চতর গণিত'
    },
    generalMath: {
        icon: <Pi size={56} className="text-sky-300"/>,
        path: '/src/data/general-math-mcq/',
        displayName: 'সাধারণ গণিত'
    }
};

// --- Bangla Chapter Names ---
export const chapterNames = {
    physics: {
        '1': 'ভৌত রাশি ও পরিমাপ', '2': 'গতি', '3': 'বল', '4': 'কাজ, ক্ষমতা ও শক্তি',
        '5': 'পদার্থের অবস্থা ও চাপ', '6': 'বস্তুর উপর তাপের প্রভাব', '7': 'তরঙ্গ ও শব্দ',
        '8': 'আলোর প্রতিফলন', '9': 'আলোর প্রতিসরণ', '10': 'স্থির তড়িৎ', '11': 'চল তড়িৎ',
        '12': 'বিদ্যুতের চৌম্বক ক্রিয়া', '13': 'আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স', '14': 'জীবন বাঁচাতে পদার্থবিজ্ঞান'
    },
    chemistry: {
        '1': 'রসায়নের ধারণা', '2': 'পদার্থের অবস্থা', '3': 'পদার্থের গঠন', '4': 'পর্যায় সারণি',
        '5': 'রাসায়নিক বন্ধন', '6': 'মোলের ধারণা ও রাসায়নিক গণনা', '7': 'রাসায়নিক বিক্রিয়া',
        '8': 'রসায়ন ও শক্তি', '9': 'এসিড-ক্ষার সমতা', '10': 'খনিজ সম্পদ: ধাতু-অধাতু',
        '11': 'খনিজ সম্পদ: জীবাশ্ম', '12': 'আমাদের জীবনে রসায়ন'
    },
    biology: {
        '1': 'জীবন পাঠ', '2': 'জীব কোষ ও টিস্যু', '3': 'কোষ বিভাজন', '4': 'জীবনী শক্তি',
        '5': 'খাদ্য, পুষ্টি এবং পরিপাক', '6': 'জীবে পরিবহন', '7': 'গ্যাসীয় বিনিময়',
        '8': 'মানব রেচন', '9': 'দৃঢ়তা প্রদান ও চলন', '10': 'সমন্বয়', '11': 'জীবে প্রজনন',
        '12': 'জীবের বংশগতি ও বিবর্তন', '13': 'জীবের পরিবেশ', '14': 'জীবপ্রযুক্তি'
    },
    higherMath: {
        '1': 'সেট ও ফাংশন', '2': 'বীজগাণিতিক রাশি', '3': 'জ্যামিতি', '4': 'জ্যামিতিক অঙ্কন',
        '5': 'সমীকরণ', '6': 'অসমতা', '7': 'অসীম ধারা', '8': 'ত্রিকোণমিতি',
        '9': 'সূচকীয় ও লগারিদমীয় ফাংশন', '10': 'দ্বিপদী বিস্তৃতি', '11': 'স্থানাঙ্ক জ্যামিতি',
        '12': 'সমতলীয় ভেক্টর', '13': 'ঘন জ্যামিতি', '14': 'সম্ভাবনা'
    },
    generalMath: {
        '1': 'বাস্তব সংখ্যা', '2': 'সেট ও ফাংশন', '3': 'বীজগাণিতিক রাশি', '4': 'সূচক ও লগারিদম',
        '5': 'এক চলকবিশিষ্ট সমীকরণ', '6': 'রেখা, কোণ ও ত্রিভুজ', '7': 'ব্যবহারিক জ্যামিতি',
        '8': 'বৃত্ত', '9': 'ত্রিকোণমিতিক অনুপাত', '10': 'দূরত্ব ও উচ্চতা',
        '11': 'বীজগাণিতিক অনুপাত ও সমানুপাত', '12': 'দুই চলকবিশিষ্ট সরল সহসমীকরণ',
        '13': 'সসীম ধারা', '14': 'অনুপাত, সদৃশতা ও প্রতিসমতা',
        '15': 'ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য', '16': 'পরিমিতি', '17': 'পরিসংখ্যান'
    }
};


// --- Chapter Loading and Processing Logic ---
export const loadChaptersForSubject = async (subjectKey) => {
    const subjectPath = subjectConfig[subjectKey]?.path;
    if (!subjectPath) {
        return [];
    }

    const chapterPromises = Object.entries(modules)
        .filter(([path]) => path.startsWith(subjectPath))
        .map(([, loader]) => loader().then(mod => {
            const questions = mod.default?.questions || [];
            if (questions.length === 0) return null;
            const chapterId = questions[0]?.chapter;
            return { id: chapterId, count: questions.length };
        }));

    const loadedChapters = await Promise.all(chapterPromises);
    
    const chapterMap = new Map();
    loadedChapters.forEach(ch => {
        // FIX: Stricter check to filter out invalid chapter IDs
        if (!ch || ch.id === null || ch.id === undefined || ch.id === 'null') return;

        if (chapterMap.has(ch.id)) {
            const existing = chapterMap.get(ch.id);
            existing.count += ch.count;
        } else {
            chapterMap.set(ch.id, { id: ch.id, count: ch.count });
        }
    });

    // Return a sorted array of unique chapters
    return Array.from(chapterMap.values())
        .sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
};