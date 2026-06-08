import { useEffect, useState } from 'react';
import { ChatSession } from '../ChatSession';
import { ChatMessages } from '../ChatMessages';
import { useGetChatSessions } from '@/hooks/chatSession';

// Kept mock messages so the UI is interactive, as requested
const MOCK_MESSAGES = [
  {
    _id: '6a25c75e0d9ae3918dda4178',
    sessionId: '6a25c75e0d9ae3918dda4175',
    sender: 'parent',
    content: 'Describe my child report',
    createdAt: '2026-06-07T19:32:46.042Z',
    updatedAt: '2026-06-07T19:32:46.042Z',
  },
  {
    _id: '6a25c7990d9ae3918dda417b',
    sessionId: '6a25c75e0d9ae3918dda4175',
    sender: 'AI',
    content:
      "Overall growth: 15% | Emotional state: anger_aggression | Recommendation: Focus Area Identified: Your child's reaction speed accuracy currently indicates a potential area for support. Consider focusing their upcoming activities on this skill to help build confidence and proficiency.",
    createdAt: '2026-06-07T19:33:45.413Z',
    updatedAt: '2026-06-07T19:33:45.413Z',
  },
  {
    _id: '6a25ce41b4dafafc999f0ed6',
    sessionId: '6a25c75e0d9ae3918dda4175',
    sender: 'parent',
    content: 'Which skill should we focus on to build here confidence',
    createdAt: '2026-06-07T20:02:09.911Z',
    updatedAt: '2026-06-07T20:02:09.911Z',
  },
  {
    _id: '6a25cea0b4dafafc999f0ed9',
    sessionId: '6a25c75e0d9ae3918dda4175',
    sender: 'AI',
    content:
      'It sounds like your child has some challenges in reaction speed accuracy, which could be affecting their overall performance. It would be helpful to discuss these issues further and work together as a family to identify ways to improve this particular skill. This will not only enhance their confidence but also make them better prepared for various situations they may encounter in school and life.',
    createdAt: '2026-06-07T20:03:44.029Z',
    updatedAt: '2026-06-07T20:03:44.029Z',
  },
];

export const ChatModal = ({ onClose, profile }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Pagination & Fetching limits
  const [page, setPage] = useState(1);
  const limit = 4;

  const { data: fetchedData, isFetching } = useGetChatSessions(
    { query: { childId: profile?.id, sort: '-createdAt', limit, page } },
    { staleTime: Infinity },
  );

  // Core State
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState('new'); // Empty session selected by default
  const [messages, setMessages] = useState([
    {
      _id: 'temp-greeting',
      sessionId: 'new',
      sender: 'AI',
      content: `Hi! How can I help you regarding ${profile?.name} today?`,
      createdAt: new Date().toISOString(),
    },
    ...MOCK_MESSAGES,
  ]);

  // Reset states cleanly if a different child profile is selected
  useEffect(() => {
    setPage(1);
    setSessions([]);
    setActiveSession('new');
    setMessages([
      {
        _id: 'temp-greeting',
        sessionId: 'new',
        sender: 'AI',
        content: `Hi! How can I help you regarding ${profile?.name} today?`,
        createdAt: new Date().toISOString(),
      },
      ...MOCK_MESSAGES,
    ]);
  }, [profile?._id, profile?.name]);

  // Handle accumulating fetched sessions over pages
  useEffect(() => {
    const incomingSessions = fetchedData?.chatsessionList || (Array.isArray(fetchedData) ? fetchedData : []);

    if (incomingSessions.length > 0) {
      setSessions((prev) => {
        if (page === 1) return incomingSessions; // Start fresh on page 1

        // Combine while ensuring no duplicates
        const newSessions = incomingSessions.filter(
          (newSession) => !prev.some((existing) => existing._id === newSession._id),
        );
        return [...prev, ...newSessions];
      });
    }
  }, [fetchedData, page]);

  // Lock background scroll when the chatbot window is open (Mobile Only)
  useEffect(() => {
    const handleScrollLock = () => {
      const isMobile = window.innerWidth < 768; // Tailwind 'md' breakpoint
      if (isMobile) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden'; // Ensure stricter lock for iOS/mobile browsers
      } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    };

    handleScrollLock();
    window.addEventListener('resize', handleScrollLock);

    return () => {
      window.removeEventListener('resize', handleScrollLock);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleNewChat = () => {
    setActiveSession('new');
    if (window.innerWidth < 768) setShowMobileSidebar(false);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Evaluate the data context for ChatMessages
  const activeMessages = messages.filter((m) => m.sessionId === activeSession);
  const currentSession =
    activeSession === 'new' ? { _id: 'new', topic: 'New Conversation' } : sessions.find((s) => s._id === activeSession);

  // Check if we hit the limit which indicates there MIGHT be more to load
  const incomingSessions = fetchedData?.chatsessionList || fetchedData || [];
  const hasMore = incomingSessions.length === limit;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full h-full md:h-[85vh] md:w-[90vw] md:max-w-5xl md:rounded-[2rem] shadow-2xl flex overflow-hidden relative animate-in zoom-in-95 duration-200">
        <ChatSession
          profile={profile}
          sessions={sessions}
          setSessions={setSessions}
          activeSession={activeSession}
          setActiveSession={setActiveSession}
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
          onNewChat={handleNewChat}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isFetching={isFetching}
          setMessages={setMessages}
        />

        <ChatMessages
          profile={profile}
          activeSession={activeSession}
          currentSession={currentSession}
          activeMessages={activeMessages}
          hasSessions={sessions.length > 0}
          onClose={onClose}
          setShowMobileSidebar={setShowMobileSidebar}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
};
