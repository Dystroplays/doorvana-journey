import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="text-6xl mb-6">🏗️🏠🚪🏢🔧</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Doorvana Customer Journey Map
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Interactive customer journey visualization for Doorvana's Salesforce implementation
          across 5 business segments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/journey"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            View Journey Map →
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Admin Panel
          </Link>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            <strong>Segments:</strong> Custom Home Builders • Retail (North TX) • Garage Door Dealers
            • Commercial Bidding • Commercial Service
          </p>
        </div>
      </div>
    </div>
  );
}
