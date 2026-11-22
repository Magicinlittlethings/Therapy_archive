import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Session,
  SessionMaterial,
  TherapyNote,
  UserAttendance,
  SessionFollow,
  ContentRequest,
  SessionRating,
  NotificationItem,
  DemoPersona,
  AttachedPolaroid,
  AttendanceState,
  MaterialType,
  NoteReport,
  TrackIdInquiry
} from '../types';
import {
  CURATED_SESSIONS,
  CURATED_MATERIALS,
  SAMPLE_THERAPY_NOTES,
  DEFAULT_NOTE_REPORTS,
  DEFAULT_TRACK_INQUIRIES
} from '../data/seedData';
import { soundboardEngine } from '../utils/audioSynth';

interface StoreContextType {
  persona: DemoPersona;
  setPersona: (persona: DemoPersona) => void;
  isReloadingRole: boolean;
  reloadingRoleName: string;
  roleTourModalOpen: boolean;
  roleTourPersona: DemoPersona | null;
  openRoleTour: (role: DemoPersona) => void;
  closeRoleTour: () => void;
  sessions: Session[];
  materials: SessionMaterial[];
  notes: TherapyNote[];
  reports: NoteReport[];
  trackInquiries: TrackIdInquiry[];
  attendances: Record<string, UserAttendance>;
  follows: Record<string, SessionFollow>;
  ratings: Record<string, SessionRating>;
  contentRequests: ContentRequest[];
  notifications: NotificationItem[];
  saveNote: (noteData: Partial<TherapyNote> & { sessionId: string }) => string;
  deleteNote: (id: string) => void;
  submitNoteForModeration: (id: string) => void;
  submitNoteToCommunity: (noteId: string, options: { isAnonymous: boolean; includePolaroids: boolean }) => void;
  withdrawCommunitySubmission: (noteId: string) => void;
  approveNote: (id: string, feedback?: string) => void;
  rejectNote: (id: string, feedback?: string) => void;
  togglePinNoteByDj: (id: string) => void;
  attachPolaroidToNote: (noteId: string, polaroid: AttachedPolaroid) => void;
  removePolaroidFromNote: (noteId: string, polaroidId: string) => void;
  toggleFollow: (sessionId: string, preferences?: { notifyMaterials: boolean; notifyRecaps: boolean }) => boolean;
  isFollowed: (sessionId: string) => boolean;
  getAttendance: (sessionId: string) => AttendanceState;
  submitRating: (sessionId: string, rating: number, reflection?: string) => void;
  submitContentRequest: (sessionId: string, materialType: MaterialType, artistName?: string, note?: string) => void;
  publishMaterial: (material: Omit<SessionMaterial, 'id' | 'publishedDate'>) => void;
  simulateAttendanceImport: (sessionId: string, count: number) => void;
  isBrowserOpen: boolean;
  browserUrl: string;
  openBrowser: (url?: string) => void;
  closeBrowser: () => void;
  isNotifCenterOpen: boolean;
  openNotifCenter: () => void;
  closeNotifCenter: () => void;
  toggleNotifCenter: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deviceMode: 'desktop' | 'mobile';
  setDeviceMode: (mode: 'desktop' | 'mobile') => void;
  mobileApp: 'home' | 'files' | 'browser' | 'notes' | 'alerts' | 'deck' | 'settings';
  setMobileApp: (app: 'home' | 'files' | 'browser' | 'notes' | 'alerts' | 'deck' | 'settings') => void;
  isSoundboardPlaying: boolean;
  toggleSoundboardPlay: () => void;
  toggleLikeNote: (id: string) => void;
  flagNote: (id: string, reason?: string) => void;
  unflagNote: (id: string) => void;
  reportNote: (noteId: string, reason: NoteReport['reason'], reasonText: string, details?: string) => void;
  resolveReport: (reportId: string, action: 'dismiss' | 'remove', notes?: string) => void;
  submitTrackIdInquiry: (sessionId: string, timestampApprox: string, description: string) => void;
  replyToTrackIdInquiry: (inquiryId: string, djResponse: string) => void;
  respondToTrackRequest: (id: string, response: string) => void;
  resetDemoData: () => void;
  showTour: boolean;
  tourStep: number;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  closeTour: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PERSONA: 'gt_demo_persona',
  NOTES: 'gt_demo_therapy_notes_v9',
  FOLLOWS: 'gt_demo_follows',
  ATTENDANCE: 'gt_demo_attendance',
  MATERIALS: 'gt_demo_materials',
  RATINGS: 'gt_demo_ratings',
  REQUESTS: 'gt_demo_requests',
  NOTIFICATIONS: 'gt_demo_notifications_v3',
  TOUR_SEEN: 'gt_demo_tour_seen',
  REPORTS: 'gt_demo_reports_v1',
  TRACK_INQUIRIES: 'gt_demo_track_inquiries_v1'
};

