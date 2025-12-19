
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Search, Filter, AlertTriangle, Loader2, Sparkles, X, CheckCircle, Info, Zap, Calendar, ExternalLink as LucideExternalLink, ShieldCheck } from 'lucide-react';
import Navbar from './components/Navbar';
import OfferCard from './components/OfferCard';
import { Offer, Category, OfferStatus, OfferType } from './types';
import { INITIAL_OFFERS, CATEGORIES, OFFER_TYPES } from './constants';
import { discoverOffers } from './services/geminiService';

const App: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [recentOnly, setRecentOnly] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newOfferLinks, setNewOfferLinks] = useState<{title: string, uri: string}[]>([]);

  // Filter and Sort Logic
  const filteredOffers = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    return offers
      .filter(offer => {
        const matchesSearch = offer.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              offer.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || offer.category === selectedCategory;
        const isVisible = isAdmin ? true : offer.status === OfferStatus.APPROVED;
        
        const verifiedDate = new Date(offer.lastVerifiedDate);
        const isRecent = verifiedDate >= thirtyDaysAgo;
        const matchesRecent = !recentOnly || isRecent;

        return matchesSearch && matchesCategory && isVisible && matchesRecent;
      })
      .sort((a, b) => new Date(b.lastVerifiedDate).getTime() - new Date(a.lastVerifiedDate).getTime());
  }, [offers, searchQuery, selectedCategory, isAdmin, recentOnly]);

  const handleAIDiscovery = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    const result = await discoverOffers(searchQuery);
    
    if (result.offers.length > 0) {
      const formattedOffers: Offer[] = result.offers.map((o, idx) => ({
        id: `ai-${Date.now()}-${idx}`,
        toolName: o.toolName || 'Unknown Tool',
        category: (o.category as Category) || Category.SAAS,
        type: (o.type as OfferType) || OfferType.FREE_TRIAL,
        description: o.description || 'No description available.',
        promoCode: o.promoCode,
        sourceUrl: o.sourceUrl || '#',
        lastVerifiedDate: o.lastVerifiedDate || new Date().toISOString().split('T')[0],
        status: OfferStatus.APPROVED, // Auto-approve AI found ones for better demo feel
        expiryDate: o.expiryDate,
        isTrending: false
      }));
      setOffers(prev => [...prev, ...formattedOffers]);
      setNewOfferLinks(result.links);
    }
    setIsSearching(false);
  };

  const handleVerify = (id: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: OfferStatus.APPROVED, lastVerifiedDate: new Date().toISOString().split('T')[0] } : o));
  };

  const handleSubmitNewOffer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOffer: Offer = {
      id: Date.now().toString(),
      toolName: formData.get('toolName') as string,
      category: formData.get('category') as Category,
      type: formData.get('type') as OfferType,
      description: formData.get('description') as string,
      promoCode: formData.get('promoCode') as string || undefined,
      sourceUrl: formData.get('sourceUrl') as string,
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      status: OfferStatus.PENDING,
      isTrending: false
    };
    setOffers(prev => [...prev, newOffer]);
    setIsSubmitModalOpen(false);
    alert('Offer submitted for verification!');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          onAdminClick={() => setIsAdmin(!isAdmin)} 
          onSubmitClick={() => setIsSubmitModalOpen(true)}
          isAdmin={isAdmin} 
        />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-slate-900 text-white pt-20 pb-24 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-900 to-slate-900"></div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Showing latest offers from the last 30 days</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Unlock Premium Tools <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Fresh Deals, Every Day.</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Aggregating the best free trials, promo codes, and student offers. Always verified, always current.
              </p>

              <div className="relative max-w-2xl mx-auto group">
                <input
                  type="text"
                  placeholder="Search current offers (e.g., Cursor, Lovable, Claude)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAIDiscovery()}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-5 pl-14 pr-32 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-sm group-hover:border-slate-600 shadow-2xl"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                <button 
                  onClick={handleAIDiscovery}
                  disabled={isSearching}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-all font-semibold flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Find Latest</span>
                </button>
              </div>
            </div>
          </section>

          {/* Browser Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-20 relative z-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <button
                  onClick={() => setRecentOnly(!recentOnly)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border flex items-center space-x-2 ${recentOnly ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Last 30 Days</span>
                </button>
                <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === 'All' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  All
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2 text-slate-500 text-sm">
                <Filter className="w-4 h-4" />
                <span>Showing {filteredOffers.length} {recentOnly ? 'recent' : ''} offers</span>
              </div>
            </div>

            {isAdmin && (
              <div className="mb-8 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between shadow-inner">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-600 p-2 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-indigo-900">Admin Mode Active</h2>
                    <p className="text-sm text-indigo-700">You can see pending/draft offers and verify them.</p>
                  </div>
                </div>
              </div>
            )}

            {filteredOffers.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No recent offers found</h3>
                <p className="text-slate-500 mb-6">Try searching for something specific or viewing all-time offers.</p>
                <div className="flex justify-center space-x-4">
                   <button 
                    onClick={() => setRecentOnly(false)}
                    className="bg-slate-900 text-white px-6 py-2 rounded-xl font-semibold hover:bg-slate-800 transition-all"
                  >
                    View All Time
                  </button>
                  <button 
                    onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map(offer => (
                  <OfferCard 
                    key={offer.id} 
                    offer={offer} 
                    isAdmin={isAdmin} 
                    onVerify={handleVerify}
                  />
                ))}
              </div>
            )}

            {newOfferLinks.length > 0 && (
              <div className="mt-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
                  <Info className="w-5 h-5 text-indigo-600" />
                  <span>AI Source Verifications</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newOfferLinks.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-between group"
                    >
                      <span className="text-sm text-slate-700 font-medium truncate group-hover:text-indigo-700">{link.title}</span>
                      <LucideExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="bg-slate-900 text-white border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <Zap className="w-6 h-6 text-indigo-400" />
                  <span className="text-2xl font-bold tracking-tight">OfferScout</span>
                </div>
                <p className="text-slate-400 leading-relaxed mb-6">
                  The most up-to-date hub for premium software offers. AI-powered discovery combined with human verification.
                </p>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong>Disclaimer:</strong> Offers are sourced from public domains. Validity is checked frequently but not guaranteed. 
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-slate-200">Fresh Categories</h4>
                <ul className="space-y-4 text-slate-400 text-sm">
                  {CATEGORIES.map(cat => (
                    <li key={cat}><button onClick={() => {setSelectedCategory(cat); setRecentOnly(true);}} className="hover:text-white transition-colors">{cat}</button></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-slate-200">Resources</h4>
                <ul className="space-y-4 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Submit Tool</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Recent Updates</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API for Developers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-slate-500 text-xs">
              <p>© 2024 OfferScout Inc. Focused on the latest deals.</p>
              <div className="flex items-center space-x-6">
                <a href="#" className="hover:text-white transition-colors">X / Twitter</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Submit Offer Modal */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900">Submit Recent Offer</h2>
                <button onClick={() => setIsSubmitModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmitNewOffer} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tool Name</label>
                    <input required name="toolName" placeholder="e.g., Cursor" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select required name="category" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Offer Type</label>
                    <select required name="type" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                      {OFFER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Promo Code (Optional)</label>
                    <input name="promoCode" placeholder="e.g., SAVE50" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Official Source URL</label>
                  <input required name="sourceUrl" type="url" placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea required name="description" rows={3} placeholder="Describe the offer details..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" />
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200">
                    Submit for Instant Verification
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
                    Latest offers are prioritized for review
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
