import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileNavLink = ({ to, title, onClick }) => {
  return (
    <Link 
      to={to} 
      className="profile-nav__link"
      onClick={onClick}
    >
      <h3 className="profile-nav__title">{title}</h3>
      <span className="profile-nav__icon">→</span>
    </Link>
  );
};

ProfileNavLink.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

ProfileNavLink.defaultProps = {
  onClick: () => {}
};

export default ProfileNavLink;