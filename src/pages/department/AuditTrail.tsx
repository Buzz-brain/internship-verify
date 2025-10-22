
import React, { useEffect, useState } from 'react';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search } from 'lucide-react';

import { auditApi, AuditLog } from '../../api/audit';

const actionOptions = [
  { value: 'all', label: 'All Actions' },
  { value: 'User Added', label: 'User Added' },
  { value: 'User Deleted', label: 'User Deleted' },
  { value: 'Submission Approved', label: 'Submission Approved' },
  { value: 'Settings Changed', label: 'Settings Changed' },
];


const AuditTrail: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await auditApi.getAuditLogs();
      setLogs(data);
    } catch (err) {
      // TODO: handle error (show toast)
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const userName = typeof log.user === 'string' ? log.user : (log.user?.name || '');
    let details = log.details;
    if (typeof details === 'object' && details !== null) {
      try {
        details = JSON.stringify(details);
      } catch {
        details = '[object]';
      }
    }
    details = details || '';
    return (
      (action === 'all' || log.action === action) &&
      (userName.toLowerCase().includes(search.toLowerCase()) ||
        details.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const getStatusBadge = (status: string) => {
      switch (status) {
        case 'pending':
          return <Badge variant="warning">Pending</Badge>;
        case 'under_review':
          return <Badge className="bg-orange-500 text-white">Under Review</Badge>; // orange
        case 'supervisor_verified':
          return <Badge variant="info">Supervisor Verified</Badge>;
        case 'rejected':
          return <Badge variant="danger">Rejected</Badge>;
        case 'department_approved':
          return (
            <Badge className="bg-purple-200 text-purple-900">
              Department Approved
            </Badge>
          ); // purple
        case 'verified':
          return <Badge variant="success">Blockchain Verified</Badge>;
        default:
          return <Badge>Unknown</Badge>;
      }
    }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Trail</h1>
        <p className="text-gray-600">View all department activity logs for transparency and accountability.</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-3xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by user or details..."
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select
          options={actionOptions}
          value={action}
          onChange={e => setAction(e.target.value)}
        />
      </div>

      {/* Audit Log Table with Loading Overlay */}
      <div className="relative overflow-x-auto">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">No audit logs found.</td>
              </tr>
            ) : filteredLogs.map(log => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{log.date ? new Date(log.date).toLocaleString() : ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{typeof log.user === 'string' ? log.user : (log.user?.name || '')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{log.action}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{
                  typeof log.details === 'object' && log.details !== null
                    ? JSON.stringify(log.details)
                    : (log.details || '')
                }</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(log.status || 'info')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTrail;
