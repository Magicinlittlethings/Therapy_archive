import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#070907',
        borderTop: '1px solid var(--border-default)',
        padding: 'var(--space-2xl) 0 var(--space-xl)',
        marginTop: 'auto',
        fontSize: '0.85rem'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 'var(--space-xl)',
            marginBottom: 'var(--space-2xl)'
          }}
        >
          {/* Brand Philosophy */}
          <div style={{ maxWidth: '440px' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-xs)'
              }}
            >
              GROUP THERAPY // PATIENT ARCHIVE
            </div>
            <p
              style={{
                color: 'var(--brand-primary)',
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: 'var(--space-sm)'
              }}
            >
              "The music comes first. Everything else grows from it."
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', lineHeight: 1.5 }}>
              A considered event companion for the Group Therapy community. Attendance-linked case files, 
              private reflections, followed session alerts, and progressive archival recordings across cities.
            </p>
          </div>

          {/* Boundaries & Rights */}
          <div style={{ maxWidth: '380px' }}>
            <div
              style={{
                fontFamily: 'var(--font-metadata)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-sm)'
              }}
            >
              ARCHIVE BOUNDARIES &amp; RIGHTS
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: 'var(--space-xs)' }}>
              This platform complements Group Therapy's public website. Personal collections and native streaming are 
              out of scope; session media is referenced through authorized external links and embedded archives.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-metadata)'
              }}
            >
              <ShieldCheck size={14} color="var(--brand-primary)" />
              PROVISIONAL BRAND TOKENS // CASE-FILE PROTOTYPE
            </div>
          </div>
        </div>

        {/* Demo Privacy Disclosure */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-sm)',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-metadata)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={13} />
            <span>DEMO DISCLOSURE: Fictional accounts &amp; sample reflections. Local browser storage only.</span>
          </div>
          <div>
            GROUP THERAPY ARCHIVE © 2026. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
};
