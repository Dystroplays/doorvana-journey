'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { Building2, Home, DoorOpen, Building, Wrench, FileText, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const segments = useQuery(api.segments.getAllWithRelations);

  if (!segments) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalPhases = segments.reduce((acc, s) => acc + (s.phases?.length || 0), 0);
  const totalSteps = segments.reduce(
    (acc, s) => acc + (s.phases?.reduce((a, p) => a + (p.steps?.length || 0), 0) || 0),
    0
  );
  const totalRequirements = segments.reduce((acc, s) => acc + (s.requirements?.length || 0), 0);
  const totalDecisions = segments.reduce((acc, s) => acc + (s.decisions?.length || 0), 0);
  const unresolvedDecisions = segments.reduce(
    (acc, s) => acc + (s.decisions?.filter((d) => !d.isResolved).length || 0),
    0
  );

  const iconMap: Record<string, any> = {
    builders: Building2,
    retail: Home,
    dealers: DoorOpen,
    commercial: Building,
    service: Wrench,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-gray-600">
          Overview of your Doorvana customer journey data
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Segments"
          value={segments.length}
          icon="🏗️"
          color="blue"
        />
        <StatCard
          title="Total Phases"
          value={totalPhases}
          icon="📊"
          color="purple"
        />
        <StatCard
          title="Total Steps"
          value={totalSteps}
          icon="📝"
          color="green"
        />
        <StatCard
          title="Open Decisions"
          value={unresolvedDecisions}
          icon="⚠️"
          color="yellow"
        />
      </div>

      {/* Segments Overview */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Segments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.map((segment) => {
            const Icon = iconMap[segment.key] || Building2;
            return (
              <Link
                key={segment._id}
                href={`/admin/segments`}
                className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{segment.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 truncate">
                      {segment.label}
                    </h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{segment.phases?.length || 0}</span>
                        <span>phases</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {segment.phases?.reduce((a, p) => a + (p.steps?.length || 0), 0) || 0}
                        </span>
                        <span>steps</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{segment.requirements?.length || 0}</span>
                        <span>requirements</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            title="Manage Segments"
            description="Add, edit, or delete business segments"
            href="/admin/segments"
            icon={<Building2 className="w-6 h-6" />}
          />
          <QuickActionCard
            title="Manage Phases"
            description="Configure workflow phases"
            href="/admin/phases"
            icon={<FileText className="w-6 h-6" />}
          />
          <QuickActionCard
            title="Review Decisions"
            description={`${unresolvedDecisions} open decisions need attention`}
            href="/admin/decisions"
            icon={<AlertCircle className="w-6 h-6" />}
            highlight={unresolvedDecisions > 0}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
  }[color];

  return (
    <div className={`p-6 rounded-lg ${colorClasses}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl opacity-50">{icon}</div>
      </div>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
  highlight = false,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block p-6 rounded-lg border transition-all ${
        highlight
          ? 'bg-yellow-50 border-yellow-300 hover:border-yellow-400 hover:shadow-md'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={highlight ? 'text-yellow-700' : 'text-gray-700'}>{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}
