import React from 'react';
import { GTFileExplorer } from '../components/files/GTFileExplorer';

export const ArchivePage: React.FC = () => {
  return (
    <div style={{ height: '100%', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <GTFileExplorer initialPath="/sessions" />
    </div>
  );
};
