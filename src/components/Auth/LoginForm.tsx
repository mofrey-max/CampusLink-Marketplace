import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Sparkles
} from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'access',
      label: 'Access',
      title: 'Choose your account access',
      description: 'Start with your email or load a demo account instantly.'
    },
    {
      id: 'security',
      label: 'Security',
      title: 'Complete secure sign in',
      description: 'Confirm your password to enter your CampusLink workspace.'
    }
  ];

  const demoAccounts = [
    {
      id: 'student',
      label: 'Student',
      email: 'john.doe@university.edu',
      password: 'password123',
      tone: 'from-cyan-500 to-sky-500'
    },
    {
      id: 'expert',
      label: 'Expert',
      email: 'sarah.chen@gmail.com',
      password: 'expert123',
      tone: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'institution',
      label: 'Institution',
      email: 'admin@techuniversity.com',
      password: 'admin123',
      tone: 'from-violet-500 to-fuchsia-500'
    },
    {
      id: 'admin',
      label: 'Super Admin',
      email: 'admin@campuslink.com',
      password: 'admin123',
      tone: 'from-rose-500 to-orange-400'
    }
  ] as const;

  const activeStep = steps[currentStep];

  const emailLooksValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );

  const handleNextStep = () => {
    if (!emailLooksValid) {
      setError('Enter a valid email address to continue.');
      return;
    }

    setError('');
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 0) {
      handleNextStep();
      return;
    }
    
    try {
      setError('');
      setIsLoading(true);
      const result = await onLogin(email, password);

      if (!result.success) {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login form error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (userType: 'student' | 'expert' | 'institution' | 'admin') => {
    try {
      switch (userType) {
        case 'student':
          setEmail('john.doe@university.edu');
          setPassword('password123');
          break;
        case 'expert':
          setEmail('sarah.chen@gmail.com');
          setPassword('expert123');
          break;
        case 'institution':
          setEmail('admin@techuniversity.com');
          setPassword('admin123');
          break;
        case 'admin':
          setEmail('admin@campuslink.com');
          setPassword('admin123');
          break;
      }

      setError('');
      setCurrentStep(1);
    } catch (error) {
      console.error('Error filling demo credentials:', error);
      setError('Failed to fill demo credentials');
    }
  };

  return (
    <div className="min-h-screen futuristic-app px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="glass-panel neo-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(116,87,255,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(40,212,255,0.16),transparent_32%)]" />
            <div className="relative space-y-8">
              <div className="inline-flex h-14 w-14 items-center justify-center bg-gradient-to-r from-violet-600 to-cyan-500 text-lg font-bold text-white glow-ring shadow-[0_0_28px_rgba(104,82,255,0.28)]">
                CL
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                  <Sparkles className="h-4 w-4" />
                  Future access
                </div>
                <div>
                  <h1 className="max-w-lg text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl text-neon">
                    Welcome back to CampusLink
                  </h1>
                  <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
                    A cleaner sign-in flow with guided steps, glassmorphism surfaces, and instant demo access for every account type.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/70 bg-white/72 p-5 shadow-[0_18px_40px_rgba(130,148,184,0.16)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">Guided flow</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">2 steps</p>
                  <p className="mt-2 text-sm text-slate-600">
                    First verify account access, then confirm secure entry.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/72 p-5 shadow-[0_18px_40px_rgba(130,148,184,0.16)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600">Secure lane</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">Glass UI</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Light-themed panels, subtle glow, and focused security cues.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Demo access</h2>
                  <span className="text-xs text-slate-500">Tap once to load credentials</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => fillDemoCredentials(account.id)}
                      className="group rounded-3xl border border-white/70 bg-white/72 p-4 text-left transition-all hover:-translate-y-1 hover:bg-white shadow-[0_16px_34px_rgba(130,148,184,0.15)]"
                    >
                      <div className={`mb-3 h-2 w-24 rounded-full bg-gradient-to-r ${account.tone}`} />
                      <p className="font-semibold text-slate-900">{account.label}</p>
                      <p className="mt-1 text-sm text-slate-500">{account.email}</p>
                      <p className="mt-3 text-xs font-medium text-cyan-700">Load demo and continue</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="glass-panel-strong neo-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.12))]" />
            <div className="relative">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {activeStep.label}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">{activeStep.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{activeStep.description}</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/72 px-4 py-3 text-right shadow-[0_12px_28px_rgba(130,148,184,0.14)]">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Progress</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">{currentStep + 1}/2</p>
                </div>
              </div>

              <div className="mb-8 flex items-center gap-3">
                {steps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isComplete = index < currentStep;

                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-semibold transition-all ${
                            isComplete
                              ? 'border-cyan-200 bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_12px_24px_rgba(96,165,250,0.24)]'
                              : isActive
                                ? 'border-violet-200 bg-violet-50 text-violet-700 shadow-[0_12px_24px_rgba(124,92,255,0.12)]'
                                : 'border-slate-200 bg-white/70 text-slate-400'
                          }`}
                        >
                          {isComplete ? <Check className="h-4 w-4" /> : `0${index + 1}`}
                        </div>
                        <div className="hidden sm:block">
                          <p className={`text-sm font-medium ${isActive || isComplete ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.title}
                          </p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`h-px flex-1 ${index < currentStep ? 'bg-gradient-to-r from-violet-400 to-cyan-400' : 'bg-slate-200'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 0 ? (
                  <div className="space-y-5">
                    <div className="rounded-3xl border border-white/70 bg-white/74 p-5 shadow-[0_16px_34px_rgba(130,148,184,0.12)]">
                      <label className="mb-3 block text-sm font-semibold text-slate-700">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white/80 py-4 pl-12 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
                          placeholder="Enter your CampusLink email"
                          required
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <Shield className="h-4 w-4 text-cyan-600" />
                        Your email routes you to the right workspace and dashboard.
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-violet-50/80 to-cyan-50/80 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Quick access hint</p>
                          <p className="mt-1 text-sm text-slate-600">
                            Use a demo account on the left, or continue with your own address.
                          </p>
                        </div>
                        {emailLooksValid && (
                          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
                            <Check className="h-4 w-4" />
                            Email looks good
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="rounded-3xl border border-white/70 bg-white/74 p-5 shadow-[0_16px_34px_rgba(130,148,184,0.12)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Account</p>
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                        <div>
                          <p className="text-sm text-slate-500">Signing in as</p>
                          <p className="font-semibold text-slate-900 break-all">{email || 'No email selected yet'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(0)}
                          className="text-sm font-medium text-cyan-700 hover:text-cyan-800"
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/70 bg-white/74 p-5 shadow-[0_16px_34px_rgba(130,148,184,0.12)]">
                      <label className="mb-3 block text-sm font-semibold text-slate-700">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white/80 py-4 pl-12 pr-12 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <Shield className="h-4 w-4 text-violet-600" />
                        Password is checked only when you submit this final step.
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    {currentStep > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setError('');
                          setCurrentStep(0);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 font-medium text-slate-700 transition-colors hover:bg-white"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                    )}
                    {currentStep === 0 ? (
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 font-semibold text-white transition-all hover:from-violet-500 hover:to-cyan-400 neon-button"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 font-semibold text-white transition-all hover:from-violet-500 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 neon-button"
                      >
                        {isLoading ? (
                          <>
                            <span className="h-4 w-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign in
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-slate-600">
                    New to CampusLink?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToRegister}
                      className="font-semibold text-violet-700 hover:text-violet-800"
                    >
                      Create an account
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
