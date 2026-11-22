import React from 'react';
import { useStore } from '../context/StoreContext';
import { GTFileExplorer } from '../components/files/GTFileExplorer';
import { Lock, UserCheck } from 'lucide-react';

export const MySessionsPage: React.FC = () => {
  const { persona, setPersona } = useStore();

  if (persona === 'visitor') {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
        <div
          style={{
            maxWidth: '460px',
            textAlign: 'center',
            padding: 'var(--space-2xl)',
            backgroundColor: 'rgba(20, 20, 20, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)'
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--gt-acid)'
            }}
          >
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'var(--gt-cream)' }}>
            Personal Dossier Locked
          </h2>
          <p style={{ color: 'var(--gt-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '20px' }}>
            You are currently viewing as a <strong>Public Visitor</strong>. Switch user account to access verified attendance history and private therapy notes.
          </p>
          <button
            onClick={() => setPersona('patient')}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <UserCheck size={16} />
            <span>Switch to Patient</span>
          </button>
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
