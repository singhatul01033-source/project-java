import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  CalendarDays,
  Shield,
  Briefcase,
  User as UserIcon,
  BookOpen,
  RotateCcw,
  ChevronDown,
  Bell,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    currentRole,
    switchRole,
    users,
    announcements,
    resetAllData,
    setIsReviewModalOpen,
  } = useApp();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const roles: { id: UserRole; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'organizer', label: 'Event Organizer', icon: Briefcase },
    { id: 'attendee', label: 'Attendee', icon: UserIcon },
  ];

  const recentAnnouncements = announcements.slice(0, 4);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">EventSphere</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.5 rounded">
                  v2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Online Event Management System</p>
            </div>
          </div>

          {/* Center Role Switcher (Functional Segmented Control) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => switchRole(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  title={`Switch to ${r.label} Dashboard`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span className="hidden md:inline">{r.label}</span>
                  <span className="md:hidden capitalize">{r.id}</span>
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Academic Review & Presentation Mode Button */}
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors shadow-xs"
              title="Open Project Review, Viva Deck, and Architecture Specs"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden lg:inline">Review & Viva Deck</span>
              <span className="lg:hidden">Review</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block"></span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
                aria-label="View announcements"
              >
                <Bell className="w-4 h-4" />
                {announcements.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Event Broadcasts ({announcements.length})
                    </span>
                    <span className="text-[11px] text-slate-400">Live Updates</span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {recentAnnouncements.map((anc) => (
                      <div key={anc.id} className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-600 mb-0.5">
                          <span className="truncate max-w-[170px]">{anc.eventTitle}</span>
                          <span className="text-slate-400 font-normal">
                            {new Date(anc.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <h5 className="text-xs font-semibold text-slate-900">{anc.title}</h5>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{anc.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1 py-0.2 rounded">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">{currentUser.email}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      Current Role: {currentUser.role}
                    </span>
                  </div>

                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona:
                  </div>

                  <div className="space-y-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setIsUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                          u.id === currentUser.id ? 'bg-indigo-50 text-indigo-900 font-semibold' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-xs font-medium">{u.name}</div>
                          <div className="text-[10px] text-slate-400 uppercase">{u.role}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        resetAllData();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore Default Demo Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
