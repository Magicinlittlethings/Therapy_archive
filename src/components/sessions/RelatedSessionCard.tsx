import React from 'react';
import { Link } from 'react-router-dom';
import { RelatedSessionRef } from '../../types';
import { Link2, ArrowRight } from 'lucide-react';

interface RelatedSessionCardProps {
  relation: RelatedSessionRef;
}

export const RelatedSessionCard: React.FC<RelatedSessionCardProps> = ({ relation }) => {
  const formatRelType = (type: string) => {
    switch (type) {
      case 'shared_artist':
        return 'SHARED ARTIST LINEAGE';
      case 'musical_direction':
        return 'SONIC & MUSICAL DIRECTION';
      case 'milestone':
        return 'ANNIVERSARY / MILESTONE PREDECESSOR';
      case 'branch_connection':
        return 'BRANCH INITIATIVE';
      default:
        return 'CURATED CONNECTION';
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--brand-surface-raised)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--space-sm)'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-xs)' }}>
          <Link2 size={14} color="var(--brand-primary)" />
          <span
            style={{
              fontFamily: 'var(--font-metadata)',
              fontSize: '0.68rem',
              color: 'var(--brand-primary)',
              letterSpacing: '0.08em',
              fontWeight: 700
            }}
          >
            {formatRelType(relation.relationshipType)}
          </span>
        </div>

        <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', marginBottom: '4px', color: 'var(--text-primary)' }}>
          <Link to={`/sessions/${relation.relatedSessionId}`} style={{ color: 'inherit' }}>
            {relation.relatedTitle}
          </Link>
        </h4>

        <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          DATE: {relation.relatedDate} {relation.relatedCode && `// ${relation.relatedCode}`}
        </div>

        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Why this is connected:</strong> {relation.explanation}
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-xs)', marginTop: 'var(--space-xs)' }}>
        <Link
          to={`/sessions/${relation.relatedSessionId}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-metadata)',
            color: 'var(--brand-primary)',
            fontWeight: 700
          }}
        >
          <span>VIEW CONNECTED SESSION</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
};
