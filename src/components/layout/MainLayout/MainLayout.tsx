import React from 'react';
import { MobileNavFooter } from '../MobileNavFooter';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="pb-16"> {/* Add padding at the bottom to accommodate the footer */}
      {children}
      <MobileNavFooter />
    </div>
  );
};

export default MainLayout;