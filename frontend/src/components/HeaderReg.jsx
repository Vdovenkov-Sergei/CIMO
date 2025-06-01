import React from 'react';
import CimoLogo from '../assets/images/CIMO_logo.svg';

const HeaderReg = () => {
  return (
    <header className="header">
      <img src={CimoLogo} className="logo" alt="CIMO Logo" />
    </header>
  );
};

export default HeaderReg;