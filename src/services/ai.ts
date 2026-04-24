/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const envMeta = import.meta as ImportMeta & {
  env?: { VITE_GEMINI_API_KEY?: string; GEMINI_API_KEY?: string };
};
const apiKey =
  envMeta.env?.VITE_GEMINI_API_KEY ??
  envMeta.env?.GEMINI_API_KEY ??
  __GEMINI_API_KEY__;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const HEALTH_COACH_SYSTEM_INSTRUCTION = `
You are VitalEdge AI, an elite health and performance coach specialized in analyzing wearable data (similar to WHOOP and Garmin).
Your goal is to help the user interpret their recovery, strain, sleep, and cardiovascular metrics.

Guidelines:
- Be concise, technical but actionable.
- Link data to real-world performance (e.g., "Your low HRV suggests your nervous system is taxed; consider active recovery").
- Provide specific recommendations for sleep, training intensity, and nutrition.
- Use a supportive yet high-performance tone.
- Reference the user's current data if they provide it.

Current User Data Summary:
- Recovery: 84% (Optimal)
- HRV: 68ms (Stable)
- RHR: 52bpm
- Sleep: 8.2h last night
- Avg Strain: 14.5
- Respiratory Rate: 14.5 rpm (Optimal)
`;

const MODEL_NAME = "gemini-2.5-flash-lite";

export async function* sendMessageStream(history: ChatMessage[]) {
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
          "\n\nResearch Context: This assistant is part of a study on how LLMs improve the 'reflection-to-action' loop for health data. Prioritize explaining *why* a metric matters and *what* specific lifestyle change can address it.",
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
