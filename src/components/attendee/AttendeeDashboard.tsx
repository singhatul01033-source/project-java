import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem, Registration } from '../../types';
import { StatsCard } from '../common/StatsCard';
import {
  Compass,
  Calendar,
  Ticket,
  Bell,
  History,
  UserCheck,
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  QrCode,
  Download,
  AlertCircle,
  XCircle,
  ExternalLink,
  Tag
} from 'lucide-react';

export const AttendeeDashboard: React.FC = () => {
  const {
    currentUser,
    events,
    registrations,
    announcements,
    cancelRegistration,
    updateProfile,
    setSelectedEventForDetails,
    setSelectedEventForPurchase,
    setSelectedTicketPass,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'upcoming' | 'tickets' | 'updates' | 'history' | 'profile'>('catalog');

  // Filter registrations for this attendee
  const myRegistrations = registrations.filter((r) => r.userId === currentUser.id);
  const confirmedRegistrations = myRegistrations.filter((r) => r.status === 'confirmed');

  // Filter announcements for events this attendee registered for
  const registeredEventIds = new Set(myRegistrations.map((r) => r.eventId));
  const myAnnouncements = announcements.filter((a) => registeredEventIds.has(a.eventId));

  // Catalog search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || '',
    organization: currentUser.organization || '',
    bio: currentUser.bio || '',
  });

  // Filter published & approved events
  const approvedEvents = events.filter((e) => e.status === 'approved');

  const filteredCatalog = approvedEvents.filter((evt) => {
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    'All',
    'Technology',
    'Music & Concerts',
    'Business & Startup',
    'Design & Creative',
    'Workshops & Education',
  ];

  // Save profile updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      organization: profileForm.organization,
      bio: profileForm.bio,
    });
  };

  return (
    <div className="space-y-6">
      {/* Attendee Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Attendee Experience Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore world-class conferences, manage your digital admission passes, and track live organizer alerts.
          </p>
        </div>

        {/* Tab Controls (Functional Segmented Control) */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'catalog' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Browse Events</span>
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upcoming' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>My Events ({confirmedRegistrations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tickets' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Passes & Tickets</span>
          </button>
          <button
            onClick={() => setActiveTab('updates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'updates' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Updates ({myAnnouncements.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'profile' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Active Registered Events"
          value={confirmedRegistrations.length}
          subtitle="Confirmed upcoming admissions"
          icon={Calendar}
          accentColor="indigo"
        />
        <StatsCard
          title="Total Ticket Passes"
          value={myRegistrations.reduce((s, r) => (r.status === 'confirmed' ? s + r.quantity : s), 0)}
          subtitle="Digital passes with scannable QR"
          icon={Ticket}
          accentColor="emerald"
        />
        <StatsCard
          title="Organizer Announcements"
          value={myAnnouncements.length}
          subtitle="Direct alerts from event creators"
          icon={Bell}
          accentColor="cyan"
        />
      </div>

      {/* ======================================================== */}
      {/* TAB 1: BROWSE & REGISTER FOR EVENTS (CATALOG) */}
      {/* ======================================================== */}
      {activeTab === 'catalog' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search events by title, keyword, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Interactive Category Segmented Control */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    selectedCategory === cat
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalog.map((evt) => {
              const lowestPrice = Math.min(...evt.ticketTiers.map((t) => t.price));
              const isAlreadyRegistered = confirmedRegistrations.some((r) => r.eventId === evt.id);

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Event Banner */}
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={evt.bannerUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                        {evt.category}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                        From ${lowestPrice}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5">
                      {/* Quiet Unboxed Metadata with Typographic Separators */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span>{evt.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.time}</span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.capacity - evt.registeredCount} spots left</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={() => setSelectedEventForDetails(evt)}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => setSelectedEventForPurchase(evt)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all shadow-xs ${
                        isAlreadyRegistered
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{isAlreadyRegistered ? 'Book More Tickets' : 'Register & Buy Ticket'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCatalog.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No events found</h4>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your keyword search or category filters.</p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: UPCOMING REGISTERED EVENTS */}
      {/* ======================================================== */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">My Upcoming Events</h3>
              <p className="text-xs text-slate-500">Events you are currently registered for with confirmed passes.</p>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Browse more events →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {confirmedRegistrations.map((reg) => (
              <div
                key={reg.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-bold text-indigo-600">{reg.eventDate}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Confirmed Booking
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{reg.eventTitle}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{reg.eventVenue}</span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs mb-4">
                    <div className="flex justify-between items-center text-slate-700 mb-1">
                      <span>Pass Type: <strong>{reg.ticketTierName}</strong></span>
                      <span className="font-mono font-bold">${reg.totalAmount}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Quantity: {reg.quantity} Ticket(s) · Booking Ref: <span className="font-mono font-semibold text-slate-700">{reg.bookingCode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedTicketPass(reg)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Digital Pass & QR</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to cancel your registration for "${reg.eventTitle}"?`)) {
                        cancelRegistration(reg.id);
                      }
                    }}
                    className="py-2 px-3 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
            {confirmedRegistrations.length === 0 && (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">You have no upcoming events</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">Explore our curated catalog to register for summits and concerts.</p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Browse Event Catalog
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: TICKET PURCHASES & PASSES */}
      {/* ======================================================== */}
      {activeTab === 'tickets' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Purchased Tickets & Digital Wallet</h3>
              <p className="text-xs text-slate-500">Your verified booking passes complete with cryptographic QR tokens for entrance verification.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRegistrations.map((reg) => (
              <div
                key={reg.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs relative flex flex-col justify-between ${
                  reg.status === 'confirmed' ? 'border-slate-200/80' : 'border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[11px] text-slate-500">{reg.bookingCode}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        reg.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1">{reg.eventTitle}</h4>
                  <div className="text-xs text-slate-500 mb-3">{reg.eventDate} · {reg.eventVenue}</div>

                  <div className="border-t border-b border-dashed border-slate-200 py-3 my-2 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tier:</span>
                      <span className="font-semibold text-slate-800">{reg.ticketTierName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Quantity:</span>
                      <span className="font-semibold text-slate-800">{reg.quantity} Pass(es)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Paid:</span>
                      <span className="font-mono font-bold text-slate-900">${reg.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment:</span>
                      <span className="text-slate-700">{reg.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  {reg.status === 'confirmed' ? (
                    <button
                      onClick={() => setSelectedTicketPass(reg)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-xs transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Display Printable Pass & QR</span>
                    </button>
                  ) : (
                    <div className="text-center text-xs text-slate-400 py-1 font-medium">
                      Registration Cancelled
                    </div>
                  )}
                </div>
              </div>
            ))}
            {myRegistrations.length === 0 && (
              <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
                <Ticket className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No ticket purchases recorded</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">Register for an event to receive your digital ticket.</p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Explore Events
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: EVENT UPDATES & ANNOUNCEMENTS */}
      {/* ======================================================== */}
      {activeTab === 'updates' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Event Announcements & Updates</h3>
            <p className="text-xs text-slate-500">Direct notifications dispatched by event producers for your registered sessions.</p>
          </div>

          <div className="space-y-3">
            {myAnnouncements.map((anc) => (
              <div
                key={anc.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
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
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(anc.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-indigo-600">
                  Event: {anc.eventTitle} · From Organizer: {anc.organizerName}
                </div>

                <p className="text-slate-700 leading-relaxed">{anc.message}</p>
              </div>
            ))}
            {myAnnouncements.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No new announcements</h4>
                <p className="text-xs text-slate-500 mt-1">
                  When organizers broadcast updates for events you have registered for, they will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: REGISTRATION HISTORY */}
      {/* ======================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Registration History Log</h3>
            <p className="text-xs text-slate-500">Complete archive of your historical and current event bookings.</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Event Title</th>
                    <th className="py-3 px-4">Pass Tier</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Date Registered</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{reg.bookingCode}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{reg.eventTitle}</td>
                      <td className="py-3 px-4">{reg.ticketTierName}</td>
                      <td className="py-3 px-4 font-mono">{reg.quantity}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">${reg.totalAmount}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(reg.purchasedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            reg.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {myRegistrations.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No registrations recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: PROFILE MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs max-w-2xl animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-xs"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">{currentUser.name}</h3>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Attendee Profile
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / University Affiliation</label>
              <input
                type="text"
                value={profileForm.organization}
                onChange={(e) => setProfileForm({ ...profileForm, organization: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Professional Bio</label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
