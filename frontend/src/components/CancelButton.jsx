import React from 'react';

const CancelButton = ({ 
  onClick, 
  children = 'Отмена', 
  className = 'modal__buttons-cancel', 
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

export default CancelButton;