/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, ParticipantProfile } from '../types';
import { INITIAL_AI_GREETING } from '../constants';
import { sendMessageStream } from '../services/ai';

interface AIPanelProps {
  participantProfile: ParticipantProfile | null;
  onTranscriptChange?: (messages: ChatMessage[]) => void;
  onClose?: () => void;
}

export function AIPanel({ participantProfile, onTranscriptChange, onClose }: AIPanelProps) {
  const greeting = participantProfile?.firstName
    ? `Hi ${participantProfile.firstName}, ${INITIAL_AI_GREETING}`
    : INITIAL_AI_GREETING;
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: greeting }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

      const stream = sendMessageStream(newMessages, participantProfile);
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
    <div className="flex flex-col h-full bg-brand-card" id="ai-panel">
      <div className="px-4 py-3 border-b border-brand-border flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-md border border-brand-border text-brand-muted flex items-center justify-center"
              aria-label="Close chat panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <h2 className="text-sm font-semibold text-brand-text">AI Coach</h2>
        </div>
        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              className={`flex flex-col space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-brand-muted uppercase font-semibold tracking-tight">
                {msg.role === 'user' ? 'You' : 'AI'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className={`max-w-[92%] sm:max-w-[88%] p-3.5 text-[14px] leading-[1.55] transition-all duration-200 ${
                msg.role === 'user'
                  ? 'bg-brand-accent text-white rounded-lg rounded-tr-sm font-medium shadow-sm'
                  : `text-brand-text rounded-lg rounded-tl-sm border border-brand-border ${
                      isStreamingBubble ? 'bg-slate-50' : 'bg-white'
                    }`
              }`}>
                <div className="markdown-body chat-markdown">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
              );
            })()
          ))}
          {isLoading && !messages[messages.length - 1].text && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
              <div className="bg-white p-3 rounded-lg rounded-tl-sm border border-brand-border flex items-center gap-2">
                <Loader2 className="w-3 h-3 text-brand-muted animate-spin" />
                <span className="text-[10px] text-brand-muted uppercase font-bold">Thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-brand-border bg-slate-50/70">
        <div className="relative flex items-center h-11 rounded-md bg-white border border-brand-border px-2 shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your data..."
            className="w-full bg-transparent px-3 pr-12 text-[16px] text-brand-text focus:outline-none placeholder:text-brand-muted"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 w-8 h-8 rounded-md bg-slate-50 border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-accent transition-colors disabled:opacity-50"
          >
            <span className="text-[10px]">⏎</span>
          </button>
        </div>
      </div>
    </div>
  );
}
