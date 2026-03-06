'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { USERS, User } from './constants';

interface CreateNoteFormProps {
  currentUser: string;
  onDone: () => void;
}

export default function CreateNoteForm({ currentUser, onDone }: CreateNoteFormProps) {
  const otherUsers = USERS.filter((u) => u !== currentUser) as User[];
  const [content, setContent] = useState('');
  const [assignedTo, setAssignedTo] = useState<string>(otherUsers[0] ?? USERS[0]);
  const [submitting, setSubmitting] = useState(false);

  const createNote = useMutation(api.notes.create);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await createNote({ content: content.trim(), createdBy: currentUser, assignedTo });
    setSubmitting(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border-b border-gray-100">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a note..."
        rows={3}
        className="w-full text-sm rounded-lg border border-gray-200 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
        autoFocus
      />
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 font-medium flex-shrink-0">Assign to</label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="flex-1 text-sm rounded-lg border border-gray-200 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {USERS.map((u) => (
            <option key={u} value={u}>
              {u}{u === currentUser ? ' (you)' : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onDone}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="px-4 py-1.5 text-sm font-semibold bg-gray-900 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        >
          {submitting ? 'Posting...' : 'Post note'}
        </button>
      </div>
    </form>
  );
}
