/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dashboard } from './components/Dashboard';
import { WelcomePage } from './components/WelcomePage';
import { QuestionnairePage } from './components/QuestionnairePage';
import { useState } from 'react';
import { ParticipantProfile } from './types';

type AppStep = 'welcome' | 'questionnaire' | 'dashboard';

export default function App() {
  const [step, setStep] = useState<AppStep>('welcome');
  const [participantProfile, setParticipantProfile] = useState<ParticipantProfile | null>(null);

  return (
    <div className="min-h-screen bg-[#050505]" id="app-root">
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
