
import { Offer, OfferType, Category, OfferStatus } from './types';

const getRecentDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const INITIAL_OFFERS: Offer[] = [
  {
    id: '1',
    toolName: 'Lovable',
    category: Category.AI,
    type: OfferType.FREE_MONTHS,
    description: 'Get 2 months free of the Pro subscription with code LOVABLE2FREE. Verified working for new projects.',
    promoCode: 'LOVABLE2FREE',
    sourceUrl: 'https://lovable.dev',
    lastVerifiedDate: getRecentDate(1),
    status: OfferStatus.APPROVED,
    isTrending: true
  },
  {
    id: '2',
    toolName: 'Supabase',
    category: Category.DEV,
    type: OfferType.LIFETIME_FREE,
    description: 'Generous free tier including database, auth, and storage. Updated limits for 2024.',
    sourceUrl: 'https://supabase.com/pricing',
    lastVerifiedDate: getRecentDate(12),
    status: OfferStatus.APPROVED,
    isTrending: false
  },
  {
    id: '3',
    toolName: 'GitHub Copilot',
    category: Category.AI,
    type: OfferType.STUDENT_OFFER,
    description: 'Free for verified students through the GitHub Student Developer Pack. Recently updated verification process.',
    sourceUrl: 'https://education.github.com/pack',
    lastVerifiedDate: getRecentDate(3),
    status: OfferStatus.APPROVED,
    isTrending: true
  },
  {
    id: '4',
    toolName: 'Notion',
    category: Category.PRODUCTIVITY,
    type: OfferType.STUDENT_OFFER,
    description: 'Personal Pro plan is free for students and educators. Valid for the 2024/2025 academic year.',
    sourceUrl: 'https://www.notion.so/students',
    lastVerifiedDate: getRecentDate(45),
    status: OfferStatus.APPROVED,
    isTrending: false
  },
  {
    id: '5',
    toolName: 'Cursor AI',
    category: Category.AI,
    type: OfferType.FREE_TRIAL,
    description: '14-day Pro trial with code CURSOR_FRESH. Available for new users this month.',
    promoCode: 'CURSOR_FRESH',
    sourceUrl: 'https://cursor.sh',
    lastVerifiedDate: getRecentDate(0),
    status: OfferStatus.APPROVED,
    isTrending: true
  }
];

export const CATEGORIES = Object.values(Category);
export const OFFER_TYPES = Object.values(OfferType);
