
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { BarChart3, PieChart, Users, CheckCircle, XCircle, FileText, Calendar } from 'lucide-react';
import { Input } from '../../components/ui/Input';

import { analyticsApi } from '../../api/analytics';

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await analyticsApi.getDepartmentAnalytics({
        start: dateRange.start || undefined,
        end: dateRange.end || undefined,
      });
      setStats(data);
    } catch (err) {
      // TODO: handle error (show toast)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, [dateRange.start, dateRange.end]);

  const statCards = [
    { title: 'Total Submissions', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { title: 'Pending', value: stats.pending, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Visualize department performance, trends, and key metrics.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-8">
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <Calendar className="h-5 w-5 text-gray-400" />
          <Input
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange(r => ({ ...r, start: e.target.value }))}
            className="w-36"
          />
          <span className="mx-2 text-gray-400">to</span>
          <Input
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange(r => ({ ...r, end: e.target.value }))}
            className="w-36"
          />
        </div>
      </div>

      {/* Stat Cards & Charts with Loading Overlay */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx}>
                <CardContent className="py-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${stat.bg}`}><Icon className={`h-6 w-6 ${stat.color}`} /></div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Charts Section (placeholders) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="py-8 flex flex-col items-center justify-center">
              <BarChart3 className="h-16 w-16 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submissions Over Time</h3>
              <p className="text-gray-500">(Bar chart placeholder)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-8 flex flex-col items-center justify-center">
              <PieChart className="h-16 w-16 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Status Breakdown</h3>
              <p className="text-gray-500">(Pie chart placeholder)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
