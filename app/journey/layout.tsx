import Link from 'next/link';
import { Map, Home } from 'lucide-react';
import NotesWidget from '@/components/notes/NotesWidget';

export default function JourneyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Map className="w-6 h-6 text-gray-900" />
              <h1 className="text-xl font-bold text-gray-900">Journey Map</h1>
            </div>
            <div className="flex items-center gap-2">
              <NotesWidget />
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
