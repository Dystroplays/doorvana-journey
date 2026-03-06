'use client';

import { useState } from 'react';
import { USERS, User, USER_STORAGE_KEY } from './constants';

interface UserIdentityModalProps {
  onSelect: (user: User) => void;
}

export default function UserIdentityModal({ onSelect }: UserIdentityModalProps) {
  const [selected, setSelected] = useState<User | null>(null);

  function handleContinue() {
    if (!selected) return;
    localStorage.setItem(USER_STORAGE_KEY, selected);
    onSelect(selected);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-80">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Who are you?</h2>
        <p className="text-sm text-gray-500 mb-6">Pick your name to leave and receive notes.</p>
        <div className="flex flex-col gap-3 mb-8">
          {USERS.map((user) => (
            <label
              key={user}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${
                selected === user
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="user"
                value={user}
                checked={selected === user}
                onChange={() => setSelected(user)}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  selected === user ? 'border-gray-900' : 'border-gray-400'
                }`}
              >
                {selected === user && (
                  <span className="w-2 h-2 rounded-full bg-gray-900" />
                )}
              </span>
              <span className="font-medium text-gray-800">{user}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
