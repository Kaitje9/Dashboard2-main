/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { ChatMessage, ParticipantProfile } from "../types";
import { HEALTH_DATA_CONTEXT } from "../constants";
import { coachConfig } from "../ai/prompts/coach-config";

const envMeta = import.meta as ImportMeta & {
  env?: { VITE_GEMINI_API_KEY?: string; GEMINI_API_KEY?: string };
};
const apiKey =
  envMeta.env?.VITE_GEMINI_API_KEY ??
  envMeta.env?.GEMINI_API_KEY ??
  __GEMINI_API_KEY__;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const HEALTH_COACH_SYSTEM_INSTRUCTION = `
${coachConfig.systemPrompt}

Current User Data Summary:
${HEALTH_DATA_CONTEXT}
`;

const MODEL_NAME = "gemini-2.5-flash-lite";

function buildParticipantContext(profile: ParticipantProfile | null) {
  if (!profile) return "";

  return `
Participant Profile:
- Name: ${profile.firstName || "Not provided"}
- Age range: ${profile.ageRange}
- Gender: ${profile.gender || "Not provided"}
- Primary sports: ${profile.primarySports}
- Weekly sleep quality (self-report): ${profile.weeklySleepQuality}
- Activity level: ${profile.activityLevel}
- Current recovery feeling: ${profile.recoveryFeeling}
- Main goal: ${profile.currentGoal}
`.trim();
}

export async function* sendMessageStream(
  history: ChatMessage[],
  participantProfile: ParticipantProfile | null = null
) {
  if (!ai) {
    yield "AI is not configured yet. Add `VITE_GEMINI_API_KEY` to your `.env.local` file and restart the dev server.";
    return;
  }

  try {
    const chatHistory = history.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction:
          HEALTH_COACH_SYSTEM_INSTRUCTION +
          `\n\n${buildParticipantContext(participantProfile)}` +
          "\n\nResponse style:\n- 2-3 concise lines in natural language.\n- No section headings unless user asks.\n- Include one specific action and one measurable target.\n- Finish with one reflective question.\n\nResearch Context: This assistant is part of a study on how LLMs improve the reflection-to-action loop for health data. Prioritize explaining why a metric matters and what specific lifestyle change can address it.",
      },
      history: chatHistory,
    });

    const lastMessage = history[history.length - 1].text;
    const result = await chat.sendMessageStream({ message: lastMessage });
    for await (const chunk of result) {
      const chunkText = chunk.text;
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error while contacting Gemini.";
    console.error("Gemini request failed:", error);
    yield `Connection issue. Pulse AI offline.\n\nDetails: ${message}`;
  }
}
