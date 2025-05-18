import React from 'react';

const SubmitButton = ({ onClick, disabled, children = "Войти", ...props }) => {
  return (
    <button
      type="submit"
      className="form__button"
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default SubmitButton;