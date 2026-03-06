import Link from 'next/link';
import { Settings, Home } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-gray-900" />
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto">
            <NavLink href="/admin" exact>
              Dashboard
            </NavLink>
            <NavLink href="/admin/segments">Segments</NavLink>
            <NavLink href="/admin/phases">Phases</NavLink>
            <NavLink href="/admin/steps">Steps</NavLink>
            <NavLink href="/admin/requirements">Requirements</NavLink>
            <NavLink href="/admin/decisions">Decisions</NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  children,
  exact = false,
}: {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}) {
  // Note: In a real app, you'd use usePathname() from next/navigation
  // For now, this is a simplified version
  return (
    <Link
      href={href}
      className="inline-flex items-center px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors whitespace-nowrap"
    >
      {children}
    </Link>
  );
}
