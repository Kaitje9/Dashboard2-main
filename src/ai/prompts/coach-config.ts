import systemPrompt from "./coach-system.md?raw";

export const coachConfig = {
  systemPrompt,
  model: "claude-sonnet-4-5",
  temperature: 0.7,
  maxTokens: 600,
  features: {
    socraticMode: false,
    showReasoning: false,
    citeDays: true,
  },
};

export type CoachConfig = typeof coachConfig;
