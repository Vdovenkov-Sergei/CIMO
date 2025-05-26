import React from 'react';
import eyeIconUrl from '../assets/images/eye.svg';

const WatchButton = ({ onClick, alt = "Просмотрено", className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`movie-button movie-button--primary ${className}`}
      aria-label={alt}
    >
      <img src={eyeIconUrl} alt={alt} />
    </button>
  );
};

export default WatchButton;
