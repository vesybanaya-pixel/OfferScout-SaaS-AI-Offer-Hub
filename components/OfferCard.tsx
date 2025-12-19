
import React from 'react';
import { ExternalLink, Calendar, Tag, CheckCircle2, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { Offer, OfferType } from '../types';

interface OfferCardProps {
  offer: Offer;
  onVerify?: (id: string) => void;
  isAdmin?: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onVerify, isAdmin }) => {
  const isNew = () => {
    const verifiedDate = new Date(offer.lastVerifiedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - verifiedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case OfferType.PROMO_CODE: return 'bg-purple-100 text-purple-700 border-purple-200';
      case OfferType.FREE_TRIAL: return 'bg-blue-100 text-blue-700 border-blue-200';
      case OfferType.LIFETIME_FREE: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case OfferType.STUDENT_OFFER: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
      <div className="flex gap-1 absolute top-0 right-0">
        {isNew() && (
          <div className="bg-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center space-x-1 uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3 h-3" />
            <span>New</span>
          </div>
        )}
        {offer.isTrending && (
          <div className={`${isNew() ? 'rounded-none' : 'rounded-bl-xl'} bg-orange-500 text-white text-[10px] font-bold px-3 py-1 flex items-center space-x-1 uppercase tracking-wider`}>
            <TrendingUp className="w-3 h-3" />
            <span>Trending</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 block">
            {offer.category}
          </span>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors pr-16">
            {offer.toolName}
          </h3>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getTypeColor(offer.type)}`}>
          {offer.type}
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
        {offer.description}
      </p>

      {offer.promoCode && (
        <div className="mb-6">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Promo Code</label>
          <div className="flex items-center space-x-2">
            <code className="bg-slate-50 border border-dashed border-slate-300 px-3 py-2 rounded-lg text-indigo-600 font-mono font-bold select-all flex-grow text-center">
              {offer.promoCode}
            </code>
          </div>
        </div>
      )}

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className={`flex items-center space-x-1.5 ${isNew() ? 'text-indigo-600 font-medium' : ''}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>Verified: {formatDate(offer.lastVerifiedDate)}</span>
          </div>
          {offer.expiryDate && (
            <div className="flex items-center space-x-1.5 text-rose-500 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Expires: {offer.expiryDate}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <a
            href={offer.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-grow flex items-center justify-center space-x-2 bg-slate-900 text-white py-2.5 rounded-xl hover:bg-slate-800 transition-all font-semibold text-sm shadow-sm"
          >
            <span>Claim Offer</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          
          {isAdmin && (
            <button
              onClick={() => onVerify?.(offer.id)}
              className="px-3 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100"
              title="Verify Offer"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
