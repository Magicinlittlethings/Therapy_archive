import React from 'react';
import { NotesBrowserWindow } from '../components/social/NotesBrowserWindow';
import { useNavigate } from 'react-router-dom';

export const NotesFeedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      <NotesBrowserWindow onClose={() => navigate('/')} />
    </div>
  );
};
