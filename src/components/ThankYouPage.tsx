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
        className="w-full max-w-3xl rounded-[28px] border border-brand-border bg-brand-card p-8 md:p-10"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-accent mb-3">Thank You</p>
        <h1 className="text-3xl md:text-4xl font-light text-brand-text mb-4">Thanks for participating!</h1>
        <p className="text-sm text-brand-muted leading-relaxed mb-6">
          You can now download your questionnaire responses and the chatbot conversation transcript for your research records.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button type="button" onClick={downloadQuestionnaireTxt} className="px-4 py-3 rounded-xl border border-brand-border text-xs uppercase tracking-[0.12em] font-black text-brand-text">
            Download Questionnaire
          </button>
          <button type="button" onClick={downloadTranscriptTxt} className="px-4 py-3 rounded-xl border border-brand-border text-xs uppercase tracking-[0.12em] font-black text-brand-text">
            Download Transcript
          </button>
          <button type="button" onClick={downloadJson} className="px-4 py-3 rounded-xl bg-brand-accent text-black text-xs uppercase tracking-[0.12em] font-black">
            Download Full JSON
          </button>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onRestart}
            className="px-5 py-3 rounded-xl border border-brand-border text-xs uppercase tracking-[0.12em] font-black text-brand-muted hover:text-brand-text transition-colors"
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
