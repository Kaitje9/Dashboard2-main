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
  const [isInputFocused, setIsInputFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
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
    <div className="flex flex-col h-full bg-transparent" id="ai-panel">
      <div className="p-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-brand-card text-brand-muted shadow-[0_8px_18px_rgba(16,19,23,0.14)] flex items-center justify-center"
          aria-label="Close chat panel"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shadow-[0_0_8px_rgba(229,249,62,0.6)]"></div>
        <h2 className="text-sm font-bold text-brand-text uppercase tracking-widest font-sans">Pulse Intelligence</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5" ref={scrollRef}>
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
              <div className={`max-w-[92%] sm:max-w-[88%] p-4 text-[15px] leading-[1.55] transition-all duration-200 ${
                msg.role === 'user'
                  ? 'bg-brand-accent text-black rounded-2xl rounded-tr-none font-medium shadow-[0_4px_14px_rgba(16,19,23,0.08)]'
                  : `text-brand-text rounded-2xl rounded-tl-none shadow-[0_4px_14px_rgba(16,19,23,0.08)] ${
                      isStreamingBubble ? 'bg-white/58' : isInputFocused ? 'bg-white/80' : 'bg-white/72'
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
              <div className="bg-white/72 p-3 rounded-xl rounded-tl-none flex items-center gap-2 shadow-[0_4px_14px_rgba(16,19,23,0.08)]">
                <Loader2 className="w-3 h-3 text-brand-muted animate-spin" />
                <span className="text-[10px] text-brand-muted uppercase font-bold">Analyzing Bio-Sync...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="p-4 pb-[calc(env(safe-area-inset-bottom)+12px)] bg-white/10 backdrop-blur-2xl">
        <div className="relative flex items-center h-14 rounded-full bg-brand-card shadow-[0_10px_24px_rgba(16,19,23,0.14)] px-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your data..."
            className="w-full bg-transparent px-3 pr-12 text-[16px] text-brand-text focus:outline-none placeholder:text-brand-muted"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-3 w-8 h-8 rounded-full bg-white/85 flex items-center justify-center text-brand-muted hover:text-brand-accent transition-colors disabled:opacity-50 shadow-[0_6px_16px_rgba(16,19,23,0.1)]"
          >
            <span className="text-[10px]">⏎</span>
          </button>
        </div>
      </div>
    </div>
  );
}
