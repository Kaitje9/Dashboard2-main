/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, SendHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, ParticipantProfile } from '../types';
import { INITIAL_AI_GREETING } from '../constants';
import { sendMessageStream } from '../services/ai';
import { Button } from './ui/button';

interface AIPanelProps {
  participantProfile: ParticipantProfile | null;
  activeTab: "today" | "recovery" | "sleep" | "activity";
  onTranscriptChange?: (messages: ChatMessage[]) => void;
}

export function AIPanel({ participantProfile, activeTab, onTranscriptChange }: AIPanelProps) {
  const greeting = participantProfile?.firstName
    ? `Hi ${participantProfile.firstName}, ${INITIAL_AI_GREETING}`
    : INITIAL_AI_GREETING;
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: greeting }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [messages, isLoading]);

  useEffect(() => {
    onTranscriptChange?.(messages);
  }, [messages, onTranscriptChange]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const newMessages = [...messages, userMessage];
      let assistantResponse = '';
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      scrollToBottom('auto');

      const stream = sendMessageStream(newMessages, participantProfile, activeTab);
      for await (const chunk of stream) {
        assistantResponse += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          const rest = prev.slice(0, -1);
          return [...rest, { ...last, text: assistantResponse }];
        });
        requestAnimationFrame(() => scrollToBottom('auto'));
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Connection issue. Pulse AI offline.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent" id="ai-panel">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <AnimatePresence>
          {messages.map((msg, i) => (
            (() => {
              const isModel = msg.role === 'model';
              const isStreamingBubble = isModel && isLoading && i === messages.length - 1;
              return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.role === 'model' && (
                <span className="text-[10px] text-brand-muted">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <div className={`max-w-[100%] p-3 transition-all duration-200 ${
                msg.role === 'user'
                  ? 'bg-brand-accent text-[#1f1814] rounded-xl rounded-tr-sm text-[12px] leading-[1.4] font-medium'
                  : `text-brand-text rounded-lg rounded-tl-sm border border-brand-border ${
                      isStreamingBubble ? 'bg-[#3a404b]' : 'bg-[var(--surface-raised)]'
                    }`
              }`}>
                <div className="markdown-body chat-markdown text-[13px] leading-[1.5]">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
              );
            })()
          ))}
          {isLoading && !messages[messages.length - 1].text && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
              <div className="bg-[#343944] p-2.5 rounded-lg rounded-tl-sm border border-brand-border flex items-center gap-2">
                <Loader2 className="w-3 h-3 text-brand-muted animate-spin" />
                <span className="text-[10px] text-brand-muted uppercase font-bold">Thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="p-2.5 border-t border-brand-border bg-transparent sticky bottom-0">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={(e) => {
              const nextRows = Math.min(3, Math.max(1, Math.ceil((e.currentTarget.value.length + 1) / 38)));
              setRows(nextRows);
            }}
            rows={rows}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about your data..."
            className="w-full resize-none rounded-md border border-brand-border bg-[#3a404b] text-[12px] leading-[1.4] text-brand-text px-3 py-2 pr-9 outline-none"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading}
            variant="ghost"
            size="icon"
            className="absolute right-1 bottom-1 h-7 w-7 rounded-md opacity-80"
            aria-label="Send message"
          >
            <SendHorizontal className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
