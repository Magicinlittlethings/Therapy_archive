import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { MaterialCard } from '../components/sessions/MaterialCard';
import { Radio, Calendar, ArrowRight, Disc3 } from 'lucide-react';

export const FollowedPage: React.FC = () => {
  const { sessions, materials, follows, toggleFollow, persona } = useStore();

  const followedSessions = sessions.filter(s => follows[s.id]);
  const followedSessionIds = new Set(followedSessions.map(s => s.id));

  // Progressive materials belonging to followed sessions
  const followedMaterials = materials.filter(m => followedSessionIds.has(m.sessionId));

  if (persona === 'visitor') {
    return (
      <div className="container" style={{ padding: 'var(--space-3xl) var(--space-md)', textAlign: 'center' }}>
        <div className="archival-panel-raised" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Radio size={40} color="var(--brand-primary)" style={{ marginBottom: 'var(--space-sm)' }} />
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-xs)' }}>
            Followed Sessions
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: 'var(--space-lg)' }}>
            You are currently exploring as a Public Visitor. Switch to <strong>"Patient"</strong> in the top menu bar to follow sessions and receive progressive material drops.
          </p>
          <Link to="/sessions" className="btn btn-primary">
            Explore Collective Archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 32px 80px', maxWidth: '1360px', margin: '0 auto', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-sm)',
          paddingBottom: '12px',
          marginBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="case-ref-stamp">
            FOLLOW THERAPY // PROGRESSIVE RELEASES
          </span>
          <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)' }}>
            {followedSessions.length} TRACKED
          </span>
        </div>
      </div>

      {followedSessions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>
          {/* Section 1: Followed Sessions Overview */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', borderBottom: '1px solid var(--border-default)', paddingBottom: 'var(--space-xs)' }}>
              <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--gt-cream)' }}>
                Followed Sessions ({followedSessions.length})
              </h2>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-acid)' }}>
                UPDATES ACTIVE
              </span>
            </div>

            <div className="grid-2">
              {followedSessions.map(session => (
                <div
                  key={session.id}
                  className="archival-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: '3px solid var(--brand-primary)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="case-ref-stamp">{session.sessionCode || 'CASE REF'}</span>
                      <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.7rem', color: 'var(--brand-primary)' }}>
                        ● RECEIVING UPDATES
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                      <Link to={`/sessions/${session.id}`} style={{ color: 'inherit' }}>
                        {session.title}
                      </Link>
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-metadata)', marginBottom: 'var(--space-sm)' }}>
                      <Calendar size={13} color="var(--brand-primary)" />
                      <span>{session.date} // {session.venue || session.city}</span>
                    </div>

                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {session.description}
                    </p>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: 'var(--space-sm)',
                      marginTop: 'var(--space-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <button
                      onClick={() => toggleFollow(session.id)}
                      className="btn btn-ghost"
                      style={{ fontSize: '0.72rem', padding: '4px 8px', color: 'var(--text-muted)', minHeight: '30px' }}
                    >
                      Unfollow Session
                    </button>

                    <Link
                      to={`/sessions/${session.id}`}
                      style={{
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-metadata)',
                        color: 'var(--brand-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 700
                      }}
                    >
                      <span>OPEN RECORD</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Progressive Material Drops Timeline */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', borderBottom: '1px solid var(--border-default)', paddingBottom: 'var(--space-xs)' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>
                  Published Materials for Followed Sessions ({followedMaterials.length})
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                  Archival releases progressively cleared and made accessible.
                </p>
              </div>
            </div>

            {followedMaterials.length > 0 ? (
              <div className="grid-2">
                {followedMaterials.map(mat => (
                  <MaterialCard key={mat.id} material={mat} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: 'var(--space-xl)',
                  textAlign: 'center',
                  backgroundColor: 'var(--brand-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--border-default)'
                }}
              >
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  No materials have been published yet for your followed sessions. You will receive an alert as recordings are released.
                </p>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div
          style={{
            padding: 'var(--space-3xl) var(--space-md)',
            textAlign: 'center',
            backgroundColor: 'var(--brand-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <Disc3 size={32} color="var(--brand-primary)" style={{ marginBottom: 'var(--space-sm)' }} />
          <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-xs)' }}>
            No Followed Sessions Yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto var(--space-lg)', lineHeight: 1.5 }}>
            Browse past session case files in the collective archive and click <strong>Follow Therapy</strong> to receive progressive notifications when recordings, tracklists, and recaps drop.
          </p>
          <Link to="/sessions" className="btn btn-primary">
            Browse Session Archive
          </Link>
        </div>
      )}
    </div>
  );
};
