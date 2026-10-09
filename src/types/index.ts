export type UserRole = 'admin' | 'organizer' | 'attendee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  organization?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  bio?: string;
  interests?: string[];
}

export type EventStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';

export interface TicketTier {
  id: string;
  eventId: string;
  name: string; // e.g. "Early Bird", "General Admission", "VIP All-Access"
  price: number;
  quantity: number;
  sold: number;
  description: string;
  isActive: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: 'Technology' | 'Music & Concerts' | 'Business & Startup' | 'Design & Creative' | 'Workshops & Education' | 'Gaming & Esports';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  venue: string;
  isVirtual: boolean;
  virtualLink?: string;
  bannerUrl: string;
  organizerId: string;
  organizerName: string;
  status: EventStatus;
  rejectionReason?: string;
  capacity: number;
  registeredCount: number;
  featured?: boolean;
  ticketTiers: TicketTier[];
  createdAt: string;
  tags: string[];
}

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  userId: string;
  userName: string;
  userEmail: string;
  ticketTierId: string;
  ticketTierName: string;
  ticketPrice: number;
  quantity: number;
  totalAmount: number;
  bookingCode: string;
  qrCodeSeed: string;
  status: 'confirmed' | 'cancelled' | 'attended';
  purchasedAt: string;
  paymentMethod: 'Credit Card' | 'Debit Card' | 'UPI' | 'PayPal';
}

export interface Announcement {
  id: string;
  eventId: string;
  eventTitle: string;
  organizerId: string;
  organizerName: string;
  title: string;
  message: string;
  priority: 'normal' | 'important' | 'urgent';
  createdAt: string;
  recipientCount: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  category: 'USER_MGMT' | 'EVENT_APPROVAL' | 'SETTINGS' | 'TICKET_SALE' | 'COMMUNICATION' | 'EVENT_MGMT';
  details: string;
  timestamp: string;
}

export interface SystemSettings {
  platformName: string;
  supportEmail: string;
  currency: string;
  platformFeePercent: number;
  autoApproveEvents: boolean;
  maintenanceMode: boolean;
  allowPublicRegistrations: boolean;
  maxEventsPerOrganizer: number;
  sendEmailNotifications: boolean;
}
