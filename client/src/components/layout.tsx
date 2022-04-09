import React from 'react';
import { NavBar } from './NavBar';
import { NavigationBar } from './NavigationBar';
import { Wrapper, WrapperVariants } from './Wrapper';

interface layoutProps {
  variant?: WrapperVariants;
}

export const Layout: React.FC<layoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavigationBar></NavigationBar>
      {/* <NavBar></NavBar> */}
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
