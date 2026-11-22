import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Session, SessionMaterial, TherapyNote } from '../../types';
import {
  Folder,
  FolderOpen,
  FileText,
  Music,
  Image as ImageIcon,
  FileEdit,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Search,
  Grid,
  List as ListIcon,
  ArrowLeft,
  ArrowUp,
  Play,
  Pause,
  ExternalLink,
  Pin,
  Check,
  Clock,
  X,
  User,
  ShieldAlert,
  Calendar,
  MapPin,
  Disc3,
  Globe,
  Bell
} from 'lucide-react';

export type FileSystemItem = {
  id: string;
  name: string;
  type: 'folder' | 'audio' | 'photo' | 'note' | 'info';
  extension?: string;
  sizeOrDuration?: string;
  dateModified: string;
  targetPath?: string;
  sessionId?: string;
  sessionCode?: string | null;
  session?: Session;
  material?: SessionMaterial;
  note?: TherapyNote;
  badge?: string;
  badgeType?: 'verified' | 'pending' | 'public' | 'pinned';
};

interface GTFileExplorerProps {
  initialPath?: string;
  onOpenFile?: (item: FileSystemItem) => void;
}

export const GTFileExplorer: React.FC<GTFileExplorerProps> = ({ initialPath = '/sessions', onOpenFile }) => {
  const navigate = useNavigate();
  const { sessions, materials, notes, getAttendance, isFollowed, persona, approveNote, rejectNote, togglePinNoteByDj, openBrowser, notifications } = useStore();
  const attendedCount = sessions.filter(s => getAttendance(s.id) === 'attended').length;
  const pendingNotesCount = notes.filter(n => n.moderationStatus === 'pending').length;

  // Current directory path state
  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [history, setHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // View mode: 'list' (Finder column view) or 'grid' (Finder icon view)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Search filter inside current directory
  const [searchFilter, setSearchFilter] = useState('');

  // Selected file for inspector / preview modal
  const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Audio playback preview state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeAudioItem, setActiveAudioItem] = useState<FileSystemItem | null>(null);

  // Sidebar expanded folders
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    sessions: true,
    myDossier: true,
    curatorDesk: true
  });

  const toggleFolderExpand = (key: string) => {
    setExpandedFolders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Navigate to a new directory
  const navigateTo = (newPath: string) => {
    if (newPath === currentPath) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPath);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(newPath);
    setSearchFilter('');
    setSelectedItem(null);
  };

  // Back in directory history
  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedItem(null);
    }
  };

  // Up one directory level
  const goUp = () => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length > 1) {
      parts.pop();
      navigateTo('/' + parts.join('/'));
    } else if (parts.length === 1) {
      navigateTo('/');
    }
  };

  // Parse path segments for breadcrumbs
  const pathSegments = useMemo(() => {
    const clean = currentPath.replace(/^\/+|\/+$/g, '');
    if (!clean) return [{ label: 'GT_ARCHIVE', path: '/' }];

    const parts = clean.split('/');
    const breadcrumbs = [{ label: 'GT_ARCHIVE', path: '/' }];
    let accum = '';

    parts.forEach(p => {
      accum += '/' + p;
      let label = p;
      if (p === 'sessions') label = 'Sessions';
      else if (p === 'my-dossier') label = 'My Files';
      else if (p === 'curator-desk') label = 'Curator Desk';
      else if (p === 'recordings') label = 'Audio Recordings';
      else if (p === 'photos') label = 'Photo Gallery';
      else if (p === 'notes') label = 'Therapy Notes';
      else {
        // Find session code if applicable
        const s = sessions.find(item => item.id === p);
        if (s) label = s.sessionCode || s.title;
      }
      breadcrumbs.push({ label, path: accum });
    });

    return breadcrumbs;
  }, [currentPath, sessions]);

  // Compute items inside current directory
  const directoryItems: FileSystemItem[] = useMemo(() => {
    const p = currentPath.replace(/\/+$/, '') || '/';

    // ROOT DIRECTORY: /
    if (p === '/') {
      const items: FileSystemItem[] = [
        {
          id: 'dir-sessions',
          name: '01_Sessions',
          type: 'folder',
          dateModified: '2026-11-18',
          sizeOrDuration: `${sessions.length} sessions`,
          targetPath: '/sessions',
          badge: 'Public Archive'
        }
      ];

      if (persona !== 'visitor') {
        items.push({
          id: 'dir-my-dossier',
          name: '02_My_Files',
          type: 'folder',
          dateModified: '2026-11-18',
          sizeOrDuration: 'Personal Dossier',
          targetPath: '/my-dossier',
          badge: 'Patient Dossier'
        });
      }

      if (persona === 'admin' || persona === 'dj') {
        items.push({
          id: 'dir-curator-desk',
          name: '03_Curator_&_DJ_Desk',
          type: 'folder',
          dateModified: '2026-11-18',
          sizeOrDuration: 'Moderation & Reviews',
          targetPath: '/curator-desk',
          badge: 'Staff Desk'
        });
      }

      // In-System Web Application (Social Media Feed)
      items.push({
        id: 'file-notes-html',
        name: 'notes.html',
        type: 'info',
        extension: 'html',
        dateModified: '2026-11-19',
        sizeOrDuration: 'Social Media Feed // Community Wall',
        badge: 'Social Feed',
        badgeType: 'verified'
      });

      return items;
    }

    // ALL SESSIONS DIRECTORY: /sessions
    if (p === '/sessions') {
      return sessions.map(s => {
        const attendance = getAttendance(s.id);
        const sessionNotes = notes.filter(n => n.sessionId === s.id);
        const sessionMats = materials.filter(m => m.sessionId === s.id);
        const totalItems = sessionMats.length + sessionNotes.length + 1; // +1 for info.txt

        let badge = 'Confirmed';
        let badgeType: FileSystemItem['badgeType'] = 'public';
        if (s.archivalStatus === 'awaiting_verification') {
          badge = 'Awaiting Verification';
          badgeType = 'pending';
        } else if (s.archivalStatus === 'partial_record') {
          badge = 'Partial Record';
          badgeType = 'public';
        } else if (attendance === 'attended') {
          badge = 'Verified Attended';
          badgeType = 'verified';
        } else if (attendance === 'pending_verification') {
          badge = 'Pending Verification';
          badgeType = 'pending';
        }

        return {
          id: `session-${s.id}`,
          name: `${s.sessionCode || s.title} (${s.venue || s.city})`,
          type: 'folder',
          dateModified: s.date,
          sizeOrDuration: `${totalItems} items`,
          targetPath: `/sessions/${s.id}`,
          sessionId: s.id,
          sessionCode: s.sessionCode,
          session: s,
          badge,
          badgeType
        };
      });
    }

    // INSIDE A SPECIFIC SESSION: /sessions/:sessionId
    const sessionMatch = p.match(/^\/sessions\/([a-zA-Z0-9-]+)$/);
    if (sessionMatch) {
      const sId = sessionMatch[1];
      const s = sessions.find(item => item.id === sId);
      if (!s) return [];

      const sessionAudio = materials.filter(m => m.sessionId === sId && m.type === 'dj_set');
      const sessionPhotos = materials.filter(m => m.sessionId === sId && m.type === 'gallery');
      const sessionNotes = notes.filter(n => n.sessionId === sId && n.moderationStatus === 'approved');

      return [
        {
          id: `info-${sId}`,
          name: `${s.sessionCode || 'session'}_info.txt`,
          type: 'info',
          extension: 'txt',
          dateModified: s.date,
          sizeOrDuration: '3.2 KB',
          sessionId: sId,
          session: s,
          badge: 'Session Overview'
        },
        {
          id: `folder-audio-${sId}`,
          name: '01_Audio_Recordings',
          type: 'folder',
          dateModified: s.date,
          sizeOrDuration: `${sessionAudio.length} recordings`,
          targetPath: `/sessions/${sId}/recordings`,
          sessionId: sId
        },
        {
          id: `folder-photos-${sId}`,
          name: '02_Visuals_&_Photos',
          type: 'folder',
          dateModified: s.date,
          sizeOrDuration: `${sessionPhotos.length} photo folders`,
          targetPath: `/sessions/${sId}/photos`,
          sessionId: sId
        },
        {
          id: `folder-notes-${sId}`,
          name: '03_Therapy_Notes',
          type: 'folder',
          dateModified: s.date,
          sizeOrDuration: `${sessionNotes.length} notes`,
          targetPath: `/sessions/${sId}/notes`,
          sessionId: sId,
          badge: 'Therapy Notes'
        }
      ];
    }

    // INSIDE SESSION AUDIO RECORDINGS: /sessions/:sessionId/recordings
    const audioMatch = p.match(/^\/sessions\/([a-zA-Z0-9-]+)\/recordings$/);
    if (audioMatch) {
      const sId = audioMatch[1];
      const sessionAudio = materials.filter(m => m.sessionId === sId && m.type === 'dj_set');

      if (sessionAudio.length === 0) {
        return [
          {
            id: 'placeholder-audio',
            name: 'soundboard_capture_in_processing.txt',
            type: 'info',
            dateModified: '2026-11-18',
            sizeOrDuration: 'Pending Master',
            badge: 'In Processing'
          }
        ];
      }

      return sessionAudio.map(m => ({
        id: `mat-${m.id}`,
        name: `${m.artistName || 'Resident'}_live_capture.mp3`,
        type: 'audio',
        extension: 'mp3',
        dateModified: m.publishedDate,
        sizeOrDuration: '1h 22m · 128 MB',
        sessionId: sId,
        material: m,
        badge: m.rightsStatus === 'official_release' ? 'Official Soundboard' : 'Archived Capture',
        badgeType: 'verified'
      }));
    }

    // INSIDE SESSION COMMUNITY THERAPY NOTES: /sessions/:sessionId/notes
    const notesMatch = p.match(/^\/sessions\/([a-zA-Z0-9-]+)\/notes$/);
    if (notesMatch) {
      const sId = notesMatch[1];
      const sessionNotes = notes.filter(n => n.sessionId === sId && n.moderationStatus === 'approved');

      return sessionNotes.map(n => ({
        id: `note-${n.id}`,
        name: `${(n.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 32)}.note`,
        type: 'note',
        extension: 'note',
        dateModified: n.updatedAt.split('T')[0],
        sizeOrDuration: `${n.polaroids?.length || 0} polaroids`,
        sessionId: sId,
        note: n,
        badge: n.pinnedByDj ? 'Pinned by DJ' : (n.authorDisplayName || 'Attendee'),
        badgeType: n.pinnedByDj ? 'pinned' : 'public'
      }));
    }

    // INSIDE SESSION PHOTOS: /sessions/:sessionId/photos
    const photosMatch = p.match(/^\/sessions\/([a-zA-Z0-9-]+)\/photos$/);
    if (photosMatch) {
      const sId = photosMatch[1];
      return [
        {
          id: `photo-1-${sId}`,
          name: 'laser_fog_perimeter_0340.jpg',
          type: 'photo',
          extension: 'jpg',
          dateModified: '2026-11-06',
          sizeOrDuration: '4.8 MB · Polaroid Scan',
          sessionId: sId,
          badge: 'Event Photo'
        },
        {
          id: `photo-2-${sId}`,
          name: 'booth_rotary_mixer_128bpm.jpg',
          type: 'photo',
          extension: 'jpg',
          dateModified: '2026-11-06',
          sizeOrDuration: '3.9 MB · Booth Setup',
          sessionId: sId,
          badge: 'Resident Deck'
        },
        {
          id: `photo-3-${sId}`,
          name: 'collective_dancefloor_pulse.jpg',
          type: 'photo',
          extension: 'jpg',
          dateModified: '2026-11-06',
          sizeOrDuration: '5.2 MB · Nightlight Scan',
          sessionId: sId,
          badge: 'Dancefloor'
        }
      ];
    }

    // MY DOSSIER ROOT: /my-dossier
    if (p === '/my-dossier') {
      const attendedSessions = sessions.filter(s => getAttendance(s.id) === 'attended');
      const pendingSessions = sessions.filter(s => getAttendance(s.id) === 'pending_verification');
      const followedSessions = sessions.filter(s => isFollowed(s.id));

      return [
        {
          id: 'folder-my-attended',
          name: 'Attended_Sessions',
          type: 'folder',
          dateModified: '2026-11-18',
          sizeOrDuration: `${attendedSessions.length} verified records`,
          targetPath: '/my-dossier/attended',
          badge: `${attendedSessions.length} Attended`,
          badgeType: 'verified'
        },
        {
          id: 'folder-my-pending',
          name: 'Pending_Verification',
          type: 'folder',
          dateModified: '2026-11-18',
          sizeOrDuration: `${pendingSessions.length} tickets`,
          targetPath: '/my-dossier/pending',
          badge: `${pendingSessions.length} Awaiting Scan`,
          badgeType: 'pending'
        },
        {
          id: 'folder-my-notes',
          name: 'My_Therapy_Notes',
          type: 'folder',
          dateModified: '2026-11-18',
          sizeOrDuration: `${notes.length} reflections`,
          targetPath: '/my-dossier/notes',
          badge: `${notes.length} Notes`,
          badgeType: 'public'
        },
        {
          id: 'folder-my-followed',
          name: 'Followed_Sessions',
          type: 'folder',
          dateModified: '2026-11-18',
          sizeOrDuration: `${followedSessions.length} tracking`,
          targetPath: '/my-dossier/followed',
          badge: `${followedSessions.length} Tracked`
        }
      ];
    }

    // MY DOSSIER SUBDIRECTORIES
    if (p === '/my-dossier/attended') {
      const attendedSessions = sessions.filter(s => getAttendance(s.id) === 'attended');
      return attendedSessions.map(s => ({
        id: `att-${s.id}`,
        name: `${s.sessionCode || s.title}_verified_ticket.nfo`,
        type: 'info',
        extension: 'nfo',
        dateModified: s.date,
        sizeOrDuration: 'Verified Door Scan',
        sessionId: s.id,
        session: s,
        badge: 'Verified Attendee',
        badgeType: 'verified'
      }));
    }

    if (p === '/my-dossier/pending') {
      const pendingSessions = sessions.filter(s => getAttendance(s.id) === 'pending_verification');
      return pendingSessions.map(s => ({
        id: `pen-${s.id}`,
        name: `${s.sessionCode || s.title}_awaiting_check_in.txt`,
        type: 'info',
        extension: 'txt',
        dateModified: s.date,
        sizeOrDuration: 'Awaiting Check-in Upload',
        sessionId: s.id,
        session: s,
        badge: 'Auto-Match by Email',
        badgeType: 'pending'
      }));
    }

    if (p === '/my-dossier/notes') {
      return notes.map(n => ({
        id: `my-note-${n.id}`,
        name: `${(n.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 32)}.note`,
        type: 'note',
        extension: 'note',
        dateModified: n.updatedAt.split('T')[0],
        sizeOrDuration: `${n.polaroids?.length || 0} photos`,
        sessionId: n.sessionId,
        note: n,
        badge: n.moderationStatus === 'approved' ? 'Public Wall' : (n.moderationStatus === 'pending' ? 'In Review' : 'Private Memo'),
        badgeType: n.moderationStatus === 'approved' ? 'verified' : (n.moderationStatus === 'pending' ? 'pending' : 'public')
      }));
    }

    if (p === '/my-dossier/followed') {
      const followedSessions = sessions.filter(s => isFollowed(s.id));
      return followedSessions.map(s => ({
        id: `fol-${s.id}`,
        name: `${s.sessionCode || s.title}_release_tracker.txt`,
        type: 'info',
        extension: 'txt',
        dateModified: s.date,
        sizeOrDuration: 'Release Alerts Active',
        sessionId: s.id,
        session: s,
        badge: 'Tracking Releases'
      }));
    }

    // CURATOR & DJ DESK ROOT: /curator-desk
    if (p === '/curator-desk') {
      const pendingNotes = notes.filter(n => n.moderationStatus === 'pending');
      const djReviews = notes.filter(n => n.noteType === 'dj_session_note' && n.artistName?.toLowerCase() === 'aniko');
      const items: FileSystemItem[] = [];

      // Notes moderation queue is strictly for curator staff
      if (persona === 'admin') {
        items.push({
          id: 'folder-moderation-queue',
          name: '01_Moderation_Queue',
          type: 'folder',
          dateModified: '2026-11-18',
          sizeOrDuration: `${pendingNotes.length} submissions`,
          targetPath: '/curator-desk/moderation',
          badge: `${pendingNotes.length} Pending`,
          badgeType: 'pending'
        });
      }

      // Audience set reviews for Resident DJ & Curators
      items.push({
        id: 'folder-dj-reviews',
        name: '02_Audience_Set_Reviews',
        type: 'folder',
        dateModified: '2026-11-18',
        sizeOrDuration: `${djReviews.length} set reviews`,
        targetPath: '/curator-desk/dj-reviews',
        badge: 'Resident DJ Aniko',
        badgeType: 'verified'
      });

      // Door check-in ingestion is strictly for curator staff
      if (persona === 'admin') {
        items.push({
          id: 'folder-door-ingest',
          name: '03_Door_Check-in_Ingestion',
          type: 'folder',
          dateModified: '2026-11-18',
          sizeOrDuration: 'CSV Reconciler',
          targetPath: '/curator-desk/check-in',
          badge: 'Scanner Ingest'
        });
      }

      return items;
    }

    if (p === '/curator-desk/moderation') {
      const pendingNotes = notes.filter(n => n.moderationStatus === 'pending');
      if (pendingNotes.length === 0) {
        return [
          {
            id: 'mod-queue-empty',
            name: 'moderation_queue_all_cleared.txt',
            type: 'info',
            dateModified: '2026-11-18',
            sizeOrDuration: '0 items pending',
            badge: 'Queue Clear',
            badgeType: 'verified'
          }
        ];
      }

      return pendingNotes.map(n => ({
        id: `mod-note-${n.id}`,
        name: `${(n.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 32)}_review.note`,
        type: 'note',
        extension: 'note',
        dateModified: n.updatedAt.split('T')[0],
        sizeOrDuration: `${n.polaroids?.length || 0} polaroids`,
        sessionId: n.sessionId,
        note: n,
        badge: 'Pending Curator Action',
        badgeType: 'pending'
      }));
    }

    if (p === '/curator-desk/dj-reviews') {
      const djReviews = notes.filter(n => n.noteType === 'dj_session_note' && n.artistName?.toLowerCase() === 'aniko');
      return djReviews.map(n => ({
        id: `dj-rev-${n.id}`,
        name: `aniko_set_review_${n.sessionCode || 'gt'}.note`,
        type: 'note',
        extension: 'note',
        dateModified: n.updatedAt.split('T')[0],
        sizeOrDuration: `${n.polaroids?.length || 0} polaroids`,
        sessionId: n.sessionId,
        note: n,
        badge: n.pinnedByDj ? 'Pinned to DJ Profile' : 'Audience Review',
        badgeType: n.pinnedByDj ? 'pinned' : 'verified'
      }));
    }

    return [];
  }, [currentPath, sessions, materials, notes, getAttendance, isFollowed, persona]);

  // Filtered items based on search
  const filteredItems = useMemo(() => {
    if (!searchFilter.trim()) return directoryItems;
    const q = searchFilter.toLowerCase();
    return directoryItems.filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q)) ||
      (item.sizeOrDuration && item.sizeOrDuration.toLowerCase().includes(q))
    );
  }, [directoryItems, searchFilter]);

  // Handle clicking an item
  const handleItemClick = (item: FileSystemItem) => {
    setSelectedItem(item);

    // If opening notes.html, launch in-system web browser!
    if (item.name === 'notes.html' || item.extension === 'html') {
      openBrowser('gt://notes.html');
      return;
    }

    if (item.type === 'folder' && item.targetPath) {
      navigateTo(item.targetPath);
      return;
    }

    // If onOpenFile callback provided
    if (onOpenFile) {
      onOpenFile(item);
    }

    // Open file preview modal
    setPreviewModalOpen(true);
  };

  // Helper for rendering icons
  const renderItemIcon = (type: FileSystemItem['type'], size = 18, extension?: string) => {
    if (extension === 'html') {
      return <Globe size={size} color="var(--gt-acid)" />;
    }

    switch (type) {
      case 'folder':
        return <Folder size={size} color="var(--gt-acid)" fill="rgba(4, 229, 57, 0.18)" />;
      case 'audio':
        return <Music size={size} color="#ff5c2e" />;
      case 'photo':
        return <ImageIcon size={size} color="#ffbd2e" />;
      case 'note':
        return <FileEdit size={size} color="var(--gt-acid)" />;
      case 'info':
      default:
        return <FileText size={size} color="#c8c5bc" />;
    }
  };

  return (
    <div className="finder-window">
      {/* Finder Top Titlebar */}
      <div className="finder-titlebar">
        {/* Left: Back / Up navigation buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={goBack}
              disabled={historyIndex === 0}
              style={{
                background: 'none',
                border: 'none',
                color: historyIndex === 0 ? '#444' : 'var(--gt-cream)',
                cursor: historyIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '4px'
              }}
              title="Back"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={goUp}
              disabled={currentPath === '/'}
              style={{
                background: 'none',
                border: 'none',
                color: currentPath === '/' ? '#444' : 'var(--gt-cream)',
                cursor: currentPath === '/' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '4px'
              }}
              title="Up one folder"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* Center: Interactive Breadcrumbs */}
        <div className="finder-breadcrumbs">
          {pathSegments.map((seg, idx) => (
            <React.Fragment key={seg.path}>
              {idx > 0 && <span className="finder-breadcrumb-sep">/</span>}
              <span
                onClick={() => navigateTo(seg.path)}
                className={`finder-breadcrumb-segment ${idx === pathSegments.length - 1 ? 'active' : ''}`}
              >
                {idx === 0 ? <Folder size={13} color="var(--gt-acid)" /> : null}
                <span>{seg.label}</span>
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Right: Search Filter + View Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick Search */}
          <div style={{ position: 'relative' }}>
            <Search size={13} color="#888" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Filter files..."
              style={{
                padding: '4px 10px 4px 26px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '4px',
                color: 'var(--gt-cream)',
                fontFamily: 'var(--font-metadata)',
                fontSize: '0.75rem',
                outline: 'none',
                width: '140px'
              }}
            />
          </div>

          {/* List vs Grid Switcher */}
          <div style={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', padding: '2px' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? 'rgba(4, 229, 57, 0.2)' : 'none',
                border: 'none',
                color: viewMode === 'list' ? 'var(--gt-acid)' : '#888',
                padding: '4px 7px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="List View"
            >
              <ListIcon size={14} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? 'rgba(4, 229, 57, 0.2)' : 'none',
                border: 'none',
                color: viewMode === 'grid' ? 'var(--gt-acid)' : '#888',
                padding: '4px 7px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Grid View"
            >
              <Grid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Explorer Body: Sidebar + Main Content */}
      <div className="finder-body">
        {/* Desktop Sidebar Tree View */}
        <div className="finder-sidebar">
          {/* In-System Web Applications */}
          <div>
            <div className="finder-sidebar-section-title">WEB BROWSER</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                onClick={() => openBrowser('gt://notes.html')}
                className="finder-nav-item"
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="finder-nav-icon">
                    <Globe size={15} color="var(--gt-acid)" />
                  </span>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>notes.html</span>
                </div>
                <span className="finder-nav-item-badge" style={{ backgroundColor: 'rgba(4, 229, 57, 0.15)', color: 'var(--gt-acid)' }}>
                  Social Feed
                </span>
              </div>
            </div>
          </div>

          {/* Menu for Visitor */}
          {persona === 'visitor' && (
            <div>
              <div className="finder-sidebar-section-title">PUBLIC ARCHIVE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div
                  onClick={() => navigateTo('/sessions')}
                  className={`finder-nav-item ${currentPath.startsWith('/sessions') ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="finder-nav-icon">
                      <Folder size={15} color="var(--gt-acid)" />
                    </span>
                    <span>All Sessions</span>
                  </div>
                  <span className="finder-nav-item-badge">{sessions.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Menu for Patient Dossier */}
          {persona === 'patient' && (
            <div>
              <div className="finder-sidebar-section-title">MY DOSSIER</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div
                  onClick={() => navigateTo('/my-dossier')}
                  className={`finder-nav-item ${currentPath === '/my-dossier' ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="finder-nav-icon">
                      <Folder size={15} color="#04e539" />
                    </span>
                    <span>My Files</span>
                  </div>
                  <span className="finder-nav-item-badge">Dossier</span>
                </div>

                <div
                  onClick={() => navigateTo('/my-dossier/notes')}
                  className={`finder-nav-item ${currentPath === '/my-dossier/notes' ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="finder-nav-icon">
                      <FileEdit size={15} color="var(--gt-acid)" />
                    </span>
                    <span>Therapy Notes</span>
                  </div>
                  <span className="finder-nav-item-badge">{notes.length}</span>
                </div>

                <div
                  onClick={() => navigateTo('/my-dossier/attended')}
                  className={`finder-nav-item ${currentPath === '/my-dossier/attended' ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="finder-nav-icon">
                      <Check size={15} color="var(--gt-acid)" />
                    </span>
                    <span>Attended Sessions</span>
                  </div>
                  <span className="finder-nav-item-badge">{attendedCount}</span>
                </div>

                <div
                  onClick={() => navigateTo('/sessions')}
                  className={`finder-nav-item ${currentPath.startsWith('/sessions') ? 'active' : ''}`}
                  style={{ marginTop: '4px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="finder-nav-icon">
                      <Folder size={15} color="var(--gt-acid)" />
                    </span>
                    <span>All Sessions</span>
                  </div>
                  <span className="finder-nav-item-badge">{sessions.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Menu for Curator or Resident DJ */}
          {(persona === 'admin' || persona === 'dj') && (
            <div>
              <div className="finder-sidebar-section-title">
                {persona === 'dj' ? 'DJ CRATE DESK' : 'CURATOR &amp; STAFF DESK'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div
                  onClick={() => navigateTo('/curator-desk')}
                  className={`finder-nav-item ${currentPath === '/curator-desk' ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="finder-nav-icon">
                      <Disc3 size={15} color="#ff5c2e" />
                    </span>
                    <span>Curation Overview</span>
                  </div>
                  <span className="finder-nav-item-badge">Desk</span>
                </div>

                {/* Notes moderation is strictly for curator staff, not shown for DJ */}
                {persona === 'admin' && (
                  <div
                    onClick={() => navigateTo('/curator-desk/moderation')}
                    className={`finder-nav-item ${currentPath === '/curator-desk/moderation' ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="finder-nav-icon">
                        <FileEdit size={15} color="var(--gt-acid)" />
                      </span>
                      <span>Notes Moderation</span>
                    </div>
                    {pendingNotesCount > 0 ? (
                      <span className="finder-nav-item-badge" style={{ backgroundColor: 'rgba(255, 92, 46, 0.2)', color: '#ff5c2e' }}>
                        {pendingNotesCount}
                      </span>
                    ) : (
                      <span className="finder-nav-item-badge">0</span>
                    )}
                  </div>
                )}

                <div
                  onClick={() => navigateTo('/curator-desk/dj-reviews')}
                  className={`finder-nav-item ${currentPath === '/curator-desk/dj-reviews' ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="finder-nav-icon">
                      <Disc3 size={15} color="var(--gt-acid)" />
                    </span>
                    <span>Audience Set Reviews</span>
                  </div>
                  <span className="finder-nav-item-badge">Reviews</span>
                </div>

                <div
                  onClick={() => navigateTo('/sessions')}
                  className={`finder-nav-item ${currentPath.startsWith('/sessions') ? 'active' : ''}`}
                  style={{ marginTop: '4px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="finder-nav-icon">
                      <Folder size={15} color="var(--gt-acid)" />
                    </span>
                    <span>All Sessions</span>
                  </div>
                  <span className="finder-nav-item-badge">{sessions.length}</span>
                </div>
              </div>
            </div>
          )}



          {/* Directory Tree */}
          <div>
            <div
              onClick={() => toggleFolderExpand('sessions')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <span className="finder-sidebar-section-title">SESSION DIRECTORY</span>
              {expandedFolders.sessions ? <ChevronDown size={12} color="#888" /> : <ChevronRight size={12} color="#888" />}
            </div>

            {expandedFolders.sessions && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                {sessions.map(s => {
                  const isCurrent = currentPath.startsWith(`/sessions/${s.id}`);
                  return (
                    <div
                      key={s.id}
                      onClick={() => navigateTo(`/sessions/${s.id}`)}
                      className={`finder-nav-item ${isCurrent ? 'active' : ''}`}
                      style={{ paddingLeft: '14px', fontSize: '0.78rem' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <span className="finder-nav-icon" style={{ width: '16px', height: '16px' }}>
                          <FolderOpen size={13} color={isCurrent ? 'var(--gt-acid)' : '#888'} />
                        </span>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.sessionCode || s.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main Files View */}
        <div className="finder-content">
          {/* Sub-toolbar Status line */}
          <div className="finder-subtoolbar">
            <span>
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} in directory
            </span>
            <span style={{ color: '#888', fontSize: '0.72rem' }}>
              Double-click or tap to open
            </span>
          </div>

          {/* Files Canvas */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gt-muted)' }}>
                <Folder size={40} color="#444" style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gt-cream)' }}>
                  This directory is empty
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  No files match your current path or filter.
                </div>
              </div>
            ) : viewMode === 'list' ? (
              <>
                {/* Desktop Table View */}
                <table className="finder-table finder-desktop-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45%' }}>Name</th>
                      <th style={{ width: '18%' }}>Date</th>
                      <th style={{ width: '18%' }}>Kind / Size</th>
                      <th style={{ width: '19%', textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map(item => {
                      const isSelected = selectedItem?.id === item.id;
                      return (
                        <tr
                          key={item.id}
                          className={`finder-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleItemClick(item)}
                        >
                          <td>
                            <div className="finder-file-name-cell">
                              <span className="finder-icon">
                                {renderItemIcon(item.type, 18, item.extension)}
                              </span>
                              <span style={{ color: item.type === 'folder' ? 'var(--gt-cream)' : '#ffffff', fontWeight: item.type === 'folder' ? 600 : 400 }}>
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.78rem', color: 'var(--gt-muted)' }}>
                            {item.dateModified}
                          </td>
                          <td style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.78rem', color: 'var(--gt-muted)' }}>
                            {item.sizeOrDuration || item.type.toUpperCase()}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {item.badge && (
                              <span
                                style={{
                                  display: 'inline-block',
                                  fontSize: '0.68rem',
                                  fontFamily: 'var(--font-metadata)',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: item.badgeType === 'verified'
                                    ? 'rgba(4, 229, 57, 0.15)'
                                    : item.badgeType === 'pending'
                                    ? 'rgba(255, 184, 48, 0.15)'
                                    : item.badgeType === 'pinned'
                                    ? 'rgba(4, 229, 57, 0.25)'
                                    : 'rgba(255, 255, 255, 0.08)',
                                  color: item.badgeType === 'verified'
                                    ? 'var(--gt-acid)'
                                    : item.badgeType === 'pending'
                                    ? '#ffb830'
                                    : item.badgeType === 'pinned'
                                    ? 'var(--gt-acid)'
                                    : 'var(--gt-cream)',
                                  border: `1px solid ${
                                    item.badgeType === 'verified' || item.badgeType === 'pinned'
                                      ? 'rgba(4, 229, 57, 0.4)'
                                      : item.badgeType === 'pending'
                                      ? 'rgba(255, 184, 48, 0.4)'
                                      : 'rgba(255, 255, 255, 0.12)'
                                  }`
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Mobile Phone File View (iOS / Android Files layout) */}
                <div className="finder-mobile-list">
                  {filteredItems.map(item => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`mobile-file-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="mobile-file-info">
                          <span className="finder-icon" style={{ flexShrink: 0 }}>
                            {renderItemIcon(item.type, 22, item.extension)}
                          </span>
                          <div className="mobile-file-titles">
                            <div className="mobile-file-title">
                              {item.name}
                            </div>
                            <div className="mobile-file-sub">
                              {item.dateModified} &bull; {item.sizeOrDuration || item.type.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          {item.badge && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontFamily: 'var(--font-metadata)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: item.badgeType === 'verified'
                                  ? 'rgba(4, 229, 57, 0.15)'
                                  : item.badgeType === 'pending'
                                  ? 'rgba(255, 184, 48, 0.15)'
                                  : 'rgba(255, 255, 255, 0.08)',
                                color: item.badgeType === 'verified'
                                  ? 'var(--gt-acid)'
                                  : item.badgeType === 'pending'
                                  ? '#ffb830'
                                  : 'var(--gt-cream)',
                                border: `1px solid ${
                                  item.badgeType === 'verified'
                                    ? 'rgba(4, 229, 57, 0.4)'
                                    : 'rgba(255, 255, 255, 0.1)'
                                }`
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight size={14} color="#666" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* GRID / ICON VIEW (Finder Desktop Icons) */
              <div className="finder-grid-container">
                {filteredItems.map(item => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`finder-grid-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="finder-grid-icon">
                        {renderItemIcon(item.type, 38, item.extension)}
                      </div>
                      <div className="finder-grid-name">
                        {item.name}
                      </div>
                      <div className="finder-grid-meta">
                        {item.sizeOrDuration || item.dateModified}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FILE PREVIEW MODAL / DRAWER */}
      {previewModalOpen && selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => {
            setPreviewModalOpen(false);
            setIsPlayingAudio(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#0a0d0a',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '8px',
              maxWidth: selectedItem.type === 'note' ? '760px' : '580px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#0d100d'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {renderItemIcon(selectedItem.type, 16, selectedItem.extension)}
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--gt-cream)', fontFamily: 'var(--font-metadata)' }}>
                  {selectedItem.name}
                </span>
              </div>

              <button
                onClick={() => {
                  setPreviewModalOpen(false);
                  setIsPlayingAudio(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gt-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Based on File Type */}
            <div style={{ padding: '20px' }}>
              {/* NOTE FILE (.note): Physical Ruled Notebook with Washi Tape and Polaroids! */}
              {selectedItem.type === 'note' && selectedItem.note && (
                <div>
                  <div className="notebook-ruled-container" style={{ margin: '0 0 16px 0' }}>
                    {/* Header Strip */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 20px 12px 64px',
                        borderBottom: '1px solid var(--notebook-line)',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <span className="case-ref-stamp">
                        {selectedItem.note.sessionCode || 'NOTE'} // {selectedItem.note.authorDisplayName || 'PATIENT'}
                      </span>
                      {selectedItem.note.pinnedByDj && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--gt-acid)', fontFamily: 'var(--font-metadata)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Pin size={12} />
                          PINNED BY RESIDENT DJ
                        </span>
                      )}
                    </div>

                    {/* Journal Reflection Body: Balanced Side-by-Side Polaroid + Ruled lines */}
                    <div className="reflection-journal-body">
                      {selectedItem.note.polaroids && selectedItem.note.polaroids.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '18px' }}>
                          {selectedItem.note.polaroids.map((pol, idx) => (
                            <div key={pol.id || idx} className="polaroid-card" style={{ transform: `rotate(${pol.rotation}deg)` }}>
                              <div className="washi-tape-strip washi-tape-top-center"></div>
                              <div className="polaroid-photo-frame">
                                <img src={pol.imageUrl} alt={pol.caption} />
                              </div>
                              <div className="polaroid-caption">
                                {pol.caption}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ width: '20px' }} />
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                        {selectedItem.note.title && (
                          <div style={{ padding: '0 20px 10px 0', borderBottom: '1px solid var(--notebook-line)', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--gt-cream)', margin: 0 }}>
                              {selectedItem.note.title}
                            </h3>
                          </div>
                        )}

                        {/* Ruled lined paper content: text sits directly on the lines */}
                        <div className="notebook-ruled-display" style={{ paddingLeft: '8px' }}>
                          {selectedItem.note.content}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/my-sessions/${selectedItem.sessionId || 'gt-xii'}/notes`)}
                    >
                      Open in Therapy Notes
                    </button>
                  </div>
                </div>
              )}

              {/* AUDIO FILE (.mp3): Soundboard Playback */}
              {selectedItem.type === 'audio' && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 92, 46, 0.15)',
                      border: '2px solid #ff5c2e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}
                  >
                    <Music size={36} color="#ff5c2e" />
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                    {selectedItem.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)', marginBottom: '20px' }}>
                    {selectedItem.sizeOrDuration} // Soundboard Recording
                  </div>

                  {/* Audio Controls */}
                  <div
                    style={{
                      backgroundColor: '#121612',
                      borderRadius: '6px',
                      padding: '16px',
                      marginBottom: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {/* Scrub bar */}
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#222', borderRadius: '3px', marginBottom: '12px', position: 'relative' }}>
                      <div style={{ width: isPlayingAudio ? '42%' : '0%', height: '100%', backgroundColor: 'var(--gt-acid)', borderRadius: '3px', transition: 'width 0.2s' }}></div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-muted)' }}>
                        {isPlayingAudio ? '34:12' : '00:00'}
                      </span>

                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="btn btn-primary"
                        style={{ padding: '8px 18px', minHeight: '34px', gap: '6px' }}
                      >
                        {isPlayingAudio ? <Pause size={14} /> : <Play size={14} />}
                        <span>{isPlayingAudio ? 'Pause Synth Demo' : 'Play Audio Preview (Web Audio Synth Demo)'}</span>
                      </button>

                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-muted)' }}>
                        1:22:45
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <a
                      href={selectedItem.material?.externalUrl || 'https://linktr.ee/grouptherapyng'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', gap: '6px' }}
                    >
                      <ExternalLink size={13} />
                      <span>Open on MixMachina / Direct Source</span>
                    </a>
                  </div>
                </div>
              )}

              {/* PHOTO FILE (.jpg) */}
              {selectedItem.type === 'photo' && (
                <div style={{ textAlign: 'center' }}>
                  <div className="polaroid-card" style={{ display: 'inline-block', margin: '0 auto 16px' }}>
                    <div className="washi-tape-strip washi-tape-top-center"></div>
                    <div className="polaroid-photo-frame" style={{ width: '320px', height: '320px' }}>
                      <img
                        src={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23080b08"/><polygon points="200,0 60,400 80,400" fill="%2304e539" opacity="0.85"/><polygon points="200,0 170,400 200,400" fill="%2304e539" opacity="0.95"/><polygon points="200,0 310,400 340,400" fill="%2304e539" opacity="0.75"/><circle cx="200" cy="180" r="140" fill="%2304e539" opacity="0.12"/><text x="24" y="375" fill="%2304e539" font-family="monospace" font-size="11">GROUP THERAPY // EVENT ARCHIVE</text></svg>`}
                        alt={selectedItem.name}
                      />
                    </div>
                    <div className="polaroid-caption">
                      {selectedItem.name.replace('.jpg', '').replace(/_/g, ' ')}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)' }}>
                    {selectedItem.sizeOrDuration} · Authorized archival photography
                  </div>
                </div>
              )}

              {/* INFO FILE (.txt / .nfo) */}
              {selectedItem.type === 'info' && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#050705',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      padding: '16px',
                      fontFamily: 'var(--font-metadata)',
                      fontSize: '0.8rem',
                      lineHeight: 1.6,
                      color: 'var(--gt-cream)',
                      whiteSpace: 'pre-wrap',
                      marginBottom: '16px'
                    }}
                  >
                    {selectedItem.session ? (
                      `[GROUP THERAPY ARCHIVAL DOSSIER]
=========================================
SESSION CODE : ${selectedItem.session.sessionCode || 'SPECIAL'}
TITLE        : ${selectedItem.session.title}
DATE         : ${selectedItem.session.date}
VENUE        : ${selectedItem.session.venue || 'Warehouse'}, ${selectedItem.session.city}
BRANCH       : ${selectedItem.session.branch}

RESIDENTS & GUESTS:
${selectedItem.session.artists.map(a => `• ${a.name} (${a.role || 'Performer'})`).join('\n')}

DESCRIPTION:
${selectedItem.session.description}

ARCHIVE NOTE:
All audio sets and community reflections associated with this case file are cataloged under the session directory.`
                    ) : (
                      `[DOSSIER ENTRY // ${selectedItem.name}]
Status: ${selectedItem.badge || 'Documented'}
Modified: ${selectedItem.dateModified}
Reference: Cryptographic check in integrity verified.`
                    )}
                  </div>

                  {selectedItem.session && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/sessions/${selectedItem.session?.id}`)}
                      >
                        Open Full Session Dossier
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
