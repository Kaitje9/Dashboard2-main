import { motion } from "motion/react";
import { ChatMessage, ParticipantProfile } from "../types";

interface ThankYouPageProps {
  participantProfile: ParticipantProfile | null;
  transcript: ChatMessage[];
  onRestart: () => void;
}

export function ThankYouPage({ participantProfile, transcript, onRestart }: ThankYouPageProps) {
  const timestamp = new Date().toISOString();

  const downloadJson = () => {
    const payload = {
      exportedAt: timestamp,
      participantProfile,
      transcript,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    triggerDownload(blob, "study-session-export.json");
  };

  const downloadTranscriptTxt = () => {
    const body = transcript
      .map((message, index) => `${index + 1}. [${message.role.toUpperCase()}] ${message.text}`)
      .join("\n\n");
    const blob = new Blob([body || "No chat transcript available."], { type: "text/plain;charset=utf-8" });
    triggerDownload(blob, "chat-transcript.txt");
  };

  const downloadQuestionnaireTxt = () => {
    if (!participantProfile) {
      const blob = new Blob(["No questionnaire data available."], { type: "text/plain;charset=utf-8" });
      triggerDownload(blob, "questionnaire-results.txt");
      return;
    }

    const lines = [
      `Name: ${participantProfile.firstName || "Not provided"}`,
      `Age range: ${participantProfile.ageRange}`,
      `Gender: ${participantProfile.gender || "Not provided"}`,
      `Primary sports: ${participantProfile.primarySports}`,
      `Weekly sleep quality: ${participantProfile.weeklySleepQuality}`,
      `Activity level: ${participantProfile.activityLevel}`,
      `Recovery feeling: ${participantProfile.recoveryFeeling}`,
      `Current goal: ${participantProfile.currentGoal}`,
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    triggerDownload(blob, "questionnaire-results.txt");
  };

  return (
    <div className="min-h-[100dvh] bg-brand-bg text-brand-text px-6 py-10 flex items-center justify-center">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl rounded-2xl border border-brand-border bg-brand-card p-8 md:p-10 shadow-sm"
      >
        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-accent mb-2">Thank You</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-brand-text mb-3">Thanks for participating!</h1>
        <p className="text-sm text-brand-muted leading-relaxed mb-6">
          You can now download your questionnaire responses and the chatbot conversation transcript for your research records.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <button type="button" onClick={downloadQuestionnaireTxt} className="px-4 py-2.5 rounded-lg border border-brand-border text-sm font-medium text-brand-text hover:bg-slate-50 transition-colors">
            Download Questionnaire
          </button>
          <button type="button" onClick={downloadTranscriptTxt} className="px-4 py-2.5 rounded-lg border border-brand-border text-sm font-medium text-brand-text hover:bg-slate-50 transition-colors">
            Download Transcript
          </button>
          <button type="button" onClick={downloadJson} className="px-4 py-2.5 rounded-lg bg-brand-accent text-white text-sm font-medium">
            Download Full JSON
          </button>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onRestart}
            className="px-4 py-2.5 rounded-lg border border-brand-border text-sm font-medium text-brand-muted hover:text-brand-text hover:bg-slate-50 transition-colors"
          >
            Start New Participant
          </button>
        </div>
      </motion.section>
    </div>
  );
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
