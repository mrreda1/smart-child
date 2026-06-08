import { Bot, Menu, MessageSquare, Send, Square, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const ChatMessages = ({
  profile,
  activeSession,
  currentSession,
  activeMessages,
  hasSessions,
  onClose,
  setShowMobileSidebar,
  setMessages,
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const replyTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isTyping]);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping || !activeSession) return;

    const newMessage = {
      _id: Date.now().toString(), // Mock temporary ID
      sessionId: activeSession,
      sender: 'parent',
      content: input,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    replyTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      const botReply = {
        _id: (Date.now() + 1).toString(), // Mock temporary ID
        sessionId: activeSession,
        sender: 'AI',
        content: `Thanks for asking about ${profile?.name}. Based on their data, I'm analyzing your request...`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botReply]);
    }, 2000);
  };

  const handleStop = () => {
    if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
    setIsTyping(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative z-10 w-full">
      {/* Chat Header */}
      <div className="h-[72px] bg-white border-b border-gray-100 px-4 md:px-6 flex justify-between items-center shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="md:hidden p-2 -ml-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 shrink-0"
          >
            <Menu size={20} />
          </button>
          <div className="bg-[#FFC107] p-2 rounded-full hidden sm:flex shrink-0">
            <Bot size={22} className="text-black" />
          </div>
          <div className="flex flex-col overflow-hidden justify-center">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-md text-gray-900 leading-tight truncate">AI Assistant</h3>
              {/* Visual Reference to the Child */}
              <div
                className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-full shrink-0"
                title={`Messaging for ${profile?.name}`}
              >
                {profile?.photo ? (
                  <img
                    src={`${import.meta.env.VITE_IMG_BASE_URL}/${profile.photo}`}
                    className="w-3.5 h-3.5 rounded-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FFC107] text-black flex items-center justify-center text-[8px] font-black">
                    {profile?.name?.charAt(0)}
                  </div>
                )}
                <span className="text-[11px] font-bold uppercase tracking-wider truncate max-w-[80px]">
                  {profile?.name}
                </span>
              </div>
            </div>
            {/* Clean Subtitle */}
            <p className="text-xs text-gray-500 font-medium truncate max-w-[200px] sm:max-w-[300px]">
              {currentSession?.topic || (!hasSessions ? 'No active sessions' : 'New Conversation')}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors shrink-0"
          title="Close chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50/50 flex flex-col gap-4">
        {!activeSession ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm gap-3">
            <MessageSquare size={32} className="opacity-20" />
            <p>Select or create a new conversation to start.</p>
          </div>
        ) : activeMessages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            No messages in this conversation yet.
          </div>
        ) : (
          activeMessages.map((m) => (
            <div
              key={m._id}
              className={`max-w-[85%] md:max-w-[75%] p-3.5 text-[15px] leading-relaxed shadow-sm ${
                m.sender === 'parent'
                  ? 'bg-[#FFC107] text-black self-end rounded-2xl rounded-br-sm'
                  : 'bg-white border border-gray-100 text-gray-800 self-start rounded-2xl rounded-bl-sm'
              }`}
            >
              {m.content}
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="bg-white border border-gray-100 text-gray-800 self-start rounded-2xl rounded-bl-sm max-w-[85%] px-4 py-4 shadow-sm flex items-center gap-1.5 w-[72px]">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Form */}
      <div className="p-3 md:p-4 bg-white border-t border-gray-100">
        <form
          onSubmit={handleSend}
          className="max-w-4xl mx-auto flex gap-2 items-end bg-gray-50 p-1.5 rounded-3xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#FFC107]/30 focus-within:border-[#FFC107] transition-all"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping || !activeSession}
            placeholder={
              !activeSession
                ? 'Create a new chat to message...'
                : isTyping
                  ? 'Waiting for response...'
                  : `Ask something about ${profile?.name}...`
            }
            className="flex-1 bg-transparent text-[15px] px-4 py-3 outline-none resize-none max-h-32 min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          {isTyping ? (
            <button
              type="button"
              onClick={handleStop}
              className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors flex-shrink-0 mb-1 mr-1"
            >
              <Square size={20} fill="currentColor" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || !activeSession}
              className="bg-[#FFC107] text-black p-3 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 mb-1 mr-1 shadow-sm"
            >
              <Send size={20} className="ml-0.5" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
