import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-green-500 rounded p-1.5 flex items-center justify-center">
               <Box className="w-5 h-5 text-white" strokeWidth={2.5}/>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">LivestockIQ</span>
          </Link>
          {/* <div className="hidden md:flex flex-1 justify-center items-center gap-10">
             <a href="#how-it-works" className="text-gray-600 hover:text-green-500 font-medium transition-colors">How It Works</a>
             <a href="#features" className="text-gray-600 hover:text-green-500 font-medium transition-colors">Features</a>
             <a href="#pricing" className="text-gray-600 hover:text-green-500 font-medium transition-colors">Pricing</a>
             <a href="#resources" className="text-gray-600 hover:text-green-500 font-medium transition-colors">Resources</a>
          </div> */}
          <div className="flex items-center gap-6">
             <Link to="/login" className="text-gray-700 font-medium hover:text-slate-900 transition-colors">Log In</Link>
             <Link to="/estimate" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm">Start Free Estimation</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
