import React from 'react';
import Input from './Input'; // Предполагаем, что у вас есть компонент Input
import SubmitButton from './SubmitButton'; // Предполагаем, что у вас есть компонент Button
import SecondaryButton from './SecondaryButton'; // Предполагаем, что у вас есть компонент SecondaryButton

const NicknameForm = ({
  nickname = '',
  onNicknameChange = () => {},
  onSubmit = () => {},
  onSkip = () => {},
  isLoading = false,
  isSkippable = true
}) => {
  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Придумайте никнейм</h2>
      <p className="auth-form__subtitle">Никнейм должен быть уникальным</p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <Input
            type="text"
            placeholder="Никнейм"
            value={nickname}
            onChange={onNicknameChange}
            className="form__input"
            maxLength={20} // Ограничение длины никнейма
          />
        </div>

        <div className="form__buttons">
          <SubmitButton
            type="submit"
            className="form__button"
            disabled={isLoading || !nickname.trim()}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </SubmitButton>

          {isSkippable && (
            <SecondaryButton
              className='secondary-btn'
              type="button"
              onClick={onSkip}
              disabled={isLoading}
            >
              Придумать позже
            </SecondaryButton>
          )}
        </div>
      </form>
    </section>
  );
};

export default NicknameForm;