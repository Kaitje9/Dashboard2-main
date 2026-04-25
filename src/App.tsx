/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dashboard } from './components/Dashboard';
import { WelcomePage } from './components/WelcomePage';
import { QuestionnairePage } from './components/QuestionnairePage';
import { useEffect, useState } from 'react';
import { ParticipantProfile } from './types';

type AppStep = 'welcome' | 'questionnaire' | 'dashboard';

export default function App() {
  const [step, setStep] = useState<AppStep>('welcome');
  const [participantProfile, setParticipantProfile] = useState<ParticipantProfile | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem('theme');
    return stored === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-brand-bg" id="app-root">
      <button
        type="button"
        onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
        className="fixed top-4 right-4 z-[70] px-4 py-2 rounded-xl border border-brand-border bg-brand-card text-brand-text text-[10px] uppercase tracking-[0.14em] font-black"
      >
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>
      {step === 'welcome' && <WelcomePage onContinue={() => setStep('questionnaire')} />}
      {step === 'questionnaire' && (
        <QuestionnairePage
          onBack={() => setStep('welcome')}
          onSubmit={(profile) => {
            setParticipantProfile(profile);
            setStep('dashboard');
          }}
        />
      )}
      {step === 'dashboard' && <Dashboard participantProfile={participantProfile} />}
    </div>
  );
}
