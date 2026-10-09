import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  X,
  Lock,
  ChevronRight,
  Ticket,
  AlertCircle
} from 'lucide-react';

export const TicketPurchaseModal: React.FC = () => {
  const {
    currentUser,
    selectedEventForPurchase,
    setSelectedEventForPurchase,
    purchaseTickets,
    setSelectedTicketPass,
    settings,
  } = useApp();

  if (!selectedEventForPurchase) return null;

  const evt = selectedEventForPurchase;
  const activeTiers = evt.ticketTiers.filter((t) => t.isActive);

  const [selectedTierId, setSelectedTierId] = useState<string>(activeTiers[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Debit Card' | 'UPI' | 'PayPal'>('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock payment details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [upiId, setUpiId] = useState(`${currentUser.name.toLowerCase().replace(/\s+/g, '')}@okaxis`);

  const currentTier = evt.ticketTiers.find((t) => t.id === selectedTierId) || activeTiers[0];
  const unitPrice = currentTier ? currentTier.price : 0;
  const subtotal = unitPrice * quantity;
  const platformFee = Math.round((subtotal * settings.platformFeePercent) / 100);
  const totalAmount = subtotal + platformFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTier) return;

    setIsProcessing(true);
    setTimeout(() => {
      const reg = purchaseTickets({
        eventId: evt.id,
        ticketTierId: currentTier.id,
        quantity,
        paymentMethod,
      });

      setIsProcessing(false);
      setSelectedEventForPurchase(null);

      // Open ticket pass right away
      if (reg) {
        setSelectedTicketPass(reg);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in-50">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
              EventSphere Ticketing Checkout
            </span>
            <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>
          </div>
          <button
            onClick={() => setSelectedEventForPurchase(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleCheckout} className="p-5 space-y-5 text-xs">
          {/* Step 1: Select Tier */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">1. Select Admission Pass Tier</label>
            <div className="space-y-2">
              {activeTiers.map((tier) => {
                const isSelected = tier.id === selectedTierId;
                const remaining = tier.quantity - tier.sold;
                const isSoldOut = remaining <= 0;

                return (
                  <div
                    key={tier.id}
                    onClick={() => !isSoldOut && setSelectedTierId(tier.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : isSoldOut
                        ? 'border-slate-200 opacity-50 cursor-not-allowed bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{tier.name}</div>
                      <div className="text-[11px] text-slate-500">{tier.description}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {isSoldOut ? 'Sold out' : `${remaining} tickets available`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900 text-sm">${tier.price}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Quantity */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div>
              <div className="font-bold text-slate-800">Pass Quantity</div>
              <div className="text-[11px] text-slate-500">Number of tickets for this transaction</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40"
              >
                -
              </button>
              <span className="font-mono font-bold text-slate-900 text-sm px-2">{quantity}</span>
              <button
                type="button"
                disabled={quantity >= 10}
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-7 h-7 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Step 3: Attendee Details Confirmation */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
            <span className="font-bold text-slate-800 block mb-1">Ticket Holder Information</span>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Name:</span>
              <strong className="text-slate-900">{currentUser.name}</strong>
            </div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>Email:</span>
              <span className="font-mono text-slate-900">{currentUser.email}</span>
            </div>
          </div>

          {/* Step 4: Payment Method */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">2. Secure Payment Gateway</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(['Credit Card', 'Debit Card', 'UPI', 'PayPal'] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                    paymentMethod === method
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            {/* Mock Payment Details */}
            {paymentMethod.includes('Card') ? (
              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2 pl-8 rounded-md border border-slate-200 bg-white font-mono text-xs"
                    />
                    <CreditCard className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Expiry</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full p-1.5 rounded-md border border-slate-200 bg-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full p-1.5 rounded-md border border-slate-200 bg-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  {paymentMethod === 'UPI' ? 'Virtual Payment Address (VPA / UPI ID)' : 'PayPal Account Email'}
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-200 bg-white font-mono text-xs"
                />
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({quantity}x tickets):</span>
              <span className="font-mono">${subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform service fee ({settings.platformFeePercent}%):</span>
              <span className="font-mono">${platformFee}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-200">
              <span>Total Payable Amount:</span>
              <span className="font-mono text-indigo-600">${totalAmount}</span>
            </div>
          </div>

          {/* Submit Checkout */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Authorizing Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Complete Registration (${totalAmount})</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit TLS Encrypted · Instant QR E-Ticket Delivery</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
