import React from 'react';
// Import existing and new icons
import { 
    Sparkles, TestTube, Dna, Calculator, Pi,
    BookText, Globe, Laptop, MoonStar 
} from 'lucide-react';

// --- Subject Configurations (Updated) ---
export const subjectConfig = {
    physics: {
        icon: <Sparkles size={56} className="text-blue-300"/>,
        path: '/src/data/physics-mcq/',
        displayName: 'পদার্থবিজ্ঞান'
    },
    chemistry: {
        icon: <TestTube size={56} className="text-purple-300"/>,
        path: '/src/data/chemistry-mcq/',
        displayName: 'রসায়ন'
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
    },
    // --- Newly Integrated Subjects ---
    bangla1st: {
        icon: <BookText size={56} className="text-red-300"/>,
        path: '/src/data/bangla-1st-mcq/',
        displayName: 'বাংলা প্রথম পত্র'
    },
    bangla2nd: {
        icon: <BookText size={56} className="text-red-400"/>,
        path: '/src/data/bangla-2nd-mcq/',
        displayName: 'বাংলা দ্বিতীয় পত্র'
    },
    bgs: {
        icon: <Globe size={56} className="text-emerald-300"/>,
        path: '/src/data/bgs-mcq/',
        displayName: 'বাংলাদেশ ও বিশ্বপরিচয়'
    },
    ict: {
        icon: <Laptop size={56} className="text-gray-300"/>,
        path: '/src/data/ict-mcq/',
        displayName: 'তথ্য ও যোগাযোগ প্রযুক্তি'
    },
    islam: {
        icon: <MoonStar size={56} className="text-teal-300"/>,
        path: '/src/data/islam-mcq/',
        displayName: 'ইসলাম ও নৈতিক শিক্ষা'
    }
};

// Map board shortcodes to their full Bengali names
export const boardBengaliNames = {
    // === General & Aliases ===
    'All': 'সকল বোর্ড',
    'All.B': 'সকল বোর্ড',
    'Unknown': 'অজানা প্রশ্ন',
    'B': 'বোর্ড',

    // === Boards ===
    'Dhaka': 'ঢাকা বোর্ড', 'DB': 'ঢাকা বোর্ড',
    'Barishal': 'বরিশাল বোর্ড', 'BB': 'বরিশাল বোর্ড',
    'Cumilla': 'কুমিল্লা বোর্ড', 'CB': 'কুমিল্লা বোর্ড',
    'Chattogram': 'চট্টগ্রাম বোর্ড', 'Ctg.B': 'চট্টগ্রাম বোর্ড',
    'Rajshahi': 'রাজশাহী বোর্ড', 'RB': 'রাজশাহী বোর্ড',
    'Jashore': 'যশোর বোর্ড', 'JB': 'যশোর বোর্ড',
    'Sylhet': 'সিলেট বোর্ড', 'SB': 'সিলেট বোর্ড',
    'Dinajpur': 'দিনাজপুর বোর্ড', 'Din.B': 'দিনাজপুর বোর্ড',
    'Mymensingh': 'ময়মনসিংহ বোর্ড', 'MB': 'ময়মনসিংহ বোর্ড',

    // === Added Technical and Madrasah Boards ===
    'Madrasah': 'মাদ্রাসা বোর্ড', 'Mad': 'মাদ্রাসা বোর্ড',
    'Technical': 'কারিগরি বোর্ড', 'Tech': 'কারিগরি বোর্ড'
};

// Utility function to convert English digits to Bengali
export const convertToBengaliDigits = (num) => {
    if (num === null || num === undefined) return '';
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(d => bengaliDigits[englishDigits.indexOf(d)] ?? d).join('');
};

// Helper function to convert Bengali digits to English for reliable parsing
export const convertToEnglishDigits = (str) => {
    if (!str) return '';
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return str.toString().split('').map(d => englishDigits[bengaliDigits.indexOf(d)] ?? d).join('');
};

