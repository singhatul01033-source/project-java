import React from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, X, Download, CheckCircle, Calendar, MapPin, Ticket, ShieldCheck } from 'lucide-react';

export const TicketPassModal: React.FC = () => {
  const { selectedTicketPass, setSelectedTicketPass } = useApp();

  if (!selectedTicketPass) return null;

  const reg = selectedTicketPass;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in-50">
        {/* Pass Actions Header (hidden in print) */}
        <div className="no-print flex items-center justify-between p-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Digital Admission Pass Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              title="Print Pass / Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setSelectedTicketPass(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Pass Body */}
        <div className="p-6 bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 text-white relative">
          {/* Top Brand & Pass Type */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10 mb-4">
            <div>
              <span className="font-extrabold tracking-wider uppercase text-indigo-400">EventSphere</span>
              <span className="text-[10px] text-slate-400 block">OFFICIAL E-TICKET PASS</span>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                {reg.ticketTierName}
              </span>
            </div>
          </div>

          {/* Event Title */}
          <h2 className="text-lg font-bold text-white tracking-tight leading-snug mb-3">
            {reg.eventTitle}
          </h2>

          {/* Schedule & Location */}
          <div className="space-y-1.5 text-xs text-slate-300 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="font-semibold text-white">{reg.eventDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{reg.eventVenue}</span>
            </div>
          </div>

          {/* Attendee Details Grid */}
          <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 rounded-xl border border-white/10 text-xs mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Pass Holder</span>
              <strong className="text-white text-xs">{reg.userName}</strong>
              <div className="text-[10px] text-slate-400 truncate">{reg.userEmail}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Admit Quantity</span>
              <strong className="text-white text-xs">{reg.quantity} Person(s)</strong>
              <div className="text-[10px] text-emerald-400 font-mono">Paid: ${reg.totalAmount}</div>
            </div>
          </div>

          {/* Scannable QR Code & Barcode Area */}
          <div className="bg-white rounded-2xl p-5 text-slate-900 flex flex-col items-center justify-center text-center shadow-lg">
            {/* Visual SVG QR Code */}
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl mb-3">
              <svg width="140" height="140" viewBox="0 0 140 140" className="w-32 h-32">
                {/* Outer Framing */}
                <rect width="140" height="140" fill="#ffffff" />
                {/* Top-Left Position Square */}
                <rect x="10" y="10" width="35" height="35" fill="#0f172a" rx="4" />
                <rect x="17" y="17" width="21" height="21" fill="#ffffff" rx="2" />
                <rect x="23" y="23" width="9" height="9" fill="#0f172a" rx="1" />
                {/* Top-Right Position Square */}
                <rect x="95" y="10" width="35" height="35" fill="#0f172a" rx="4" />
                <rect x="102" y="17" width="21" height="21" fill="#ffffff" rx="2" />
                <rect x="108" y="23" width="9" height="9" fill="#0f172a" rx="1" />
                {/* Bottom-Left Position Square */}
                <rect x="10" y="95" width="35" height="35" fill="#0f172a" rx="4" />
                <rect x="17" y="102" width="21" height="21" fill="#ffffff" rx="2" />
                <rect x="23" y="108" width="9" height="9" fill="#0f172a" rx="1" />

                {/* QR Data Matrix Patterns (seed-based) */}
                <rect x="52" y="14" width="7" height="7" fill="#0f172a" />
                <rect x="66" y="14" width="7" height="7" fill="#0f172a" />
                <rect x="80" y="20" width="7" height="7" fill="#0f172a" />
                <rect x="52" y="28" width="7" height="7" fill="#0f172a" />
                <rect x="73" y="28" width="7" height="7" fill="#0f172a" />

                <rect x="14" y="52" width="7" height="7" fill="#0f172a" />
                <rect x="28" y="52" width="7" height="7" fill="#0f172a" />
                <rect x="42" y="52" width="7" height="7" fill="#0f172a" />
                <rect x="56" y="52" width="7" height="7" fill="#0f172a" />
                <rect x="70" y="52" width="7" height="7" fill="#0f172a" />
                <rect x="84" y="52" width="7" height="7" fill="#0f172a" />
                <rect x="98" y="52" width="7" height="7" fill="#0f172a" />
                <rect x="119" y="52" width="7" height="7" fill="#0f172a" />

                <rect x="21" y="66" width="7" height="7" fill="#0f172a" />
                <rect x="42" y="66" width="7" height="7" fill="#0f172a" />
                <rect x="63" y="66" width="7" height="7" fill="#0f172a" />
                <rect x="84" y="66" width="7" height="7" fill="#0f172a" />
                <rect x="105" y="66" width="7" height="7" fill="#0f172a" />

                <rect x="14" y="80" width="7" height="7" fill="#0f172a" />
                <rect x="35" y="80" width="7" height="7" fill="#0f172a" />
                <rect x="56" y="80" width="7" height="7" fill="#0f172a" />
                <rect x="77" y="80" width="7" height="7" fill="#0f172a" />
                <rect x="98" y="80" width="7" height="7" fill="#0f172a" />
                <rect x="119" y="80" width="7" height="7" fill="#0f172a" />

                <rect x="52" y="95" width="7" height="7" fill="#0f172a" />
                <rect x="70" y="95" width="7" height="7" fill="#0f172a" />
                <rect x="84" y="95" width="7" height="7" fill="#0f172a" />
                <rect x="105" y="95" width="7" height="7" fill="#0f172a" />
                <rect x="119" y="95" width="7" height="7" fill="#0f172a" />

                <rect x="63" y="108" width="7" height="7" fill="#0f172a" />
                <rect x="77" y="108" width="7" height="7" fill="#0f172a" />
                <rect x="98" y="108" width="7" height="7" fill="#0f172a" />
                <rect x="112" y="108" width="7" height="7" fill="#0f172a" />

                <rect x="52" y="119" width="7" height="7" fill="#0f172a" />
                <rect x="70" y="119" width="7" height="7" fill="#0f172a" />
                <rect x="91" y="119" width="7" height="7" fill="#0f172a" />
                <rect x="119" y="119" width="7" height="7" fill="#0f172a" />
              </svg>
            </div>

            <div className="font-mono font-bold text-slate-900 text-sm tracking-wider">
              {reg.bookingCode}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Scan at Venue Security Desk for Entry Badge Print
            </p>

            {/* Linear Barcode */}
            <div className="w-full mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-1 opacity-80 h-8">
              {[3, 1, 4, 1, 5, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3, 2, 4, 1, 3].map((w, i) => (
                <div
                  key={i}
                  className="bg-slate-900 h-6"
                  style={{ width: `${w * 1.5}px` }}
                ></div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-center text-[10px] text-slate-400">
            Issued via EventSphere Digital Ticket Authority · Non-Transferable
          </div>
        </div>
      </div>
    </div>
  );
};
