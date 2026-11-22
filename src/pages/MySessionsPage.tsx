import React from 'react';
import { useStore } from '../context/StoreContext';
import { GTFileExplorer } from '../components/files/GTFileExplorer';
import { Lock, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

export const MySessionsPage: React.FC = () => {
  const { persona, setPersona, openVerifyModal } = useStore();

  if (persona === 'visitor' || persona === 'follower') {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
        <div
          style={{
            maxWidth: '520px',
            textAlign: 'center',
            padding: '32px 28px',
            backgroundColor: 'rgba(12, 16, 12, 0.94)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(4, 229, 57, 0.08)'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(4, 229, 57, 0.08)',
              border: '1px solid rgba(4, 229, 57, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--gt-acid)'
            }}
          >
            <Lock size={26} />
          </div>

          <div className="case-ref-stamp" style={{ marginBottom: '8px' }}>
            PATIENT DOSSIER // RESTRICTED ACCESS
          </div>

          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'var(--gt-cream)' }}>
            Physical Attendance Verification Required
          </h2>

          <p style={{ color: 'var(--gt-muted)', fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '22px' }}>
            {persona === 'follower' ? (
              <>
                You are registered as a <strong>Community Follower</strong>. A financial ticket purchase or registered account alone does not grant patient access. Physical attendance verified through a door check-in scan or verified guestlist entry is required to unlock your Personal Dossier and Therapy Notes.
              </>
            ) : (
              <>
                You are currently exploring as an unauthenticated <strong>Public Visitor</strong>. The Personal Dossier contains confidential session check-ins, personal memory files, and private Therapy Notes. Verified physical attendance is required.
              </>
            )}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => setPersona('patient')}
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <UserCheck size={16} />
              <span>Simulate Verified Patient (Lami Adeyemi)</span>
            </button>

            <button
              onClick={openVerifyModal}
              className="btn btn-outline-neon"
              style={{ fontSize: '0.8rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Sparkles size={14} />
              <span>Interactive Ticket Verification Demo...</span>
            </button>
          </div>

          <div style={{ marginTop: '18px', fontSize: '0.7rem', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)' }}>
            PROTOTYPE NOTICE // In production, attendance is matched to your ticket purchase email.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <GTFileExplorer initialPath="/my-dossier" />
    </div>
  );
};
