import React, { useEffect, useState } from "react";
import { Globe, Users, Monitor, MapPin, Activity } from "lucide-react";

interface AnalyticsData {
  stats: {
    totalVisitors: number;
    uniqueCountries: number;
    browsers: Record<string, number>;
    devices: Record<string, number>;
  };
  visitors: Array<{
    ip: string;
    timestamp: string;
    geo?: {
      country: string;
      city: string;
      regionName: string;
    };
    parsedUA: {
      browser: { name: string; version: string };
      os: { name: string; version: string };
      device: { type?: string };
    };
    screenResolution: string;
    language: string;
    colorScheme: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchAnalytics = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-analytics", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401) {
        setError("Invalid token");
        setIsAuthenticated(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalytics(token);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-950 dark:to-dark-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-dark-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-2">
                Access Token
              </label>
              <input
                type="password"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
                placeholder="Enter your admin token"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-dark-600 dark:text-dark-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Portfolio Analytics</h1>
          <button
            onClick={() => fetchAnalytics(token)}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} label="Total Visitors" value={analytics?.stats.totalVisitors || 0} color="blue" />
          <StatCard
            icon={Globe}
            label="Unique Countries"
            value={analytics?.stats.uniqueCountries || 0}
            color="green"
          />
          <StatCard
            icon={Monitor}
            label="Most Used Browser"
            value={
              Object.entries(analytics?.stats.browsers || {}).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || "N/A"
            }
            color="purple"
          />
          <StatCard
            icon={MapPin}
            label="Device Types"
            value={Object.keys(analytics?.stats.devices || {}).length}
            color="orange"
          />
        </div>

        {/* Browser Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-dark-900 dark:text-white">Browsers</h2>
            <div className="space-y-3">
              {Object.entries(analytics?.stats.browsers || {}).map(([browser, count]) => (
                <div key={browser} className="flex items-center justify-between">
                  <span className="text-dark-700 dark:text-dark-200">{browser}</span>
                  <span className="font-semibold text-primary-600">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-dark-900 dark:text-white">Device Types</h2>
            <div className="space-y-3">
              {Object.entries(analytics?.stats.devices || {}).map(([device, count]) => (
                <div key={device} className="flex items-center justify-between">
                  <span className="text-dark-700 dark:text-dark-200 capitalize">{device}</span>
                  <span className="font-semibold text-primary-600">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Visitors */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-dark-900 dark:text-white">Recent Visitors</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-200 dark:border-dark-700">
                  <th className="text-left py-3 px-4 text-dark-700 dark:text-dark-200">Time</th>
                  <th className="text-left py-3 px-4 text-dark-700 dark:text-dark-200">Location</th>
                  <th className="text-left py-3 px-4 text-dark-700 dark:text-dark-200">Ip address</th>
                  <th className="text-left py-3 px-4 text-dark-700 dark:text-dark-200">Browser</th>
                  <th className="text-left py-3 px-4 text-dark-700 dark:text-dark-200">Device</th>
                  <th className="text-left py-3 px-4 text-dark-700 dark:text-dark-200">Screen</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.visitors.map((visitor, index) => (
                  <tr key={index} className="border-b border-dark-100 dark:border-dark-700">
                    <td className="py-3 px-4 text-dark-600 dark:text-dark-300">
                      {new Date(visitor.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-dark-600 dark:text-dark-300">
                      {visitor.geo ? `${visitor.geo.city}, ${visitor.geo.country}` : "Unknown"}
                    </td>
                    <td className="py-3 px-4 text-dark-600 dark:text-dark-300">
                     {visitor?.ip || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-dark-600 dark:text-dark-300">
                      {visitor.parsedUA.browser.name} {visitor.parsedUA.browser.version}
                    </td>
                    <td className="py-3 px-4 text-dark-600 dark:text-dark-300">
                      {visitor.parsedUA.os.name} {visitor.parsedUA.os.version}
                    </td>
                    <td className="py-3 px-4 text-dark-600 dark:text-dark-300">{visitor.screenResolution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: "blue" | "green" | "purple" | "orange";
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
    green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300",
    orange: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300",
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-2xl font-bold text-dark-900 dark:text-white mb-1">{value}</p>
      <p className="text-sm text-dark-600 dark:text-dark-400">{label}</p>
    </div>
  );
};

export default Dashboard;
