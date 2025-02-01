import Link from 'next/link';
import Button from '@mui/material/Button';
import React from 'react';

const LinkButton = ({ href, children, ...props }: { href: string; children: React.ReactNode;}) => {
  return (
    <Button
      component={Link}
      href={href}
      {...props}
    >
      {children}
    </Button>
  );
};

export default LinkButton;
