import React from 'react';
import { NavBar } from './NavBar';
import { Wrapper, WrapperVariants } from './Wrapper';

interface layoutProps {
  variant?: WrapperVariants;
}

export const Layout: React.FC<layoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar></NavBar>
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
