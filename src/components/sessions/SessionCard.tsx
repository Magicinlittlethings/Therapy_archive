import React from 'react';
import { Link } from 'react-router-dom';
import { Session } from '../../types';
import { useStore } from '../../context/StoreContext';
import { StatusBadge } from '../common/StatusBadge';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface SessionCardProps {
  session: Session;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const { getAttendance, isFollowed } = useStore();
  const attendance = getAttendance(session.id);
  const followed = isFollowed(session.id);

  return (
    <div
      className="archival-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '320px',
        overflow: 'hidden'
      }}
    >
      {/* Top Bar / Case Reference */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-sm)',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 'var(--space-xs)'
          }}
        >
          <span className="case-ref-stamp">
            {session.sessionCode ? `CASE REF // ${session.sessionCode}` : 'CASE REF // SPECIAL SESSION'}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-metadata)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase'
            }}
          >
            {session.branch}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.45rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            marginBottom: 'var(--space-xs)',
            color: 'var(--text-primary)'
          }}
        >
          <Link to={`/sessions/${session.id}`} style={{ color: 'inherit' }}>
            {session.title}
          </Link>
        </h3>

        {/* Metadata: Date & Venue */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            marginBottom: 'var(--space-md)',
            fontFamily: 'var(--font-metadata)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={13} color="var(--brand-primary)" />
            <span>{session.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={13} color="var(--brand-primary)" />
            <span>
              {session.venue ? `${session.venue}, ${session.city}` : `${session.city} (Archived venue pending confirmation)`}
            </span>
          </div>
        </div>

        {/* Description Snippet */}
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.825rem',
            lineHeight: 1.5,
            marginBottom: 'var(--space-md)'
          }}
        >
          {session.description}
        </p>

        {/* Artists Roster Preview */}
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <div
            style={{
              fontFamily: 'var(--font-metadata)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            LINEUP // {session.lineupStatus === 'recorded_only' ? 'Identified Recordings' : 'Confirmed'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {session.artists.slice(0, 5).map((artist, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-ui)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                {artist.name}
              </span>
            ))}
            {session.artists.length > 5 && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-metadata)',
                  color: 'var(--text-muted)',
                  padding: '2px 4px'
                }}
              >
                +{session.artists.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Status Badges & CTA */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 'var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {attendance === 'attended' && <StatusBadge type="attended" />}
          {attendance === 'pending_verification' && <StatusBadge type="pending" />}
          {followed && <StatusBadge type="followed" />}
          {session.lineupStatus === 'recorded_only' && <StatusBadge type="recorded_only" />}
        </div>

        <Link
          to={`/sessions/${session.id}`}
          style={{
            fontFamily: 'var(--font-metadata)',
            fontSize: '0.78rem',
            color: 'var(--brand-primary)',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>OPEN CASE FILE</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};
