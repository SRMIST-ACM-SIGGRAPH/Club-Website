'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type FormData = {
  id?: string; // Present if editing
  full_name: string;
  srm_email: string;
  registration_number: string;
  phone_number: string;
  github_url: string;
  linkedin_url: string;
  domain_preference: string;
  why_join: string;
};

const emptyForm: FormData = {
  full_name: '',
  srm_email: '',
  registration_number: '',
  phone_number: '',
  github_url: '',
  linkedin_url: '',
  domain_preference: '',
  why_join: '',
};

export function ApplicationForm() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  // Dashboard state
  const [existingApps, setExistingApps] = useState<any[]>([]);
  const [isViewingDashboard, setIsViewingDashboard] = useState(false);

  // Form state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchApplications(session.user.id);
      else setIsLoadingAuth(false);
    }).catch(() => {
      setIsLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchApplications(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchApplications = async (userId: string) => {
    setIsLoadingAuth(true);
    try {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setExistingApps(data);
        setIsViewingDashboard(true);
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // 2. Local Storage Sync (only if NOT editing)
  useEffect(() => {
    if (formData.id) return; // Don't override with local storage if editing
    const saved = localStorage.getItem('recruit_form_data');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved form data');
      }
    }
  }, [formData.id]);

  useEffect(() => {
    if (!formData.id) {
      localStorage.setItem('recruit_form_data', JSON.stringify(formData));
    }
  }, [formData]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/join` }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const updateField = (field: keyof FormData, value: string) => {
    if (field === 'phone_number' && value !== '') {
      if (!/^[0-9+\-()\s]*$/.test(value)) return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.full_name.trim()) { newErrors.full_name = "Required"; isValid = false; }
      
      const emailRegex = /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/;
      if (!formData.srm_email.match(emailRegex)) {
        newErrors.srm_email = "Must be a valid @srmist.edu.in email";
        isValid = false;
      }
      
      if (!formData.registration_number.trim()) { newErrors.registration_number = "Required"; isValid = false; }
      if (!formData.phone_number.trim()) { newErrors.phone_number = "Required"; isValid = false; }
    }

    if (currentStep === 3) {
      if (!formData.domain_preference) { newErrors.domain_preference = "Please select a domain"; isValid = false; }
      
      const charCount = formData.why_join.trim().length;
      if (charCount < 50 || charCount > 100) {
        newErrors.why_join = `Must be between 50 and 100 characters (Currently: ${charCount})`;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, 3));
    }
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // Handle form "Enter" key press
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
    } else {
      submitApplication();
    }
  };

  const submitApplication = async () => {
    if (!validateStep(3)) return;
    if (!user) return;

    setIsSubmitting(true);
    
    const payload = {
      user_id: user.id,
      github_email: user.email, // Saves their primary GitHub email
      full_name: formData.full_name,
      srm_email: formData.srm_email,
      registration_number: formData.registration_number,
      phone_number: formData.phone_number,
      github_url: formData.github_url,
      linkedin_url: formData.linkedin_url,
      domain_preference: formData.domain_preference,
      why_join: formData.why_join
    };

    let error;

    if (formData.id) {
      // Editing existing
      const res = await supabase.from('applications').update(payload).eq('id', formData.id);
      error = res.error;
    } else {
      // Inserting new
      const res = await supabase.from('applications').insert([payload]);
      error = res.error;
    }

    setIsSubmitting(false);

    if (error) {
      // If it's a unique constraint error (23505)
      if (error.code === '23505') {
        alert("You have already applied for this domain! Please edit your existing application or choose a different domain.");
      } else {
        alert("Error submitting application: " + error.message);
      }
    } else {
      setIsSuccess(true);
      if (!formData.id) localStorage.removeItem('recruit_form_data');
    }
  };

  const startEdit = (app: any) => {
    setFormData(app);
    setStep(1);
    setIsViewingDashboard(false);
  };

  const startNew = () => {
    setFormData(emptyForm);
    setStep(1);
    setIsViewingDashboard(false);
  };

  if (isLoadingAuth) {
    return <div className="text-center text-white/50 py-12">Loading...</div>;
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-16 p-8 bg-[#050505]/80 backdrop-blur-md border border-[#FF6B1A]/30 rounded-2xl text-center shadow-[0_0_30px_rgba(255,107,26,0.15)]">
        <h2 className="text-3xl font-bold text-white mb-4">Application Saved!</h2>
        <p className="text-white/70 mb-8">
          Thank you for applying to ACM SIGGRAPH SRM. You can track or edit your applications by returning to this page.
        </p>
        <button onClick={() => { setIsSuccess(false); fetchApplications(user!.id); }} className="px-6 py-3 bg-[#FF6B1A] text-black font-bold rounded hover:bg-[#ffaa00] transition-colors">
          View Dashboard
        </button>
      </div>
    );
  }

  // User Dashboard View
  if (isViewingDashboard) {
    const appliedDomains = existingApps.map(app => app.domain_preference);
    const canApplyMore = appliedDomains.length < 4; // 4 total domains

    return (
      <div className="max-w-2xl mx-auto mt-16 p-6 md:p-8 bg-[#050505]/80 backdrop-blur-md border border-white/10 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Your Applications</h2>
          <button onClick={handleSignOut} className="text-sm text-white/50 hover:text-white transition-colors">
            Not you? Sign out
          </button>
        </div>
        <div className="space-y-4 mb-8">
          {existingApps.map((app) => (
            <div key={app.id} className="p-4 border border-white/10 bg-white/5 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="text-lg text-[#FF6B1A] font-bold">{app.domain_preference}</h3>
                <p className="text-white/50 text-sm">Submitted on {new Date(app.created_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => startEdit(app)} className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors text-sm">
                Edit
              </button>
            </div>
          ))}
        </div>
        
        {canApplyMore && (
          <button onClick={startNew} className="w-full py-4 border border-dashed border-[#FF6B1A]/50 text-[#FF6B1A] rounded-xl hover:bg-[#FF6B1A]/10 transition-colors flex justify-center items-center gap-2">
            <span className="text-xl">+</span> Apply for another Domain
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 p-6 md:p-8 bg-[#050505]/80 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden">
      {!user ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-white/60 mb-8">To prevent spam, please authenticate with your GitHub account to start the application.</p>
          <button 
            onClick={handleLogin}
            className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center mx-auto gap-3 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Sign in with GitHub
          </button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white">{formData.id ? 'Edit Application' : 'New Application'}</h2>
              <div className="flex gap-4 mt-1 items-center">
                {existingApps.length > 0 && (
                  <button type="button" onClick={() => setIsViewingDashboard(true)} className="text-[#FF6B1A] text-sm hover:underline">
                    &larr; Back to Dashboard
                  </button>
                )}
                <button type="button" onClick={handleSignOut} className="text-white/50 hover:text-white text-sm transition-colors">
                  Sign out
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full ${step === i ? 'bg-[#FF6B1A]' : step > i ? 'bg-[#FF6B1A]/50' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>

          <div className="min-h-[300px]">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg text-[#FF6B1A] mb-4">Step 1: Personal Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Full Name *</label>
                    <input type="text" autoFocus value={formData.full_name} onChange={e => updateField('full_name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[#FF6B1A]" />
                    {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">SRM Email ID *</label>
                    <input type="email" placeholder="ab1234@srmist.edu.in" value={formData.srm_email} onChange={e => updateField('srm_email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[#FF6B1A]" />
                    {errors.srm_email && <p className="text-red-400 text-xs mt-1">{errors.srm_email}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Registration Number *</label>
                      <input type="text" placeholder="RA..." value={formData.registration_number} onChange={e => updateField('registration_number', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[#FF6B1A]" />
                      {errors.registration_number && <p className="text-red-400 text-xs mt-1">{errors.registration_number}</p>}
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">WhatsApp Number *</label>
                      <input type="tel" value={formData.phone_number} onChange={e => updateField('phone_number', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[#FF6B1A]" />
                      {errors.phone_number && <p className="text-red-400 text-xs mt-1">{errors.phone_number}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg text-[#FF6B1A] mb-4">Step 2: Digital Presence</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">GitHub Profile URL (Optional)</label>
                    <input type="url" autoFocus placeholder="https://github.com/yourusername" value={formData.github_url} onChange={e => updateField('github_url', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[#FF6B1A]" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">LinkedIn Profile URL (Optional)</label>
                    <input type="url" placeholder="https://linkedin.com/in/yourusername" value={formData.linkedin_url} onChange={e => updateField('linkedin_url', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[#FF6B1A]" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg text-[#FF6B1A] mb-4">Step 3: Domain & Intent</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Preferred Domain *</label>
                    <select autoFocus value={formData.domain_preference} onChange={e => updateField('domain_preference', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[#FF6B1A] appearance-none">
                      <option value="" disabled>Select a domain...</option>
                      {/* Hide domains they already applied for unless they are editing this specific application */}
                      {['Web Development', 'Corporate', 'Creatives', 'R&D'].map(domain => {
                        const hasApplied = existingApps.some(app => app.domain_preference === domain);
                        const isCurrentEdit = formData.domain_preference === domain;
                        if (hasApplied && !isCurrentEdit) return null;
                        return <option key={domain} value={domain}>{domain}</option>
                      })}
                    </select>
                    {errors.domain_preference && <p className="text-red-400 text-xs mt-1">{errors.domain_preference}</p>}
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <label className="block text-white/70 text-sm">Why do you want to join? *</label>
                      <span className={`text-xs ${formData.why_join.trim().length < 50 || formData.why_join.trim().length > 100 ? 'text-red-400' : 'text-green-400'}`}>
                        {formData.why_join.trim().length} / 50-100 chars
                      </span>
                    </div>
                    <textarea 
                      rows={5} 
                      value={formData.why_join} 
                      onChange={e => updateField('why_join', e.target.value)} 
                      placeholder="Tell us what you hope to learn, what you can contribute, and why ACM SIGGRAPH interests you."
                      className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[#FF6B1A] resize-none" 
                    />
                    {errors.why_join && <p className="text-red-400 text-xs mt-1">{errors.why_join}</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="px-6 py-2 border border-white/20 text-white rounded hover:bg-white/5 transition-colors">
                Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button type="submit" className="px-6 py-2 bg-white/10 text-white font-bold rounded hover:bg-white/20 transition-colors">
                Next
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#FF6B1A] text-black font-bold rounded hover:bg-[#ffaa00] transition-colors disabled:opacity-50 flex items-center gap-2">
                {isSubmitting ? 'Saving...' : (formData.id ? 'Update Application' : 'Submit Application')}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
