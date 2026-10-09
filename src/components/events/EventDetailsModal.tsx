import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  ShieldCheck,
  Ticket,
  ExternalLink,
  X
} from 'lucide-react';

export const EventDetailsModal: React.FC = () => {
  const {
    selectedEventForDetails,
    setSelectedEventForDetails,
    setSelectedEventForPurchase,
  } = useApp();

  if (!selectedEventForDetails) return null;

  const evt = selectedEventForDetails;
  const lowestPrice = Math.min(...evt.ticketTiers.map((t) => t.price));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in-50">
        {/* Banner with Close button */}
        <div className="relative h-56 overflow-hidden bg-slate-900">
          <img
            src={evt.bannerUrl}
            alt={evt.title}
            className="w-full h-full object-cover opacity-90"
          />
          <button
            onClick={() => setSelectedEventForDetails(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-md">
            {evt.category}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Organized by <strong>{evt.organizerName}</strong></span>
              <span aria-hidden="true">·</span>
              <span className="capitalize text-emerald-600 font-semibold">{evt.status}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {evt.title}
            </h2>
          </div>

          {/* Quick Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-700">Date</div>
                <div className="text-slate-900 font-mono font-bold mt-0.5">{evt.date}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-700">Time</div>
                <div className="text-slate-900 font-bold mt-0.5">{evt.time}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Users className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-700">Capacity</div>
                <div className="text-slate-900 font-bold mt-0.5">
                  {evt.registeredCount} / {evt.capacity} booked
                </div>
              </div>
            </div>
          </div>

          {/* Venue & Location */}
          <div className="flex items-start gap-3 text-xs">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">Venue & Access</div>
              <div className="text-slate-600 mt-0.5">{evt.venue}</div>
              {evt.isVirtual && evt.virtualLink && (
                <a
                  href={evt.virtualLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline mt-1 font-semibold"
                >
                  <span>Access Virtual Meeting Room</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">About This Event</h4>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{evt.description}</p>
          </div>

          {/* Ticket Tiers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Available Admission Tiers ({evt.ticketTiers.length})
            </h4>
            <div className="space-y-2.5">
              {evt.ticketTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{tier.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{tier.description}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-mono font-bold text-slate-900 text-sm">${tier.price}</div>
                    <div className="text-[10px] text-slate-400">
                      {tier.quantity - tier.sold} remaining
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {evt.tags && evt.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Keywords:</span>
              {evt.tags.map((tag, idx) => (
                <span key={tag} className="text-slate-600">
                  {tag}
                  {idx < evt.tags.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 block">Admission starts from</span>
            <span className="text-lg font-bold text-slate-900 font-mono">${lowestPrice}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedEventForDetails(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                const target = selectedEventForDetails;
                setSelectedEventForDetails(null);
                setSelectedEventForPurchase(target);
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <Ticket className="w-4 h-4" />
              <span>Purchase Tickets</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
