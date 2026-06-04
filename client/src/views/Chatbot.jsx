import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, LogOut, User, Square } from 'lucide-react';

const THEME = {
  bgBeige: 'bg-[#FDFBF7]',
};

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi there! 👋 How can I help you and your child today?', sender: 'bot' },
  ]);
  const messagesEndRef = useRef(null);
  const replyTimeoutRef = useRef(null);

  // Auto-hide tooltip after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  // Lock background scroll when the chatbot window is open (Mobile Only)
  useEffect(() => {
    const handleScrollLock = () => {
      const isMobile = window.innerWidth < 768; // Tailwind 'md' breakpoint
      if (isOpen && isMobile) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    handleScrollLock(); // Evaluate immediately when isOpen changes
    window.addEventListener('resize', handleScrollLock); // Handle device rotation/resize

    // Cleanup on unmount or when dependencies change
    return () => {
      window.removeEventListener('resize', handleScrollLock);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    setMessages((prev) => [...prev, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    replyTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: 'Thanks for reaching out! Our support team will review this and assist you shortly.',
          sender: 'bot',
        },
      ]);
    }, 2000);
  };

  const handleStop = () => {
    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
    }
    setIsTyping(false);
  };

  return (
    <>
      {/* The Chat Window */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col bg-white md:inset-auto md:bottom-24 md:left-6 md:w-[350px] md:h-[500px] md:rounded-2xl md:shadow-2xl md:border md:border-gray-200 overflow-hidden transition-all duration-300 ease-out transform origin-bottom-left ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-12 md:translate-y-8 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-[#FFC107] px-4 py-4 flex justify-between items-center text-gray-900 shadow-sm z-10">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-full">
              <Bot size={20} className="text-[#FFC107]" />
            </div>
            <div>
              <h3 className="font-bold text-md leading-tight">Support Chat</h3>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-black/10 p-1.5 rounded-full transition-colors"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] p-3 text-sm rounded-2xl shadow-sm ${
                m.sender === 'user'
                  ? 'bg-[#FFC107] text-black self-end rounded-br-sm'
                  : 'bg-white border border-gray-100 text-gray-800 self-start rounded-bl-sm'
              }`}
            >
              {m.text}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="bg-white border border-gray-100 text-gray-800 self-start rounded-bl-sm rounded-2xl max-w-[85%] px-4 py-3 shadow-sm flex items-center gap-1.5 h-[38px]">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder={isTyping ? 'Waiting for reply...' : 'Type your message...'}
            className="flex-1 bg-gray-100 text-sm rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#FFC107]/50 transition-shadow disabled:opacity-60 disabled:bg-gray-200 disabled:cursor-not-allowed"
          />
          {isTyping ? (
            <button
              type="button"
              onClick={handleStop}
              className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-colors flex-shrink-0 animate-in zoom-in duration-200"
              title="Stop generating reply"
            >
              <Square size={18} fill="currentColor" className="mx-0.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-[#FFC107] text-black p-2.5 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 animate-in zoom-in duration-200"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          )}
        </form>
      </div>

      {/* Encouraging Tooltip */}
      <div
        className={`fixed bottom-[88px] left-6 z-[85] bg-white text-gray-800 p-3.5 rounded-2xl shadow-xl border border-gray-200 max-w-[220px] transition-all duration-500 ease-out transform origin-bottom-left ${
          showTooltip && !isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setShowTooltip(false)}
          className="absolute -top-2 -right-2 bg-gray-100 text-gray-500 rounded-full p-1 hover:bg-gray-200 hover:text-gray-800 transition-colors shadow-sm"
          aria-label="Close tooltip"
        >
          <X size={12} />
        </button>
        <p className="text-xs font-semibold leading-relaxed relative z-10 text-gray-700">
          Need advice or recommendations for your child? Chat with our AI assistant!
        </p>
        {/* Tooltip Tail */}
        <div className="absolute -bottom-2 left-5 w-4 h-4 bg-white border-b border-r border-gray-200 transform rotate-45 rounded-sm"></div>
      </div>

      {/* Floating Toggle Button (Hidden when open on mobile) */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setShowTooltip(false); // Hide tooltip forever once they open the chat
        }}
        className={`fixed bottom-6 left-6 z-[90] w-14 h-14 bg-[#FFC107] text-black rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-400/30 ${isOpen ? 'hidden md:flex' : 'flex'}`}
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
      </button>
    </>
  );
};

// --- Mock Components to visualize the layout ---
const ParentDashboardHeader = () => (
  <header className="bg-white py-4 px-6 md:px-12 flex justify-between items-center shadow-sm z-10 relative">
    <div className="flex items-center gap-2 font-bold text-xl text-blue-900 tracking-tight">
      <span className="text-[#FFC107] text-2xl">🧩</span> NCJC
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
      <a href="#" className="hover:text-gray-900 transition-colors">
        Home
      </a>
      <a href="#" className="text-gray-900 border-b-2 border-[#FFC107] pb-1">
        Dashboard
      </a>
    </div>
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 border-2 border-blue-200 cursor-pointer">
        <User size={20} />
      </div>
      <button className="text-gray-400 hover:text-gray-700 transition-colors">
        <LogOut size={20} />
      </button>
    </div>
  </header>
);

const OutletMock = () => (
  <div className="w-full max-w-5xl mx-auto space-y-8">
    <div>
      <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Dashboard</h1>
      <p className="text-gray-500 mt-1">Manage profiles and view progress</p>
    </div>

    <div>
      <h2 className="text-xl font-bold text-[#0F172A] mb-4">Managed Profiles</h2>
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col items-center max-w-xs relative">
        <span className="absolute top-4 left-4 bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded-md">
          Owner
        </span>
        <div className="w-24 h-24 bg-pink-100 rounded-full mb-4 border-4 border-white shadow-md flex items-center justify-center text-3xl">
          👧🏼
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Lili, 10</h3>

        <div className="w-full bg-gray-50 rounded-xl p-3 flex justify-between items-center mb-6">
          <span className="text-xs text-gray-500 font-semibold">SHARE CODE</span>
          <span className="text-sm font-mono font-bold text-gray-800">X9F52078</span>
        </div>

        <button className="w-full bg-[#FFC107] hover:bg-yellow-400 transition-colors text-black font-bold py-3 px-4 rounded-xl mb-3 shadow-sm">
          ▶ Play Mode
        </button>
        <button className="w-full bg-gray-50 hover:bg-gray-100 transition-colors text-gray-800 font-bold py-3 px-4 rounded-xl">
          📊 View Reports
        </button>
      </div>
    </div>

    {/* Lots of placeholder text to demonstrate scrolling behavior */}
    <div className="h-64 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 font-medium p-4 text-center">
      Scroll down to test the floating chatbot behavior on mobile (resize your browser if on desktop)
    </div>
    <div className="h-64 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 font-medium">
      Keep scrolling...
    </div>
  </div>
);

// --- The Layout Component You Requested ---
const ParentDashboardLayout = () => {
  return (
    <div className={`min-h-screen ${THEME.bgBeige} relative flex flex-col`}>
      <ParentDashboardHeader />

      {/* Notice the pb-24 (padding-bottom: 6rem) added here to ensure the chat button doesn't hide content at the very bottom of the page */}
      <main className="flex-1 w-full flex flex-col p-6 pb-24 md:p-12 md:pb-24 space-y-12 animate-in fade-in duration-500">
        <OutletMock />
      </main>

      {/* The Chat Bot Widget */}
      <ChatBot />
    </div>
  );
};

export default ParentDashboardLayout;
