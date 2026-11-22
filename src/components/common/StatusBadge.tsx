import React from 'react';

interface StatusBadgeProps {
  type: 'attended' | 'pending' | 'followed' | 'verified_lineup' | 'recorded_only' | 'official_release' | 'authorized_embed';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, label }) => {
  let text = label;
  let bg = 'rgba(255, 255, 255, 0.05)';
  let color = 'var(--text-secondary)';
  let border = 'var(--border-default)';

  switch (type) {
    case 'attended':
      text = text || 'VERIFIED ATTENDANCE';
      bg = 'var(--status-verified-bg)';
      color = 'var(--status-verified)';
      border = 'rgba(142, 219, 117, 0.3)';
      break;
    case 'pending':
      text = text || 'PENDING VERIFICATION';
      bg = 'var(--status-pending-bg)';
      color = 'var(--status-pending)';
      border = 'rgba(233, 180, 76, 0.3)';
      break;
    case 'followed':
      text = text || 'FOLLOWED SESSION';
      bg = 'var(--brand-primary-dim)';
      color = 'var(--brand-primary)';
      border = 'var(--border-accent)';
      break;
    case 'verified_lineup':
      text = text || 'CONFIRMED LINEUP';
      bg = 'rgba(98, 182, 203, 0.12)';
      color = 'var(--status-info)';
      border = 'rgba(98, 182, 203, 0.3)';
      break;
    case 'recorded_only':
      text = text || 'IDENTIFIED RECORDINGS ONLY';
      bg = 'rgba(233, 180, 76, 0.1)';
      color = 'var(--status-pending)';
      border = 'rgba(233, 180, 76, 0.3)';
      break;
    case 'official_release':
      text = text || 'OFFICIAL RELEASE';
      bg = 'var(--brand-primary-dim)';
      color = 'var(--brand-primary)';
      border = 'var(--border-accent)';
      break;
    case 'authorized_embed':
      text = text || 'AUTHORIZED LINK';
      bg = 'rgba(255, 255, 255, 0.06)';
      color = 'var(--text-primary)';
      border = 'var(--border-default)';
      break;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        fontSize: '0.68rem',
        fontFamily: 'var(--font-metadata)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        borderRadius: 'var(--radius-xs)',
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap'
      }}
    >
      <span style={{ fontSize: '0.55rem' }}>●</span>
      {text}
    </span>
  );
};
