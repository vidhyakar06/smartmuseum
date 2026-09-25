import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  ExternalLink,
  Minimize2,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useVisitor } from '../contexts/VisitorContext.js';
import { audioService } from '../services/audioService.js';
import { SUPPORTED_LANGUAGES } from '../services/translationService.js';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export const AIChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Greetings! I am Athena, your Autonomous AI Museum Historian. Ask me anything about our exhibits, artists, visiting hours, galleries, or walking directions!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Athena Art AI'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useVisitor();

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isThinking]);

  const quickPrompts = [
    'What are the opening hours & ticket prices?',
    'Tell me about the Renaissance gallery',
    'Where is the museum cafe and restroom?',
    'Recommend 3 must-see artworks'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsThinking(true);

    try {
      const historyPayload = messages.slice(-4).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await api.chatAI({
        message: text,
        language,
        history: historyPayload
      });

      if (res && res.success && res.data) {
        const sourceName = res.data.source === 'gemini-flash'
          ? 'Google Gemini'
          : res.data.source === 'groq-llama'
            ? 'Groq LLaMA'
            : 'Art Historian';

        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: res.data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: sourceName
          }
        ]);
        if (!isOpen) setUnreadCount(c => c + 1);
      } else {
        throw new Error('No answer received');
      }
    } catch {
      // Resilient local intelligent fallback response so user never sees an error
      const fallbackText = getSmartFallback(text, language);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Curatorial Guide'
        }
      ]);
      if (!isOpen) setUnreadCount(c => c + 1);
    } finally {
      setIsThinking(false);
    }
  };

  function getSmartFallback(q: string, lang: string): string {
    const query = q.toLowerCase();
    if (query.includes('hour') || query.includes('time') || query.includes('ticket') || query.includes('price')) {
      return 'The Smart Museum is open daily from 9:00 AM to 7:00 PM. General admission is $20, Student pass is $12, and VIP Curatorial pass is $35. Check the Tickets section to reserve digital passes instantly.';
    }
    if (query.includes('cafe') || query.includes('restroom') || query.includes('where') || query.includes('direction')) {
      return 'The Museum Café and Information Desk are in the Main Atrium. Restrooms are accessible near Gallery A and Gallery D corridors. Check our interactive 3D vector Map for step-by-step navigation!';
    }
    if (query.includes('mona lisa') || query.includes('da vinci')) {
      return 'Leonardo da Vinci created the iconic Mona Lisa during the Italian Renaissance. In our collection, explore Gallery A for companion masterpieces from the Florentine and Venetian masters.';
    }
    if (query.includes('starry night') || query.includes('van gogh')) {
      return 'Vincent van Gogh painted his celestial masterpiece in Saint-Rémy in 1889. Look for expressive Post-Impressionist masterworks situated in Gallery C.';
    }
    return `Welcome to the Smart Museum! I am Athena, your AI Curatorial Guide. You can ask me about our permanent collections, art movements, or navigate to the AI Guide tab for a deep curatorial dialogue.`;
  }

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          id="ai-chatbot-launcher"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 md:bottom-6 right-5 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-museum-cyan via-blue-500 to-museum-gold text-black font-bold shadow-2xl shadow-museum-cyan/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
          aria-label="Open AI Museum Guide Chatbot"
        >
          <div className="relative">
            <Sparkles size={20} className="text-black animate-pulse" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs tracking-wide hidden sm:inline">AI Art Guide</span>
          <span className="w-2 h-2 rounded-full bg-emerald-950 border border-emerald-400 animate-ping" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div
          id="ai-chatbot-window"
          className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[410px] h-[550px] max-h-[85vh] bg-[#101318]/95 backdrop-blur-2xl border border-museum-gold/40 rounded-3xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#141820] to-[#1A1F2B] border-b border-museum-border/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-museum-cyan to-blue-600 flex items-center justify-center text-black font-bold shadow-md shadow-museum-cyan/20">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-serif font-bold text-white tracking-wide">
                    Athena • AI Guide
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
                </div>
                <p className="text-[10px] font-mono text-museum-cyan flex items-center gap-1">
                  Athena Autonomous AI (Active)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-museum-muted">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-museum-elevated border border-museum-border text-museum-gold text-[10px] rounded-lg px-1.5 py-0.5 focus:outline-none cursor-pointer"
                  title="Change AI language"
                >
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code} className="bg-[#12151B] text-white">
                      {l.flag} {l.nativeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fullscreen AI Guide page link */}
              <Link
                to="/ai"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-museum-elevated hover:text-white transition-colors"
                title="Open Fullscreen Curatorial Mode"
              >
                <ExternalLink size={14} />
              </Link>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-museum-elevated hover:text-white transition-colors cursor-pointer"
                title="Minimize Chatbot"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-museum-cyan/20 border border-museum-cyan/40 text-museum-cyan flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-1.5 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-museum-gold text-black font-medium rounded-tr-none shadow-museum-gold/10'
                      : 'bg-[#161B24] border border-museum-border/90 text-museum-text rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex items-center justify-between text-[9px] opacity-70 pt-0.5">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center gap-2">
                        {msg.source && <span className="text-museum-cyan">{msg.source}</span>}
                        <button
                          onClick={() => audioService.playNarration(msg.text, language)}
                          className="text-museum-gold hover:underline flex items-center gap-0.5 cursor-pointer"
                          title="Listen to this message"
                        >
                          <Volume2 size={11} />
                          <span>Listen</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-museum-gold/30 border border-museum-gold text-museum-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-museum-cyan/20 border border-museum-cyan/40 text-museum-cyan flex items-center justify-center flex-shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-[#161B24] border border-museum-border rounded-2xl rounded-tl-none p-2.5 text-xs text-museum-cyan flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-museum-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-museum-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-museum-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className="text-[11px]">Athena is consulting curatorial archives...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-1.5 bg-[#0D1015] border-t border-museum-border/70 overflow-x-auto flex items-center gap-1.5">
            <span className="text-[9px] font-semibold text-museum-muted uppercase whitespace-nowrap">Ask:</span>
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="px-2 py-0.5 rounded-full bg-museum-elevated hover:bg-museum-border border border-museum-border text-[10px] text-museum-text hover:text-museum-gold whitespace-nowrap transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-[#12161E] border-t border-museum-border flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Athena about art, tickets, galleries..."
              className="flex-1 bg-[#0A0D12] border border-museum-border rounded-xl px-3 py-2 text-xs text-white placeholder-museum-muted focus:outline-none focus:border-museum-gold transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="w-8 h-8 rounded-xl bg-museum-gold disabled:opacity-40 text-black flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all flex-shrink-0 cursor-pointer shadow-md shadow-museum-gold/20"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
