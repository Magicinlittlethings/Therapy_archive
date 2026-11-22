import React from 'react';
import { SessionMaterial } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Play, FileText, Image, ExternalLink } from 'lucide-react';

interface MaterialCardProps {
  material: SessionMaterial;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const getIcon = () => {
    switch (material.type) {
      case 'dj_set':
        return <Play size={15} color="var(--brand-primary)" />;
      case 'tracklist':
        return <FileText size={15} color="var(--brand-primary)" />;
      case 'gallery':
      case 'recap':
        return <Image size={15} color="var(--brand-primary)" />;
      default:
        return <Play size={15} color="var(--brand-primary)" />;
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {getIcon()}
            <span
              style={{
                fontFamily: 'var(--font-metadata)',
                fontSize: '0.7rem',
                color: 'var(--brand-primary)',
                textTransform: 'uppercase',
                fontWeight: 700
              }}
            >
              {material.type.replace('_', ' ')}
            </span>
          </div>
          <StatusBadge
            type={material.rightsStatus === 'official_release' ? 'official_release' : 'authorized_embed'}
            label={material.rightsStatus.replace('_', ' ')}
          />
        </div>

        <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', marginBottom: '4px', color: 'var(--text-primary)' }}>
          {material.title}
        </h4>

        {material.artistName && (
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-metadata)', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            PERFORMER: {material.artistName}
          </div>
        )}

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {material.description}
        </p>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 'var(--space-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'var(--space-xs)'
        }}
      >
        <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          RELEASED {material.publishedDate} // {material.platform.toUpperCase()}
        </span>

        <a
          href={material.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-neon"
          style={{
            padding: '4px 10px',
            fontSize: '0.72rem',
            minHeight: '32px',
            gap: '4px'
          }}
          title="Opens authorized external archive or player"
        >
          <span>LISTEN / VIEW</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};
