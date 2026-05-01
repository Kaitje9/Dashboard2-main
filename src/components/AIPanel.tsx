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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

      const stream = sendMessageStream(newMessages, participantProfile);
      for await (const chunk of stream) {
        assistantResponse += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          const rest = prev.slice(0, -1);
          return [...rest, { ...last, text: assistantResponse }];
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Connection issue. Pulse AI offline.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/35 backdrop-blur-xl border-l border-white/50" id="ai-panel">
      <div className="p-6 border-b border-white/50 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/70 border border-brand-border text-brand-muted flex items-center justify-center"
          aria-label="Close chat panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shadow-[0_0_8px_rgba(229,249,62,0.6)]"></div>
        <h2 className="text-sm font-bold text-brand-text uppercase tracking-widest font-sans">Pulse Intelligence</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-brand-muted uppercase font-bold tracking-tighter">
                {msg.role === 'user' ? 'You' : 'AI'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className={`max-w-[90%] p-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-brand-accent text-black rounded-2xl rounded-tr-none font-medium' 
                  : 'bg-white/70 text-brand-text rounded-2xl rounded-tl-none border border-white/70'
              }`}>
                <div className="markdown-body">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && !messages[messages.length - 1].text && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
              <div className="bg-white/70 p-3 rounded-xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-3 h-3 text-brand-muted animate-spin" />
                <span className="text-[10px] text-brand-muted uppercase font-bold">Analyzing Bio-Sync...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white/30">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your data..."
            className="w-full bg-white/80 border border-brand-border rounded-xl py-3 px-4 pr-12 text-xs text-brand-text focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-muted"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-3 w-6 h-6 bg-brand-border rounded flex items-center justify-center text-brand-muted hover:text-brand-accent transition-colors disabled:opacity-50"
          >
            <span className="text-[10px]">⏎</span>
          </button>
        </div>
      </div>
    </div>
  );
}
