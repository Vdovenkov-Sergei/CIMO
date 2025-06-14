import React from 'react';

const WatchButton = ({ onClick, alt = "Просмотрено", className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`movie-button movie-button--primary ${className}`}
      aria-label={alt}
    >
      <img src='/eye.svg' alt={alt} />
    </button>
  );
};

export default WatchButton;