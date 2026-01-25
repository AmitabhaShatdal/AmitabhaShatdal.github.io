import React from 'react';
import { createRoot } from 'react-dom/client';
import BulletinBoardApp from './components/bulletinboard/BulletinBoardApp';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<BulletinBoardApp />);
}
