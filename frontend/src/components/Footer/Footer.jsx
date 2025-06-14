import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <h2 className="footer__title">Наши контакты</h2>
      <a href="mailto:cinemood.corp@gmail.com" className="footer__email">
        cinemood.corp@gmail.com
      </a>
    </footer>
  );
};

export default Footer;