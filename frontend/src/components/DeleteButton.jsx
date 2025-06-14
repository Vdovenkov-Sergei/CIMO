// DeleteButton.jsx
import React from 'react';
import trashIconUrl from '../assets/images/trash.svg';

const DeleteButton = ({ onClick, alt = "Удалить", className = "" }) => {
  return (
    <button 
      onClick={onClick}
      className={`movie-button movie-button--danger ${className}`}
      aria-label={alt}
    >
      <img src={trashIconUrl} alt={alt} />
    </button>
  );
};

export default DeleteButton;