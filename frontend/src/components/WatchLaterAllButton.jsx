import React from 'react';

const WatchLaterAllButton = ({ onClick, disabled = false }) => {
  return (
    <button 
      onClick={onClick}
      className="add-all-button"
      disabled={disabled}
    >
      Отложить все
    </button>
  );
};

export default WatchLaterAllButton;