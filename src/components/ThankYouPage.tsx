import { motion } from "motion/react";
import { ChatMessage, ParticipantProfile } from "../types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

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
    <div className="min-h-[100dvh] bg-brand-bg text-brand-text px-3 md:px-4 py-6 flex items-center justify-center">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl"
      >
        <Card>
          <CardHeader className="space-y-3">
            <Badge variant="secondary" className="w-fit">Session Completed</Badge>
            <CardTitle className="text-3xl md:text-4xl">Thanks for participating</CardTitle>
            <CardDescription>
              Download questionnaire results and conversation transcripts for your research records.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button type="button" variant="outline" onClick={downloadQuestionnaireTxt}>Download Questionnaire</Button>
              <Button type="button" variant="outline" onClick={downloadTranscriptTxt}>Download Transcript</Button>
              <Button type="button" onClick={downloadJson}>Download Full JSON</Button>
            </div>

            <div className="flex justify-end border-t border-brand-border pt-5">
              <Button type="button" variant="secondary" onClick={onRestart}>Start New Participant</Button>
            </div>
          </CardContent>
        </Card>
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
