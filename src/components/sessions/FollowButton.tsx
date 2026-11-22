import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Radio, Check, Bell } from 'lucide-react';

interface FollowButtonProps {
  sessionId: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FollowButton: React.FC<FollowButtonProps> = ({ sessionId, size = 'md' }) => {
  const { isFollowed, toggleFollow, persona } = useStore();
  const followed = isFollowed(sessionId);
  const [showModal, setShowModal] = useState(false);
  const [notifyMaterials, setNotifyMaterials] = useState(true);
  const [notifyRecaps, setNotifyRecaps] = useState(true);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (persona === 'visitor') {
      alert('You are currently exploring as a Public Visitor. Switch persona to "Registered Patient" or "Verified Attendee" in the top bar to follow sessions.');
      return;
    }

    if (!followed) {
      // Open preference modal
      setShowModal(true);
    } else {
      toggleFollow(sessionId);
    }
  };

  const confirmFollow = () => {
    toggleFollow(sessionId, { notifyMaterials, notifyRecaps });
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={followed ? 'btn btn-secondary' : 'btn btn-outline-neon'}
        style={{
          padding: size === 'sm' ? '6px 12px' : '10px 18px',
          fontSize: size === 'sm' ? '0.75rem' : '0.85rem',
          fontFamily: 'var(--font-metadata)',
          letterSpacing: '0.04em',
          minHeight: '40px'
        }}
        title="Follow this session for progressive material updates (Following does not record attendance)"
      >
        {followed ? (
          <>
            <Check size={14} color="var(--brand-primary)" />
            <span>FOLLOWING THERAPY</span>
          </>
        ) : (
          <>
            <Radio size={14} />
            <span>FOLLOW THERAPY</span>
          </>
        )}
      </button>

      {/* Preference Modal on Initial Follow */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--space-md)'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--brand-surface-raised)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-sm)',
              maxWidth: '460px',
              width: '100%',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-sm)' }}>
              <Bell size={18} color="var(--brand-primary)" />
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
                Follow Therapy Notifications
              </h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 'var(--space-md)' }}>
              Stay connected to this session after the night ends. Configure which progressive archival releases 
              you want to be notified about.
            </p>

            <div
              style={{
                backgroundColor: 'rgba(183, 255, 0, 0.05)',
                border: '1px solid var(--border-accent)',
                padding: 'var(--space-sm)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.75rem',
                color: 'var(--brand-primary)',
                fontFamily: 'var(--font-metadata)',
                marginBottom: 'var(--space-md)'
              }}
            >
              NOTICE: Following a session never implies or proves attendance. Attendance requires verified check-in proof.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={notifyMaterials}
                  onChange={e => setNotifyMaterials(e.target.checked)}
                  style={{ accentColor: 'var(--brand-primary)', width: '16px', height: '16px' }}
                />
                <span>Notify me when official recordings &amp; sets are published</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={notifyRecaps}
                  onChange={e => setNotifyRecaps(e.target.checked)}
                  style={{ accentColor: 'var(--brand-primary)', width: '16px', height: '16px' }}
                />
                <span>Notify me when photo galleries and editorial recaps are added</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={confirmFollow}
              >
                Confirm &amp; Follow Session
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
