import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CURATED_RELATED_SESSIONS } from '../data/seedData';
import { StatusBadge } from '../components/common/StatusBadge';
import { FollowButton } from '../components/sessions/FollowButton';
import { MaterialCard } from '../components/sessions/MaterialCard';
import { RelatedSessionCard } from '../components/sessions/RelatedSessionCard';
import {
  Calendar,
  MapPin,
  Clock,
  ShieldAlert,
  FileEdit,
  Star,
  HelpCircle,
  ArrowLeft,
  Headphones,
  Check,
  Eye,
  Lock,
  Ticket,
  Sliders
} from 'lucide-react';
import { MaterialType } from '../types';

export const SessionRecordPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    sessions,
    materials,
    getAttendance,
    ratings,
    submitRating,
    submitContentRequest,
    notes,
    persona,
    openVerifyModal,
    trackInquiries,
    submitTrackIdInquiry
  } = useStore();

  const session = sessions.find(s => s.id === id) || sessions[0];
  const attendance = getAttendance(session.id);
  const sessionMaterials = materials.filter(m => m.sessionId === session.id);
  const relatedLinks = CURATED_RELATED_SESSIONS.filter(r => r.sessionId === session.id);
  const existingRating = ratings[session.id];
  const userNotes = notes.filter(n => n.sessionId === session.id);
  const sessionTrackInquiries = trackInquiries.filter(t => t.sessionId === session.id);

  // Modals
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingScore, setRatingScore] = useState<number>(existingRating?.rating || 5);
  const [ratingReflection, setRatingReflection] = useState<string>(existingRating?.reflection || '');

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reqType, setReqType] = useState<MaterialType>('tracklist');
  const [reqArtist, setReqArtist] = useState('');
  const [reqNote, setReqNote] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Track ID Inquiry Modal State
  const [trackIdModalOpen, setTrackIdModalOpen] = useState(false);
  const [trackTimestamp, setTrackTimestamp] = useState('03:45 AM');
  const [trackDescription, setTrackDescription] = useState('');
  const [trackIdSuccess, setTrackIdSuccess] = useState(false);

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRating(session.id, ratingScore, ratingReflection);
    setRatingModalOpen(false);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContentRequest(session.id, reqType, reqArtist, reqNote);
    setRequestSuccess(true);
    setTimeout(() => {
      setRequestSuccess(false);
      setRequestModalOpen(false);
      setReqArtist('');
      setReqNote('');
    }, 1800);
  };

  return (
    <div style={{ padding: '28px 32px 80px', maxWidth: '1360px', margin: '0 auto', width: '100%', minHeight: '100%', boxSizing: 'border-box' }}>
      {/* Back Link */}
      <div style={{ marginBottom: '12px' }}>
        <Link
          to="/sessions"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-metadata)',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <ArrowLeft size={13} />
          <span>RETURN TO SESSIONS DIRECTORY</span>
        </Link>
      </div>

      {/* Case-File Master Header */}
      <div
        className="archival-panel-raised"
        style={{
          marginBottom: '16px',
          padding: '16px 20px',
          borderLeft: '4px solid var(--brand-primary)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-sm)',
            marginBottom: '10px',
            borderBottom: '1px solid var(--border-default)',
            paddingBottom: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <span className="case-ref-stamp">
              {session.sessionCode ? `CASE REF // ${session.sessionCode}` : 'CASE REF // SPECIAL SESSION'}
            </span>
            <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              CLASSIFICATION: {session.branch.toUpperCase()}
            </span>
            {attendance === 'attended' ? (
              <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.68rem', color: 'var(--gt-acid)', backgroundColor: 'rgba(4, 229, 57, 0.12)', padding: '2px 8px', borderRadius: '3px', border: '1px solid rgba(4, 229, 57, 0.3)' }}>
                ATTENDANCE: VERIFIED
              </span>
            ) : (
              <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.68rem', color: 'var(--gt-muted)', backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '2px 8px', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                STATUS: PUBLIC RECORD
              </span>
            )}
          </div>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            marginBottom: '12px',
            letterSpacing: '-0.02em',
            color: 'var(--gt-cream)'
          }}
        >
          {session.title}
        </h1>

        {/* Archival Metadata Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            backgroundColor: 'var(--brand-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xs)',
            padding: 'var(--space-md)',
            fontFamily: 'var(--font-metadata)',
            fontSize: '0.8rem'
          }}
        >
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginBottom: '2px' }}>DATE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
              <Calendar size={14} color="var(--brand-primary)" />
              <span>{session.date}</span>
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginBottom: '2px' }}>VENUE &amp; CITY</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
              <MapPin size={14} color="var(--brand-primary)" />
              <span>
                {session.venue ? `${session.venue}, ${session.city}` : `${session.city} (Archived venue pending)`}
              </span>
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginBottom: '2px' }}>VERIFICATION LEVEL</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
              <Clock size={14} color="var(--brand-primary)" />
              <span>CONFIDENCE: {session.confidence.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 'var(--space-xl)', maxWidth: '780px' }}>
          {session.description}
        </p>

        {/* Verification Note Alert */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            padding: 'var(--space-sm) var(--space-md)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-metadata)',
            marginBottom: 'var(--space-xl)'
          }}
        >
          ARCHIVE VERIFICATION NOTE: {session.verificationNote}
        </div>

        {/* Primary Patient Actions Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-md)',
            borderTop: '1px solid var(--border-default)',
            paddingTop: 'var(--space-lg)'
          }}
        >
          {/* Follow Therapy Control */}
          <FollowButton sessionId={session.id} />

          {/* Track ID Request CTA */}
          <button
            onClick={() => {
              if (attendance !== 'attended' && persona !== 'dj' && persona !== 'admin') {
                alert('Track ID Requests: Reserved for verified attendees who experienced this gathering in the room. Verify ticket email or choose an attended session.');
                return;
              }
              setTrackIdModalOpen(true);
            }}
            className="btn btn-outline-neon"
            style={{ gap: '6px', fontSize: '0.8rem', padding: '7px 14px' }}
          >
            <Sliders size={15} />
            <span>Request Track ID from Set</span>
          </button>

          {/* Therapy Note Writing CTA */}
          {persona !== 'visitor' && (
            attendance === 'attended' ? (
              <Link
                to={`/my-sessions/${session.id}/notes`}
                className="btn btn-secondary"
                style={{ gap: '6px' }}
              >
                <FileEdit size={16} />
                <span>
                  {userNotes.length > 0 ? `Open Therapy Notes (${userNotes.length})` : 'Write Note (Private or Public)'}
                </span>
              </Link>
            ) : (
              <Link
                to={`/my-sessions/${session.id}/notes`}
                className="btn btn-ghost"
                style={{
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-metadata)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--gt-muted)'
                }}
              >
                <Eye size={14} />
                <span>Public Records &amp; Notes Only</span>
              </Link>
            )
          )}

          {/* Overall Session Rating CTA (Verified Attendee Only) */}
          {attendance === 'attended' && (
            <button
              onClick={() => setRatingModalOpen(true)}
              className="btn btn-secondary"
              style={{ gap: '6px' }}
            >
              <Star size={16} color="var(--status-pending)" />
              <span>
                {existingRating ? `Rating: ${existingRating.rating}/5 (Edit)` : 'Rate Session (Verified)'}
              </span>
            </button>
          )}

          {/* Content Request Button */}
          {persona !== 'visitor' && (
            <button
              onClick={() => setRequestModalOpen(true)}
              className="btn btn-ghost"
              style={{ gap: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-metadata)' }}
            >
              <HelpCircle size={14} />
              <span>Request Unreleased Material</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid: Lineup, Progressive Materials & Connections */}
      <div className="grid-2">
        {/* Left Column: Official Lineup Breakdown */}
        <div className="archival-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
              Lineup
            </h3>
            <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {session.artists.length} ARTISTS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {session.artists.map((artist, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-sm)',
                  backgroundColor: 'var(--brand-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    {artist.name}
                  </div>
                  {artist.association && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-metadata)' }}>
                      {artist.association}
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--brand-primary)' }}>
                  {artist.role || 'DJ'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Progressive Materials */}
        <div className="archival-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
              Progressive Materials Archive
            </h3>
            <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {sessionMaterials.length} PUBLISHED
            </span>
          </div>

          {sessionMaterials.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {sessionMaterials.map(mat => (
                <MaterialCard key={mat.id} material={mat} />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: 'var(--space-xl)',
                textAlign: 'center',
                backgroundColor: 'var(--brand-surface-raised)',
                borderRadius: 'var(--radius-xs)',
                border: '1px dashed var(--border-default)'
              }}
            >
              <Headphones size={28} color="var(--text-muted)" style={{ marginBottom: 'var(--space-xs)' }} />
              <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                Materials In Preparation
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4, marginBottom: 'var(--space-md)' }}>
                Official session recordings, tracklists, and recap photography are progressively cleared and published by the GT team.
              </p>
              <FollowButton sessionId={session.id} size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Interconnected Session Discovery */}
      {relatedLinks.length > 0 && (
        <div style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-3xl)' }}>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <div className="case-ref-stamp" style={{ marginBottom: '6px' }}>
              CURATED CONTINUITY // INTERCONNECTED ARCHIVE
            </div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
              Connected Sessions &amp; Lineage
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Human-curated relationships based on resident continuity, anniversary milestones, and musical explorations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: relatedLinks.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-md)' }}>
            {relatedLinks.map(rel => (
              <RelatedSessionCard key={rel.id} relation={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Community Therapy Notes & Patient Reflections Section */}
      <div style={{ marginBottom: 'var(--space-3xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)', letterSpacing: '0.08em', marginBottom: '6px' }}>
              COMMUNITY REFLECTIONS
            </div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
              Community Reflections ({notes.filter(n => n.sessionId === session.id && n.moderationStatus === 'approved').length})
            </h3>
            <p style={{ color: 'var(--gt-muted)', fontSize: '0.85rem' }}>
              Dancefloor memories and personal reflections shared by attendees who experienced this session.
            </p>
          </div>

          <Link
            to={`/my-sessions/${session.id}/notes`}
            className="btn btn-outline-neon"
            style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FileEdit size={14} />
            <span>
              {attendance === 'attended' ? 'Open Therapy Notes' : 'Browse Public Records'}
            </span>
          </Link>
        </div>

        {persona === 'visitor' || persona === 'follower' ? (
          <div
            style={{
              padding: 'var(--space-2xl)',
              textAlign: 'center',
              backgroundColor: 'rgba(4, 229, 57, 0.03)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(4, 229, 57, 0.25)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <Lock size={32} color="var(--gt-acid)" style={{ marginBottom: 'var(--space-xs)' }} />
            <div className="case-ref-stamp" style={{ marginBottom: '8px' }}>
              MEMBERS-ONLY ARCHIVE // VERIFIED ATTENDANCE REQUIRED
            </div>
            <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'var(--gt-cream)' }}>
              Community Reflections Locked
            </h4>
            <p style={{ color: 'var(--gt-muted)', fontSize: '0.85rem', maxWidth: '540px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
              Personal dancefloor reflections and polaroids are reserved for verified attendees of Group Therapy sessions. Unverified visitors and followers can explore all official recordings, tracklists, and lineups.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={openVerifyModal}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Ticket size={14} />
                <span>Verify Ticket Email &amp; Unlock Reflections</span>
              </button>
            </div>
          </div>
        ) : notes.filter(n => n.sessionId === session.id && n.moderationStatus === 'approved').length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            {notes
              .filter(n => n.sessionId === session.id && n.moderationStatus === 'approved')
              .map(note => (
                <div key={note.id} className="notebook-ruled-container" style={{ padding: '0 0 var(--space-md) 0' }}>
                  {/* Note Header Strip */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 20px',
                      borderBottom: '1px solid var(--notebook-line)',
                      backgroundColor: 'rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="case-ref-stamp">
                        {note.authorDisplayName || 'VERIFIED ATTENDEE'}
                      </span>
                      {note.pinnedByDj && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-metadata)',
                            color: 'var(--gt-acid)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Star size={11} fill="var(--gt-acid)" />
                          PINNED BY RESIDENT DJ
                        </span>
                      )}
                    </div>

                    <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.7rem', color: 'var(--gt-muted)' }}>
                      CURATED ARCHIVE // {note.sessionCode}
                    </span>
                  </div>

                  {/* Journal Reflection Body: Balanced Side-by-Side Polaroid + Ruled lines */}
                  <div className="reflection-journal-body">
                    {note.polaroids && note.polaroids.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '18px' }}>
                        {note.polaroids.map((pol, idx) => (
                          <div
                            key={pol.id || idx}
                            className="polaroid-card"
                            style={{ transform: `rotate(${pol.rotation}deg)` }}
                          >
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
                      {note.title && (
                        <div style={{ padding: '0 20px 10px 0', borderBottom: '1px solid var(--notebook-line)', marginBottom: '8px' }}>
                          <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--gt-cream)', margin: 0 }}>
                            {note.title}
                          </h4>
                        </div>
                      )}

                      {/* Ruled Text Body: text sits directly on the green ruled lines */}
                      <div className="notebook-ruled-display">
                        {note.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div
            style={{
              padding: 'var(--space-2xl)',
              textAlign: 'center',
              backgroundColor: 'var(--gt-charcoal)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--gt-border)'
            }}
          >
            <p style={{ color: 'var(--gt-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-sm)' }}>
              No public reflections have been published to this session's wall yet.
            </p>
            <p style={{ color: 'var(--gt-acid)', fontSize: '0.78rem', fontFamily: 'var(--font-metadata)' }}>
              Attendees can draft therapy notes with photos and submit them for community curation.
            </p>
          </div>
        )}

        {/* Track ID Inquiries Section */}
        {sessionTrackInquiries.length > 0 && (
          <div style={{ marginTop: 'var(--space-2xl)' }}>
            <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)', letterSpacing: '0.08em', marginBottom: '6px' }}>
              SET IDENTIFICATION BOARD
            </div>
            <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>
              Track ID Inquiries for {session.title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sessionTrackInquiries.map(inq => (
                <div key={inq.id} className="archival-panel-raised" style={{ padding: '12px 16px', borderLeft: inq.status === 'answered' ? '3px solid var(--gt-acid)' : '3px solid #ffb830' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="case-ref-stamp">TIME: {inq.timestampApprox}</span>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-metadata)', color: inq.status === 'answered' ? 'var(--gt-acid)' : '#ffb830' }}>
                        {inq.status === 'answered' ? '● IDENTIFIED' : '● AWAITING CONTEXT'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)' }}>
                      BY {inq.submittedBy}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gt-cream)', margin: '4px 0 8px 0' }}>
                    "{inq.description}"
                  </p>
                  {inq.djResponse && (
                    <div style={{ padding: '8px 12px', backgroundColor: 'rgba(4, 229, 57, 0.08)', borderRadius: '4px', border: '1px solid rgba(4, 229, 57, 0.2)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gt-acid)', fontFamily: 'var(--font-metadata)', fontWeight: 700, marginBottom: '2px' }}>
                        {inq.respondedBy || 'Resident DJ'} [SIMULATED DEMO RESPONSE]
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gt-cream)' }}>{inq.djResponse}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rating Modal for Verified Attendees */}
      {ratingModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--space-md)'
          }}
          onClick={() => setRatingModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--brand-surface-raised)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-sm)',
              maxWidth: '460px',
              width: '100%',
              padding: 'var(--space-xl)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-xs)' }}>
              Session Reflection &amp; Rating
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginBottom: 'var(--space-md)' }}>
              As a verified attendee of {session.title}, share a lightweight overall assessment of the sound and energy.
            </p>

            <form onSubmit={handleRatingSubmit}>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-metadata)', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  OVERALL SOUND &amp; ATMOSPHERE (1 TO 5)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingScore(star)}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: ratingScore >= star ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.05)',
                        color: ratingScore >= star ? 'var(--brand-bg)' : 'var(--text-secondary)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '1rem'
                      }}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-metadata)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  OPTIONAL BRIEF REFLECTION
                </label>
                <textarea
                  value={ratingReflection}
                  onChange={e => setRatingReflection(e.target.value)}
                  placeholder="The room acoustics, sound system balance, or peak energy moments..."
                  style={{
                    width: '100%',
                    height: '80px',
                    padding: '10px',
                    backgroundColor: 'var(--brand-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setRatingModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content Request Modal */}
      {requestModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--space-md)'
          }}
          onClick={() => setRequestModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--brand-surface-raised)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-sm)',
              maxWidth: '460px',
              width: '100%',
              padding: 'var(--space-xl)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {requestSuccess ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0' }}>
                <Check size={36} color="var(--brand-primary)" style={{ marginBottom: 'var(--space-sm)' }} />
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-xs)' }}>
                  Request Logged
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Your request has been added to the GT archival curation queue.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit}>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-xs)' }}>
                  Request Session Material
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginBottom: 'var(--space-md)' }}>
                  Let the curation team know what unreleased audio, tracklists, or recaps you'd like to see prioritized.
                </p>

                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    MATERIAL TYPE
                  </label>
                  <select
                    value={reqType}
                    onChange={e => setReqType(e.target.value as MaterialType)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'var(--brand-surface)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="dj_set">Full DJ Set Audio / Recording</option>
                    <option value="tracklist">Set Tracklist &amp; Track IDs</option>
                    <option value="gallery">Photo Gallery &amp; Room Visuals</option>
                    <option value="recap">Editorial Recap</option>
                  </select>
                </div>

                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    SPECIFIC ARTIST / PERFORMER (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={reqArtist}
                    onChange={e => setReqArtist(e.target.value)}
                    placeholder="e.g. Aniko, Sounds of Ace, Yosa..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'var(--brand-surface)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    NOTE / TIMESTAMP (OPTIONAL)
                  </label>
                  <textarea
                    value={reqNote}
                    onChange={e => setReqNote(e.target.value)}
                    placeholder="e.g. Specifically the 3-step bootleg played around 3am..."
                    style={{
                      width: '100%',
                      height: '70px',
                      padding: '10px',
                      backgroundColor: 'var(--brand-surface)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setRequestModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Track ID Inquiry Modal for Attended Patients */}
      {trackIdModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--space-md)'
          }}
          onClick={() => setTrackIdModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--brand-surface-raised)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-sm)',
              maxWidth: '480px',
              width: '100%',
              padding: 'var(--space-xl)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {trackIdSuccess ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0' }}>
                <Check size={36} color="var(--gt-acid)" style={{ marginBottom: 'var(--space-sm)' }} />
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-xs)' }}>
                  Track ID Inquiry Filed
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Your track request has been linked to {session.title} and delivered to the resident DJ desk. Responses will appear on this session case file.
                </p>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!trackDescription.trim()) return;
                  submitTrackIdInquiry(session.id, trackTimestamp, trackDescription);
                  setTrackIdSuccess(true);
                  setTimeout(() => {
                    setTrackIdSuccess(false);
                    setTrackIdModalOpen(false);
                    setTrackDescription('');
                  }, 1800);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-xs)' }}>
                  <Sliders size={18} color="var(--gt-acid)" />
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', margin: 0 }}>
                    Request Track ID from Performance
                  </h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginBottom: 'var(--space-md)' }}>
                  As an attendee of {session.title}, describe the track or transition you want identified. DJs answer asynchronously.
                </p>

                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    APPROXIMATE TIMESTAMP / TIME OF NIGHT
                  </label>
                  <input
                    type="text"
                    value={trackTimestamp}
                    onChange={e => setTrackTimestamp(e.target.value)}
                    placeholder="e.g. 03:45 AM or 'midway through set'"
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'var(--brand-surface)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    SONIC DESCRIPTION &amp; VOCALS / ELEMENTS
                  </label>
                  <textarea
                    value={trackDescription}
                    onChange={e => setTrackDescription(e.target.value)}
                    required
                    placeholder="Describe the rhythm (e.g. heavy rolling bassline with syncopated Yoruba vocal sample, tempo ~124bpm)..."
                    style={{
                      width: '100%',
                      height: '80px',
                      padding: '10px',
                      backgroundColor: 'var(--brand-surface)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setTrackIdModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Track ID Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
