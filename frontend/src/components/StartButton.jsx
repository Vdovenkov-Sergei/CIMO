import React from 'react';

const StartButton = ({ 
  onClick, 
  children = 'Подтвердить', 
  className = 'modal__buttons-start', 
  disabled = false,
  ...props 
}) => {
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default StartButton;