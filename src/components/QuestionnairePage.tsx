import { useState } from "react";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { ParticipantProfile } from "../types";

interface QuestionnairePageProps {
  onSubmit: (profile: ParticipantProfile) => void;
  onBack: () => void;
}

const DEFAULT_PROFILE: ParticipantProfile = {
  firstName: "",
  ageRange: "",
  gender: "",
  primarySports: "",
  weeklySleepQuality: "",
  activityLevel: "",
  recoveryFeeling: "",
  currentGoal: "",
};

export function QuestionnairePage({ onSubmit, onBack }: QuestionnairePageProps) {
  const [profile, setProfile] = useState<ParticipantProfile>(DEFAULT_PROFILE);

  const updateProfile = (field: keyof ParticipantProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const isValid =
    profile.ageRange &&
    profile.primarySports &&
    profile.weeklySleepQuality &&
    profile.activityLevel &&
    profile.recoveryFeeling &&
    profile.currentGoal;

  return (
    <div className="min-h-[100dvh] bg-brand-bg text-brand-text px-6 py-8 md:py-12">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto rounded-[28px] border border-brand-border bg-brand-card p-8 md:p-10"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-accent mb-3">
          Participant Intake
        </p>
        <h2 className="text-2xl md:text-3xl font-light text-brand-text mb-6">Quick baseline questionnaire</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="First name (optional)">
            <input
              value={profile.firstName}
              onChange={e => updateProfile("firstName", e.target.value)}
              className="input-field"
              placeholder="Alex"
            />
          </Field>
          <Field label="Age range *">
            <select
              value={profile.ageRange}
              onChange={e => updateProfile("ageRange", e.target.value)}
              className="input-field"
            >
              <option value="">Select...</option>
              <option>18-24</option>
              <option>25-34</option>
              <option>35-44</option>
              <option>45-54</option>
              <option>55+</option>
            </select>
          </Field>
          <Field label="Gender identity (optional)">
            <input
              value={profile.gender}
              onChange={e => updateProfile("gender", e.target.value)}
              className="input-field"
              placeholder="Optional"
            />
          </Field>
          <Field label="Primary sport(s) *">
            <input
              value={profile.primarySports}
              onChange={e => updateProfile("primarySports", e.target.value)}
              className="input-field"
              placeholder="Running, strength training..."
            />
          </Field>
          <Field label="How did you sleep this week? *">
            <select
              value={profile.weeklySleepQuality}
              onChange={e => updateProfile("weeklySleepQuality", e.target.value)}
              className="input-field"
            >
              <option value="">Select...</option>
              <option>Poor and inconsistent</option>
              <option>Below average</option>
              <option>Average</option>
              <option>Good</option>
              <option>Very good and consistent</option>
            </select>
          </Field>
          <Field label="Current activity level *">
            <select
              value={profile.activityLevel}
              onChange={e => updateProfile("activityLevel", e.target.value)}
              className="input-field"
            >
              <option value="">Select...</option>
              <option>Low (1-2 sessions/week)</option>
              <option>Moderate (3-4 sessions/week)</option>
              <option>High (5-6 sessions/week)</option>
              <option>Very high (daily training)</option>
            </select>
          </Field>
          <Field label="How recovered do you feel today? *">
            <select
              value={profile.recoveryFeeling}
              onChange={e => updateProfile("recoveryFeeling", e.target.value)}
              className="input-field"
            >
              <option value="">Select...</option>
              <option>Very low</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Very high</option>
            </select>
          </Field>
          <Field label="Main goal for the next month *">
            <input
              value={profile.currentGoal}
              onChange={e => updateProfile("currentGoal", e.target.value)}
              className="input-field"
              placeholder="Improve 5k time, better sleep consistency..."
            />
          </Field>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3 rounded-xl border border-brand-border text-xs uppercase tracking-[0.14em] font-black text-brand-muted hover:text-brand-text transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            disabled={!isValid}
            onClick={() => onSubmit(profile)}
            className="px-6 py-3 rounded-xl bg-brand-accent text-black text-xs uppercase tracking-[0.14em] font-black disabled:opacity-40"
          >
            Continue to Dashboard
          </button>
        </div>
      </motion.section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.12em] font-black text-brand-muted">{label}</span>
      {children}
    </label>
  );
}
