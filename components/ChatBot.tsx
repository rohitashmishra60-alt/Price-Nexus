import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Sparkles } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm your PriceNexus AI assistant. Ask me anything about products, prices, or specs." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    
    // Add user message immediately
    const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    // Get response
    const responseText = await getChatResponse(messages, userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="relative" ref={chatContainerRef}>
        {/* Trigger Button in Header - Bigger & Highlighted */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`relative p-3 rounded-full transition-all duration-300 shadow-xl border ${
                isOpen 
                    ? 'bg-white text-black border-white' 
                    : 'bg-gradient-to-br from-shop-purple to-indigo-600 text-white border-white/20 hover:scale-110 hover:shadow-purple-500/40'
            }`}
            title="AI Assistant"
        >
            <Sparkles className={`w-6 h-6 ${!isOpen ? 'animate-pulse' : ''}`} />
            
            {/* Notification Dot */}
            {!isOpen && messages.length > 1 && (
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-black"></span>
                </span>
            )}
        </button>

        {/* Dropdown Chat Window */}
        <div 
            className={`absolute top-full right-0 mt-4 z-50 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl w-[350px] md:w-[400px] overflow-hidden transition-all duration-300 origin-top-right flex flex-col ${isOpen ? 'scale-100 opacity-100 translate-y-0 h-[500px]' : 'scale-90 opacity-0 -translate-y-4 h-0 pointer-events-none'}`}
        >
            {/* Header */}
            <div className="bg-[#111] p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-shop-purple to-indigo-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">PriceNexus AI</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] text-gray-400">Gemini 3 Pro Preview</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-black/50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                            className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-white text-black rounded-tr-sm' 
                                : 'bg-[#222] text-gray-200 border border-white/5 rounded-tl-sm'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-[#222] border border-white/5 rounded-2xl rounded-tl-sm p-3 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-shop-purple" />
                            <span className="text-xs text-gray-500">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-[#111] border-t border-white/5 shrink-0 flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about prices..."
                    className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-shop-purple/50 focus:ring-1 focus:ring-shop-purple/50 transition-all placeholder:text-gray-600"
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="bg-white text-black p-2 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    </div>
  );
};

export default ChatBot;