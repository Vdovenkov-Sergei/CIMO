import React from 'react';

const DeleteButton = ({ onClick, alt = "Удалить", className = "" }) => {
  return (
    <button 
      onClick={onClick}
      className={`movie-button movie-button--danger ${className}`}
      aria-label={alt}
    >
      <img src='/trash.svg' alt={alt} />
    </button>
  );
};

export default DeleteButton;