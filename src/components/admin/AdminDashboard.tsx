import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, EventItem } from '../../types';
import { StatsCard } from '../common/StatsCard';
import {
  Users,
  CalendarCheck,
  Settings,
  BarChart3,
  Activity,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Edit2,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  Clock,
  Sparkles,
  Save,
  RotateCcw,
  AlertTriangle,
  Filter
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    events,
    approveEvent,
    rejectEvent,
    registrations,
    auditLogs,
    settings,
    updateSettings,
    setSelectedEventForDetails,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'approvals' | 'settings' | 'logs'>('overview');

  // --- User Management State ---
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'attendee' as UserRole,
    phone: '',
    organization: '',
    status: 'active' as 'active' | 'suspended',
    bio: '',
  });

  // --- Event Approvals State ---
  const [rejectionModalEvent, setRejectionModalEvent] = useState<EventItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // --- Settings Form State ---
  const [settingsForm, setSettingsForm] = useState(settings);

  // Sync settingsForm if settings changes
  React.useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Statistics Computations
  const totalUsers = users.length;
  const totalEvents = events.length;
  const pendingEvents = events.filter((e) => e.status === 'pending');
  const approvedEvents = events.filter((e) => e.status === 'approved');
  const totalRegistrations = registrations.length;
  const totalGrossRevenue = registrations.reduce((sum, r) => sum + r.totalAmount, 0);
  const platformRevenue = Math.round((totalGrossRevenue * settings.platformFeePercent) / 100);

  // Category statistics
  const eventsByCategory = events.reduce((acc, evt) => {
    acc[evt.category] = (acc[evt.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Handle User Create
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) return;
    const success = addUser({
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      role: newUserForm.role,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80`,
      phone: newUserForm.phone.trim(),
      organization: newUserForm.organization.trim(),
      status: newUserForm.status,
      bio: newUserForm.bio.trim(),
    });
    if (success) {
      setIsAddUserModalOpen(false);
      setNewUserForm({
        name: '',
        email: '',
        role: 'attendee',
        phone: '',
        organization: '',
        status: 'active',
        bio: '',
      });
    }
  };

  // Handle User Edit Save
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
      status: editingUser.status,
      phone: editingUser.phone,
      organization: editingUser.organization,
    });
    setEditingUser(null);
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.organization && u.organization.toLowerCase().includes(userSearch.toLowerCase()));
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Operations Governance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise platform users, review organizer event submissions, monitor real-time audit logs, and configure system policies.
          </p>
        </div>

        {/* Tab Controls (Functional Segmented Tabs) */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'overview' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Statistics</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'users' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Management ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'approvals' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Event Approvals</span>
            {pendingEvents.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>System Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'logs' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Activity ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW & EVENT STATISTICS */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Events"
              value={totalEvents}
              subtitle={`${approvedEvents.length} approved · ${pendingEvents.length} pending`}
              icon={CalendarCheck}
              trend={{ value: '18% this month', isPositive: true }}
              accentColor="indigo"
            />
            <StatsCard
              title="Active User Accounts"
              value={totalUsers}
              subtitle={`${users.filter((u) => u.role === 'organizer').length} organizers · ${users.filter((u) => u.role === 'attendee').length} attendees`}
              icon={Users}
              trend={{ value: '12% this month', isPositive: true }}
              accentColor="cyan"
            />
            <StatsCard
              title="Total Registrations"
              value={totalRegistrations}
              subtitle="Confirmed attendee bookings"
              icon={TrendingUp}
              trend={{ value: '24% this week', isPositive: true }}
              accentColor="emerald"
            />
            <StatsCard
              title="Gross Ticket Volume"
              value={`$${totalGrossRevenue.toLocaleString()}`}
              subtitle={`Platform Cut (~${settings.platformFeePercent}%): $${platformRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: 'Platform Revenue $', isPositive: true }}
              accentColor="amber"
            />
          </div>

          {/* Graphical Analytics & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Registration Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Event Registrations & Sales Performance</h3>
                  <p className="text-xs text-slate-500">Attendee capacity fulfillment across published events</p>
                </div>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                  Live DB Telemetry
                </span>
              </div>

              <div className="space-y-4 mt-6">
                {events.map((evt) => {
                  const percent = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));
                  return (
                    <div key={evt.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-semibold text-slate-800 truncate max-w-sm">
                          {evt.title}
                        </div>
                        <div className="text-slate-500 font-mono">
                          {evt.registeredCount} / {evt.capacity} seats ({percent}%)
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            percent >= 80 ? 'bg-amber-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">Events By Industry Category</h3>
              <p className="text-xs text-slate-500 mb-4">Catalog distribution breakdown</p>

              <div className="space-y-3">
                {Object.entries(eventsByCategory).map(([category, count]) => {
                  const share = Math.round((count / totalEvents) * 100);
                  return (
                    <div key={category} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-semibold text-slate-800">{category}</span>
                        <span className="font-mono text-slate-500 font-medium">{count} events ({share}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${share}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Approval Quick Action Widget */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-700">Pending Review Queue</span>
                  <span className="text-amber-600 font-bold">{pendingEvents.length} events awaiting</span>
                </div>
                {pendingEvents.length > 0 ? (
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="w-full py-2 px-3 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors shadow-xs"
                  >
                    Review Pending Submissions →
                  </button>
                ) : (
                  <p className="text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 text-center font-medium">
                    ✓ All organizer events are currently approved and processed!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: USER MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user by name, email, or company..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-500 px-2">Role:</span>
                {(['all', 'admin', 'organizer', 'attendee'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-2.5 py-1 text-xs rounded capitalize font-medium transition-colors ${
                      userRoleFilter === role
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New User Account</span>
            </button>
          </div>

          {/* User Accounts Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Organization / Bio</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{user.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            user.role === 'admin'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : user.role === 'organizer'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">
                        <span className="font-medium text-slate-800">{user.organization || 'Individual'}</span>
                        {user.bio && <p className="text-[11px] text-slate-400 truncate">{user.bio}</p>}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                            user.status === 'active' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          ></span>
                          <span className="capitalize">{user.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
                                deleteUser(user.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        No user accounts found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add User Modal */}
          {isAddUserModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Provision New User Account</h3>
                  <button
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreateUser} className="space-y-4 mt-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jessica Sterling"
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jessica@example.com"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                      <select
                        value={newUserForm.role}
                        onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                        className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value="attendee">Attendee</option>
                        <option value="organizer">Event Organizer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Status</label>
                      <select
                        value={newUserForm.status}
                        onChange={(e) =>
                          setNewUserForm({ ...newUserForm, status: e.target.value as 'active' | 'suspended' })
                        }
                        className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Organization / Affiliation</label>
                    <input
                      type="text"
                      placeholder="e.g. Stanford AI Lab"
                      value={newUserForm.organization}
                      onChange={(e) => setNewUserForm({ ...newUserForm, organization: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Short Bio</label>
                    <textarea
                      rows={2}
                      placeholder="Short professional introduction..."
                      value={newUserForm.bio}
                      onChange={(e) => setNewUserForm({ ...newUserForm, bio: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddUserModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                    >
                      Confirm User Creation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Update User: {editingUser.name}</h3>
                  <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSaveEditUser} className="space-y-4 mt-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Role</label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="attendee">Attendee</option>
                        <option value="organizer">Event Organizer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Status</label>
                      <select
                        value={editingUser.status}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, status: e.target.value as 'active' | 'suspended' })
                        }
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Organization</label>
                    <input
                      type="text"
                      value={editingUser.organization || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, organization: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: EVENT APPROVALS */}
      {/* ======================================================== */}
      {activeTab === 'approvals' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Event Approval Queue</h3>
              <p className="text-xs text-slate-500">
                Review submissions by Event Organizers before publishing to the attendee catalog.
              </p>
            </div>
            <div className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
              {pendingEvents.length} Pending Approval
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Event Details</th>
                    <th className="py-3 px-4">Organizer</th>
                    <th className="py-3 px-4">Schedule & Venue</th>
                    <th className="py-3 px-4">Capacity & Pricing</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.bannerUrl}
                            alt={evt.title}
                            className="w-12 h-10 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{evt.title}</div>
                            <div className="text-[11px] text-indigo-600 font-medium">{evt.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{evt.organizerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {evt.organizerId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{evt.date} · {evt.time}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]">{evt.venue}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{evt.capacity} Max Cap</div>
                        <div className="text-[11px] text-slate-500">
                          {evt.ticketTiers.length} Tier(s) (${Math.min(...evt.ticketTiers.map(t => t.price))} - ${Math.max(...evt.ticketTiers.map(t => t.price))})
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            evt.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : evt.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {evt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedEventForDetails(evt)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {evt.status === 'pending' && (
                            <>
                              <button
                                onClick={() => approveEvent(evt.id)}
                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                                title="Approve & Publish"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => setRejectionModalEvent(evt)}
                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
                                title="Reject Event"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {evt.status === 'rejected' && (
                            <button
                              onClick={() => approveEvent(evt.id)}
                              className="px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200"
                            >
                              Re-Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rejection Modal */}
          {rejectionModalEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-base mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Reject Event Submission</span>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Please provide feedback to organizer <strong className="text-slate-800">{rejectionModalEvent.organizerName}</strong> explaining why <strong className="text-slate-800">"{rejectionModalEvent.title}"</strong> cannot be approved at this time.
                </p>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Venue authorization incomplete or description violates community guidelines..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 mb-4"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setRejectionModalEvent(null);
                      setRejectionReason('');
                    }}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (rejectionReason.trim()) {
                        rejectEvent(rejectionModalEvent.id, rejectionReason.trim());
                        setRejectionModalEvent(null);
                        setRejectionReason('');
                      }
                    }}
                    className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SYSTEM SETTINGS */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs animate-in fade-in-50 duration-200 max-w-3xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">System Configuration & Policies</h3>
              <p className="text-xs text-slate-500">Fine-tune platform economics, approval automation, and communications.</p>
            </div>
            <button
              onClick={() => updateSettings(settingsForm)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </button>
          </div>

          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Platform Brand Name</label>
                <input
                  type="text"
                  value={settingsForm.platformName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, platformName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Support Email Address</label>
                <input
                  type="email"
                  value={settingsForm.supportEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Platform Commission Fee (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={settingsForm.platformFeePercent}
                  onChange={(e) => setSettingsForm({ ...settingsForm, platformFeePercent: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">Applied on every ticket transaction.</p>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Display Currency</label>
                <input
                  type="text"
                  value={settingsForm.currency}
                  onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Automation & Security Rules</h4>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div>
                  <div className="font-semibold text-slate-800">Auto-Approve Organizer Events</div>
                  <div className="text-[11px] text-slate-500">
                    Bypass administrator moderation queue; events become published immediately upon creation.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.autoApproveEvents}
                  onChange={(e) => setSettingsForm({ ...settingsForm, autoApproveEvents: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div>
                  <div className="font-semibold text-slate-800">Send Email Notifications & E-Ticket Receipts</div>
                  <div className="text-[11px] text-slate-500">
                    Dispatch automated calendar invites, QR ticket confirmations, and organizer alerts.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.sendEmailNotifications}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sendEmailNotifications: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div>
                  <div className="font-semibold text-slate-800">Platform Maintenance Mode</div>
                  <div className="text-[11px] text-slate-500">
                    Restrict public attendee ticket checkouts while executing system maintenance or database upgrades.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.maintenanceMode}
                  onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: SYSTEM ACTIVITY MONITORING / AUDIT LOGS */}
      {/* ======================================================== */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Real-Time System Activity Stream</h3>
              <p className="text-xs text-slate-500">Comprehensive immutable audit logs of administrative actions, ticket purchases, and submissions.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-600">Audit Stream Active</span>
            </div>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg mt-0.5 ${
                      log.category === 'EVENT_APPROVAL'
                        ? 'bg-amber-100 text-amber-700'
                        : log.category === 'USER_MGMT'
                        ? 'bg-indigo-100 text-indigo-700'
                        : log.category === 'TICKET_SALE'
                        ? 'bg-emerald-100 text-emerald-700'
                        : log.category === 'COMMUNICATION'
                        ? 'bg-cyan-100 text-cyan-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {log.category}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">{log.details}</p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Initiated by: <strong className="text-slate-700">{log.actorName}</strong> ({log.actorRole})
                    </div>
                  </div>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-400 shrink-0 ml-4">
                  <Clock className="w-3 h-3 inline-block mr-1 text-slate-400" />
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  <div className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
