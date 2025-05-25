import React, { useState } from 'react';
import SubmitButton from './SubmitButton';
import Input from './Input';

const ChangeNicknameForm = ({ currentNickname, onSubmit }) => {
  const [nickname, setNickname] = useState(currentNickname);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    onSubmit(nickname)
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="change-nickname">
      <h2 className="change-nickname__title">Придумайте никнейм</h2>
      <p className="change-nickname__subtitle">Никнейм должен быть уникальным</p>

      <form className="form"  onSubmit={handleSubmit}>
        <div className="form__group">
          <Input
            type="text"
            id="nickname"
            placeholder="Никнейм"
            value={nickname}
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