export const processBoardName = (cleanName) => {
    let displayName = cleanName;
    let groupKey = 'অজানা প্রশ্ন';

    // Check for exact match first
    const exactMatchName = boardBengaliNames[cleanName];
    if (exactMatchName) {
        displayName = exactMatchName;
        groupKey = exactMatchName;
        return { displayName, groupKey };
    }

    const boardMatch = cleanName.match(/^([A-Za-z.]+)(\d{2,4}|All)?$/i);
    if (boardMatch) {
        const boardCode = boardMatch[1];
        const yearPart = boardMatch[2];
        const boardName = boardBengaliNames[boardCode];

        if (boardName) {
            groupKey = boardName;
            let yearText = '';
            if (yearPart && yearPart.toLowerCase() !== 'all') {
                const year = parseInt(yearPart);
                yearText = convertToBengaliDigits(yearPart.length === 2 ? 2000 + year : year);
            }
            displayName = yearText ? `${boardName} ${yearText}` : boardName;
            return { displayName, groupKey };
        }
    }

    // Handle school/college names
    const yearRegex = /((?:20|২০)[0-9০-৯]{2}|(?:19|১৯)[0-9০-৯]{2}|[0-9০-৯]{4}|[0-9০-৯]{2})$/;
    const yearMatch = cleanName.match(yearRegex);
    let extractedYear = '';
    let baseName = cleanName;

    if (yearMatch) {
        const yearString = yearMatch[0];
        const yearInEnglish = convertToEnglishDigits(yearString);
        const yearNumber = parseInt(yearInEnglish);
        if (!isNaN(yearNumber)) {
            extractedYear = convertToBengaliDigits(yearInEnglish.length === 2 ? 2000 + yearNumber : yearNumber);
            baseName = cleanName.replace(yearString, '').replace(/[,.\s]*$/, '').trim();
        }
    }

    let formattedBaseName = baseName;

   // Formatting passes (unchanged)
    formattedBaseName = formattedBaseName
    .replace(/স্কুলঅ্যান্ডকলেজ/g, 'স্কুল অ্যান্ড কলেজ').replace(/স্কুলওকলেজ/g, 'স্কুল ও কলেজ')
    .replace(/স্কুলএন্ডকলেজ/g, 'স্কুল এন্ড কলেজ').replace(/হাইস্কুল/g, 'হাই স্কুল')
    .replace(/গার্লসক্যাডেট/g, 'গার্লস ক্যাডেট').replace(/কলেজিয়েটস্কুল/g, 'কলেজিয়েট স্কুল')
    .replace(/ক্যান্ট\./g, 'ক্যান্টনমেন্ট').replace(/গভঃ/g, 'গভর্নমেন্ট')
    .replace(/বিএএফ/g, 'বি এ এফ').replace(/সেন্টযোসেফ/g, 'সেন্ট যোসেফ')
    .replace(/ক্যাডেটকলেজ/g, 'ক্যাডেট কলেজ').replace(/ক্যান্টনমেন্টপাবলিক/g, 'ক্যান্টনমেন্ট পাবলিক')
    .replace(/পাবলিককলেজ/g, 'পাবলিক কলেজ').replace(/ল্যাবরেটরিস্কুল/g, 'ল্যাবরেটরি স্কুল')
    .replace(/মডেলকলেজ/g, 'মডেল কলেজ').replace(/শাহীনকলেজ/g, 'শাহীন কলেজ')
    .replace(/উচ্চমাধ্যমিকবিদ্যালয়/g, 'উচ্চ মাধ্যমিক বিদ্যালয়').replace(/উচ্চবালিকা/g, 'উচ্চ বালিকা')
    .replace(/ওকলেজ/g, 'ও কলেজ').replace(/,([^\s])/g, ', $1').replace(/কলেজ,ঢাকা/g, 'কলেজ, ঢাকা')
    .replace(/কলেজ,ময়মনসিংহ/g, 'কলেজ, ময়মনসিংহ').replace(/গার্লসস্কুল/g, 'গার্লস স্কুল')
    .replace(/উচ্চবিদ্যালয়/g, 'উচ্চ বিদ্যালয়').replace(/ল্যাবরেটরিহাই/g, 'ল্যাবরেটরি হাই')
    .replace(/ল্যাবরেটরীহাই/g, 'ল্যাবরেটরী হাই').replace(/ঢাকারেসিডেনসিয়াল/g, 'ঢাকা রেসিডেনসিয়াল')
    .replace(/মুনীরআহমেদপাবলিক/g, 'মুনীর আহমেদ পাবলিক').replace(/রাজউকউত্তরা/g, 'রাজউক উত্তরা')
    .replace(/যোসেফউচ্চ/g, 'যোসেফ উচ্চ').replace(/উচ্চমাধ্যমিক/g, 'উচ্চ মাধ্যমিক');
        
    formattedBaseName = formattedBaseName
    .replace(/([^\s])(স্কুল|কলেজ|ক্যাডেট|পাবলিক|উচ্চ|বালিকা|বিদ্যালয়|মডেল|গভর্নমেন্ট|ল্যাবরেটরি|সেন্ট|যোসেফ|হলিক্রস|শাহীন|ক্যান্টনমেন্ট|রেসিডেনসিয়াল|নূন|উত্তরা|আইডিয়াল|অ্যান্ড|ও|এন্ড|গার্লস)/g, '$1 $2');

    formattedBaseName = formattedBaseName.replace(/\s+/g, ' ').trim();

    displayName = formattedBaseName;
    if (extractedYear) {
        displayName += ` ${extractedYear}`;
    }

    groupKey = 'স্কুল';
    return { displayName, groupKey };
};

