import { useState, useEffect } from 'react';
import { ChatSession } from '../ChatSession'; // Adjust paths as necessary
import { ChatMessages } from '../ChatMessages'; // Adjust paths as necessary
import { useGetChatSessions } from '@/hooks/chatSession';

export const ChatModal = ({ onClose, profile }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  // Pagination & Fetching limits
  const [page, setPage] = useState(1);
  const limit = 4;

  const { data: fetchedData, isFetching } = useGetChatSessions(
    { query: { childId: profile?.id, sort: '-createdAt', limit, page } },
    { enabled: !!profile?.id },
  );

  // High-level state initialized empty
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState('new');

  // Reset states cleanly when modal opens for a profile
  useEffect(() => {
    setPage(1);
    setSessions([]);
  }, [profile?.id]);

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
    window.addEventListener('resize', handleScrollLock); // Handle device rotation/resize

    // Cleanup on unmount or when dependencies change
    return () => {
      window.removeEventListener('resize', handleScrollLock);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleNewChat = () => {
    setActiveSession('new');

    // Messages are now handled automatically by the ChatMessages component detecting the New Conversation
    if (window.innerWidth < 768) setShowMobileSidebar(false);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleDeleteClick = (e, sessionId) => {
    e.stopPropagation(); // Prevent row click when clicking delete
    setSessionToDelete(sessionId);
  };

  const confirmDelete = () => {
    if (!sessionToDelete) return;

    const updatedSessions = sessions.filter((s) => s._id !== sessionToDelete);
    setSessions(updatedSessions);

    // Update active session if the currently selected one was deleted
    if (activeSession === sessionToDelete) {
      setActiveSession(updatedSessions.length > 0 ? updatedSessions[0]._id : null);
    }
    setSessionToDelete(null);
  };

  const cancelDelete = () => {
    setSessionToDelete(null);
  };

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
          onDeleteClick={handleDeleteClick}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isFetching={isFetching}
        />

        <ChatMessages
          profile={profile}
          activeSession={activeSession}
          currentSession={currentSession}
          setSessions={setSessions}
          hasSessions={sessions.length > 0}
          onClose={onClose}
          setShowMobileSidebar={setShowMobileSidebar}
        />

        {/* Delete Confirmation Overlay */}
        {sessionToDelete && (
          <div className="absolute inset-0 z-[60] bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Chat Session?</h3>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone. All messages in this conversation will be permanently removed.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
