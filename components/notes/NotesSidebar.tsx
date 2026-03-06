'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { X, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import NoteCard from './NoteCard';
import CreateNoteForm from './CreateNoteForm';
import { USER_STORAGE_KEY } from './constants';

interface NotesSidebarProps {
  currentUser: string;
  onClose: () => void;
  onSwitchUser: () => void;
}

export default function NotesSidebar({ currentUser, onClose, onSwitchUser }: NotesSidebarProps) {
  const notes = useQuery(api.notes.list) ?? [];
  const [showCreate, setShowCreate] = useState(false);
  const [showResolved, setShowResolved] = useState(false);

  const activeNotes = notes.filter((n) => !n.resolvedAt);
  const resolvedNotes = notes.filter((n) => !!n.resolvedAt);

  return (
    <aside className="fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Notes</h2>
          <button
            onClick={onSwitchUser}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            You are <span className="font-medium text-gray-700">{currentUser}</span> — switch
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Create form */}
      {showCreate && (
        <CreateNoteForm
          currentUser={currentUser}
          onDone={() => setShowCreate(false)}
        />
      )}

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto">
        {/* Active notes */}
        <div className="p-3 flex flex-col gap-2">
          {activeNotes.length === 0 && !showCreate && (
            <p className="text-xs text-gray-400 text-center py-6">No active notes. Create one!</p>
          )}
          {activeNotes.map((note) => (
            <NoteCard key={note._id} note={note} currentUser={currentUser} />
          ))}
        </div>

        {/* Resolved section */}
        {resolvedNotes.length > 0 && (
          <div className="border-t border-gray-100">
            <button
              onClick={() => setShowResolved((v) => !v)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {showResolved ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
              {resolvedNotes.length} resolved
            </button>
            {showResolved && (
              <div className="px-3 pb-3 flex flex-col gap-2">
                {resolvedNotes.map((note) => (
                  <NoteCard key={note._id} note={note} currentUser={currentUser} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
