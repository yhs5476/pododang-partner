export type CareType = 'hospital' | 'escort' | 'home';

export type MobilityStatus = 'independent' | 'assisted' | 'wheelchair' | 'bedridden';

export interface JobPost {
  id: string;
  title: string;
  patientName: string;
  patientAge: number;
  patientGender: '남' | '여';
  careType: CareType;
  hospitalName?: string;
  hospitalRoom?: string;
  homeAddress?: string;
  locationArea: string; // e.g. "서울 송파구 잠실동"
  distanceKm: number;
  etaMinutes: number;
  mobility: MobilityStatus;
  specialCares: string[];
  scheduleDates: string;
  scheduleTime: string;
  durationDays: number;
  targetBudget: number; // e.g. 150000 (1일 기준)
  currentBidsCount: number;
  guardianName: string;
  guardianRelation: string;
  urgentNotice?: string;
  description: string;
  status: 'open' | 'matched' | 'completed';
  createdAt: string;
  myBid?: Bid;
}

export interface Bid {
  id: string;
  jobId: string;
  proposedAmount: number;
  appealTags: string[];
  guardianMessage: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
}

export interface TrackingStep {
  step: number;
  key: 'start' | 'arrived_hospital' | 'clinic' | 'pharmacy' | 'heading_home' | 'completed';
  title: string;
  subTitle: string;
  icon: string;
  completed: boolean;
  time?: string;
  memo?: string;
  photoUrl?: string;
}

export interface ActiveCareSession {
  id: string;
  jobId: string;
  patientName: string;
  guardianName: string;
  guardianPhone: string;
  hospitalName: string;
  hospitalDept: string;
  scheduleDate: string;
  currentStepIndex: number;
  steps: TrackingStep[];
  startedAt?: string;
  completedAt?: string;
}

export interface CareReport {
  id: string;
  jobId: string;
  patientName: string;
  caremateName: string;
  date: string;
  hospitalName: string;
  doctorFeedback: string;
  medicationInstructions: string;
  vitalSigns: {
    temp: string;
    bloodPressure: string;
    mealIntake: '전부 드심' | '절반 드심' | '거의 못 드심';
    bowelMovement: '정상 배변' | '미배변' | '소변줄 정상';
    conditionNote: string;
  };
  aiGeneratedSummary: string;
  nextAppointment?: string;
  isAiGenerated: boolean;
  isSharedWithFamily: boolean;
  sharedAt?: string;
}

export interface PartnerProfile {
  name: string;
  roleTitle: string;
  avatarUrl: string;
  phone: string;
  isReceivingBids: boolean;
  currentRadiusKm: number;
  brix: number; // e.g. 18.6
  brixGrade: '새콤한 청포도' | '달콤한 캠벨' | '진한 머스캣' | '명품 샤인머스캣';
  totalMatches: number;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  licenses: {
    name: string;
    level: string;
    verified: boolean;
    issuedDate: string;
  }[];
  insurance: {
    verified: boolean;
    provider: string;
    coverageAmount: string;
    expiryDate: string;
  };
  settlement: {
    withdrawableAmount: number;
    pendingEscrowAmount: number;
    monthlyTotal: number;
    bankAccount: string;
  };
  reviewTags: { tag: string; count: number }[];
  brixHistory: {
    id: string;
    reason: string;
    change: number;
    date: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'caremate' | 'guardian' | 'system';
  text: string;
  timestamp: string;
  type?: 'text' | 'invoice' | 'notice';
  invoiceData?: {
    id: string;
    careTitle: string;
    period: string;
    dailyRate: number;
    days: number;
    careAmount: number;
    platformFee: number;
    totalAmount: number;
    isPaid: boolean;
  };
}

export interface Conversation {
  id: string;
  jobId: string;
  guardianName: string;
  guardianRelation: string;
  patientName: string;
  careTitle: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  matchingStatus: 'consulting' | 'agreed' | 'paid' | 'in_progress' | 'completed';
  messages: ChatMessage[];
}
