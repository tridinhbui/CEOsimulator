import React, { useState, useEffect, useRef } from 'react';
import { CompanyMetrics, Scenario, ChatMessage } from '../types';
import { getAdvisorAdvice } from '../services/geminiService';
import { IconUsers, IconZap } from './ui/Icons';

interface ChatAdvisorProps {
  scenario: Scenario | null;
  metrics: CompanyMetrics;
}

const ChatAdvisor: React.FC<ChatAdvisorProps> = ({ scenario, metrics }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const askAdvisor = async () => {
    if (!scenario) return;
    
    setLoading(true);
    // Add user question implicitly
    const userMsg: ChatMessage = { role: 'user', text: "What should I do in this situation?" };
    setMessages(prev => [...prev, userMsg]);

    const advice = await getAdvisorAdvice(scenario, metrics);
    
    const advisorMsg: ChatMessage = { role: 'advisor', text: advice };
    setMessages(prev => [...prev, advisorMsg]);
    setLoading(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto`}>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-popup origin-bottom-right">
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <IconUsers className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm">Board Advisor</div>
                <div className="text-xs text-indigo-200">AI Assistant</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded p-1">✕</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
             {messages.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-10">
                   <p>I can analyze the current scenario and metrics to provide strategic advice.</p>
                </div>
             )}
             {messages.map((msg, i) => (
               <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                   {msg.text}
                 </div>
               </div>
             ))}
             {loading && (
               <div className="flex justify-start">
                 <div className="bg-white border border-gray-200 p-3 rounded-xl rounded-bl-none shadow-sm flex gap-1">
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                 </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t">
            <button 
              onClick={askAdvisor} 
              disabled={loading || !scenario}
              className="w-full py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
               <IconZap className="w-4 h-4" />
               Analyze Scenario
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
         <button 
           onClick={() => setIsOpen(true)}
           className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110"
         >
           <IconUsers className="w-7 h-7" />
           {/* Notification Badge if new scenario? */}
           <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
         </button>
      )}
    </div>
  );
};

export default ChatAdvisor;