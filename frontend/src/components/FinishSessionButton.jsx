import React from 'react';

const FinishSessionButton = ({ onClick, disabled = false }) => {
  return (
    <button 
      onClick={onClick}
      className="end-session"
      disabled={disabled}
    >
      Завершить сессию
    </button>
  );
};

export default FinishSessionButton;