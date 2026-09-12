'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { InlineWidget } from 'react-calendly';
import bookingConfig from './booking-config.json';
import Link from 'next/link';

type Application = {
  id: string;
  domain_preference: string;
  full_name: string;
  srm_email: string;
};

export default function InterviewBookingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Auth state
  const [authStep, setAuthStep] = useState<'email' | 'otp'>('email');
  const [authEmail, setAuthEmail] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        // Fetch user's applications
        const { data, error } = await supabase
          .from('applications')
          .select('id, domain_preference, full_name, srm_email')
          .eq('user_id', session.user.id);
          
        if (!error && data) {
          setApplications(data);
          if (data.length > 0) {
            setSelectedDomain(data[0].domain_preference);
          }
        }
      }
      setIsLoading(false);
    };
    
    checkAuthAndFetchData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        // We'll let the initial fetch handle it, but if they just logged in we might need to fetch again
        // For simplicity, we just rely on initial page load state.
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail.trim().endsWith('@srmist.edu.in')) {
      setAuthError('Only @srmist.edu.in email addresses are allowed.');
      return;
    }
    setIsSendingOtp(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: authEmail.trim(),
    });
    setIsSendingOtp(false);
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authOtp || authOtp.length !== 6) {
      setAuthError('Please enter a valid 6-digit code.');
      return;
    }
    setIsVerifyingOtp(true);
    const { error } = await supabase.auth.verifyOtp({
      email: authEmail.trim(),
      token: authOtp.trim(),
      type: 'email'
    });
    setIsVerifyingOtp(false);
    if (error) {
      setAuthError(error.message);
    }
    // No need to set user here, the onAuthStateChange listener handles it
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF6B1A]/20 border-t-[#FF6B1A] rounded-full animate-spin" />
      </div>
    );
  }

  // Unauthenticated State (Popup styled as an overlay or card)
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center pt-32 pb-20 px-4 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 bg-[#050505]/90 backdrop-blur-xl border border-white/10 rounded-2xl text-center shadow-2xl relative z-10"
        >
          <div className="w-16 h-16 bg-[#FF6B1A]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#FF6B1A]/30">
            <svg className="w-8 h-8 text-[#FF6B1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-white/60 mb-6 text-sm">
            Enter your SRMIST email to log in and book your slot.
          </p>
          
          {authStep === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-left">
              <div>
                <input 
                  type="email" 
                  placeholder="ab1234@srmist.edu.in" 
                  value={authEmail} 
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#FF6B1A] transition-colors"
                  required
                />
              </div>
              {authError && <p className="text-red-400 text-sm">{authError}</p>}
              <button 
                type="submit" 
                disabled={isSendingOtp || !authEmail}
                className="w-full py-4 bg-[#FF6B1A] text-black font-bold rounded-xl hover:bg-[#ffaa00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingOtp ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/60">Sent to {authEmail}</span>
                <button type="button" onClick={() => setAuthStep('email')} className="text-xs text-[#FF6B1A] hover:underline">Change</button>
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit code" 
                  value={authOtp} 
                  onChange={(e) => setAuthOtp(e.target.value)}
                  maxLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#FF6B1A] text-center tracking-widest text-xl transition-colors"
                  required
                />
              </div>
              {authError && <p className="text-red-400 text-sm">{authError}</p>}
              <button 
                type="submit" 
                disabled={isVerifyingOtp || authOtp.length !== 6}
                className="w-full py-4 bg-[#FF6B1A] text-black font-bold rounded-xl hover:bg-[#ffaa00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifyingOtp ? 'Verifying...' : 'Verify & Login'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  // No applications found
  if (applications.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-md text-center p-8 border border-white/10 bg-white/5 rounded-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-2">No Applications Found</h2>
          <p className="text-white/60 mb-6">
            We couldn't find any submitted applications for your account. Please apply first.
          </p>
          <Link href="/join" className="inline-block px-6 py-2 bg-[#FF6B1A] text-black font-bold rounded-lg hover:bg-[#ffaa00] transition-colors">
            Go to Application Form
          </Link>
        </div>
      </div>
    );
  }

  // Find the selected application details to prefill Calendly
  const currentApp = applications.find(a => a.domain_preference === selectedDomain) || applications[0];
  const calendlyUrl = (bookingConfig.domains as Record<string, string>)[selectedDomain];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Interview Dashboard</h2>
            <p className="text-sm text-white/50 mt-1">Logged in as {user.email}</p>
          </div>
          <button 
            type="button" 
            onClick={handleSignOut} 
            className="text-white/50 hover:text-white text-sm transition-colors px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5"
          >
            Sign out
          </button>
        </div>

        <div className="mb-10 text-center mt-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Schedule Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B1A] to-[#ffaa00]">Interview</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Select an available time slot for your domain panel. Please ensure you are ready 5 minutes before your scheduled time.
          </p>
        </div>

        {applications.length > 1 && (
          <div className="max-w-md mx-auto mb-10 relative z-20">
            <label className="block text-sm font-medium text-white/70 mb-2">Select Domain</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-left text-white focus:outline-none focus:border-[#FF6B1A] flex justify-between items-center transition-colors hover:border-white/30"
              >
                <span className="font-medium">{selectedDomain}</span>
                <svg className={`w-5 h-5 text-white/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    {applications.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => {
                          setSelectedDomain(app.domain_preference);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors ${selectedDomain === app.domain_preference ? 'text-[#FF6B1A] bg-[#FF6B1A]/5' : 'text-white'}`}
                      >
                        {app.domain_preference}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,107,26,0.05)] relative z-10">
          {!calendlyUrl ? (
            <div className="p-12 text-center text-white/60">
              Scheduling is not yet open for {selectedDomain}. Please check back later!
            </div>
          ) : (
            <div className="h-[700px] w-full">
              <InlineWidget
                url={calendlyUrl}
                styles={{ height: '100%', width: '100%' }}
                prefill={{
                  name: currentApp.full_name,
                  email: currentApp.srm_email,
                }}
                pageSettings={{
                  backgroundColor: '050505',
                  hideEventTypeDetails: false,
                  hideLandingPageDetails: false,
                  primaryColor: 'FF6B1A',
                  textColor: 'ffffff',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
