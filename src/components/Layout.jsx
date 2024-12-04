import React from 'react';
import Header from './Header';
import Footer from './Footer';
import StarsCanvas from './canvas/Stars';
import ButtonGradient from '../assets/svg/ButtonGradient';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      
      {/* Stars background - positioned fixed */}
      <div className="fixed inset-0 z-0">
        {/* <StarsCanvas /> */}
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        {children}
      </div>

      <Footer />
      <ButtonGradient />
    </>
  );
};

export default Layout;
