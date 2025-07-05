import React from 'react';
import '../globals.css';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'My Tools',
};
const ToolsLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="main m-0">
      <div className="min-h-[95vh] p-4">{children}</div>
    </div>
  );
};

export default ToolsLayout;
