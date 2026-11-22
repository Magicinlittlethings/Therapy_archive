export type DemoPersona = 'patient' | 'visitor' | 'dj' | 'admin';

export type BranchType = 'Group Therapy' | 'Side Quests';

export interface ArtistRef {
  name: string;
  role?: string;
  association?: string;
}

export interface Session {
  id: string;
  sessionCode: string | null;
  title: string;
  date: string;
  city: string;
  venue: string | null;
  branch: BranchType;
  description: string;
  artists: ArtistRef[];
  lineupStatus: 'confirmed' | 'recorded_only' | 'pending';
  confidence: 'high' | 'medium' | 'low';
  verificationNote: string;
  sourceUrls: string[];
  isPublished: boolean;
  publishedAt: string;
}

export type MaterialType = 'dj_set' | 'tracklist' | 'gallery' | 'recap';
export type RightsStatus = 'official_release' | 'authorized_embed' | 'licensed' | 'pending_clearance';

export interface SessionMaterial {
  id: string;
  sessionId: string;
  artistName?: string;
  title: string;
  type: MaterialType;
  externalUrl: string;
  platform: 'mixmachina' | 'youtube' | 'soundcloud' | 'resident_advisor' | 'direct';
  rightsStatus: RightsStatus;
  publishedDate: string;
  description: string;
}

export interface RelatedSessionRef {
  id: string;
  sessionId: string;
  relatedSessionId: string;
  relatedTitle: string;
  relatedCode: string | null;
  relatedDate: string;
  relationshipType: 'shared_artist' | 'musical_direction' | 'milestone' | 'branch_connection';
  explanation: string;
}

export type AttendanceState = 'attended' | 'pending_verification' | 'not_attended';

export interface UserAttendance {
  sessionId: string;
  state: AttendanceState;
  ticketHash?: string;
  verifiedAt?: string;
  checkInSource?: 'door_scan_tix' | 'guestlist' | 'manual_review';
}

export type NoteType = 'patient_note' | 'dj_session_note';
export type NoteVisibility = 'private' | 'public_submission';
export type ModerationStatus = 'none' | 'pending' | 'approved' | 'rejected' | 'declined';
export type NoteSubmissionStatus = 'none' | 'pending' | 'approved' | 'declined';

export interface AttachedPolaroid {
  id: string;
  imageUrl: string;
  caption: string;
  position: 'top-right' | 'top-left' | 'inline' | 'bottom-right' | 'bottom-left';
  rotation: number;
}

export interface TherapyNote {
  id: string;
  sessionId: string;
  sessionCode: string | null;
  sessionTitle: string;
  artistName?: string;
  noteType: NoteType;
  title?: string;
  content: string;
  promptUsed?: string;
  visibility: NoteVisibility;
  moderationStatus: ModerationStatus;
  moderationFeedback?: string;
  isDraft: boolean;
  polaroids?: AttachedPolaroid[];
  authorDisplayName?: string;
  isAnonymousSubmission?: boolean;
  includePolaroidsInSubmission?: boolean;
  submissionStatus?: NoteSubmissionStatus;
  submittedAt?: string;
  pinnedByDj?: boolean;
  likesCount?: number;
  isLiked?: boolean;
  isFlagged?: boolean;
  reportCount?: number;
  reportedBy?: string[];
  flagReason?: string;
  trackRequested?: string;
  tags?: string[];
  djResponse?: string;
  isSimulatedDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteReport {
  id: string;
  noteId: string;
  noteTitle?: string;
  noteSnippet: string;
  reason: 'spam' | 'inappropriate' | 'privacy_violation' | 'misinformation' | 'other';
  reasonText: string;
  reportedBy: string;
  reportedAt: string;
  details?: string;
  status: 'pending_review' | 'dismissed' | 'content_removed';
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface TrackIdInquiry {
  id: string;
  sessionId: string;
  sessionTitle: string;
  sessionCode?: string | null;
  timestampApprox?: string; // e.g. "03:15 AM"
  description: string;
  submittedBy: string;
  createdAt: string;
  djResponse?: string;
  respondedBy?: string;
  respondedAt?: string;
  isSimulatedDemo?: boolean;
  status: 'unanswered' | 'answered';
}

export interface SessionFollow {
  sessionId: string;
  notifyMaterials: boolean;
  notifyRecaps: boolean;
  followedAt: string;
}

export interface ContentRequest {
  id: string;
  sessionId: string;
  materialType: MaterialType;
  artistName?: string;
  note?: string;
  requestedAt: string;
}

export interface SessionRating {
  sessionId: string;
  rating: number; // 1 to 5
  reflection?: string;
  submittedAt: string;
}

export interface NotificationItem {
  id: string;
  sessionId: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  actionUrl?: string;
}
