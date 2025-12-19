
export enum OfferType {
  FREE_TRIAL = 'Free Trial',
  FREE_MONTHS = 'Free Months',
  PROMO_CODE = 'Promo Code',
  LIFETIME_FREE = 'Lifetime Free',
  STUDENT_OFFER = 'Student Offer'
}

export enum Category {
  AI = 'AI Tools',
  DEV = 'Developer Tools',
  SAAS = 'SaaS Software',
  PRODUCTIVITY = 'Productivity',
  MARKETING = 'Marketing'
}

export enum OfferStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  EXPIRED = 'Expired',
  REJECTED = 'Rejected'
}

export interface Offer {
  id: string;
  toolName: string;
  category: Category;
  type: OfferType;
  description: string;
  promoCode?: string;
  expiryDate?: string;
  sourceUrl: string;
  lastVerifiedDate: string;
  status: OfferStatus;
  isTrending?: boolean;
}

export interface SearchResult {
  offers: Offer[];
  groundingLinks?: { title: string; uri: string }[];
}
