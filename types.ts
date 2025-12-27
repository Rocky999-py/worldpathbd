
export type Language = 'en' | 'bn';

export type VisaType = 'Tourist' | 'Study' | 'Work' | 'Family' | 'Business' | 'Digital Nomad' | 'Medical' | 'Marriage';
export type Region = 'All' | 'Europe' | 'Americas' | 'Asia' | 'Oceania' | 'Middle East';

export interface User {
  id: string;
  name: string;
  phone: string;
  authorized: boolean;
  registeredAt: number;
}

export interface Wallet {
  walletId: string;
  balance: number;
  userName: string;
  userPhone: string;
}

export interface Country {
  id: string;
  name: { en: string; bn: string };
  flag: string;
  isoCode: string;
  region: Region;
  embassyInBD: boolean;
  vfsCenter: { en: string; bn: string };
}

export interface DetailedProcessStep {
  title: { en: string; bn: string };
  action: { en: string; bn: string };
  commonProblem: { en: string; bn: string };
  solution: { en: string; bn: string };
}

export interface VisaDetail {
  currentStatus: { en: string; bn: string; status: 'Open' | 'Restricted' | 'Busy' };
  requirements: { en: string; bn: string }[];
  costs: {
    embassyFee: { en: string; bn: string };
    serviceProviderName: { en: string; bn: string }; 
    serviceProviderFee: { en: string; bn: string };
    mandatoryInsurance: { en: string; bn: string };
    totalEstimatedBDT: { en: string; bn: string };
  };
  timeline: { en: string; bn: string };
  successTips: { en: string; bn: string }[];
  keyRegulation: { en: string; bn: string };
  detailedSteps: DetailedProcessStep[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
