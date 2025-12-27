
import { Country, VisaType } from './types';

export const COUNTRIES: Country[] = [
  { id: 'germany', name: { en: 'Germany', bn: 'জার্মানি' }, flag: '🇩🇪', isoCode: 'de', region: 'Europe', embassyInBD: true, vfsCenter: { en: 'Dhaka', bn: 'ঢাকা' } },
  { id: 'italy', name: { en: 'Italy', bn: 'ইতালি' }, flag: '🇮🇹', isoCode: 'it', region: 'Europe', embassyInBD: true, vfsCenter: { en: 'Dhaka, Sylhet, Chattogram', bn: 'ঢাকা, সিলেট, চট্টগ্রাম' } },
  { id: 'france', name: { en: 'France', bn: 'ফ্রান্স' }, flag: '🇫🇷', isoCode: 'fr', region: 'Europe', embassyInBD: true, vfsCenter: { en: 'Dhaka', bn: 'ঢাকা' } },
  { id: 'uk', name: { en: 'United Kingdom', bn: 'যুক্তরাজ্য' }, flag: '🇬🇧', isoCode: 'gb', region: 'Europe', embassyInBD: true, vfsCenter: { en: 'Dhaka, Sylhet', bn: 'ঢাকা, সিলেট' } },
  { id: 'poland', name: { en: 'Poland', bn: 'পোল্যান্ড' }, flag: '🇵🇱', isoCode: 'pl', region: 'Europe', embassyInBD: true, vfsCenter: { en: 'Dhaka', bn: 'ঢাকা' } },
  { id: 'usa', name: { en: 'USA', bn: 'আমেরিকা' }, flag: '🇺🇸', isoCode: 'us', region: 'Americas', embassyInBD: true, vfsCenter: { en: 'Dhaka (Embassy)', bn: 'ঢাকা (দূতাবাস)' } },
  { id: 'canada', name: { en: 'Canada', bn: 'কানাডা' }, flag: '🇨🇦', isoCode: 'ca', region: 'Americas', embassyInBD: true, vfsCenter: { en: 'Dhaka (VFS)', bn: 'ঢাকা (ভিএফএস)' } },
  { id: 'japan', name: { en: 'Japan', bn: 'জাপান' }, flag: '🇯🇵', isoCode: 'jp', region: 'Asia', embassyInBD: true, vfsCenter: { en: 'Dhaka', bn: 'ঢাকা' } },
  { id: 'thailand', name: { en: 'Thailand', bn: 'থাইল্যান্ড' }, flag: '🇹🇭', isoCode: 'th', region: 'Asia', embassyInBD: true, vfsCenter: { en: 'Dhaka (VFS)', bn: 'ঢাকা (ভিএফএস)' } },
  { id: 'india', name: { en: 'India', bn: 'ভারত' }, flag: '🇮🇳', isoCode: 'in', region: 'Asia', embassyInBD: true, vfsCenter: { en: 'Dhaka, CTG, Sylhet', bn: 'ঢাকা, চট্টগ্রাম, সিলেট' } },
  { id: 'china', name: { en: 'China', bn: 'চীন' }, flag: '🇨🇳', isoCode: 'cn', region: 'Asia', embassyInBD: true, vfsCenter: { en: 'Dhaka', bn: 'ঢাকা' } },
  { id: 'australia', name: { en: 'Australia', bn: 'অস্ট্রেলিয়া' }, flag: '🇦🇺', isoCode: 'au', region: 'Oceania', embassyInBD: true, vfsCenter: { en: 'Dhaka', bn: 'ঢাকা' } },
  { id: 'uae', name: { en: 'UAE', bn: 'সংযুক্ত আরব আমিরাত' }, flag: '🇦🇪', isoCode: 'ae', region: 'Middle East', embassyInBD: true, vfsCenter: { en: 'E-visa', bn: 'ই-ভিসা' } },
  { id: 'saudi', name: { en: 'Saudi Arabia', bn: 'সৌদি আরব' }, flag: '🇸🇦', isoCode: 'sa', region: 'Middle East', embassyInBD: true, vfsCenter: { en: 'Dhaka', bn: 'ঢাকা' } },
];

export const VISA_TYPES: { type: VisaType; icon: string; label: { en: string; bn: string } }[] = [
  { type: 'Tourist', icon: 'fa-camera', label: { en: 'Tourist', bn: 'ট্যুরিস্ট' } },
  { type: 'Study', icon: 'fa-book', label: { en: 'Study', bn: 'শিক্ষা' } },
  { type: 'Work', icon: 'fa-briefcase', label: { en: 'Work', bn: 'কাজ' } },
  { type: 'Business', icon: 'fa-building', label: { en: 'Business', bn: 'ব্যবসা' } },
  { type: 'Digital Nomad', icon: 'fa-laptop-code', label: { en: 'Digital Nomad', bn: 'রিমোট ওয়ার্ক' } },
  { type: 'Medical', icon: 'fa-heart-pulse', label: { en: 'Medical', bn: 'চিকিৎসা' } },
  { type: 'Family', icon: 'fa-users', label: { en: 'Family', bn: 'পরিবার' } },
  { type: 'Marriage', icon: 'fa-ring', label: { en: 'Marriage', bn: 'বিবাহ' } },
];
