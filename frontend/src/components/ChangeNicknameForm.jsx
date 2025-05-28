import React, { useState } from 'react';
import SubmitButton from './SubmitButton';
import Input from './Input';

const ChangeNicknameForm = ({ 
  currentNickname, 
  onSubmit, 
  isLoading = false, 
  error = '', 
  successMessage = '' 
}) => {
  const [nickname, setNickname] = useState(currentNickname);

  const getSubtitleText = () => {
    if (error) return error;
    if (successMessage) return successMessage;
    return 'Никнейм должен быть уникальным';
  };

  const getSubtitleClass = () => {
    let className = "change-nickname__subtitle";
    if (error) className += " change-nickname__subtitle--error";
    if (successMessage) className += " change-nickname__subtitle--success";
    return className;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(nickname);
  };

  return (
    <div className="change-nickname">
      <h2 className="change-nickname__title">Придумайте никнейм</h2>
      <p className={getSubtitleClass()}>{getSubtitleText()}</p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form__group">
          <Input
            type="text"
            id="nickname"
            placeholder="Никнейм"
            onChange={(e) => setNickname(e.target.value)}
            required
            minLength={3}
            maxLength={20}
          />
        </div>
        <SubmitButton 
          type="submit" 
          disabled={isLoading || nickname === currentNickname}
          className="form__button"
        >
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </SubmitButton>
      </form>
    </div>
  );
};

export default ChangeNicknameForm;
