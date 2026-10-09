/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { AttendeeDashboard } from './components/attendee/AttendeeDashboard';
import { EventDetailsModal } from './components/events/EventDetailsModal';
import { TicketPurchaseModal } from './components/events/TicketPurchaseModal';
import { TicketPassModal } from './components/events/TicketPassModal';
import { ProjectReviewModal } from './components/presentation/ProjectReviewModal';
import { ToastContainer } from './components/common/ToastContainer';
import { CalendarDays, ShieldCheck, Heart, BookOpen } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { currentRole, currentUser, setIsReviewModalOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRole === 'admin' && <AdminDashboard />}
        {currentRole === 'organizer' && <OrganizerDashboard />}
        {currentRole === 'attendee' && <AttendeeDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              E
            </div>
            <span className="font-bold text-slate-800">EventSphere</span>
            <span>· Online Event Management System</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Project Review & Viva Slides</span>
            </button>
            <span className="text-slate-300">|</span>
            <span>Current Persona: <strong className="text-slate-700">{currentUser.name}</strong> ({currentRole.toUpperCase()})</span>
          </div>
        </div>
      </footer>

      {/* Global Interactive Modals */}
      <EventDetailsModal />
      <TicketPurchaseModal />
      <TicketPassModal />
      <ProjectReviewModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