// --- Function to generate board list for a subject (Updated Regex) ---
export const generateBoardList = (subjectKey, modules) => {
    if (!subjectConfig[subjectKey]) return {};

    const subjectPath = subjectConfig[subjectKey].path;
    const tempGrouped = {};
    
    // --- KEY CHANGE HERE ---
    // Updated Regex to include all new subject prefixes
    const subjectPrefixRegex = /^(Physics-|Chemistry-|Biology-|Higher-Math-|General-Math-|Bangla-1st-|Bangla-2nd-|BGS-|ICT-|Islam-)/i;

    Object.keys(modules)
        .filter(path => path.startsWith(subjectPath))
        .forEach(path => {
            const rawFile = path.replace(subjectPath, '').replace('.json', '');
            const cleanName = rawFile.replace(subjectPrefixRegex, '');
            
            const { displayName, groupKey } = processBoardName(cleanName);

            if (!tempGrouped[groupKey]) tempGrouped[groupKey] = [];
            tempGrouped[groupKey].push({
                id: path,
                boardId: rawFile,
                name: displayName,
                searchableName: `${displayName.toLowerCase()} ${rawFile.toLowerCase()}`
            });
        });

    // Sort groups with special ordering (unchanged logic)
    const allGroups = Object.keys(tempGrouped);
    const specialGroups = ['ঢাকা বোর্ড', 'সকল বোর্ড', 'স্কুল', 'School', 'অজানা প্রশ্ন'];
    const sortedGroups = [
        ...['ঢাকা বোর্ড', 'সকল বোর্ড'].filter(g => tempGrouped[g]),
        ...allGroups.filter(g => !specialGroups.includes(g)).sort((a, b) => a.localeCompare(b, 'bn')),
        ...['স্কুল', 'School'].filter(g => tempGrouped[g]),
        ...['অজানা প্রশ্ন'].filter(g => tempGrouped[g])
    ];

    const sortedBoardList = {};
    sortedGroups.forEach(group => {
        if (group === 'স্কুল' || group === 'School') {
            sortedBoardList[group] = tempGrouped[group].sort((a, b) => a.name.localeCompare(b.name, 'bn'));
        } else {
            sortedBoardList[group] = tempGrouped[group];
        }
    });

    return sortedBoardList;
};

// URL parsing utilities (No changes needed, this logic is dynamic)
export const parseUrlState = (pathname) => {
    if (pathname === '/') {
        return { view: 'subjects', subject: null, boardId: null, mode: null };
    }

    const subjectMatch = pathname.match(/^\/([a-z0-9]+(?:-[a-z0-9]+)*)-boards$/i);
    if (subjectMatch) {
        const subjectKey = subjectMatch[1].replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
        if (subjectConfig[subjectKey]) {
            return { view: 'boards', subject: subjectKey, boardId: null, mode: null };
        }
    }

    const questionMatch = pathname.match(/^\/(.+)\/(practice|exam|view)$/);
    if (questionMatch) {
        const boardId = questionMatch[1];
        const mode = questionMatch[2];
        return { view: 'questions', subject: null, boardId, mode };
    }

    return { view: 'subjects', subject: null, boardId: null, mode: null };
};

// Function to find subject from board ID (No changes needed, this logic is dynamic)
export const findSubjectFromBoardId = (boardId, modules) => {
    if (!boardId) return null;

    const lowerCaseBoardId = boardId.toLowerCase();
    
    const modulePathKey = Object.keys(modules).find(path => {
        const pathFileName = path.substring(path.lastIndexOf('/') + 1);
        return pathFileName.toLowerCase() === `${lowerCaseBoardId}.json`;
    });

    if (modulePathKey) {
        for (const [subjectKey, config] of Object.entries(subjectConfig)) {
            if (modulePathKey.startsWith(config.path)) {
                return subjectKey;
            }
        }
    }
    
    return null;
};