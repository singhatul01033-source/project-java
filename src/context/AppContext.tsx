import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  EventItem,
  Registration,
  Announcement,
  AuditLog,
  SystemSettings,
  TicketTier
} from '../types';
import {
  initialUsers,
  initialEvents,
  initialRegistrations,
  initialAnnouncements,
  initialAuditLogs,
  initialSystemSettings
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  users: User[];
  events: EventItem[];
  registrations: Registration[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;

  // Admin functionalities
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => boolean;
  updateUser: (id: string, updates: Partial<User>) => boolean;
  deleteUser: (id: string) => boolean;
  approveEvent: (eventId: string) => boolean;
  rejectEvent: (eventId: string, reason: string) => boolean;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetAllData: () => void;

  // Organizer functionalities
  createEvent: (eventData: Omit<EventItem, 'id' | 'createdAt' | 'organizerId' | 'organizerName' | 'status' | 'registeredCount'>) => EventItem;
  updateEvent: (id: string, updates: Partial<EventItem>) => boolean;
  deleteEvent: (id: string) => boolean;
  addTicketTier: (eventId: string, tier: Omit<TicketTier, 'id' | 'eventId' | 'sold'>) => boolean;
  updateTicketTier: (eventId: string, tierId: string, updates: Partial<TicketTier>) => boolean;
  deleteTicketTier: (eventId: string, tierId: string) => boolean;
  sendAnnouncement: (eventId: string, title: string, message: string, priority: 'normal' | 'important' | 'urgent') => boolean;

  // Attendee functionalities
  purchaseTickets: (params: {
    eventId: string;
    ticketTierId: string;
    quantity: number;
    paymentMethod: 'Credit Card' | 'Debit Card' | 'UPI' | 'PayPal';
  }) => Registration | null;
  cancelRegistration: (registrationId: string) => boolean;
  updateProfile: (updates: Partial<User>) => void;

  // Global modals
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  selectedEventForDetails: EventItem | null;
  setSelectedEventForDetails: (evt: EventItem | null) => void;
  selectedEventForPurchase: EventItem | null;
  setSelectedEventForPurchase: (evt: EventItem | null) => void;
  selectedTicketPass: Registration | null;
  setSelectedTicketPass: (reg: Registration | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'eventsphere_v3_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'registrations');
    return saved ? JSON.parse(saved) : initialRegistrations;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'auditLogs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'settings');
    return saved ? JSON.parse(saved) : initialSystemSettings;
  });

  // Current user & active role
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return initialUsers[0]; // Admin by default for initial review
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<EventItem | null>(null);
  const [selectedEventForPurchase, setSelectedEventForPurchase] = useState<EventItem | null>(null);
  const [selectedTicketPass, setSelectedTicketPass] = useState<Registration | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'settings', JSON.stringify(settings));
  }, [settings]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAudit = (action: string, category: AuditLog['category'], details: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      category,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    if (currentUser.role === role) {
      const usersInRole = users.filter((u) => u.role === role);
      if (usersInRole.length > 1) {
        const currentIndex = usersInRole.findIndex((u) => u.id === currentUser.id);
        const nextUser = usersInRole[(currentIndex + 1) % usersInRole.length];
        setCurrentUser(nextUser);
        showToast('Switched Persona', `Active user: ${nextUser.name} (${nextUser.email})`, 'info');
        return;
      }
    }
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      showToast('Switched Role', `Now viewing as ${targetUser.name} (${role.toUpperCase()})`, 'info');
    }
  };

  // --- ADMIN FUNCTIONALITIES ---
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>): boolean => {
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      showToast('User Exists', `A user with email ${userData.email} already exists`, 'error');
      return false;
    }
    const newUser: User = {
      ...userData,
      id: `usr-${userData.role}-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      avatar: userData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80`
    };
    setUsers((prev) => [...prev, newUser]);
    addAudit('CREATE_USER', 'USER_MGMT', `Created ${newUser.role} user: ${newUser.name} (${newUser.email})`);
    showToast('User Created Successfully', `Added account for ${newUser.name} as ${newUser.role.toUpperCase()}`, 'success');
    return true;
  };

  const updateUser = (id: string, updates: Partial<User>): boolean => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = { ...u, ...updates };
          if (currentUser.id === id) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    addAudit('UPDATE_USER', 'USER_MGMT', `Updated user ID: ${id}`);
    showToast('User Updated Successfully', `Account details updated successfully.`, 'success');
    return true;
  };

  const deleteUser = (id: string): boolean => {
    const target = users.find((u) => u.id === id);
    if (!target) return false;
    if (target.id === currentUser.id) {
      showToast('Action Disallowed', 'You cannot delete your own active administrator account.', 'error');
      return false;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addAudit('DELETE_USER', 'USER_MGMT', `Deleted user ${target.name} (${target.email})`);
    showToast('User Deleted Successfully', `Removed ${target.name} from the system.`, 'info');
    return true;
  };

  const approveEvent = (eventId: string): boolean => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return false;
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: 'approved', rejectionReason: undefined } : e))
    );
    addAudit('APPROVE_EVENT', 'EVENT_APPROVAL', `Approved event: "${evt.title}"`);
    showToast('Event Approved', `"${evt.title}" is now published and open for registrations!`, 'success');
    return true;
  };

  const rejectEvent = (eventId: string, reason: string): boolean => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return false;
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: 'rejected', rejectionReason: reason } : e))
    );
    addAudit('REJECT_EVENT', 'EVENT_APPROVAL', `Rejected event: "${evt.title}". Reason: ${reason}`);
    showToast('Event Rejected', `Event "${evt.title}" has been rejected. Organizer informed.`, 'warning');
    return true;
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addAudit('UPDATE_SETTINGS', 'SETTINGS', `System settings updated.`);
    showToast('System Settings Saved', 'Platform configurations updated successfully.', 'success');
  };

  const resetAllData = () => {
    setUsers(initialUsers);
    setEvents(initialEvents);
    setRegistrations(initialRegistrations);
    setAnnouncements(initialAnnouncements);
    setAuditLogs(initialAuditLogs);
    setSettings(initialSystemSettings);
    setCurrentUser(initialUsers[0]);
    showToast('Data Reset', 'All records restored to original default demo data.', 'info');
  };

  // --- ORGANIZER FUNCTIONALITIES ---
  const createEvent = (
    eventData: Omit<EventItem, 'id' | 'createdAt' | 'organizerId' | 'organizerName' | 'status' | 'registeredCount'>
  ): EventItem => {
    const initialStatus = settings.autoApproveEvents ? 'approved' : 'pending';
    const newEvent: EventItem = {
      ...eventData,
      id: 'evt-' + Date.now().toString(36),
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      status: initialStatus,
      registeredCount: 0,
      createdAt: new Date().toISOString(),
    };

    setEvents((prev) => [newEvent, ...prev]);
    addAudit(
      'CREATE_EVENT',
      'EVENT_MGMT',
      `Organizer ${currentUser.name} created "${newEvent.title}" (${initialStatus})`
    );
    showToast(
      'Event Created Successfully',
      initialStatus === 'approved'
        ? `Event is live immediately (Auto-approval enabled)!`
        : `Event submitted for Administrator approval.`,
      'success'
    );
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<EventItem>): boolean => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    addAudit('UPDATE_EVENT', 'EVENT_MGMT', `Updated event ID: ${id}`);
    showToast('Event Updated', 'Event details were updated successfully.', 'success');
    return true;
  };

  const deleteEvent = (id: string): boolean => {
    const evt = events.find((e) => e.id === id);
    if (!evt) return false;
    setEvents((prev) => prev.filter((e) => e.id !== id));
    addAudit('DELETE_EVENT', 'EVENT_MGMT', `Deleted event "${evt.title}"`);
    showToast('Event Deleted', `"${evt.title}" has been removed.`, 'info');
    return true;
  };

  const addTicketTier = (eventId: string, tier: Omit<TicketTier, 'id' | 'eventId' | 'sold'>): boolean => {
    const newTier: TicketTier = {
      ...tier,
      id: 'tkt-' + Date.now().toString(36),
      eventId,
      sold: 0,
    };
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return { ...e, ticketTiers: [...(e.ticketTiers || []), newTier] };
        }
        return e;
      })
    );
    addAudit('ADD_TICKET_TIER', 'TICKET_SALE', `Created ticket tier "${newTier.name}" for event ID ${eventId}`);
    showToast('Ticket Tier Added', `Created tier "${newTier.name}" at $${newTier.price}.`, 'success');
    return true;
  };

  const updateTicketTier = (eventId: string, tierId: string, updates: Partial<TicketTier>): boolean => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            ticketTiers: e.ticketTiers.map((t) => (t.id === tierId ? { ...t, ...updates } : t)),
          };
        }
        return e;
      })
    );
    showToast('Ticket Updated', 'Ticket details updated successfully.', 'success');
    return true;
  };

  const deleteTicketTier = (eventId: string, tierId: string): boolean => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            ticketTiers: e.ticketTiers.filter((t) => t.id !== tierId),
          };
        }
        return e;
      })
    );
    showToast('Ticket Tier Removed', 'Ticket tier removed from event.', 'info');
    return true;
  };

  const sendAnnouncement = (
    eventId: string,
    title: string,
    message: string,
    priority: 'normal' | 'important' | 'urgent'
  ): boolean => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return false;

    // Count registered attendees for this event
    const recipientRegistrations = registrations.filter(
      (r) => r.eventId === eventId && r.status === 'confirmed'
    );
    const count = recipientRegistrations.length > 0 ? recipientRegistrations.length : evt.registeredCount;

    const newAnnouncement: Announcement = {
      id: 'anc-' + Date.now(),
      eventId,
      eventTitle: evt.title,
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      title,
      message,
      priority,
      createdAt: new Date().toISOString(),
      recipientCount: count,
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    addAudit(
      'BROADCAST_MESSAGE',
      'COMMUNICATION',
      `Sent announcement "${title}" to ${count} attendees of "${evt.title}"`
    );
    showToast(
      'Announcement Dispatched',
      `Message delivered to ${count} registered attendees of "${evt.title}"`,
      'success'
    );
    return true;
  };

  // --- ATTENDEE FUNCTIONALITIES ---
  const purchaseTickets = (params: {
    eventId: string;
    ticketTierId: string;
    quantity: number;
    paymentMethod: 'Credit Card' | 'Debit Card' | 'UPI' | 'PayPal';
  }): Registration | null => {
    const { eventId, ticketTierId, quantity, paymentMethod } = params;
    const evt = events.find((e) => e.id === eventId);
    if (!evt) {
      showToast('Event Not Found', 'Could not locate event details.', 'error');
      return null;
    }

    const tier = evt.ticketTiers.find((t) => t.id === ticketTierId);
    if (!tier) {
      showToast('Tier Unavailable', 'Selected ticket tier was not found.', 'error');
      return null;
    }

    if (tier.quantity - tier.sold < quantity) {
      showToast('Tickets Sold Out', `Only ${tier.quantity - tier.sold} tickets remaining.`, 'error');
      return null;
    }

    const totalAmount = tier.price * quantity;
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const bookingCode = `EVT-${Math.floor(10000 + Math.random() * 90000)}-${randomHex}`;

    const newReg: Registration = {
      id: 'reg-' + Date.now(),
      eventId: evt.id,
      eventTitle: evt.title,
      eventDate: evt.date,
      eventVenue: evt.venue,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      ticketTierId: tier.id,
      ticketTierName: tier.name,
      ticketPrice: tier.price,
      quantity,
      totalAmount,
      bookingCode,
      qrCodeSeed: `CONFIRMED_${bookingCode}_${currentUser.id}_${tier.id}`,
      status: 'confirmed',
      purchasedAt: new Date().toISOString(),
      paymentMethod,
    };

    // Update event ticket tier sold count & total registered count
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            registeredCount: e.registeredCount + quantity,
            ticketTiers: e.ticketTiers.map((t) =>
              t.id === ticketTierId ? { ...t, sold: t.sold + quantity } : t
            ),
          };
        }
        return e;
      })
    );

    setRegistrations((prev) => [newReg, ...prev]);
    addAudit(
      'PURCHASE_TICKET',
      'TICKET_SALE',
      `${currentUser.name} purchased ${quantity}x "${tier.name}" for "${evt.title}" ($${totalAmount})`
    );

    showToast(
      'Registration Confirmed!',
      `Successfully purchased ${quantity} ticket(s) for "${evt.title}". Your pass is ready.`,
      'success'
    );

    return newReg;
  };

  const cancelRegistration = (registrationId: string): boolean => {
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return false;

    setRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, status: 'cancelled' } : r))
    );

    // Release ticket capacity
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === reg.eventId) {
          return {
            ...e,
            registeredCount: Math.max(0, e.registeredCount - reg.quantity),
            ticketTiers: e.ticketTiers.map((t) =>
              t.id === reg.ticketTierId ? { ...t, sold: Math.max(0, t.sold - reg.quantity) } : t
            ),
          };
        }
        return e;
      })
    );

    addAudit('CANCEL_REGISTRATION', 'TICKET_SALE', `${currentUser.name} cancelled registration ${reg.bookingCode}`);
    showToast('Registration Cancelled', `Booking ${reg.bookingCode} cancelled successfully.`, 'info');
    return true;
  };

  const updateProfile = (updates: Partial<User>) => {
    updateUser(currentUser.id, updates);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        setCurrentUser,
        switchRole,
        users,
        events,
        registrations,
        announcements,
        auditLogs,
        settings,
        toasts,
        showToast,
        dismissToast,
        addUser,
        updateUser,
        deleteUser,
        approveEvent,
        rejectEvent,
        updateSettings,
        resetAllData,
        createEvent,
        updateEvent,
        deleteEvent,
        addTicketTier,
        updateTicketTier,
        deleteTicketTier,
        sendAnnouncement,
        purchaseTickets,
        cancelRegistration,
        updateProfile,
        isReviewModalOpen,
        setIsReviewModalOpen,
        selectedEventForDetails,
        setSelectedEventForDetails,
        selectedEventForPurchase,
        setSelectedEventForPurchase,
        selectedTicketPass,
        setSelectedTicketPass,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
