import React, { useState, useEffect } from 'react';
import SubmitButton from './SubmitButton';
import Input from './Input';

const ChangeNicknameForm = ({ 
  currentNickname, 
  onSubmit, 
  isLoading = false, 
  backendError = '', 
  successMessage = '' 
}) => {
  const [nickname, setNickname] = useState(currentNickname);

  useEffect(() => {
    setNickname(currentNickname);
  }, [currentNickname]);

  const getSubtitleText = () => {
    if (backendError) return backendError;
    if (successMessage) return successMessage;
    return 'Никнейм должен быть уникальным';
  };

  const getSubtitleClass = () => {
    let className = "change-nickname__subtitle";
    if (backendError) {
      className += " change-nickname__subtitle--error";
    } else if (successMessage) {
      className += " change-nickname__subtitle--success";
    }
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
          />
        </div>
        <SubmitButton 
          type="submit" 
          className="form__button"
        >
          Сохранить
        </SubmitButton>
      </form>
    </div>
  );
};

export default ChangeNicknameForm;