const DEFAULT_ATTENDANCES: Record<string, UserAttendance> = {
  'gt-xii': {
    sessionId: 'gt-xii',
    state: 'attended',
    ticketHash: 'TIX-GT12-8849-VERIFIED',
    verifiedAt: '2026-02-28T01:30:00Z',
    checkInSource: 'door_scan_tix'
  },
  'gt-xv': {
    sessionId: 'gt-xv',
    state: 'attended',
    ticketHash: 'TIX-GT15-9921-VERIFIED',
    verifiedAt: '2026-11-06T23:15:00Z',
    checkInSource: 'door_scan_tix'
  },
  'gt-x': {
    sessionId: 'gt-x',
    state: 'pending_verification',
    ticketHash: 'TIX-GT10-CLAIMED',
    checkInSource: 'manual_review'
  }
};

const DEFAULT_FOLLOWS: Record<string, SessionFollow> = {
  'gt-xii': {
    sessionId: 'gt-xii',
    notifyMaterials: true,
    notifyRecaps: true,
    followedAt: '2026-02-25T14:00:00Z'
  },
  'gt-xv': {
    sessionId: 'gt-xv',
    notifyMaterials: true,
    notifyRecaps: true,
    followedAt: '2026-11-01T10:00:00Z'
  }
};

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    sessionId: 'gt-xii',
    title: 'New Session Recording Published',
    message: 'SoundsofAce soundboard capture from Group Therapy XII is now archived.',
    date: '2026-03-12',
    isRead: false,
    actionUrl: '/sessions/gt-xii'
  },
  {
    id: 'notif-2',
    sessionId: 'gt-xv',
    title: 'Visual Archive Updated',
    message: 'Photo recap capturing crowd energy at Group Therapy XV has been added to the case file.',
    date: '2026-11-12',
    isRead: false,
    actionUrl: '/sessions/gt-xv'
  },
  {
    id: 'notif-3',
    sessionId: 'gt-xv',
    title: 'Attendance Verified via Door Scan',
    message: 'Your ticket check-in for Group Therapy XV was matched automatically from the door export.',
    date: '2026-11-07',
    isRead: false,
    actionUrl: '/my-sessions'
  },
  {
    id: 'notif-4',
    sessionId: 'gt-xii',
    title: 'Therapy Note Approved // Public Wall',
    message: 'Your reflection on the 3:15 AM breakdown was approved and pinned to the session file.',
    date: '2026-03-02',
    isRead: false,
    actionUrl: '/my-sessions/gt-xii/notes'
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persona, setPersonaState] = useState<DemoPersona>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PERSONA);
    if (saved === 'attendee') return 'patient';
    return (saved as DemoPersona) || 'patient';
  });

  const [isReloadingRole, setIsReloadingRole] = useState(false);
  const [reloadingRoleName, setReloadingRoleName] = useState('');

  // Tour State - Automatically pops up on page load
  const [showTour, setShowTour] = useState(true);
  const [tourStep, setTourStep] = useState(0);

  // Role Explanatory Tour State - Pops up per role switched to
  const [roleTourModalOpen, setRoleTourModalOpen] = useState(() => {
    return Boolean(sessionStorage.getItem('gt_role_switched'));
  });
  const [roleTourPersona, setRoleTourPersona] = useState<DemoPersona | null>(() => {
    const switched = sessionStorage.getItem('gt_role_switched');
    if (switched) {
      sessionStorage.removeItem('gt_role_switched');
      return switched as DemoPersona;
    }
    return null;
  });

  const openRoleTour = (role: DemoPersona) => {
    setRoleTourPersona(role);
    setRoleTourModalOpen(true);
  };

  const closeRoleTour = () => {
    setRoleTourModalOpen(false);
  };

  const [notes, setNotes] = useState<TherapyNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SAMPLE_THERAPY_NOTES;
  });

  const [follows, setFollows] = useState<Record<string, SessionFollow>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLLOWS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_FOLLOWS;
  });

  const [attendances, setAttendances] = useState<Record<string, UserAttendance>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_ATTENDANCES;
  });

  const [materials, setMaterials] = useState<SessionMaterial[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return CURATED_MATERIALS;
  });

  const [ratings, setRatings] = useState<Record<string, SessionRating>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RATINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      'gt-xii': {
        sessionId: 'gt-xii',
        rating: 5,
        reflection: 'Immersive sound system setup and seamless transitions.',
        submittedAt: '2026-03-01T04:40:00Z'
      }
    };
  });

  const [contentRequests, setContentRequests] = useState<ContentRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'req-1',
        sessionId: 'gt-xii',
        materialType: 'tracklist',
        artistName: 'Aniko',
        note: 'Looking for the track ID played right at the start of the 3-step transition (~2:45 AM)',
        requestedAt: '2026-03-06T12:00:00Z'
      }
    ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [reports, setReports] = useState<NoteReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_NOTE_REPORTS;
  });

  const [trackInquiries, setTrackInquiries] = useState<TrackIdInquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRACK_INQUIRIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_TRACK_INQUIRIES;
  });

  // Browser state for notes.html in-system web browser
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [browserUrl, setBrowserUrl] = useState('gt://notes.html');

  const openBrowser = (url?: string) => {
    if (url) setBrowserUrl(url);
    setIsBrowserOpen(true);
  };

  const closeBrowser = () => {
    setIsBrowserOpen(false);
  };

  // Notification Center Drawer State
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false);
  const openNotifCenter = () => setIsNotifCenterOpen(true);
  const closeNotifCenter = () => setIsNotifCenterOpen(false);
  const toggleNotifCenter = () => setIsNotifCenterOpen(prev => !prev);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Device Mode: Automatically responsive based on viewport width
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>(() => {
    return typeof window !== 'undefined' && window.innerWidth <= 820 ? 'mobile' : 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 820;
      setDeviceMode(isMobile ? 'mobile' : 'desktop');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile App Navigation: 'home' | 'files' | 'browser' | 'notes' | 'alerts' | 'deck' | 'settings'
  const [mobileApp, setMobileApp] = useState<'home' | 'files' | 'browser' | 'notes' | 'alerts' | 'deck' | 'settings'>('home');

  // Live Soundboard Player State
  const [isSoundboardPlaying, setIsSoundboardPlaying] = useState(false);
  const toggleSoundboardPlay = () => setIsSoundboardPlaying(prev => !prev);

  useEffect(() => {
    if (isSoundboardPlaying) {
      soundboardEngine.start();
    } else {
      soundboardEngine.stop();
    }
  }, [isSoundboardPlaying]);

  // Reload when Role is Switched - returns to landing page
  const setPersona = (newPersona: DemoPersona) => {
    if (newPersona === persona) return;

    const roleLabels: Record<DemoPersona, string> = {
      patient: 'PATIENT DOSSIER',
      visitor: 'PUBLIC VISITOR VIEW',
      dj: 'RESIDENT DJ STATION // ANIKO',
      admin: 'GT MASTER CURATION TERMINAL'
    };

    setReloadingRoleName(roleLabels[newPersona]);
    setIsReloadingRole(true);
    localStorage.setItem(STORAGE_KEYS.PERSONA, newPersona);
    sessionStorage.setItem('gt_role_switched', newPersona);

    setTimeout(() => {
      // Reload and return to landing page
      window.location.href = '/';
    }, 600);
  };

  // Sync state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLLOWS, JSON.stringify(follows));
  }, [follows]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendances));
  }, [attendances]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(contentRequests));
  }, [contentRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRACK_INQUIRIES, JSON.stringify(trackInquiries));
  }, [trackInquiries]);

  // Attendance lookup
  const getAttendance = (sessionId: string): AttendanceState => {
    if (persona === 'visitor') return 'not_attended';
    if (persona === 'dj') {
      // DJ was present at all sessions where they played
      return 'attended';
    }
    const record = attendances[sessionId];
    return record ? record.state : 'not_attended';
  };

  const isFollowed = (sessionId: string): boolean => {
    if (persona === 'visitor') return false;
    return !!follows[sessionId];
  };

  const toggleFollow = (sessionId: string, preferences?: { notifyMaterials: boolean; notifyRecaps: boolean }): boolean => {
    if (persona === 'visitor') {
      alert('You are currently viewing as a Public Visitor. Switch to "Patient" in the top bar to follow sessions.');
      return false;
    }

    if (follows[sessionId]) {
      const next = { ...follows };
      delete next[sessionId];
      setFollows(next);
      return false;
    } else {
      const targetSession = CURATED_SESSIONS.find(s => s.id === sessionId);
      const newFollow: SessionFollow = {
        sessionId,
        notifyMaterials: preferences?.notifyMaterials ?? true,
        notifyRecaps: preferences?.notifyRecaps ?? true,
        followedAt: new Date().toISOString()
      };
      setFollows(prev => ({ ...prev, [sessionId]: newFollow }));

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        sessionId,
        title: `Following ${targetSession?.title || 'Session'}`,
        message: 'You will receive updates when official recordings, tracklists, or recaps are released.',
        date: new Date().toISOString().split('T')[0],
        isRead: false,
        actionUrl: `/sessions/${sessionId}`
      };
      setNotifications(prev => [newNotif, ...prev]);
      return true;
    }
  };

  const saveNote = (noteData: Partial<TherapyNote> & { sessionId: string }): string => {
    const targetSession = CURATED_SESSIONS.find(s => s.id === noteData.sessionId);
    const existingIndex = notes.findIndex(n => n.id === noteData.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const updated = [...notes];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...noteData,
        updatedAt: now
      };
      setNotes(updated);
      return updated[existingIndex].id;
    } else {
      const newId = `note-${Date.now()}`;
      const newNote: TherapyNote = {
        id: newId,
        sessionId: noteData.sessionId,
        sessionCode: targetSession?.sessionCode || null,
        sessionTitle: targetSession?.title || 'Group Therapy Session',
        artistName: noteData.artistName,
        noteType: noteData.noteType || 'patient_note',
        title: noteData.title || undefined,
        content: noteData.content || '',
        promptUsed: noteData.promptUsed,
        visibility: noteData.visibility || 'private',
        moderationStatus: noteData.moderationStatus || 'none',
        isDraft: noteData.isDraft ?? false,
        createdAt: now,
        updatedAt: now
      };
      setNotes(prev => [newNote, ...prev]);
      return newId;
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const submitNoteForModeration = (id: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          visibility: 'public_submission',
          submissionStatus: 'pending',
          moderationStatus: 'pending',
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    }));
  };

  const submitNoteToCommunity = (noteId: string, options: { isAnonymous: boolean; includePolaroids: boolean }) => {
    setNotes(prev => prev.map(n => {
      if (n.id === noteId) {
        return {
          ...n,
          visibility: 'public_submission',
          submissionStatus: 'pending',
          moderationStatus: 'pending',
          isAnonymousSubmission: options.isAnonymous,
          includePolaroidsInSubmission: options.includePolaroids,
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    }));

    const target = notes.find(n => n.id === noteId);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      sessionId: target?.sessionId || 'gt-xii',
      title: 'Community Submission Received',
      message: `Your reflection "${target?.title || 'Reflection'}" was submitted for community curation. Group Therapy curators review all submissions before publication.`,
      date: new Date().toISOString().split('T')[0],
      isRead: false,
      actionUrl: `/my-sessions/${target?.sessionId || 'gt-xii'}/notes`
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const withdrawCommunitySubmission = (noteId: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === noteId) {
        return {
          ...n,
          visibility: 'private',
          submissionStatus: 'none',
          moderationStatus: 'none',
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    }));
  };

  const approveNote = (id: string, feedback?: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          moderationStatus: 'approved',
          moderationFeedback: feedback || 'Approved for Group Therapy Community Archive.',
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    }));

    const target = notes.find(n => n.id === id);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      sessionId: target?.sessionId || 'gt-xii',
      title: 'Therapy Note Approved',
      message: `Your note "${target?.title || 'Reflection'}" was approved and is now featured on the public Session Case File.`,
      date: new Date().toISOString().split('T')[0],
      isRead: false,
      actionUrl: `/sessions/${target?.sessionId || 'gt-xii'}`
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const rejectNote = (id: string, feedback?: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          moderationStatus: 'rejected',
          moderationFeedback: feedback || 'Returned to private enclave. Feel free to revise.',
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    }));
  };

  const togglePinNoteByDj = (id: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          pinnedByDj: !n.pinnedByDj,
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    }));
  };

  const attachPolaroidToNote = (noteId: string, polaroid: AttachedPolaroid) => {
    setNotes(prev => prev.map(n => {
      if (n.id === noteId) {
        const existing = n.polaroids || [];
        return {
          ...n,
          polaroids: [...existing, polaroid],
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    }));
  };

  const removePolaroidFromNote = (noteId: string, polaroidId: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === noteId) {
        return {
          ...n,
          polaroids: (n.polaroids || []).filter(p => p.id !== polaroidId),
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    }));
  };

  const toggleLikeNote = (id: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        const currentlyLiked = n.isLiked ?? false;
        const currentCount = n.likesCount || 0;
        return {
          ...n,
          isLiked: !currentlyLiked,
          likesCount: currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1
        };
      }
      return n;
    }));
  };

  const flagNote = (id: string, reason?: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          isFlagged: true,
          flagReason: reason || 'Flagged by community member for curator review'
        };
      }
      return n;
    }));
  };

  const unflagNote = (id: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          isFlagged: false,
          flagReason: undefined
        };
      }
      return n;
    }));
  };

  const reportNote = (noteId: string, reason: NoteReport['reason'], reasonText: string, details?: string) => {
    const target = notes.find(n => n.id === noteId);
    const reporterName = persona === 'dj' ? 'Aniko' : persona === 'admin' ? 'Staff Curator' : 'Lami Adeyemi';

    // Prevent duplicate reports from same reporter
    const alreadyReported = reports.some(r => r.noteId === noteId && r.reportedBy === reporterName && r.status === 'pending_review');
    if (alreadyReported) return;

    const newReport: NoteReport = {
      id: `report-${Date.now()}`,
      noteId,
      noteTitle: target?.title || 'Community Reflection',
      noteSnippet: target ? target.content.slice(0, 120) + (target.content.length > 120 ? '...' : '') : '',
      reason,
      reasonText,
      reportedBy: reporterName,
      reportedAt: new Date().toISOString(),
      details,
      status: 'pending_review'
    };

    setReports(prev => [newReport, ...prev]);

    // Update note report count; only place on protective hold if severe or >= 3 reports
    setNotes(prev => prev.map(n => {
      if (n.id === noteId) {
        const count = (n.reportCount || 0) + 1;
        const currentReporters = n.reportedBy || [];
        const shouldHold = count >= 3 || reason === 'spam' || reason === 'inappropriate';
        return {
          ...n,
          reportCount: count,
          reportedBy: [...currentReporters, reporterName],
          isFlagged: shouldHold,
          flagReason: reasonText
        };
      }
      return n;
    }));
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'remove', notesText?: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: action === 'dismiss' ? 'dismissed' : 'content_removed',
          resolvedAt: new Date().toISOString(),
          resolvedBy: persona === 'dj' ? 'Aniko (DJ)' : 'Curator Staff',
          resolutionNotes: notesText || (action === 'dismiss' ? 'Report reviewed and dismissed. Content remains active in archive.' : 'Content removed from public community view.')
        };
      }
      return r;
    }));

    if (action === 'dismiss') {
      setNotes(prev => prev.map(n => {
        if (n.id === report.noteId) {
          return {
            ...n,
            isFlagged: false
          };
        }
        return n;
      }));
    } else {
      setNotes(prev => prev.map(n => {
        if (n.id === report.noteId) {
          return {
            ...n,
            isFlagged: true,
            moderationStatus: 'rejected',
            submissionStatus: 'declined'
          };
        }
        return n;
      }));
    }
  };

  const submitTrackIdInquiry = (sessionId: string, timestampApprox: string, description: string) => {
    const sessionObj = CURATED_SESSIONS.find(s => s.id === sessionId);
    const newInquiry: TrackIdInquiry = {
      id: `inquiry-${Date.now()}`,
      sessionId,
      sessionTitle: sessionObj?.title || 'Group Therapy Session',
      sessionCode: sessionObj?.sessionCode || null,
      timestampApprox,
      description,
      submittedBy: persona === 'visitor' ? 'Public Visitor' : 'Lami Adeyemi',
      createdAt: new Date().toISOString(),
      status: 'unanswered'
    };
    setTrackInquiries(prev => [newInquiry, ...prev]);
  };

  const replyToTrackIdInquiry = (inquiryId: string, djResponse: string) => {
    setTrackInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          djResponse: `[SIMULATED DEMO RESPONSE] ${djResponse}`,
          respondedBy: 'Aniko (Resident DJ)',
          respondedAt: new Date().toISOString(),
          isSimulatedDemo: true,
          status: 'answered'
        };
      }
      return inq;
    }));
  };

  const respondToTrackRequest = (id: string, response: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          djResponse: response,
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    }));
  };

  const submitRating = (sessionId: string, rating: number, reflection?: string) => {
    setRatings(prev => ({
      ...prev,
      [sessionId]: {
        sessionId,
        rating,
        reflection,
        submittedAt: new Date().toISOString()
      }
    }));
  };

  const submitContentRequest = (sessionId: string, materialType: MaterialType, artistName?: string, note?: string) => {
    const newReq: ContentRequest = {
      id: `req-${Date.now()}`,
      sessionId,
      materialType,
      artistName,
      note,
      requestedAt: new Date().toISOString()
    };
    setContentRequests(prev => [newReq, ...prev]);
  };

  const publishMaterial = (materialData: Omit<SessionMaterial, 'id' | 'publishedDate'>) => {
    const newMaterial: SessionMaterial = {
      ...materialData,
      id: `mat-${Date.now()}`,
      publishedDate: new Date().toISOString().split('T')[0]
    };
    setMaterials(prev => [newMaterial, ...prev]);

    const targetSession = CURATED_SESSIONS.find(s => s.id === materialData.sessionId);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      sessionId: materialData.sessionId,
      title: `New Material for ${targetSession?.title || 'Session'}`,
      message: `${newMaterial.title} (${newMaterial.type.toUpperCase()}) is now archived.`,
      date: newMaterial.publishedDate,
      isRead: false,
      actionUrl: `/sessions/${materialData.sessionId}`
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const simulateAttendanceImport = (sessionId: string, _count: number) => {
    setAttendances(prev => ({
      ...prev,
      [sessionId]: {
        sessionId,
        state: 'attended',
        ticketHash: `TIX-SIM-${Math.floor(Math.random() * 9000 + 1000)}`,
        verifiedAt: new Date().toISOString(),
        checkInSource: 'door_scan_tix'
      }
    }));

    const targetSession = CURATED_SESSIONS.find(s => s.id === sessionId);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      sessionId,
      title: 'Attendance Verified via Door Check-in',
      message: `Your check-in record for ${targetSession?.title || 'Session'} was matched from the door scanner export.`,
      date: new Date().toISOString().split('T')[0],
      isRead: false,
      actionUrl: `/my-sessions`
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const resetDemoData = () => {
    localStorage.clear();
    setPersonaState('patient');
    setNotes(SAMPLE_THERAPY_NOTES);
    setReports(DEFAULT_NOTE_REPORTS);
    setTrackInquiries(DEFAULT_TRACK_INQUIRIES);
    setFollows(DEFAULT_FOLLOWS);
    setAttendances(DEFAULT_ATTENDANCES);
    setMaterials(CURATED_MATERIALS);
    setRatings({});
    setContentRequests([]);
    setNotifications(DEFAULT_NOTIFICATIONS);
    setIsBrowserOpen(false);
    setIsNotifCenterOpen(false);
    setMobileApp('home');
    setShowTour(false);
    setTourStep(0);
  };

  // Tour Handlers
  const startTour = () => {
    setTourStep(0);
    setShowTour(true);
  };
  const nextTourStep = () => {
    setTourStep(prev => prev + 1);
  };
  const prevTourStep = () => {
    setTourStep(prev => Math.max(0, prev - 1));
  };
  const closeTour = () => {
    setShowTour(false);
    localStorage.setItem(STORAGE_KEYS.TOUR_SEEN, 'true');
  };

  return (
    <StoreContext.Provider
      value={{
        persona,
        setPersona,
        isReloadingRole,
        reloadingRoleName,
        roleTourModalOpen,
        roleTourPersona,
        openRoleTour,
        closeRoleTour,
        sessions: CURATED_SESSIONS,
        materials,
        notes,
        reports,
        trackInquiries,
        attendances,
        follows,
        ratings,
        contentRequests,
        notifications,
        saveNote,
        deleteNote,
        submitNoteForModeration,
        submitNoteToCommunity,
        withdrawCommunitySubmission,
        approveNote,
        rejectNote,
        togglePinNoteByDj,
        attachPolaroidToNote,
        removePolaroidFromNote,
        toggleFollow,
        isFollowed,
        getAttendance,
        submitRating,
        submitContentRequest,
        publishMaterial,
        simulateAttendanceImport,
        isBrowserOpen,
        browserUrl,
        openBrowser,
        closeBrowser,
        isNotifCenterOpen,
        openNotifCenter,
        closeNotifCenter,
        toggleNotifCenter,
        markNotificationRead,
        markAllNotificationsRead,
        deviceMode,
        setDeviceMode,
        mobileApp,
        setMobileApp,
        isSoundboardPlaying,
        toggleSoundboardPlay,
        toggleLikeNote,
        flagNote,
        unflagNote,
        reportNote,
        resolveReport,
        submitTrackIdInquiry,
        replyToTrackIdInquiry,
        respondToTrackRequest,
        resetDemoData,
        showTour,
        tourStep,
        startTour,
        nextTourStep,
        prevTourStep,
        closeTour
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
