/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";
import { HEALTH_DATA_CONTEXT } from "../constants";

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
Your goal is to reduce the reflection-to-action gap: help the user convert metrics into immediate next steps and realistic goals.

Guidelines:
- Keep answers very short and interaction-driven (max 55 words).
- Link data to real-world performance (e.g., "Your low HRV suggests your nervous system is taxed; consider active recovery").
- Provide specific recommendations for sleep, training intensity, and nutrition.
- Use a supportive yet high-performance tone.
- Reference the user's current data if they provide it.
- Mention an immediate next step and a forward-looking target naturally (without labels like short-term/long-term).
- End with one reflective question that invites the user to respond.
- Prefer concrete ranges and measurable targets over generic advice.
- If confidence is low, say what extra data would improve the recommendation.

Current User Data Summary:
${HEALTH_DATA_CONTEXT}
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
