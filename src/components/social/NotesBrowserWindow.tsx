import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  Globe,
  Lock,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  Star,
  Share2,
  X,
  Maximize2,
  Minimize2,
  Heart,
  Flag,
  MessageSquare,
  Search,
  Filter,
  Disc3,
  Sparkles,
  Music,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  Clock,
  User,
  Radio,
  Send,
  Camera,
  Save,
  AlertTriangle
} from 'lucide-react';
import { TherapyNote, AttachedPolaroid } from '../../types';
import { POLAROID_PRESETS, PolaroidPreset } from '../../data/seedData';

interface NotesBrowserWindowProps {
  initialTab?: 'all' | 'following' | 'recommended' | 'dj_requests';
  onClose?: () => void;
}

export const NotesBrowserWindow: React.FC<NotesBrowserWindowProps> = ({
  initialTab = 'all',
  onClose
}) => {
  const {
    isBrowserOpen,
    closeBrowser,
    browserUrl,
    notes,
    sessions,
    persona,
    toggleLikeNote,
    flagNote,
    reportNote,
    respondToTrackRequest,
    isFollowed,
    saveNote
  } = useStore();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'recommended' | 'dj_requests'>(initialTab);
  const [selectedSessionFilter, setSelectedSessionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(100);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [flagToastMessage, setFlagToastMessage] = useState<string | null>(null);

  // Structured Reporting Modal State
  const [reportingNoteId, setReportingNoteId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<'spam' | 'inappropriate' | 'privacy_violation' | 'misinformation' | 'other'>('spam');
  const [reportReasonText, setReportReasonText] = useState('Commercial promotion or ticket resale');
  const [reportDetails, setReportDetails] = useState('');

  // Compose Modal State matching authentic lined notebook layout
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostSession, setNewPostSession] = useState('gt-xv');
  const [newPostVisibility, setNewPostVisibility] = useState<'public_submission' | 'private'>('public_submission');
  const [newPostIsTrackRequest, setNewPostIsTrackRequest] = useState(false);
  const [newPostTrackQuery, setNewPostTrackQuery] = useState('');
  const [newPostTags, setNewPostTags] = useState<string[]>(['Cathartic']);
  const [newPostPolaroids, setNewPostPolaroids] = useState<AttachedPolaroid[]>([]);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [showPublicWarningModal, setShowPublicWarningModal] = useState(false);
  const [activePolaroidZoom, setActivePolaroidZoom] = useState<string | null>(null);

  // Simulate browser tab loading on open or refresh
  const triggerReload = () => {
    setIsLoading(true);
    setLoadingProgress(15);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            setLoadingProgress(100);
          }, 150);
          return 100;
        }
        return prev + 25;
      });
    }, 80);
  };

  useEffect(() => {
    triggerReload();
  }, [activeTab]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    closeBrowser();
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (activeTab !== 'all' || selectedSessionFilter !== 'all' || searchQuery) {
      setActiveTab('all');
      setSelectedSessionFilter('all');
      setSearchQuery('');
    } else {
      handleClose();
    }
  };

  // Filter notes based on active social media tab, session filter, and search
  const filteredFeedNotes = useMemo(() => {
    return notes.filter(note => {
      // Flagged notes are automatically removed from the public feed
      if (note.isFlagged) {
        return false;
      }

      // Must be public or approved or have content
      if (note.visibility === 'private' && note.moderationStatus === 'none') {
        // Still allow author to see their own notes in social feed if they created them
        if (note.authorDisplayName !== 'Lami Adeyemi' && note.authorDisplayName !== 'Attendee') {
          return false;
        }
      }

      // Session filter
      if (selectedSessionFilter !== 'all' && note.sessionId !== selectedSessionFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = note.title?.toLowerCase().includes(q);
        const matchesContent = note.content.toLowerCase().includes(q);
        const matchesAuthor = note.authorDisplayName?.toLowerCase().includes(q);
        const matchesArtist = note.artistName?.toLowerCase().includes(q);
        const matchesTrack = note.trackRequested?.toLowerCase().includes(q);
        const matchesTags = note.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesAuthor && !matchesArtist && !matchesTrack && !matchesTags) {
          return false;
        }
      }

      // Tab logic: All vs Following vs Recommended vs DJ Requests
      if (activeTab === 'following') {
        // Must be a followed session or artist
        const sessionIsFollowed = isFollowed(note.sessionId);
        const isFollowedTag = note.tags?.includes('Following');
        return sessionIsFollowed || isFollowedTag;
      }

      if (activeTab === 'recommended') {
        // Notes with high engagement or tagged Recommended / Healing
        return (
          note.tags?.includes('Recommended') ||
          note.tags?.includes('Sanctuary') ||
          (note.likesCount || 0) > 100
        );
      }

      if (activeTab === 'dj_requests') {
        // Must be a DJ request or track ID inquiry
        return Boolean(note.trackRequested) || note.tags?.includes('Track ID');
      }

      // Default: All reflections
      return true;
    });
  }, [notes, activeTab, selectedSessionFilter, searchQuery, isFollowed]);

  const handleSendDJResponse = (noteId: string) => {
    const text = replyInputs[noteId]?.trim();
    if (!text) return;
    respondToTrackRequest(noteId, `Aniko (Resident DJ): ${text}`);
    setReplyInputs(prev => ({ ...prev, [noteId]: '' }));
  };

  const handleOpenReportModal = (noteId: string) => {
    setReportingNoteId(noteId);
    setReportReason('spam');
    setReportReasonText('Commercial advertising or ticket resale');
    setReportDetails('');
  };

  const handleConfirmReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingNoteId) return;
    reportNote(reportingNoteId, reportReason, reportReasonText, reportDetails);
    setFlagToastMessage('Report logged for Curator review. Group Therapy curators will investigate.');
    setReportingNoteId(null);
    setTimeout(() => setFlagToastMessage(null), 3500);
  };

  // Triggered when user clicks Publish in the note composer
  const handleInitiatePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    if (newPostVisibility === 'public_submission') {
      // Show warning that this will be automatically public, giving the option to make it private
      setShowPublicWarningModal(true);
    } else {
      executeSaveNote('private');
    }
  };

  const executeSaveNote = (visibility: 'public_submission' | 'private') => {
    if (!newPostContent.trim()) return;

    const isPublic = visibility === 'public_submission';

    saveNote({
      sessionId: newPostSession,
      title: newPostTitle.trim() || (newPostIsTrackRequest ? 'Track ID Request' : 'Dancefloor Reflection'),
      content: newPostContent.trim(),
      noteType: newPostIsTrackRequest ? 'dj_session_note' : 'patient_note',
      visibility: isPublic ? 'public_submission' : 'private',
      moderationStatus: isPublic ? 'approved' : 'none',
      authorDisplayName: persona === 'dj' ? 'Aniko' : (persona === 'patient' ? 'Lami Adeyemi' : 'Guest Patient'),
      trackRequested: newPostIsTrackRequest ? newPostTrackQuery.trim() : undefined,
      tags: newPostTags.length > 0 ? newPostTags : (newPostIsTrackRequest ? ['Track ID', 'Dancefloor'] : ['Community', 'Reflection']),
      polaroids: newPostPolaroids.length > 0 ? newPostPolaroids : undefined,
      likesCount: 1,
      isLiked: true
    });

    if (isPublic) {
      setFlagToastMessage('Note published publicly to dancefloor feed & case file.');
    } else {
      setFlagToastMessage('Note saved privately to your personal dossier (hidden from public feed).');
    }
    setTimeout(() => setFlagToastMessage(null), 3500);

    // Reset composer state
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTrackQuery('');
    setNewPostIsTrackRequest(false);
    setNewPostPolaroids([]);
    setNewPostTags(['Cathartic']);
    setNewPostVisibility('public_submission');
    setShowPublicWarningModal(false);
    setShowComposeModal(false);
  };

  if (!isBrowserOpen && !onClose) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '28px',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isFullscreen ? '0' : '20px'
      }}
    >
      {/* Browser Window Chrome */}
      <div
        style={{
          width: isFullscreen ? '100vw' : 'min(1240px, 96vw)',
          height: isFullscreen ? 'calc(100vh - 28px)' : 'min(90vh, 860px)',
          backgroundColor: '#0a0d0a',
          border: isFullscreen ? 'none' : '1px solid rgba(4, 229, 57, 0.3)',
          borderRadius: isFullscreen ? '0' : '12px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(4, 229, 57, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Loading Progress Bar */}
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${loadingProgress}%`,
              height: '3px',
              backgroundColor: 'var(--gt-acid)',
              boxShadow: '0 0 10px var(--gt-acid)',
              zIndex: 100,
              transition: 'width 0.12s ease'
            }}
          />
        )}

        {/* Browser Top Window Bar (Tab strip + Window controls) */}
        <div
          style={{
            backgroundColor: '#050705',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            gap: '12px',
            userSelect: 'none'
          }}
        >
          {/* Browser Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, maxWidth: '400px' }}>
            <div
              style={{
                backgroundColor: '#0a0d0a',
                border: '1px solid rgba(4, 229, 57, 0.25)',
                borderBottom: 'none',
                borderRadius: '6px 6px 0 0',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78rem',
                color: 'var(--gt-cream)',
                fontFamily: 'var(--font-metadata)'
              }}
            >
              <Globe size={13} color="var(--gt-acid)" />
              <span style={{ fontWeight: 600 }}>notes.html</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--gt-acid)' }}>● Social Feed</span>
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gt-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '4px'
                }}
              >
                <X size={11} />
              </button>
            </div>

            <button
              onClick={triggerReload}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gt-muted)',
                padding: '4px',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
              title="Open New Tab"
            >
              <PlusCircle size={14} />
            </button>
          </div>

          {/* Window Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gt-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
              title={isFullscreen ? 'Restore Window Size' : 'Maximize to Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gt-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Browser Navigation Toolbar */}
        <div
          style={{
            backgroundColor: '#070907',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gt-cream)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}
              title="Back"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.2)',
                cursor: 'not-allowed',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Forward"
              disabled
            >
              <ArrowRight size={15} />
            </button>
            <button
              onClick={triggerReload}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gt-acid)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}
              title="Reload Feed"
            >
              <RotateCw size={14} className={isLoading ? 'feed-spin-icon' : ''} />
            </button>
          </div>

          {/* Browser Omnibar / Address Bar */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#0d100d',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-metadata)',
              fontSize: '0.8rem',
              color: 'var(--gt-cream)'
            }}
          >
            <Lock size={12} color="var(--gt-acid)" />
            <span style={{ color: 'var(--gt-acid)' }}>gt://</span>
            <span>notes.html</span>
            <span style={{ color: 'var(--gt-muted)', fontSize: '0.72rem' }}>?tab={activeTab}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gt-muted)' }}>
              <Star size={13} style={{ cursor: 'pointer' }} />
              <Share2 size={13} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          {/* Quick Compose Action Button */}
          <button
            onClick={() => setShowComposeModal(true)}
            className="btn btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '0.76rem',
              minHeight: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PlusCircle size={14} />
            <span>+ Share Note / Request Track</span>
          </button>
        </div>

        {/* BROWSER VIEWPORT: notes.html SOCIAL FEED */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#040604'
          }}
        >
          {/* Sticky Social Feed Bar */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              backgroundColor: 'rgba(7, 9, 7, 0.96)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px 24px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            {/* Feed Category Tabs (All Reflections, Following, Recommended, DJ Requests) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'all' ? 'var(--gt-acid)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'all' ? '#000' : 'var(--gt-cream)',
                  transition: 'all 0.15s ease'
                }}
              >
                All Reflections
              </button>

              <button
                onClick={() => setActiveTab('following')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'following' ? 'var(--gt-acid)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'following' ? '#000' : 'var(--gt-cream)',
                  transition: 'all 0.15s ease'
                }}
              >
                Following
              </button>

              <button
                onClick={() => setActiveTab('recommended')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'recommended' ? 'var(--gt-acid)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'recommended' ? '#000' : 'var(--gt-cream)',
                  transition: 'all 0.15s ease'
                }}
              >
                Recommended
              </button>

              <button
                onClick={() => setActiveTab('dj_requests')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: activeTab === 'dj_requests' ? 'none' : '1px solid rgba(255, 92, 46, 0.35)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'dj_requests' ? '#ff5c2e' : 'rgba(255, 92, 46, 0.08)',
                  color: activeTab === 'dj_requests' ? '#000' : '#ff7a54',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Disc3 size={14} />
                <span>DJ Requests &amp; Track IDs</span>
              </button>
            </div>

            {/* Feed Filters & Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Session Selector Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={13} color="var(--gt-acid)" />
                <select
                  value={selectedSessionFilter}
                  onChange={e => setSelectedSessionFilter(e.target.value)}
                  style={{
                    backgroundColor: '#0d100d',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: 'var(--gt-cream)',
                    fontSize: '0.78rem',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Sessions</option>
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.sessionCode || s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Search Input */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#0d100d',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  width: '200px'
                }}
              >
                <Search size={13} color="var(--gt-muted)" />
                <input
                  type="text"
                  placeholder="Search notes, tracks..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--gt-cream)',
                    fontSize: '0.78rem',
                    width: '100%'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Feed Content Stream */}
          <div style={{ maxWidth: '820px', width: '100%', margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Context Badge for DJ or Role */}
            {persona === 'dj' && (
              <div
                style={{
                  backgroundColor: 'rgba(255, 92, 46, 0.08)',
                  border: '1px solid rgba(255, 92, 46, 0.35)',
                  borderRadius: '8px',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Disc3 size={18} color="#ff5c2e" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ff7a54' }}>
                      Resident DJ Perspective Active (Aniko)
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--gt-cream)' }}>
                      Track requests and dancer reflections are highlighted. You can verify track IDs directly on the feed.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('dj_requests')}
                  className="btn btn-primary"
                  style={{ fontSize: '0.74rem', padding: '5px 12px', minHeight: '30px' }}
                >
                  View Track Inquiries
                </button>
              </div>
            )}

            {filteredFeedNotes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gt-muted)' }}>
                <Sparkles size={32} color="var(--gt-acid)" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--gt-cream)', marginBottom: '6px' }}>
                  No Reflections Found
                </h3>
                <p style={{ fontSize: '0.85rem' }}>
                  No therapy notes match the selected filters or search parameters. Try choosing All Sessions or clearing your search.
                </p>
              </div>
            ) : (
              filteredFeedNotes.map(note => {
                const isDJRequest = Boolean(note.trackRequested);
                const isLiked = note.isLiked;
                const likes = note.likesCount || 0;

                return (
                  <div
                    key={note.id}
                    style={{
                      backgroundColor: '#0a0d0a',
                      border: note.pinnedByDj ? '1px solid var(--gt-acid)' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                      transition: 'border-color 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Note Post Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: note.pinnedByDj ? 'var(--gt-acid)' : 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: note.pinnedByDj ? '#000' : 'var(--gt-cream)',
                            fontWeight: 700,
                            fontSize: '0.85rem'
                          }}
                        >
                          {note.authorDisplayName?.charAt(0) || 'P'}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gt-cream)' }}>
                              {note.authorDisplayName || 'Attendee'}
                            </span>
                            <span style={{ fontSize: '0.74rem', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)' }}>
                              @{note.authorDisplayName?.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'patient'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--gt-muted)' }}>
                            <span style={{ color: 'var(--gt-acid)', fontWeight: 600 }}>
                              {note.sessionCode || note.sessionTitle}
                            </span>
                            <span>•</span>
                            <span>{note.createdAt ? note.createdAt.split('T')[0] : 'Recent Session'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Header Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {note.pinnedByDj && (
                          <span
                            style={{
                              backgroundColor: 'rgba(4, 229, 57, 0.15)',
                              color: 'var(--gt-acid)',
                              fontSize: '0.7rem',
                              fontFamily: 'var(--font-metadata)',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontWeight: 700
                            }}
                          >
                            Pinned by DJ
                          </span>
                        )}

                        {isDJRequest && (
                          <span
                            style={{
                              backgroundColor: 'rgba(255, 92, 46, 0.15)',
                              color: '#ff7a54',
                              fontSize: '0.7rem',
                              fontFamily: 'var(--font-metadata)',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Disc3 size={11} />
                            Track ID Request
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Post Title */}
                    {note.title && (
                      <h4
                        style={{
                          fontSize: '1.1rem',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          color: 'var(--gt-cream)',
                          margin: 0
                        }}
                      >
                        {note.title}
                      </h4>
                    )}

                    {/* Ruled Paper / Note Content */}
                    <div
                      style={{
                        backgroundColor: '#070907',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '6px',
                        padding: '16px 20px',
                        fontSize: '0.92rem',
                        lineHeight: 1.65,
                        color: 'var(--gt-cream)',
                        whiteSpace: 'pre-line',
                        fontFamily: 'inherit'
                      }}
                    >
                      {note.content}
                    </div>

                    {/* Track ID Inquiry Box (if applicable) */}
                    {note.trackRequested && (
                      <div
                        style={{
                          backgroundColor: 'rgba(255, 92, 46, 0.08)',
                          border: '1px solid rgba(255, 92, 46, 0.25)',
                          borderRadius: '6px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <Music size={16} color="#ff5c2e" />
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#ff7a54', fontFamily: 'var(--font-metadata)', fontWeight: 700 }}>
                            INQUIRY SPECIFICATION
                          </div>
                          <div style={{ fontSize: '0.84rem', color: 'var(--gt-cream)' }}>
                            {note.trackRequested}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DJ Response Box (if confirmed by DJ) */}
                    {note.djResponse && (
                      <div
                        style={{
                          backgroundColor: 'rgba(4, 229, 57, 0.08)',
                          border: '1px solid rgba(4, 229, 57, 0.3)',
                          borderRadius: '6px',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px'
                        }}
                      >
                        <CheckCircle2 size={16} color="var(--gt-acid)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--gt-acid)', fontFamily: 'var(--font-metadata)', fontWeight: 800 }}>
                            VERIFIED DJ BOOTH CONFIRMATION
                          </div>
                          <div style={{ fontSize: '0.86rem', color: 'var(--gt-cream)', marginTop: '2px' }}>
                            {note.djResponse}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DJ Reply Input (when viewing as Resident DJ and no response yet) */}
                    {persona === 'dj' && !note.djResponse && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <input
                          type="text"
                          placeholder="Reply as Resident DJ Aniko (e.g. Verified track title &amp; release date)..."
                          value={replyInputs[note.id] || ''}
                          onChange={e => setReplyInputs(prev => ({ ...prev, [note.id]: e.target.value }))}
                          style={{
                            flex: 1,
                            backgroundColor: '#070907',
                            border: '1px solid rgba(255, 92, 46, 0.4)',
                            color: 'var(--gt-cream)',
                            fontSize: '0.8rem',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                        />
                        <button
                          onClick={() => handleSendDJResponse(note.id)}
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.76rem', minHeight: '32px' }}
                        >
                          <Send size={13} />
                          <span>Reply</span>
                        </button>
                      </div>
                    )}

                    {/* Attached Polaroid Scans */}
                    {note.polaroids && note.polaroids.length > 0 && (
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {note.polaroids.map(pol => (
                          <div
                            key={pol.id}
                            onClick={() => setActivePolaroidZoom(pol.imageUrl)}
                            style={{
                              backgroundColor: '#111',
                              padding: '8px 8px 16px 8px',
                              borderRadius: '4px',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                              cursor: 'pointer',
                              width: '160px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              transition: 'transform 0.15s ease'
                            }}
                          >
                            <img
                              src={pol.imageUrl}
                              alt={pol.caption}
                              style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '2px' }}
                            />
                            <div
                              style={{
                                fontSize: '0.66rem',
                                color: 'var(--gt-muted)',
                                marginTop: '6px',
                                textAlign: 'center',
                                fontFamily: 'monospace'
                              }}
                            >
                              {pol.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Post Action Footer Bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '10px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '0.78rem',
                        color: 'var(--gt-muted)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Like / Heart Counter */}
                        <button
                          onClick={() => toggleLikeNote(note.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: isLiked ? '#ff5c2e' : 'var(--gt-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            fontWeight: isLiked ? 700 : 500,
                            transition: 'color 0.15s ease'
                          }}
                        >
                          <Heart size={15} fill={isLiked ? '#ff5c2e' : 'none'} />
                          <span>{likes}</span>
                        </button>

                        {/* Report / Flag button */}
                        <button
                          onClick={() => handleOpenReportModal(note.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: note.isFlagged ? '#ffbd2e' : 'var(--gt-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            cursor: 'pointer',
                            padding: '4px 6px'
                          }}
                          title="Report note for curator review"
                        >
                          <Flag size={14} fill={note.isFlagged ? '#ffbd2e' : 'none'} />
                          <span>{note.isFlagged ? 'Reported' : 'Report'}</span>
                        </button>
                      </div>

                      {/* Tags Pill List */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {note.tags?.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              color: 'var(--gt-cream)',
                              fontSize: '0.68rem',
                              fontFamily: 'var(--font-metadata)',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Compose Modal matching authentic lined notebook layout */}
        {showComposeModal && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <div
              style={{
                backgroundColor: '#0a0d0a',
                border: '1px solid var(--border-accent)',
                borderRadius: '8px',
                padding: '24px',
                maxWidth: '740px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(4, 229, 57, 0.12)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={16} color="var(--gt-acid)" />
                  <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', color: 'var(--gt-cream)', margin: 0, fontWeight: 700 }}>
                    Document Dancefloor Reflection // notes.html
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--gt-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleInitiatePublish} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Meta Controls Row: Session selector & Visibility Switcher */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {/* Session Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.72rem', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)' }}>
                      SESSION:
                    </label>
                    <select
                      value={newPostSession}
                      onChange={e => setNewPostSession(e.target.value)}
                      style={{
                        backgroundColor: '#050705',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: 'var(--gt-cream)',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-metadata)',
                        outline: 'none'
                      }}
                    >
                      {sessions.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.sessionCode || s.title} ({s.venue})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Visibility Switcher (Private vs Public) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ display: 'flex', backgroundColor: '#050705', padding: '2px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                      <button
                        type="button"
                        onClick={() => setNewPostVisibility('private')}
                        style={{
                          padding: '5px 12px',
                          fontSize: '0.74rem',
                          borderRadius: '3px',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          backgroundColor: newPostVisibility === 'private' ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                          color: newPostVisibility === 'private' ? 'var(--gt-cream)' : 'var(--gt-muted)'
                        }}
                      >
                        <Lock size={12} />
                        <span>Private Note</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewPostVisibility('public_submission')}
                        style={{
                          padding: '5px 12px',
                          fontSize: '0.74rem',
                          borderRadius: '3px',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          backgroundColor: newPostVisibility === 'public_submission' ? 'rgba(4, 229, 57, 0.2)' : 'transparent',
                          color: newPostVisibility === 'public_submission' ? 'var(--gt-acid)' : 'var(--gt-muted)'
                        }}
                      >
                        <Globe size={12} />
                        <span>Public Note</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-metadata)', color: newPostVisibility === 'private' ? 'var(--gt-muted)' : 'var(--gt-acid)', marginTop: '-8px' }}>
                  {newPostVisibility === 'private'
                    ? '// Stored locally in your patient dossier (hidden from public feed)'
                    : '// Published to community feed & session case file'}
                </div>

                {/* Title Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Title this reflection (e.g. The 4:00 AM frequency shift behind the booth)..."
                    value={newPostTitle}
                    onChange={e => setNewPostTitle(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#070907',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '4px',
                      color: 'var(--gt-cream)',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      padding: '10px 14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* AUTHENTIC LINED NOTEBOOK CONTAINER */}
                <div className="notebook-ruled-container" style={{ margin: '4px 0' }}>
                  {/* Header inside notebook */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 16px 8px 62px',
                      borderBottom: '1px solid var(--notebook-line)',
                      backgroundColor: '#060806'
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)', letterSpacing: '0.06em' }}>
                      AUTHENTIC DANCEFLOOR LOG // NOTES.HTML
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPhotoPicker(true)}
                      className="btn btn-outline-neon"
                      style={{ fontSize: '0.72rem', padding: '3px 10px', minHeight: '26px', gap: '5px' }}
                    >
                      <Camera size={12} />
                      <span>+ Attach Photo</span>
                    </button>
                  </div>

                  {/* Attached Photos Display */}
                  {newPostPolaroids.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        padding: '16px 20px',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderBottom: '1px dashed var(--notebook-line)',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start'
                      }}
                    >
                      {newPostPolaroids.map((pol, idx) => (
                        <div
                          key={pol.id || idx}
                          className="polaroid-card"
                          style={{
                            width: '130px',
                            transform: idx % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)'
                          }}
                        >
                          <div className="washi-tape-strip washi-tape-top-center" />
                          <div className="polaroid-photo-frame" style={{ width: '110px', height: '90px' }}>
                            <img src={pol.imageUrl} alt={pol.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div className="polaroid-caption" style={{ fontSize: '0.62rem' }}>
                            {pol.caption}
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewPostPolaroids(prev => prev.filter((_, i) => i !== idx))}
                            style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: '#e42335',
                              color: '#fff',
                              border: 'none',
                              fontSize: '10px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 30
                            }}
                            title="Detach Photo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Lined Textarea */}
                  <textarea
                    className="notebook-lined-textarea"
                    rows={6}
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    required
                    placeholder="What happened on the floor? Write line by line: the syncopation, the crowd perimeter, the unreleased 3-step roll, or the sunrise walk home..."
                    style={{ minHeight: '180px', padding: '12px 20px 24px 62px' }}
                  />

                  {/* Footer inside notebook */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 16px 6px 62px',
                      borderTop: '1px solid var(--notebook-line)',
                      backgroundColor: '#050705',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-metadata)',
                      color: 'var(--gt-muted)'
                    }}
                  >
                    <span style={{ color: 'var(--gt-acid)' }}>AUTOSAVE READY // LOCAL DOSSIER</span>
                    <span>
                      {newPostContent.split('\n').length} LINES // {newPostContent.length} CHARS
                    </span>
                  </div>
                </div>

                {/* Track Request Checkbox & Query */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 92, 46, 0.08)',
                    border: '1px solid rgba(255, 92, 46, 0.25)',
                    borderRadius: '4px',
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      id="track-req-checkbox"
                      checked={newPostIsTrackRequest}
                      onChange={e => setNewPostIsTrackRequest(e.target.checked)}
                      style={{ accentColor: '#ff5c2e', cursor: 'pointer' }}
                    />
                    <label htmlFor="track-req-checkbox" style={{ fontSize: '0.82rem', color: '#ff7a54', cursor: 'pointer', fontWeight: 600 }}>
                      Request Track ID from Resident DJ (Aniko)
                    </label>
                  </div>

                  {newPostIsTrackRequest && (
                    <input
                      type="text"
                      placeholder="e.g. What was the 03:20 AM transition with female vocal chant?"
                      value={newPostTrackQuery}
                      onChange={e => setNewPostTrackQuery(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#070907',
                        border: '1px solid rgba(255, 92, 46, 0.4)',
                        color: 'var(--gt-cream)',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-metadata)',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  )}
                </div>

                {/* Mood / Vibe Tags Selector */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)', marginBottom: '6px' }}>
                    VIBE / MOOD TAGS:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['Cathartic', 'Hypnotic', 'Late Night', 'Track ID', 'Sub-Bass', 'Soundboard', 'Sanctuary', 'Daybreak'].map(tag => {
                      const isSelected = newPostTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (isSelected) setNewPostTags(prev => prev.filter(t => t !== tag));
                            else setNewPostTags(prev => [...prev, tag]);
                          }}
                          style={{
                            padding: '3px 10px',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-metadata)',
                            borderRadius: '12px',
                            border: isSelected ? '1px solid var(--gt-acid)' : '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: isSelected ? 'rgba(4, 229, 57, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                            color: isSelected ? 'var(--gt-acid)' : 'var(--gt-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <button
                    type="button"
                    onClick={() => setShowComposeModal(false)}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem' }}
                  >
                    {newPostVisibility === 'public_submission' ? 'Publish to Feed' : 'Save Private Note'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AUTOMATIC PUBLIC BROADCAST WARNING MODAL */}
        {showPublicWarningModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              padding: '20px'
            }}
          >
            <div
              style={{
                backgroundColor: '#0c0f0c',
                border: '1px solid var(--gt-acid)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(4, 229, 57, 0.25)',
                borderRadius: '8px',
                padding: '24px 28px',
                maxWidth: '480px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={22} color="var(--gt-acid)" />
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--gt-cream)', fontWeight: 700 }}>
                  PUBLIC BROADCAST NOTICE
                </h4>
              </div>

              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--gt-cream)', lineHeight: 1.55 }}>
                This reflection will be <strong>automatically public</strong> to all patients across the community feed and session archive.
              </p>

              <div style={{ fontSize: '0.78rem', color: 'var(--gt-muted)', lineHeight: 1.45, backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '4px', borderLeft: '3px solid var(--gt-acid)' }}>
                You can publish it publicly to the community wall, or choose to store it privately in your personal dossier.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => executeSaveNote('public_submission')}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.84rem', padding: '10px' }}
                >
                  <Globe size={14} />
                  <span>Publish to Public Feed</span>
                </button>

                <button
                  type="button"
                  onClick={() => executeSaveNote('private')}
                  className="btn btn-outline-neon"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.84rem', padding: '10px' }}
                >
                  <Lock size={14} />
                  <span>Make Private (Save to My Dossier Only)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPublicWarningModal(false)}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHOTO PICKER MODAL (Preset dancefloor polaroids) */}
        {showPhotoPicker && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1150,
              padding: '20px'
            }}
          >
            <div
              style={{
                backgroundColor: '#0c0f0c',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '22px',
                maxWidth: '620px',
                width: '100%',
                maxHeight: '85vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Camera size={16} color="var(--gt-acid)" />
                  <h4 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--gt-cream)' }}>
                    Attach Dancefloor Photo Memory
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--gt-muted)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                {POLAROID_PRESETS.map(preset => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setNewPostPolaroids(prev => [
                        ...prev,
                        {
                          id: `pol-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                          imageUrl: preset.imageUrl,
                          caption: preset.defaultCaption,
                          position: 'inline',
                          rotation: prev.length % 2 === 0 ? -2 : 2
                        }
                      ]);
                      setShowPhotoPicker(false);
                    }}
                    style={{
                      backgroundColor: '#111',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      padding: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: 'border-color 0.15s ease'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gt-acid)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                  >
                    <img src={preset.imageUrl} alt={preset.name} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '2px' }} />
                    <div style={{ fontSize: '0.66rem', color: 'var(--gt-cream)', marginTop: '6px', textAlign: 'center', fontWeight: 600 }}>
                      {preset.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STRUCTURED COMMUNITY REPORT MODAL */}
        {reportingNoteId && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(3, 4, 3, 0.88)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3500,
              padding: '16px'
            }}
            onClick={() => setReportingNoteId(null)}
          >
            <div
              style={{
                backgroundColor: '#0c0f0c',
                border: '1px solid rgba(255, 92, 46, 0.4)',
                borderRadius: '8px',
                maxWidth: '480px',
                width: '100%',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Flag size={18} color="#ff5c2e" />
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', margin: 0, color: 'var(--gt-cream)' }}>
                  Report Community Reflection
                </h3>
              </div>

              <p style={{ color: 'var(--gt-muted)', fontSize: '0.825rem', lineHeight: 1.5, marginBottom: '16px' }}>
                Reports create a moderation case for Group Therapy curators to investigate. Reporting does not automatically erase another member's contribution.
              </p>

              <form onSubmit={handleConfirmReport}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-acid)', marginBottom: '6px', fontWeight: 700 }}>
                    SELECT REASON FOR REPORT
                  </label>
                  <select
                    value={reportReason}
                    onChange={e => {
                      const val = e.target.value as any;
                      setReportReason(val);
                      if (val === 'spam') setReportReasonText('Commercial advertising or ticket resale');
                      if (val === 'inappropriate') setReportReasonText('Harassment, abusive language, or boundary violation');
                      if (val === 'privacy_violation') setReportReasonText('Non-consensual photo or private identity exposure');
                      if (val === 'misinformation') setReportReasonText('Inaccurate session history or misleading lineup attribution');
                      if (val === 'other') setReportReasonText('Other dancefloor etiquette violation');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#050705',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                      color: 'var(--gt-cream)',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-body)',
                      outline: 'none'
                    }}
                  >
                    <option value="spam">Commercial promotion or ticket resale</option>
                    <option value="inappropriate">Harassment, abusive language, or boundary violation</option>
                    <option value="privacy_violation">Non-consensual photo or private identity exposure</option>
                    <option value="misinformation">Inaccurate event information or misleading claim</option>
                    <option value="other">Other dancefloor etiquette violation</option>
                  </select>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-muted)', marginBottom: '6px' }}>
                    ADDITIONAL CONTEXT (OPTIONAL)
                  </label>
                  <textarea
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder="Provide brief details to help curators review this case..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#050705',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '4px',
                      color: 'var(--gt-cream)',
                      fontSize: '0.825rem',
                      fontFamily: 'var(--font-body)',
                      resize: 'none',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setReportingNoteId(null)}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.78rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', color: '#ff5c2e', borderColor: 'rgba(255, 92, 46, 0.4)' }}
                  >
                    Submit Report to Curators
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FEED ACTION TOAST NOTIFICATION BANNER */}
        {flagToastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0a0d0a',
              border: '1px solid var(--gt-acid)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.85), 0 0 20px rgba(4, 229, 57, 0.25)',
              borderRadius: '4px',
              padding: '10px 20px',
              fontSize: '0.82rem',
              color: 'var(--gt-cream)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              zIndex: 3000
            }}
          >
            <CheckCircle2 size={16} color="var(--gt-acid)" />
            <span>{flagToastMessage}</span>
          </div>
        )}

        {/* Polaroid Zoom Lightbox */}
        {activePolaroidZoom && (
          <div
            onClick={() => setActivePolaroidZoom(null)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              padding: '24px',
              cursor: 'zoom-out'
            }}
          >
            <img
              src={activePolaroidZoom}
              alt="Polaroid Zoom"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                borderRadius: '8px',
                border: '2px solid var(--gt-acid)',
                boxShadow: '0 0 50px rgba(4, 229, 57, 0.4)'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
