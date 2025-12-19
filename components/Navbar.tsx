
import React from 'react';
import { Search, ShieldCheck, PlusCircle, LayoutGrid, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onAdminClick: () => void;
  onSubmitClick: () => void;
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick, onSubmitClick, isAdmin }) => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">OfferScout</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Browse</Link>
            <button onClick={onSubmitClick} className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              <PlusCircle className="w-4 h-4" />
              <span>Submit Offer</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onAdminClick}
              className={`p-2 rounded-full transition-colors ${isAdmin ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
              title="Admin Dashboard"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
            <div className="h-6 w-[1px] bg-slate-200"></div>
            <button className="hidden sm:block px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
