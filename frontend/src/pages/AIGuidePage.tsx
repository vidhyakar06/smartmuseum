import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Image as ImageIcon,
  Compass,
  ArrowRight,
  Headphones,
  RotateCcw,
  Globe,
  Layers,
  HelpCircle,
  X,
  Volume2
} from 'lucide-react';
import { api } from '../services/api.js';
import { Exhibit } from '../types/index.js';
import { useVisitor } from '../contexts/VisitorContext.js';
import { SUPPORTED_LANGUAGES, translationService } from '../services/translationService.js';
import { audioService } from '../services/audioService.js';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  relatedExhibits?: Array<{
    exhibitId: string;
    title: string;
    artist: string;
    category: string;
    location: string;
  }>;
}

export const AIGuidePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, setLanguage, t, playAudio } = useVisitor();

  const exhibitIdParam = searchParams.get('exhibitId') || '';

  const [allExhibits, setAllExhibits] = useState<Exhibit[]>([]);
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeEngine, setActiveEngine] = useState<string>('Athena Art AI');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load exhibits
  useEffect(() => {
    api.getExhibits().then(res => {
      if (res.success) {
        setAllExhibits(res.data);
        if (exhibitIdParam) {
          const match = res.data.find(e => e.exhibitId === exhibitIdParam);
          if (match) setSelectedExhibit(match);
        }
      }
    }).catch(() => {});
  }, [exhibitIdParam]);

  // Initial welcome message from AI
  useEffect(() => {
    const welcome = selectedExhibit
      ? `Greetings! I am Athena, your Autonomous AI Curatorial Guide. I am loaded with deep scholarly knowledge about "${selectedExhibit.title}" by ${selectedExhibit.artist}. How may I illuminate your experience today?`
      : 'Welcome to the Smart Museum! I am Athena, your Autonomous AI Art Historian and Interactive Guide. You can ask me about our permanent galleries, art movements, or select any artwork for deep curatorial analysis.';

    setMessages([
      {
        sender: 'assistant',
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'athena-art-ai'
      }
    ]);
  }, [selectedExhibit?.exhibitId]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isThinking) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsThinking(true);

    try {
      const historyPayload = messages.slice(-4).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await api.chatAI({
        message: textToSend,
        exhibitId: selectedExhibit?.exhibitId,
        language,
        history: historyPayload
      });

      if (res.success && res.data) {
        if (res.data.source === 'athena-art-ai' || res.data.source === 'local-art-expert') {
          setActiveEngine('Athena Art AI (Built-in)');
        } else if (res.data.source === 'gemini-flash') {
          setActiveEngine('Google Gemini');
        } else if (res.data.source === 'groq-llama') {
          setActiveEngine('Groq LLaMA 3.3');
        }

        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: res.data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: res.data.source,
            relatedExhibits: res.data.relatedExhibits
          }
        ]);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I am momentarily reconnecting to the museum knowledge network. Please ask again in a second.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const quickPrompts = selectedExhibit
    ? [
        `Who painted ${selectedExhibit.title}?`,
        'Why is this artwork famous?',
        'Explain this in simple English for a student.',
        'What other paintings are near this one?',
        'What symbols or secret details are hidden here?'
      ]
    : [
        'What are the museum opening hours and ticket prices?',
        'Which gallery houses the Renaissance masterpieces?',
        'Where can I find the Museum Café and restrooms?',
        'Recommend 3 must-see artworks today.'
      ];

  const handleSelectExhibit = (exId: string) => {
    if (!exId) {
      setSelectedExhibit(null);
      setSearchParams({});
    } else {
      const found = allExhibits.find(e => e.exhibitId === exId);
      if (found) {
        setSelectedExhibit(found);
        setSearchParams({ exhibitId: found.exhibitId });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col glass-panel-glow rounded-3xl border border-museum-gold/30 shadow-2xl overflow-hidden animate-in fade-in duration-300">
      {/* AI Guide Top Bar */}
      <div className="p-4 bg-[#11141A] border-b border-museum-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-museum-cyan to-blue-600 flex items-center justify-center text-black font-bold shadow-cyan-glow/30">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <span>{t('aiGuideTitle')}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-museum-cyan/15 text-museum-cyan border border-museum-cyan/30 flex items-center gap-1">
                <Sparkles size={11} />
                {activeEngine}
              </span>
            </h2>
            <p className="text-xs text-museum-muted">
              Interactive Art Historian with Curatorial Context
            </p>
          </div>
        </div>

        {/* Controls: Language & Artwork Context */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Chat Language Selector */}
          <div className="flex items-center gap-1.5 bg-museum-elevated border border-museum-border rounded-lg px-2 py-1">
            <Globe size={13} className="text-museum-gold" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-museum-gold font-semibold text-xs focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#15181D] text-white">
                  {l.flag} {l.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Active Exhibit Selector Dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedExhibit?.exhibitId || ''}
              onChange={(e) => handleSelectExhibit(e.target.value)}
              className="bg-museum-elevated border border-museum-border text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-museum-gold max-w-[200px] truncate"
            >
              <option value="">General Museum Assistant</option>
              {allExhibits.map(ex => (
                <option key={ex.exhibitId} value={ex.exhibitId}>
                  {ex.title} ({ex.artist})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Exhibit Floating Context Banner */}
      {selectedExhibit && (
        <div className="bg-[#151922] border-b border-museum-border/80 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img src={selectedExhibit.images[0]} alt={selectedExhibit.title} className="w-8 h-8 rounded-lg object-cover border border-museum-gold/30" />
            <div className="truncate">
              <span className="text-museum-gold font-semibold truncate">{selectedExhibit.title}</span>
              <span className="text-museum-muted text-[11px] ml-2">by {selectedExhibit.artist} ({selectedExhibit.year})</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => playAudio(selectedExhibit)}
              className="px-2 py-0.5 rounded bg-museum-gold/15 text-museum-gold border border-museum-gold/30 hover:bg-museum-gold hover:text-black transition-colors"
            >
              Play Audio
            </button>
            <button
              onClick={() => handleSelectExhibit('')}
              className="text-museum-muted hover:text-white p-1"
              title="Clear context"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-museum-cyan/20 border border-museum-cyan/40 text-museum-cyan flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={16} />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
              msg.sender === 'user'
                ? 'bg-museum-gold text-black font-medium rounded-tr-none shadow-md shadow-museum-gold/15'
                : 'bg-[#171B22] border border-museum-border text-museum-text rounded-tl-none shadow-lg'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Related Exhibits Suggestions in Assistant Message */}
              {msg.relatedExhibits && msg.relatedExhibits.length > 0 && (
                <div className="pt-3 mt-2 border-t border-museum-border/60">
                  <span className="text-[10px] font-semibold text-museum-gold uppercase tracking-wider block mb-2">
                    Recommended Companion Works
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.relatedExhibits.map(rel => (
                      <button
                        key={rel.exhibitId}
                        onClick={() => handleSelectExhibit(rel.exhibitId)}
                        className="p-2 rounded-xl bg-museum-elevated hover:bg-museum-border/80 border border-museum-border text-left transition-colors flex items-center justify-between"
                      >
                        <div className="truncate">
                          <p className="font-semibold text-white truncate">{rel.title}</p>
                          <p className="text-[10px] text-museum-muted truncate">{rel.artist}</p>
                        </div>
                        <ArrowRight size={13} className="text-museum-gold ml-2 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] opacity-75 pt-1">
                <span>{msg.timestamp}</span>
                <div className="flex items-center gap-3">
                  {msg.source && (
                    <span>
                      Engine: {msg.source === 'gemini-flash' ? 'Google Gemini' : msg.source === 'groq-llama' ? 'Groq LLaMA' : 'Athena Art AI (Built-in)'}
                    </span>
                  )}
                  <button
                    onClick={() => audioService.playNarration(msg.text, language)}
                    className="flex items-center gap-1 text-museum-gold hover:text-museum-gold-light hover:underline font-medium"
                    title="Listen to Athena's response aloud"
                  >
                    <Volume2 size={12} />
                    <span>Listen</span>
                  </button>
                </div>
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-museum-gold/30 border border-museum-gold text-museum-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-museum-cyan/20 border border-museum-cyan/40 text-museum-cyan flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-[#171B22] border border-museum-border rounded-2xl rounded-tl-none p-3 text-xs text-museum-cyan flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-museum-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-museum-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-museum-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span>{t('aiThinking')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-[#12151B] border-t border-museum-border overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] font-semibold text-museum-muted whitespace-nowrap uppercase">Quick Ask:</span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 rounded-full bg-museum-elevated hover:bg-museum-border border border-museum-border text-[11px] text-museum-text hover:text-museum-gold whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Textarea & Send Control */}
      <div className="p-3 sm:p-4 bg-[#11141A] border-t border-museum-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('aiPlaceholder')}
            className="flex-1 bg-[#0E1116] border border-museum-border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-museum-muted focus:outline-none focus:border-museum-gold focus:ring-1 focus:ring-museum-gold transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="w-11 h-11 rounded-xl bg-museum-gold disabled:opacity-40 text-black flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-lg shadow-museum-gold/20"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
