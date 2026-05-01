import { useState } from "react";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { ParticipantProfile } from "../types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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
    <div className="min-h-[100dvh] bg-brand-bg text-brand-text px-3 md:px-4 py-5 md:py-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl mx-auto"
      >
        <Card>
          <CardHeader className="space-y-3">
            <Badge variant="secondary" className="w-fit">Participant Intake</Badge>
            <CardTitle className="text-2xl md:text-3xl">Quick baseline questionnaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="First name (optional)">
            <Input
              value={profile.firstName}
              onChange={e => updateProfile("firstName", e.target.value)}
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
            <Input
              value={profile.gender}
              onChange={e => updateProfile("gender", e.target.value)}
              placeholder="Optional"
            />
          </Field>
          <Field label="Primary sport(s) *">
            <Input
              value={profile.primarySports}
              onChange={e => updateProfile("primarySports", e.target.value)}
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
            <Input
              value={profile.currentGoal}
              onChange={e => updateProfile("currentGoal", e.target.value)}
              placeholder="Improve 5k time, better sleep consistency..."
            />
          </Field>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-brand-border pt-5">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
          >
            Back
          </Button>
          <Button
            type="button"
            disabled={!isValid}
            onClick={() => {
              const activeElement = document.activeElement as HTMLElement | null;
              activeElement?.blur();
              onSubmit(profile);
            }}
          >
            Continue to Dashboard
          </Button>
        </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
