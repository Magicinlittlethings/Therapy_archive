export type DemoPersona = 'patient' | 'visitor' | 'follower' | 'dj' | 'admin';

export type BranchType = 'Group Therapy' | 'Side Quests';

export type ArchivalStatus = 'confirmed' | 'partial_record' | 'awaiting_verification';

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
  archivalStatus: ArchivalStatus;
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
  checkInSource?: 'door_scan_tix' | 'guestlist' | 'manual_review' | 'curator_archival';
  ticketPurchasedOnly?: boolean;
}

export type NoteType = 'patient_note' | 'dj_session_note';
export type ModerationStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface AttachedPolaroid {
  id: string;
  imageUrl: string;
  caption: string;
  position: 'top-right' | 'top-left' | 'inline' | 'bottom-right' | 'bottom-left';
  rotation: number;
}

/**
 * Private Therapy Note (Strictly personal to the author)
 */
export interface PrivateTherapyNote {
  id: string;
  sessionId: string;
  sessionCode: string | null;
  sessionTitle: string;
  artistName?: string;
  noteType: NoteType;
  title?: string;
  content: string;
  promptUsed?: string;
  polaroids?: AttachedPolaroid[];
  authorDisplayName: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Community Submission (Deliberately submitted copy for collective archive)
 */
export interface CommunitySubmission {
  id: string;
  originalNoteId?: string;
  sessionId: string;
  sessionCode: string | null;
  sessionTitle: string;
  artistName?: string;
  noteType: NoteType;
  title?: string;
  content: string;
  authorDisplayName: string;
  isAnonymous: boolean;
  includePolaroids: boolean;
  polaroids?: AttachedPolaroid[];
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderationFeedback?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  pinnedByDj?: boolean;
  isResonated?: boolean;
  resonanceCount?: number;
  isFlagged?: boolean;
  reportCount?: number;
  reportedBy?: string[];
  flagReason?: string;
  trackRequested?: string;
  tags?: string[];
  djResponse?: string;
  isSimulatedDemo?: boolean;
}

export type NoteVisibility = 'private' | 'public_submission';

// Backward-compatible TherapyNote interface
export type TherapyNote = PrivateTherapyNote & Omit<Partial<CommunitySubmission>, 'moderationStatus'> & {
  visibility?: NoteVisibility;
  submissionStatus?: 'none' | 'pending' | 'approved' | 'declined' | 'rejected';
  moderationStatus?: 'none' | 'pending' | 'approved' | 'rejected' | 'declined';
  likesCount?: number;
  isLiked?: boolean;
  isAnonymousSubmission?: boolean;
  includePolaroidsInSubmission?: boolean;
};

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

export interface AttendanceScenario {
  id: string;
  name: string;
  persona: DemoPersona;
  email: string;
  title: string;
  purchaseSummary: string;
  doorCheckInSummary: string;
  eligibilityStatus: 'Verified Patient' | 'Community Follower' | 'Awaiting Curator Review';
  explanation: string;
}
