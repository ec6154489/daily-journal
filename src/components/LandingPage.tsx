import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PenLine, Shield, Sparkles } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight">
          Capture your thoughts, <br />
          <span className="italic text-stone-500">one day at a time.</span>
        </h1>
        <p className="text-lg text-stone-600 mb-10 leading-relaxed">
          A simple, secure, and beautiful space for your daily reflections. 
          Start your journaling journey today and preserve your memories forever.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/signup"
            className="px-8 py-4 bg-stone-800 text-white font-medium rounded-full hover:bg-stone-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Writing for Free
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-white border border-stone-200 text-stone-800 font-medium rounded-full hover:bg-stone-50 transition-all"
          >
            Welcome Back
          </Link>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mt-12 w-full">
        <div className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm">
          <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Shield className="w-6 h-6 text-stone-700" />
          </div>
          <h3 className="font-bold text-stone-900 mb-2">Private & Secure</h3>
          <p className="text-sm text-stone-600">Your entries are for your eyes only, protected with industry-standard encryption.</p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm">
          <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <PenLine className="w-6 h-6 text-stone-700" />
          </div>
          <h3 className="font-bold text-stone-900 mb-2">Simple Writing</h3>
          <p className="text-sm text-stone-600">A distraction-free interface designed to help you focus on what matters: your thoughts.</p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm">
          <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Sparkles className="w-6 h-6 text-stone-700" />
          </div>
          <h3 className="font-bold text-stone-900 mb-2">Beautiful Design</h3>
          <p className="text-sm text-stone-600">A warm, organic aesthetic that makes journaling a delightful daily ritual.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
