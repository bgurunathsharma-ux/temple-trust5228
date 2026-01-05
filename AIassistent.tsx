import React, { useState, useRef, useEffect } from 'react';
import { Donation, Expense } from '../types';
import { getTrustInsights } from '../services/geminiService';

interface AIAssistantProps {
  donations: Donation[];
  expenses: Expense[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ donations, expenses }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    try {
      const response = await getTrustInsights(donations, expenses, userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'సర్వర్ సమస్య వచ్చింది. దయచేసి మళ్ళీ ప్రయత్నించండి.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-orange-200">
      <div className="p-4 bg-red-800 text-yellow-400 flex items-center space-x-3">
        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-red-900 shadow-md">
          <i className="fas fa-robot"></i>
        </div>
        <h3 className="font-bold">ట్రస్ట్ AI సహాయకుడు</h3>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-orange-50/30">
        {messages.length === 0 && (
          <div className="text-center py-10 opacity-50">
            <i className="fas fa-comment-dots text-4xl mb-2 text-red-800"></i>
            <p className="text-sm font-bold">నమస్కారం! ట్రస్ట్ వివరాల గురించి ఏదైనా అడగండి.</p>
          </div>
        )}
        
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-red-700 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-orange-200 shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleAsk} className="p-3 bg-white border-t flex items-center space-x-2">
        <input 
          className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="ప్రశ్న అడగండి..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={loading}
        />
        <button 
          disabled={loading || !query.trim()}
          className="w-12 h-12 bg-red-800 text-yellow-400 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;