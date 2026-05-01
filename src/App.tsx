/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dashboard } from './components/Dashboard';
import { WelcomePage } from './components/WelcomePage';
import { ThankYouPage } from './components/ThankYouPage';
import { useEffect, useState } from 'react';
import { ChatMessage, ParticipantProfile } from './types';

type AppStep = 'welcome' | 'dashboard' | 'thankyou';

export default function App() {
  const [step, setStep] = useState<AppStep>('welcome');
  const [participantProfile, setParticipantProfile] = useState<ParticipantProfile | null>(null);
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div className="min-h-[100dvh] bg-brand-bg overflow-x-hidden" id="app-root">
      {step === 'welcome' && <WelcomePage onContinue={() => setStep('dashboard')} />}
      {step === 'dashboard' && (
        <Dashboard
          participantProfile={participantProfile}
          onTranscriptChange={setTranscript}
          onCompleteStudy={() => setStep('thankyou')}
        />
      )}
      {step === 'thankyou' && (
        <ThankYouPage
          participantProfile={participantProfile}
          transcript={transcript}
          onRestart={() => {
            setParticipantProfile(null);
            setTranscript([]);
            setStep('welcome');
          }}
        />
      )}
    </div>
  );
}
