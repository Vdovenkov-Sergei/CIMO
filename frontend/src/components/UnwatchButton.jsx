import React from 'react';

const UnwatchButton = ({ onClick, alt = "Не просмотрено", className = "" }) => {
  return (
    <button 
      onClick={onClick}
      className={`movie-button movie-button--secondary ${className}`}
      aria-label={alt}
    >
      <img src='/eye-slash.svg' alt={alt} />
    </button>
  );
};

export default UnwatchButton;