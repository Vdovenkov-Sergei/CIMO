import React from 'react';

const InputLogin = ({ value, onChange, ...props }) => {
  return (
    <input 
      type="text" 
      placeholder="Логин" 
      className="form__input"
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default InputLogin;