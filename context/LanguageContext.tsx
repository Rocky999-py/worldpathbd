
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const translations = {
  en: {
    explore: 'Find Visas',
    vault: 'My Documents',
    aiGuide: 'Smart Guide',
    liveSupport: 'Help Chat',
    slotAutomator: 'Auto Booker',
    destination: 'Where are you going?',
    origin: 'Applying from Bangladesh',
    visaType: 'Type of Visa',
    travelPurpose: 'Why are you traveling?',
    generateRoadmap: 'Get My Visa Plan',
    verifiedEmbassy: 'Updated for 2025 Rules',
    scanning: 'Checking Embassy Rules...',
    retrieving: 'Getting the latest 2025 updates for you.',
    startFinish: 'From Start to End',
    factualRoadmap: 'Real Expert Plan',
    expectedWait: 'Time it Takes',
    estCost: 'Total Cost',
    processingCenter: 'Submission Office',
    readyStart: 'Ready to begin?',
    advisorHelp: 'Ask our assistant to check your profile or cover letter.',
    verifyDocs: 'Check Documents',
    applicationPath: 'Step-by-Step Path',
    easyExplain: 'Simple Details',
    mandatoryDocs: 'Required Documents',
    financialSummary: 'Money Details',
    expertTips: 'Important Advice',
    embassyFee: 'Visa Fee',
    serviceCharge: 'Office Fee',
    totalEst: 'Total Price',
    commonMistake: 'Common Mistake',
    embassyFix: 'The Right Way',
    heroTitle: 'Easy Global Visas.',
    heroSub: 'Simple step-by-step guides for people in Bangladesh.',
    intel: 'Latest 2025 Information',
    changeSelection: 'Go Back',
    routeAvailability: 'Current Status',
    softwareTitle: 'Easy Appointment Booking',
    softwareSub: 'A smart tool to help you book slots at VFS Global, BLS, and Embassy websites automatically.',
    deliveryTime: 'Done in 15-20 Days',
    hybridModel: 'Smart Tech + Human Help',
    compatibility: 'Supported Websites',
    bookConsultation: 'Request a Demo',
    pricingTitle: 'Choose Your Plan',
    pricingSub: 'Fair pricing to help you get your appointment fast.',
    priceRange: '1,650€ — 10,000€',
    priceIncluded: 'Payment: 45% Now / 55% When Finished',
    priceNote: 'Final price depends on how hard the website is to book.',
    processingProposal: 'Checking your request...',
    analyzingPortal: 'Checking the booking website...',
    welcomeSuccess: 'Ready to Start',
    successTimeline: 'We can book this for you. Your setup is confirmed.',
    contactSoon: 'Our manager will call you within 2 hours.',
    selectCountry: 'Select Your Country',
    automationPossibility: 'Booking Chance',
    milestonePayment: 'How to Pay',
    milestoneDesc: '45% to Start / 55% After Completion'
  },
  bn: {
    explore: 'অন্বেষণ',
    vault: 'ডকুমেন্ট ভল্ট',
    aiGuide: 'এআই গাইড',
    liveSupport: 'লাইভ সাপোর্ট',
    slotAutomator: 'স্লট অটোমেটর',
    destination: 'গন্তব্য',
    origin: 'বাংলাদেশ থেকে আবেদন',
    visaType: 'ভিসার ধরন',
    travelPurpose: 'ভ্রমণের উদ্দেশ্য নির্বাচন করুন',
    generateRoadmap: 'এক্সপার্ট রোডম্যাপ তৈরি করুন',
    verifiedEmbassy: '২০২৫ দূতাবাস মান অনুযায়ী যাচাইকৃত',
    scanning: 'দূতাবাসের মানদণ্ড যাচাই করা হচ্ছে...',
    retrieving: 'বাংলাদেশি আবেদনকারীদের জন্য সর্বশেষ ২০২৫ সালের নিয়মগুলো আনা হচ্ছে।',
    startFinish: 'শুরু থেকে শেষ',
    factualRoadmap: 'নির্ভরযোগ্য এক্সপার্ট রোডম্যাপ',
    expectedWait: 'প্রত্যাশিত সময়',
    estCost: 'আনুমানিক খরচ (মোট)',
    processingCenter: 'প্রসেসিং সেন্টার',
    readyStart: 'আপনি কি শুরু করতে প্রস্তুত?',
    advisorHelp: 'আপনার প্রোফাইল বা কভার লেটার যাচাই করতে এআই পরামর্শ নিন।',
    verifyDocs: 'ডকুমেন্ট যাচাই করুন',
    applicationPath: 'আবেদনের পথ (শুরু থেকে শেষ)',
    easyExplain: 'সহজ ব্যাখ্যা',
    mandatoryDocs: 'প্রয়োজনীয় নথিপত্র',
    financialSummary: 'খরচের হিসাব',
    expertTips: 'বিশেষজ্ঞ টিপস',
    embassyFee: 'দূতাবাস ফি',
    serviceCharge: 'সার্ভিস চার্জ',
    totalEst: 'মোট আনুমানিক',
    commonMistake: 'সাধারণ ভুল',
    embassyFix: 'দূতাবাস স্ট্যান্ডার্ড সমাধান',
    heroTitle: 'গ্লোবাল ভিসা, তথ্যপূর্ণ ও সহজ।',
    heroSub: 'বাংলাদেশ থেকে বিশ্বের প্রতিটি দেশের জন্য ধাপে ধাপে রোডম্যাপ।',
    intel: 'রিয়েল-টাইম তথ্য • ২০২৫ আপডেট',
    changeSelection: 'নির্বাচন পরিবর্তন',
    routeAvailability: 'রুটের অবস্থা',
    softwareTitle: 'নেক্সট-জেন এআই অ্যাপয়েন্টমেন্ট অটোমেশন',
    softwareSub: 'VFS Global, BLS এবং এম্বেসি পোর্টালগুলোর জন্য বিশ্বের প্রথম ১০০% নির্ভুল এআই বুকিং ইঞ্জিন।',
    deliveryTime: '১৫-২০ দিনের মধ্যে ডেলিভারি',
    hybridModel: 'এআই + বিশেষজ্ঞ হিউম্যান ওভারসাইট',
    compatibility: 'টার্গেট সাইট কম্প্যাটিবিলিটি',
    bookConsultation: 'সফটওয়্যার ডেমো রিকোয়েস্ট',
    pricingTitle: 'নিউরাল ইনভার্সন প্যাকেজ',
    pricingSub: 'পরম পোর্টাল নিয়ন্ত্রণের জন্য মাইলফলক-ভিত্তিক বিনিয়োগ।',
    priceRange: '১,৬৫০€ — ১০,০০০€',
    priceIncluded: 'মাইলস্টোন: ৪৫% অগ্রিম / ৫৫% কাজ শেষে',
    priceNote: 'চূড়ান্ত মূল্য টার্গেট পোর্টালের আর্কিটেকচার এবং সিকিউরিটির উপর নির্ভর করে।',
    processingProposal: 'এআই ফিজিবিলিটি প্রপোজাল প্রসেস করা হচ্ছে...',
    analyzingPortal: 'টার্গেট পোর্টাল আর্কিটেকচার এবং সিকিউরিটি যাচাই করা হচ্ছে...',
    welcomeSuccess: 'নিউরাল লিংক সফলভাবে স্থাপিত',
    successTimeline: 'অটোমেশন সম্ভাবনা ১০০%। প্রোটোকল ডিপ্লয়মেন্ট নিশ্চিত।',
    contactSoon: 'আমাদের টেকনিক্যাল ডিরেক্টর ২ ঘণ্টার মধ্যে আপনার ফোনের মাধ্যমে যোগাযোগ করবেন।',
    selectCountry: 'টার্গেট দেশ নির্বাচন করুন',
    automationPossibility: 'অটোমেশন সম্ভাবনা',
    milestonePayment: 'মাইলস্টোন পেমেন্ট প্রোটোকল',
    milestoneDesc: '৪৫% শুরুতে / ৫৫% সম্পূর্ণ হওয়ার পর'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: keyof typeof translations['en']) => {
    return translations[lang][key] || translations['en'][key];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
