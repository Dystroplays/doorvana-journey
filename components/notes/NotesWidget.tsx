'use client';

import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StickyNote } from 'lucide-react';
import { User, USER_STORAGE_KEY } from './constants';
import UserIdentityModal from './UserIdentityModal';
import NotesSidebar from './NotesSidebar';

export default function NotesWidget() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const notes = useQuery(api.notes.list) ?? [];

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(USER_STORAGE_KEY) as User | null;
    if (stored) {
      setCurrentUser(stored);
    } else {
      setShowIdentityModal(true);
    }
  }, []);

  function handleUserSelect(user: User) {
    setCurrentUser(user);
    setShowIdentityModal(false);
  }

  function handleSwitchUser() {
    setShowIdentityModal(true);
    setSidebarOpen(false);
  }

  if (!mounted) return null;

  const unreadCount = currentUser
    ? notes.filter((n) => n.assignedTo === currentUser && !n.seenAt && !n.resolvedAt).length
    : 0;

  return (
    <>
      {showIdentityModal && <UserIdentityModal onSelect={handleUserSelect} />}

      {/* Toggle button — rendered in the header via portal-like absolute placement */}
      {currentUser && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <StickyNote className="w-4 h-4" />
          Notes
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {sidebarOpen && currentUser && (
        <NotesSidebar
          currentUser={currentUser}
          onClose={() => setSidebarOpen(false)}
          onSwitchUser={handleSwitchUser}
        />
      )}
    </>
  );
}
