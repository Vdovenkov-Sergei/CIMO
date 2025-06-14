import React from 'react';
import CimoLogo from '../../assets/images/CIMO_logo.svg';
import './HeaderReg.scss';

const HeaderReg = () => {
  return (
    <header className="header-reg">
      <img src={CimoLogo} className="logo" alt="CIMO Logo" />
    </header>
  );
};

export default HeaderReg;