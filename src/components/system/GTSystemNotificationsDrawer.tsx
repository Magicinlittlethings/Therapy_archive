import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  Bell,
  X,
  CheckCheck,
  Disc3,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Volume2
} from 'lucide-react';

export const GTSystemNotificationsDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    isNotifCenterOpen,
    closeNotifCenter,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openBrowser
  } = useStore();

  if (!isNotifCenterOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleActionClick = (notifId: string, actionUrl?: string) => {
    markNotificationRead(notifId);
    closeNotifCenter();
    if (actionUrl) {
      if (actionUrl === '/notes.html') {
        openBrowser('gt://notes.html');
      } else {
        navigate(actionUrl);
      }
    }
  };

  const getNotifIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('recording') || t.includes('soundboard') || t.includes('audio')) {
      return <Volume2 size={16} color="var(--gt-acid)" />;
    }
    if (t.includes('visual') || t.includes('photo') || t.includes('recap')) {
      return <ImageIcon size={16} color="var(--gt-orange)" />;
    }
    if (t.includes('verified') || t.includes('attendance') || t.includes('ticket')) {
      return <CheckCircle2 size={16} color="var(--gt-acid)" />;
    }
    return <Disc3 size={16} color="var(--gt-cream)" />;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeNotifCenter}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          transition: 'opacity 0.2s ease'
        }}
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-label="System Notifications Center"
        style={{
          position: 'fixed',
          top: '28px',
          right: 0,
          bottom: 0,
          width: 'min(440px, 94vw)',
          backgroundColor: 'rgba(10, 10, 10, 0.96)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid var(--border-accent)',
          boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(4, 229, 57, 0.12)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: 'var(--space-md) var(--space-lg)',
            borderBottom: '1px solid var(--gt-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(18, 18, 18, 0.9)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'rgba(4, 229, 57, 0.12)',
                border: '1px solid var(--border-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gt-acid)'
              }}
            >
              <Bell size={16} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--gt-cream)' }}>
                Followed Session Updates
              </div>
            </div>
          </div>

          <button
            onClick={closeNotifCenter}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--gt-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 'var(--radius-xs)'
            }}
            title="Close Drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar Sub-header */}
        <div
          style={{
            padding: 'var(--space-xs) var(--space-lg)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(3, 3, 3, 0.7)'
          }}
        >
          <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-muted)' }}>
            {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
          </span>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--gt-acid)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-metadata)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <CheckCheck size={13} />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notification Cards List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-md) var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)'
          }}
        >
          {notifications.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-3xl) var(--space-md)',
                color: 'var(--gt-muted)'
              }}
            >
              <Bell size={36} color="var(--gt-border)" style={{ marginBottom: '12px' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gt-cream)', marginBottom: '6px' }}>
                No active notifications
              </div>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                Follow sessions in the Archive Explorer to receive soundboard audio drops and visual updates.
              </p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => notif.actionUrl && handleActionClick(notif.id, notif.actionUrl)}
                style={{
                  backgroundColor: notif.isRead ? 'rgba(18, 18, 18, 0.6)' : 'rgba(26, 26, 26, 0.95)',
                  border: notif.isRead ? '1px solid var(--border-subtle)' : '1px solid var(--border-accent)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-md)',
                  position: 'relative',
                  cursor: notif.actionUrl ? 'pointer' : 'default',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {/* Unread Indicator Dot */}
                {!notif.isRead && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--gt-acid)',
                      boxShadow: '0 0 8px var(--gt-acid)'
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>
                    {getNotifIcon(notif.title)}
                  </div>
                  <div style={{ flex: 1, paddingRight: notif.isRead ? '0' : '16px' }}>
                    <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.66rem', color: 'var(--gt-acid)', letterSpacing: '0.08em', marginBottom: '2px' }}>
                      SESSION UPDATE // {notif.sessionId.toUpperCase()}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gt-cream)', lineHeight: 1.3 }}>
                      {notif.title}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--gt-muted)', lineHeight: 1.45, marginBottom: 'var(--space-sm)' }}>
                  {notif.message}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.68rem', color: 'var(--gt-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} />
                    <span>{notif.date}</span>
                  </span>

                  {notif.actionUrl && (
                    <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.7rem', color: 'var(--gt-acid)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <span>Open File</span>
                      <ExternalLink size={11} />
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div
          style={{
            padding: 'var(--space-sm) var(--space-lg)',
            borderTop: '1px solid var(--gt-border)',
            backgroundColor: 'rgba(18, 18, 18, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-metadata)',
            fontSize: '0.7rem',
            color: 'var(--gt-muted)'
          }}
        >
          <span>GT-OS WORKSTATION v2.4</span>
          <span style={{ color: 'var(--gt-acid)' }}>NETWORK ACTIVE</span>
        </div>
      </aside>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
