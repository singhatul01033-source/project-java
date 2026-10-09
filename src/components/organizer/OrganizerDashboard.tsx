import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem, TicketTier } from '../../types';
import { StatsCard } from '../common/StatsCard';
import {
  Calendar,
  Ticket,
  Mail,
  BarChart2,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  CalendarCheck
} from 'lucide-react';

export const OrganizerDashboard: React.FC = () => {
  const {
    currentUser,
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    addTicketTier,
    updateTicketTier,
    deleteTicketTier,
    sendAnnouncement,
    announcements,
    registrations,
    setSelectedEventForDetails,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'events' | 'tickets' | 'messages' | 'stats' | 'upcoming'>('events');

  // Filter events belonging to current organizer (or show all if admin switched)
  const myEvents = events.filter((e) => e.organizerId === currentUser.id);
  // If demo organizer doesn't have events yet, allow viewing all or creating
  const displayEvents = myEvents.length > 0 ? myEvents : events;

  // --- Create Event Modal State ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'Technology' as EventItem['category'],
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    venue: '',
    isVirtual: false,
    virtualLink: '',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    capacity: 500,
    tags: 'Conference, Innovation',
    // Initial ticket tier
    tierName: 'General Admission',
    tierPrice: 99,
    tierQuantity: 400,
  });

  // --- Add Ticket Tier Modal State ---
  const [selectedEventForTier, setSelectedEventForTier] = useState<EventItem | null>(null);
  const [ticketTierForm, setTicketTierForm] = useState({
    name: '',
    price: 49,
    quantity: 100,
    description: '',
    isActive: true,
  });

  // --- Communication Form State ---
  const [messageForm, setMessageForm] = useState({
    eventId: displayEvents[0]?.id || '',
    title: '',
    message: '',
    priority: 'normal' as 'normal' | 'important' | 'urgent',
  });

  // Computations
  const totalMyRegistrations = registrations.filter((r) =>
    displayEvents.some((e) => e.id === r.eventId)
  );
  const totalRevenue = totalMyRegistrations.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalSeats = displayEvents.reduce((sum, e) => sum + e.capacity, 0);
  const totalBooked = displayEvents.reduce((sum, e) => sum + e.registeredCount, 0);

  // Handle Event Creation
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.venue.trim()) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title: eventForm.title,
        description: eventForm.description,
        category: eventForm.category,
        date: eventForm.date,
        time: eventForm.time,
        venue: eventForm.venue,
        isVirtual: eventForm.isVirtual,
        virtualLink: eventForm.virtualLink,
        bannerUrl: eventForm.bannerUrl,
        capacity: Number(eventForm.capacity),
        tags: eventForm.tags.split(',').map((t) => t.trim()),
      });
      setEditingEvent(null);
    } else {
      createEvent({
        title: eventForm.title,
        description: eventForm.description,
        category: eventForm.category,
        date: eventForm.date,
        time: eventForm.time,
        venue: eventForm.venue,
        isVirtual: eventForm.isVirtual,
        virtualLink: eventForm.virtualLink,
        bannerUrl: eventForm.bannerUrl,
        capacity: Number(eventForm.capacity),
        tags: eventForm.tags.split(',').map((t) => t.trim()),
        ticketTiers: [
          {
            id: 'tkt-' + Date.now(),
            eventId: '',
            name: eventForm.tierName || 'General Admission',
            price: Number(eventForm.tierPrice) || 0,
            quantity: Number(eventForm.tierQuantity) || 100,
            sold: 0,
            description: 'Standard event access pass.',
            isActive: true,
          },
        ],
      });
    }

    setIsCreateModalOpen(false);
  };

  // Open Edit Form
  const openEditModal = (evt: EventItem) => {
    setEditingEvent(evt);
    setEventForm({
      title: evt.title,
      description: evt.description,
      category: evt.category,
      date: evt.date,
      time: evt.time,
      venue: evt.venue,
      isVirtual: evt.isVirtual,
      virtualLink: evt.virtualLink || '',
      bannerUrl: evt.bannerUrl,
      capacity: evt.capacity,
      tags: evt.tags?.join(', ') || '',
      tierName: '',
      tierPrice: 0,
      tierQuantity: 0,
    });
    setIsCreateModalOpen(true);
  };

  // Handle Add Ticket Tier
  const handleAddTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForTier || !ticketTierForm.name) return;
    addTicketTier(selectedEventForTier.id, {
      name: ticketTierForm.name,
      price: Number(ticketTierForm.price),
      quantity: Number(ticketTierForm.quantity),
      description: ticketTierForm.description,
      isActive: ticketTierForm.isActive,
    });
    setSelectedEventForTier(null);
    setTicketTierForm({
      name: '',
      price: 49,
      quantity: 100,
      description: '',
      isActive: true,
    });
  };

  // Handle Send Announcement
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.eventId || !messageForm.title.trim() || !messageForm.message.trim()) return;
    sendAnnouncement(
      messageForm.eventId,
      messageForm.title.trim(),
      messageForm.message.trim(),
      messageForm.priority
    );
    setMessageForm({
      eventId: displayEvents[0]?.id || '',
      title: '',
      message: '',
      priority: 'normal',
    });
  };

  // Filter announcements for current organizer
  const myAnnouncements = announcements.filter((a) =>
    displayEvents.some((e) => e.id === a.eventId)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Event Producer Console</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Organizer Command Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Design event programs, configure ticketing inventory tiers, broadcast attendee announcements, and analyze sales.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'events' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events ({displayEvents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tickets' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Ticketing</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'messages' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Communications</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'stats' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Sales Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upcoming' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Deadlines</span>
          </button>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="My Managed Events"
          value={displayEvents.length}
          subtitle={`${displayEvents.filter((e) => e.status === 'approved').length} Active · ${displayEvents.filter((e) => e.status === 'pending').length} In Review`}
          icon={CalendarCheck}
          accentColor="indigo"
        />
        <StatsCard
          title="Total Ticket Registrations"
          value={totalBooked}
          subtitle={`Capacity filled across catalog`}
          icon={Users}
          trend={{ value: `${Math.round((totalBooked / (totalSeats || 1)) * 100)}% filled`, isPositive: true }}
          accentColor="emerald"
        />
        <StatsCard
          title="Gross Sales Generated"
          value={`$${totalRevenue.toLocaleString()}`}
          subtitle={`${totalMyRegistrations.length} verified ticket transactions`}
          icon={DollarSign}
          accentColor="amber"
        />
        <StatsCard
          title="Attendee Broadcasts"
          value={myAnnouncements.length}
          subtitle="Updates dispatched to guests"
          icon={Mail}
          accentColor="cyan"
        />
      </div>

      {/* ======================================================== */}
      {/* TAB 1: EVENT MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'events' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">Events Management Table</h3>
              <p className="text-xs text-slate-500">
                Create new event submissions, adjust scheduling, update venues, or withdraw events.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingEvent(null);
                setEventForm({
                  title: '',
                  description: '',
                  category: 'Technology',
                  date: new Date().toISOString().split('T')[0],
                  time: '10:00 AM',
                  venue: '',
                  isVirtual: false,
                  virtualLink: '',
                  bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
                  capacity: 500,
                  tags: 'Conference, Tech',
                  tierName: 'General Admission',
                  tierPrice: 99,
                  tierQuantity: 400,
                });
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Event</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Event & Category</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Location / Format</th>
                    <th className="py-3 px-4">Capacity & Registrations</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayEvents.map((evt) => (
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
                        <div className="font-semibold text-slate-800">{evt.date}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{evt.time}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">
                        {evt.isVirtual ? (
                          <span className="text-cyan-700 font-medium">Virtual Livestream</span>
                        ) : (
                          <span className="text-slate-800 font-medium truncate block">{evt.venue}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {evt.registeredCount} / {evt.capacity}
                        </div>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, (evt.registeredCount / evt.capacity) * 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            evt.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : evt.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {evt.status}
                        </span>
                        {evt.rejectionReason && (
                          <div className="text-[10px] text-rose-600 mt-0.5 max-w-xs truncate">
                            Reason: {evt.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedEventForDetails(evt)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Preview Event"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(evt)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Edit Event"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete event "${evt.title}"?`)) {
                                deleteEvent(evt.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: TICKET MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'tickets' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Ticketing Inventory & Pricing Tiers</h3>
              <p className="text-xs text-slate-500">Configure ticket tiers, pricing, quantities, and sales availability.</p>
            </div>
          </div>

          <div className="space-y-6">
            {displayEvents.map((evt) => (
              <div key={evt.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img src={evt.bannerUrl} alt={evt.title} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{evt.title}</h4>
                      <div className="text-xs text-slate-500">
                        {evt.date} · Venue: {evt.venue} · Capacity: {evt.capacity}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedEventForTier(evt);
                      setTicketTierForm({
                        name: '',
                        price: 49,
                        quantity: 100,
                        description: '',
                        isActive: true,
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Ticket Tier</span>
                  </button>
                </div>

                {/* Tiers List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {evt.ticketTiers.map((tier) => {
                    const remaining = tier.quantity - tier.sold;
                    return (
                      <div
                        key={tier.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors relative flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900 text-xs">{tier.name}</span>
                            <span className="font-mono font-bold text-indigo-600 text-sm">${tier.price}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mb-3">{tier.description}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 text-xs">
                          <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                            <span>Sold: {tier.sold} / {tier.quantity}</span>
                            <span className="font-medium text-emerald-600">{remaining} Left</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mb-3">
                            <div
                              className="bg-indigo-600 h-1.5 rounded-full"
                              style={{ width: `${Math.min(100, (tier.sold / tier.quantity) * 100)}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tier.isActive}
                                onChange={(e) =>
                                  updateTicketTier(evt.id, tier.id, { isActive: e.target.checked })
                                }
                                className="w-3.5 h-3.5 rounded text-indigo-600"
                              />
                              <span className="text-slate-600">On Sale</span>
                            </label>

                            {evt.ticketTiers.length > 1 && (
                              <button
                                onClick={() => {
                                  if (confirm(`Remove ticket tier "${tier.name}"?`)) {
                                    deleteTicketTier(evt.id, tier.id);
                                  }
                                }}
                                className="text-rose-500 hover:text-rose-700 text-[11px] font-medium"
                              >
                                Delete Tier
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ATTENDEE COMMUNICATION */}
      {/* ======================================================== */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-in fade-in-50 duration-200">
          {/* Dispatch Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Dispatch Attendee Broadcast</h3>
            <p className="text-xs text-slate-500 mb-4">
              Send notifications, schedule updates, or urgent venue instructions to all registered attendees.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Event *</label>
                <select
                  value={messageForm.eventId}
                  onChange={(e) => setMessageForm({ ...messageForm, eventId: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {displayEvents.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({evt.registeredCount} Attendees)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
                <select
                  value={messageForm.priority}
                  onChange={(e) =>
                    setMessageForm({ ...messageForm, priority: e.target.value as 'normal' | 'important' | 'urgent' })
                  }
                  className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="normal">Normal Information</option>
                  <option value="important">Important Update</option>
                  <option value="urgent">Urgent / Alert (Push Priority)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Keynote Schedule & Gate Pass Instructions"
                  value={messageForm.title}
                  onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Broadcast Message Body *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type clear instructions, schedule adjustments, or parking details for attendees..."
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Broadcast to Attendees</span>
              </button>
            </form>
          </div>

          {/* Broadcast Log */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Communication History</h3>
                <p className="text-xs text-slate-500">Record of sent broadcasts with delivered recipient counts.</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                {myAnnouncements.length} Sent
              </span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto">
              {myAnnouncements.map((anc) => (
                <div
                  key={anc.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm">{anc.title}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        anc.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : anc.priority === 'important'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {anc.priority}
                    </span>
                  </div>
                  <div className="text-[11px] text-indigo-600 font-semibold mb-2">Event: {anc.eventTitle}</div>
                  <p className="text-slate-600 leading-relaxed mb-3">{anc.message}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[11px] text-slate-400">
                    <span>Delivered to: <strong className="text-slate-700">{anc.recipientCount} Attendees</strong></span>
                    <span>{new Date(anc.createdAt).toLocaleDateString()} at {new Date(anc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
              {myAnnouncements.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No broadcasts dispatched yet. Use the form on the left to send notifications.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: EVENT STATISTICS & DEMOGRAPHICS */}
      {/* ======================================================== */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Breakdown by Event */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">Event Revenue Performance</h3>
              <p className="text-xs text-slate-500 mb-4">Gross ticket sales volume across your managed portfolio</p>

              <div className="space-y-4">
                {displayEvents.map((evt) => {
                  const eventRegs = registrations.filter((r) => r.eventId === evt.id);
                  const rev = eventRegs.reduce((sum, r) => sum + r.totalAmount, 0);
                  const maxRev = 10000;
                  const percent = Math.min(100, Math.round((rev / maxRev) * 100));

                  return (
                    <div key={evt.id} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800 truncate max-w-xs">{evt.title}</span>
                        <span className="font-mono font-bold text-emerald-600">${rev.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${percent || 15}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attendee Demographics & Roles */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">Attendee Demographics & Pass Types</h3>
              <p className="text-xs text-slate-500 mb-4">Breakdown of purchased tiers and participation rates</p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>VIP & Premium Tiers</span>
                    <span className="text-indigo-600">32%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>General Admission & Standard</span>
                    <span className="text-indigo-600">54%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '54%' }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>Early Bird / Student Passes</span>
                    <span className="text-indigo-600">14%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '14%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: UPCOMING EVENTS & KEY DEADLINES */}
      {/* ======================================================== */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Upcoming Events & Production Milestones</h3>
            <p className="text-xs text-slate-500">Timeline of event dates, registration closing, and technical runs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-bold text-indigo-600">{evt.date}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {evt.time}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{evt.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Key Deadline: Speaker Deck Review</span>
                    <span className="font-semibold text-amber-600">3 Days Prior</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Badge Printing & On-Site Setup</span>
                    <span className="font-semibold text-slate-800">1 Day Prior</span>
                  </div>
                  <button
                    onClick={() => setSelectedEventForDetails(evt)}
                    className="w-full mt-2 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-center"
                  >
                    View Operational Brief →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CREATE / EDIT EVENT MODAL --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingEvent ? 'Edit Event Details' : 'Create New Event Submission'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Agents Global Expo 2026"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comprehensive event brief, agenda topics, and speaker highlights..."
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, category: e.target.value as EventItem['category'] })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Music & Concerts">Music & Concerts</option>
                    <option value="Business & Startup">Business & Startup</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="Workshops & Education">Workshops & Education</option>
                    <option value="Gaming & Esports">Gaming & Esports</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Capacity *</label>
                  <input
                    type="number"
                    min="10"
                    max="50000"
                    required
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Date (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:30 AM"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue / Physical Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Ballroom, Hyatt Regency or Virtual Stream"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <input
                  type="checkbox"
                  id="isVirtual"
                  checked={eventForm.isVirtual}
                  onChange={(e) => setEventForm({ ...eventForm, isVirtual: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <label htmlFor="isVirtual" className="font-semibold text-slate-800 cursor-pointer">
                  This is an Online / Hybrid Virtual Event
                </label>
              </div>

              {eventForm.isVirtual && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Virtual Stream / Meeting Link</label>
                  <input
                    type="url"
                    placeholder="https://zoom.us/j/123456789"
                    value={eventForm.virtualLink}
                    onChange={(e) => setEventForm({ ...eventForm, virtualLink: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={eventForm.bannerUrl}
                  onChange={(e) => setEventForm({ ...eventForm, bannerUrl: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {!editingEvent && (
                <div className="p-3 rounded-lg border border-indigo-100 bg-indigo-50/50 space-y-3">
                  <h4 className="font-bold text-indigo-900 text-xs">Primary Ticket Tier Setup</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-700 mb-1 font-medium">Tier Name</label>
                      <input
                        type="text"
                        value={eventForm.tierName}
                        onChange={(e) => setEventForm({ ...eventForm, tierName: e.target.value })}
                        className="w-full p-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1 font-medium">Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={eventForm.tierPrice}
                        onChange={(e) => setEventForm({ ...eventForm, tierPrice: Number(e.target.value) })}
                        className="w-full p-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1 font-medium">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={eventForm.tierQuantity}
                        onChange={(e) => setEventForm({ ...eventForm, tierQuantity: Number(e.target.value) })}
                        className="w-full p-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  {editingEvent ? 'Save Event Changes' : 'Submit Event For Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD TICKET TIER MODAL --- */}
      {selectedEventForTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-base font-bold text-slate-900">
                Add Ticket Tier: {selectedEventForTier.title}
              </h3>
              <button
                onClick={() => setSelectedEventForTier(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTier} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Backstage All-Access"
                  value={ticketTierForm.name}
                  onChange={(e) => setTicketTierForm({ ...ticketTierForm, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={ticketTierForm.price}
                    onChange={(e) => setTicketTierForm({ ...ticketTierForm, price: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={ticketTierForm.quantity}
                    onChange={(e) => setTicketTierForm({ ...ticketTierForm, quantity: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Perks & Description</label>
                <textarea
                  rows={2}
                  placeholder="Details of what this ticket pass includes..."
                  value={ticketTierForm.description}
                  onChange={(e) => setTicketTierForm({ ...ticketTierForm, description: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedEventForTier(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold"
                >
                  Add Ticket Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
