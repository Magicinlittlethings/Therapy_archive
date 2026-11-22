import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Session,
  SessionMaterial,
  PrivateTherapyNote,
  CommunitySubmission,
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
  TrackIdInquiry,
  AttendanceScenario
} from '../types';
import {
  CURATED_SESSIONS,
  CURATED_MATERIALS,
  SAMPLE_PRIVATE_NOTES,
  SAMPLE_COMMUNITY_SUBMISSIONS,
  DEFAULT_NOTE_REPORTS,
  DEFAULT_TRACK_INQUIRIES,
  DEFAULT_ATTENDANCE_SCENARIOS
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
  privateNotes: PrivateTherapyNote[];
  communitySubmissions: CommunitySubmission[];
  notes: TherapyNote[]; // Combined legacy list
  reports: NoteReport[];
  trackInquiries: TrackIdInquiry[];
  attendances: Record<string, UserAttendance>;
  follows: Record<string, SessionFollow>;
  ratings: Record<string, SessionRating>;
  contentRequests: ContentRequest[];
  notifications: NotificationItem[];
  saveNote: (noteData: Partial<TherapyNote> & { sessionId: string }) => string;
  savePrivateNote: (noteData: Partial<PrivateTherapyNote> & { sessionId: string }) => string;
  deleteNote: (id: string) => void;
  submitNoteForModeration: (id: string) => void;
  submitNoteToCommunity: (noteId: string, options: { isAnonymous: boolean; includePolaroids: boolean }) => void;
  withdrawCommunitySubmission: (noteIdOrSubId: string) => void;
  approveNote: (id: string, feedback?: string) => void;
  rejectNote: (id: string, feedback?: string) => void;
  togglePinNoteByDj: (id: string) => void;
  resonateWithSubmission: (id: string) => void;
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

  // Predictable Attendance Scenarios & Interactive Verification
  attendanceScenarios: AttendanceScenario[];
  activeScenarioId: string;
  selectAttendanceScenario: (id: string) => void;
  isVerifyModalOpen: boolean;
  openVerifyModal: () => void;
  closeVerifyModal: () => void;
  simulateEmailVerification: (email: string) => { success: boolean; message: string; persona: DemoPersona };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PERSONA: 'gt_demo_persona_v2',
  PRIVATE_NOTES: 'gt_demo_priv_notes_v2',
  COMMUNITY_SUBMISSIONS: 'gt_demo_comm_subs_v2',
  FOLLOWS: 'gt_demo_follows_v2',
  ATTENDANCE: 'gt_demo_attendance_v2',
  MATERIALS: 'gt_demo_materials_v2',
  RATINGS: 'gt_demo_ratings_v2',
  REQUESTS: 'gt_demo_requests_v2',
  NOTIFICATIONS: 'gt_demo_notifications_v4',
  TOUR_SEEN: 'gt_demo_tour_seen_v2',
  REPORTS: 'gt_demo_reports_v2',
  TRACK_INQUIRIES: 'gt_demo_track_inquiries_v2',
  ACTIVE_SCENARIO: 'gt_demo_scenario_id_v2'
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
    title: 'Attendance Verified via Door Check-in',
    message: 'Your ticket check-in for Group Therapy XV was matched from the door scanner export.',
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

  const [activeScenarioId, setActiveScenarioId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SCENARIO) || 'scen-lami';
  });

  const [isReloadingRole, setIsReloadingRole] = useState(false);
  const [reloadingRoleName, setReloadingRoleName] = useState('');

  // Tour State
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Role Explanatory Tour State
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

  // Interactive Verification Gate Modal State
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const openVerifyModal = () => setIsVerifyModalOpen(true);
  const closeVerifyModal = () => setIsVerifyModalOpen(false);

  const openRoleTour = (role: DemoPersona) => {
    setRoleTourPersona(role);
    setRoleTourModalOpen(true);
  };

  const closeRoleTour = () => {
    setRoleTourModalOpen(false);
  };

  // Distinct Collections: Private Notes vs Community Submissions
  const [privateNotes, setPrivateNotes] = useState<PrivateTherapyNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRIVATE_NOTES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SAMPLE_PRIVATE_NOTES;
  });

  const [communitySubmissions, setCommunitySubmissions] = useState<CommunitySubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMUNITY_SUBMISSIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SAMPLE_COMMUNITY_SUBMISSIONS;
  });

  // Combined legacy notes representation for components expecting flat notes
  const notes = useMemo<TherapyNote[]>(() => {
    const privCombined: TherapyNote[] = privateNotes.map(p => {
      const existingSub = communitySubmissions.find(s => s.originalNoteId === p.id);
      return {
        ...p,
        visibility: existingSub ? 'public_submission' as const : 'private' as const,
        submissionStatus: existingSub ? existingSub.moderationStatus : 'none' as const,
        moderationStatus: existingSub ? existingSub.moderationStatus : 'none' as const,
        likesCount: existingSub?.resonanceCount || 0,
        isLiked: existingSub?.isResonated || false
      };
    });

    const commOnlyCombined: TherapyNote[] = communitySubmissions
      .filter(s => !s.originalNoteId || !privateNotes.some(p => p.id === s.originalNoteId))
      .map(s => ({
        id: s.id,
        sessionId: s.sessionId,
        sessionCode: s.sessionCode,
        sessionTitle: s.sessionTitle,
        artistName: s.artistName,
        noteType: s.noteType,
        title: s.title,
        content: s.content,
        authorDisplayName: s.authorDisplayName,
        polaroids: s.polaroids,
        visibility: 'public_submission' as const,
        submissionStatus: s.moderationStatus,
        moderationStatus: s.moderationStatus,
        moderationFeedback: s.moderationFeedback,
        isDraft: false,
        pinnedByDj: s.pinnedByDj,
        isLiked: s.isResonated,
        likesCount: s.resonanceCount,
        isFlagged: s.isFlagged,
        reportCount: s.reportCount,
        reportedBy: s.reportedBy,
        flagReason: s.flagReason,
        trackRequested: s.trackRequested,
        tags: s.tags,
        djResponse: s.djResponse,
        isSimulatedDemo: s.isSimulatedDemo,
        createdAt: s.submittedAt,
        updatedAt: s.submittedAt
      }));

    return [...privCombined, ...commOnlyCombined];
  }, [privateNotes, communitySubmissions]);

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

  // Device Mode: Responsive
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

  const [mobileApp, setMobileApp] = useState<'home' | 'files' | 'browser' | 'notes' | 'alerts' | 'deck' | 'settings'>('home');

  // Soundboard Web Audio Synth
  const [isSoundboardPlaying, setIsSoundboardPlaying] = useState(false);
  const toggleSoundboardPlay = () => setIsSoundboardPlaying(prev => !prev);

  useEffect(() => {
    if (isSoundboardPlaying) {
      soundboardEngine.start();
    } else {
      soundboardEngine.stop();
    }
  }, [isSoundboardPlaying]);

  // Reload when Role is Switched
  const setPersona = (newPersona: DemoPersona) => {
    if (newPersona === persona) return;

    const roleLabels: Record<DemoPersona, string> = {
      patient: 'VERIFIED PATIENT DOSSIER (Lami Adeyemi)',
      follower: 'COMMUNITY FOLLOWER (Unverified Attendance)',
      visitor: 'PUBLIC VISITOR (Unregistered)',
      dj: 'RESIDENT DJ STATION // ANIKO',
      admin: 'GT CURATOR TERMINAL (Staff)'
    };

    setReloadingRoleName(roleLabels[newPersona]);
    setIsReloadingRole(true);
    localStorage.setItem(STORAGE_KEYS.PERSONA, newPersona);
    sessionStorage.setItem('gt_role_switched', newPersona);

    setTimeout(() => {
      window.location.href = '/';
    }, 550);
  };

  // Select Attendance Scenario
  const selectAttendanceScenario = (scenarioId: string) => {
    const scen = DEFAULT_ATTENDANCE_SCENARIOS.find(s => s.id === scenarioId) || DEFAULT_ATTENDANCE_SCENARIOS[0];
    setActiveScenarioId(scen.id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SCENARIO, scen.id);

    if (scen.id === 'scen-lami') {
      setAttendances({
        'gt-xii': { sessionId: 'gt-xii', state: 'attended', ticketHash: 'TIX-GT12-8849-VERIFIED', verifiedAt: '2026-02-28T01:30:00Z', checkInSource: 'door_scan_tix' },
        'gt-xv': { sessionId: 'gt-xv', state: 'attended', ticketHash: 'TIX-GT15-9921-VERIFIED', verifiedAt: '2026-11-06T23:15:00Z', checkInSource: 'door_scan_tix' }
      });
      setPersona('patient');
    } else if (scen.id === 'scen-group') {
      setAttendances({
        'gt-xv': { sessionId: 'gt-xv', state: 'attended', ticketHash: 'TIX-GT15-GROUP-01', verifiedAt: '2026-11-06T23:45:00Z', checkInSource: 'door_scan_tix' }
      });
      setPersona('patient');
    } else if (scen.id === 'scen-noshow') {
      setAttendances({
        'gt-viii': { sessionId: 'gt-viii', state: 'not_attended', ticketHash: 'TIX-GT08-PURCHASED', ticketPurchasedOnly: true }
      });
      setPersona('follower');
    } else if (scen.id === 'scen-guestlist') {
      setAttendances({
        'gt-x': { sessionId: 'gt-x', state: 'attended', ticketHash: 'GUEST-GT10-NGOZI', verifiedAt: '2025-11-07T00:30:00Z', checkInSource: 'guestlist' }
      });
      setPersona('patient');
    } else if (scen.id === 'scen-cash') {
      setAttendances({
        'gt-iv': { sessionId: 'gt-iv', state: 'pending_verification', checkInSource: 'curator_archival' }
      });
      setPersona('follower');
    } else if (scen.id === 'scen-linked-email') {
      setAttendances({
        'gt-xii': { sessionId: 'gt-xii', state: 'attended', ticketHash: 'TIX-GT12-8849-VERIFIED', verifiedAt: '2026-02-28T01:30:00Z', checkInSource: 'door_scan_tix' },
        'gt-xv': { sessionId: 'gt-xv', state: 'attended', ticketHash: 'TIX-GT15-9921-VERIFIED', verifiedAt: '2026-11-06T23:15:00Z', checkInSource: 'door_scan_tix' },
        'gt-v': { sessionId: 'gt-v', state: 'attended', ticketHash: 'TIX-GT05-LINKED-CORP', verifiedAt: '2024-08-24T23:00:00Z', checkInSource: 'door_scan_tix' }
      });
      setPersona('patient');
    }
  };

  // Simulate Email Verification
  const simulateEmailVerification = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'lami@grouptherapy.live' || cleanEmail === 'lami.work@gmail.com') {
      setPersonaState('patient');
      localStorage.setItem(STORAGE_KEYS.PERSONA, 'patient');
      setAttendances({
        'gt-xii': { sessionId: 'gt-xii', state: 'attended', ticketHash: 'TIX-GT12-8849-VERIFIED', verifiedAt: '2026-02-28T01:30:00Z', checkInSource: 'door_scan_tix' },
        'gt-xv': { sessionId: 'gt-xv', state: 'attended', ticketHash: 'TIX-GT15-9921-VERIFIED', verifiedAt: '2026-11-06T23:15:00Z', checkInSource: 'door_scan_tix' }
      });
      return {
        success: true,
        message: 'Attendance verified via door scan logs for GT-XII and GT-XV. Patient Dossier unlocked.',
        persona: 'patient' as DemoPersona
      };
    } else if (cleanEmail === 'chidi@grouptherapy.live') {
      setPersonaState('patient');
      localStorage.setItem(STORAGE_KEYS.PERSONA, 'patient');
      setAttendances({
        'gt-xv': { sessionId: 'gt-xv', state: 'attended', ticketHash: 'TIX-GT15-GROUP-01', verifiedAt: '2026-11-06T23:45:00Z', checkInSource: 'door_scan_tix' }
      });
      return {
        success: true,
        message: '1 physical attendance verified for GT-XV. 2 companion claim passes available in your dossier.',
        persona: 'patient' as DemoPersona
      };
    } else if (cleanEmail === 'ngozi@grouptherapy.live') {
      setPersonaState('patient');
      localStorage.setItem(STORAGE_KEYS.PERSONA, 'patient');
      setAttendances({
        'gt-x': { sessionId: 'gt-x', state: 'attended', ticketHash: 'GUEST-GT10-NGOZI', verifiedAt: '2025-11-07T00:30:00Z', checkInSource: 'guestlist' }
      });
      return {
        success: true,
        message: 'Verified attendance matched via door manager guest list for GT-X.',
        persona: 'patient' as DemoPersona
      };
    } else if (cleanEmail === 'alex@grouptherapy.live') {
      setPersonaState('follower');
      localStorage.setItem(STORAGE_KEYS.PERSONA, 'follower');
      setAttendances({
        'gt-viii': { sessionId: 'gt-viii', state: 'not_attended', ticketPurchasedOnly: true }
      });
      return {
        success: true,
        message: 'Ticket purchase confirmed for GT-VIII, but no physical door check-in was recorded. Registered as Community Follower.',
        persona: 'follower' as DemoPersona
      };
    } else {
      // Unrecognized email: offer follower registration
      setPersonaState('follower');
      localStorage.setItem(STORAGE_KEYS.PERSONA, 'follower');
      return {
        success: false,
        message: 'No physical door check-in record found for this address. Registered as Community Follower. You may link another purchase email or submit an archival attendance claim.',
        persona: 'follower' as DemoPersona
      };
    }
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRIVATE_NOTES, JSON.stringify(privateNotes));
  }, [privateNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_SUBMISSIONS, JSON.stringify(communitySubmissions));
  }, [communitySubmissions]);

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
    if (persona === 'visitor' || persona === 'follower') return 'not_attended';
    if (persona === 'dj') {
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
      alert('You are currently viewing as an unauthenticated visitor. Register as a Community Follower or Patient to follow sessions.');
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

  // Save Private Note (Strictly updates privateNotes collection)
  const savePrivateNote = (noteData: Partial<PrivateTherapyNote> & { sessionId: string }): string => {
    const targetSession = CURATED_SESSIONS.find(s => s.id === noteData.sessionId);
    const existingIndex = privateNotes.findIndex(n => n.id === noteData.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const updated = [...privateNotes];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...noteData,
        updatedAt: now
      };
      setPrivateNotes(updated);
      return updated[existingIndex].id;
    } else {
      const newId = `priv-note-${Date.now()}`;
      const newNote: PrivateTherapyNote = {
        id: newId,
        sessionId: noteData.sessionId,
        sessionCode: targetSession?.sessionCode || null,
        sessionTitle: targetSession?.title || 'Group Therapy Session',
        artistName: noteData.artistName,
        noteType: noteData.noteType || 'patient_note',
        title: noteData.title || undefined,
        content: noteData.content || '',
        promptUsed: noteData.promptUsed,
        authorDisplayName: persona === 'dj' ? 'Aniko' : 'Lami Adeyemi',
        isDraft: noteData.isDraft ?? false,
        polaroids: noteData.polaroids || [],
        createdAt: now,
        updatedAt: now
      };
      setPrivateNotes(prev => [newNote, ...prev]);
      return newId;
    }
  };

  // Backward-compatible saveNote wrapper
  const saveNote = (noteData: Partial<TherapyNote> & { sessionId: string }): string => {
    return savePrivateNote(noteData as Partial<PrivateTherapyNote> & { sessionId: string });
  };

  const deleteNote = (id: string) => {
    setPrivateNotes(prev => prev.filter(n => n.id !== id));
    // Also remove from community submissions if linked
    setCommunitySubmissions(prev => prev.filter(s => s.originalNoteId !== id && s.id !== id));
  };

  const submitNoteForModeration = (id: string) => {
    submitNoteToCommunity(id, { isAnonymous: false, includePolaroids: true });
  };

  // Deliberately Submit to Community (Creates separate CommunitySubmission record)
  const submitNoteToCommunity = (noteId: string, options: { isAnonymous: boolean; includePolaroids: boolean }) => {
    const priv = privateNotes.find(n => n.id === noteId);
    if (!priv) return;

    const existingSubIndex = communitySubmissions.findIndex(s => s.originalNoteId === noteId);
    const now = new Date().toISOString();

    const submissionData: CommunitySubmission = {
      id: existingSubIndex >= 0 ? communitySubmissions[existingSubIndex].id : `comm-sub-${Date.now()}`,
      originalNoteId: priv.id,
      sessionId: priv.sessionId,
      sessionCode: priv.sessionCode,
      sessionTitle: priv.sessionTitle,
      artistName: priv.artistName,
      noteType: priv.noteType,
      title: priv.title || 'Untitled Reflection',
      content: priv.content,
      authorDisplayName: options.isAnonymous ? 'Anonymous Dancer' : priv.authorDisplayName,
      isAnonymous: options.isAnonymous,
      includePolaroids: options.includePolaroids,
      polaroids: options.includePolaroids ? priv.polaroids : [],
      moderationStatus: 'pending',
      submittedAt: now,
      isResonated: false
    };

    if (existingSubIndex >= 0) {
      const updated = [...communitySubmissions];
      updated[existingSubIndex] = submissionData;
      setCommunitySubmissions(updated);
    } else {
      setCommunitySubmissions(prev => [submissionData, ...prev]);
    }

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      sessionId: priv.sessionId,
      title: 'Community Submission Received',
      message: `Your reflection "${priv.title || 'Reflection'}" was submitted for collective curation. Group Therapy curators review submissions before publication.`,
      date: new Date().toISOString().split('T')[0],
      isRead: false,
      actionUrl: `/my-sessions/${priv.sessionId}/notes`
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Withdraw Community Submission (Does NOT touch the private note)
  const withdrawCommunitySubmission = (noteIdOrSubId: string) => {
    setCommunitySubmissions(prev => prev.filter(s => s.id !== noteIdOrSubId && s.originalNoteId !== noteIdOrSubId));
  };

  const approveNote = (id: string, feedback?: string) => {
    setCommunitySubmissions(prev => prev.map(s => {
      if (s.id === id || s.originalNoteId === id) {
        return {
          ...s,
          moderationStatus: 'approved',
          moderationFeedback: feedback || 'Approved for Group Therapy Community Archive.',
          reviewedAt: new Date().toISOString(),
          reviewedBy: persona === 'dj' ? 'Aniko (DJ)' : 'Staff Curator'
        };
      }
      return s;
    }));
  };

  const rejectNote = (id: string, feedback?: string) => {
    setCommunitySubmissions(prev => prev.map(s => {
      if (s.id === id || s.originalNoteId === id) {
        return {
          ...s,
          moderationStatus: 'rejected',
          moderationFeedback: feedback || 'Returned to private enclave with curator notes.',
          reviewedAt: new Date().toISOString(),
          reviewedBy: persona === 'dj' ? 'Aniko (DJ)' : 'Staff Curator'
        };
      }
      return s;
    }));
  };

  const togglePinNoteByDj = (id: string) => {
    setCommunitySubmissions(prev => prev.map(s => {
      if (s.id === id || s.originalNoteId === id) {
        return {
          ...s,
          pinnedByDj: !s.pinnedByDj
        };
      }
      return s;
    }));
  };

  // Resonate (Quiet acknowledgement without numeric vanity scoreboards)
  const resonateWithSubmission = (id: string) => {
    setCommunitySubmissions(prev => prev.map(s => {
      if (s.id === id || s.originalNoteId === id) {
        const currentlyResonated = s.isResonated ?? false;
        return {
          ...s,
          isResonated: !currentlyResonated,
          resonanceCount: currentlyResonated ? Math.max(0, (s.resonanceCount || 1) - 1) : (s.resonanceCount || 0) + 1
        };
      }
      return s;
    }));
  };

  const toggleLikeNote = (id: string) => {
    resonateWithSubmission(id);
  };

  const attachPolaroidToNote = (noteId: string, polaroid: AttachedPolaroid) => {
    setPrivateNotes(prev => prev.map(n => {
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
    setPrivateNotes(prev => prev.map(n => {
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

  const flagNote = (id: string, reason?: string) => {
    reportNote(id, 'other', reason || 'Flagged for curator review');
  };

  const unflagNote = (id: string) => {
    setCommunitySubmissions(prev => prev.map(s => {
      if (s.id === id || s.originalNoteId === id) {
        return {
          ...s,
          isFlagged: false,
          flagReason: undefined
        };
      }
      return s;
    }));
  };

  // Report creates a formal moderation case; does NOT automatically remove reflection
  const reportNote = (noteId: string, reason: NoteReport['reason'], reasonText: string, details?: string) => {
    const target = communitySubmissions.find(s => s.id === noteId || s.originalNoteId === noteId);
    const reporterName = persona === 'dj' ? 'Aniko' : persona === 'admin' ? 'Staff Curator' : 'Lami Adeyemi';

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

    // Only place on protective hold if severe spam/inappropriate or >= 3 independent reports
    setCommunitySubmissions(prev => prev.map(s => {
      if (s.id === noteId || s.originalNoteId === noteId) {
        const count = (s.reportCount || 0) + 1;
        const currentReporters = s.reportedBy || [];
        const shouldHold = count >= 3 || reason === 'spam' || reason === 'inappropriate';
        return {
          ...s,
          reportCount: count,
          reportedBy: [...currentReporters, reporterName],
          isFlagged: shouldHold,
          flagReason: reasonText
        };
      }
      return s;
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
          resolvedBy: persona === 'dj' ? 'Aniko (DJ)' : 'Staff Curator',
          resolutionNotes: notesText || (action === 'dismiss' ? 'Report reviewed and dismissed. Content remains active in archive.' : 'Content removed from public community view.')
        };
      }
      return r;
    }));

    if (action === 'dismiss') {
      setCommunitySubmissions(prev => prev.map(s => {
        if (s.id === report.noteId || s.originalNoteId === report.noteId) {
          return {
            ...s,
            isFlagged: false
          };
        }
        return s;
      }));
    } else {
      setCommunitySubmissions(prev => prev.map(s => {
        if (s.id === report.noteId || s.originalNoteId === report.noteId) {
          return {
            ...s,
            isFlagged: true,
            moderationStatus: 'rejected'
          };
        }
        return s;
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
      submittedBy: persona === 'visitor' ? 'Public Visitor' : persona === 'follower' ? 'Community Follower' : 'Lami Adeyemi (Verified Attendee)',
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
    setCommunitySubmissions(prev => prev.map(s => {
      if (s.id === id || s.originalNoteId === id) {
        return {
          ...s,
          djResponse: `[SIMULATED DEMO RESPONSE] ${response}`
        };
      }
      return s;
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
    setActiveScenarioId('scen-lami');
    setPrivateNotes(SAMPLE_PRIVATE_NOTES);
    setCommunitySubmissions(SAMPLE_COMMUNITY_SUBMISSIONS);
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
        privateNotes,
        communitySubmissions,
        notes,
        reports,
        trackInquiries,
        attendances,
        follows,
        ratings,
        contentRequests,
        notifications,
        saveNote,
        savePrivateNote,
        deleteNote,
        submitNoteForModeration,
        submitNoteToCommunity,
        withdrawCommunitySubmission,
        approveNote,
        rejectNote,
        togglePinNoteByDj,
        resonateWithSubmission,
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
        closeTour,
        attendanceScenarios: DEFAULT_ATTENDANCE_SCENARIOS,
        activeScenarioId,
        selectAttendanceScenario,
        isVerifyModalOpen,
        openVerifyModal,
        closeVerifyModal,
        simulateEmailVerification
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
