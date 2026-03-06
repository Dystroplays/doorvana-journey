'use client';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { Trash2, Eye, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Doc<'notes'>;
  currentUser: string;
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NoteCard({ note, currentUser }: NoteCardProps) {
  const markSeen = useMutation(api.notes.markSeen);
  const markResolved = useMutation(api.notes.markResolved);
  const remove = useMutation(api.notes.remove);

  const isResolved = !!note.resolvedAt;
  const isSeen = !!note.seenAt;
  const isAssignee = note.assignedTo === currentUser;
  const isCreator = note.createdBy === currentUser;

  return (
    <div
      className={cn(
        'rounded-xl border p-3.5 transition-colors',
        isResolved
          ? 'bg-gray-50 border-gray-200 opacity-60'
          : 'bg-yellow-50 border-yellow-200'
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
          <span>{note.createdBy}</span>
          <ArrowRight className="w-3 h-3" />
          <span className={cn(isAssignee && !isResolved ? 'text-gray-900 font-semibold' : '')}>
            {note.assignedTo}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isResolved && (
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
              Resolved
            </span>
          )}
          {!isResolved && isSeen && (
            <span className="text-[10px] font-semibold text-green-600 uppercase tracking-wide">
              Seen
            </span>
          )}
          {isCreator && (
            <button
              onClick={() => remove({ id: note._id })}
              className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-800 leading-snug mb-3 whitespace-pre-wrap">{note.content}</p>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          {timeAgo(note._creationTime)}
        </span>
        <div className="flex gap-2">
          {!isSeen && isAssignee && !isResolved && (
            <button
              onClick={() => markSeen({ id: note._id })}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Mark seen
            </button>
          )}
          {isSeen && !isResolved && (
            <button
              onClick={() => markResolved({ id: note._id })}
              className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-800 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Resolve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
