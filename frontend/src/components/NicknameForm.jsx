import React from 'react';
import Input from './Input';
import SubmitButton from './SubmitButton';
import SecondaryButton from './SecondaryButton';

const NicknameForm = ({
  nickname = '',
  onNicknameChange = () => {},
  onSubmit = () => {},
  onSkip = () => {},
  isLoading = false,
  isSkippable = true,
  error = '',
  backendError = '',
  successMessage = ''
}) => {
  const getSubtitleText = () => {
    if (backendError) return backendError;
    if (error) return error;
    if (successMessage) return successMessage;
    return 'Никнейм должен быть уникальным.';
  };

  const getSubtitleClass = () => {
    let className = "auth-form__subtitle";
    if (backendError || error) className += " auth-form__subtitle--error";
    if (successMessage) className += " auth-form__subtitle--success";
    return className;
  };

  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Придумайте никнейм</h2>
      <p className={getSubtitleClass()}>
        {getSubtitleText()}
      </p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <Input
            type="text"
            placeholder="Никнейм"
            value={nickname}
            onChange={onNicknameChange}
            className="form__input"
            maxLength={20}
            required
          />
        </div>

        <div className="form__buttons">
          <SubmitButton
            type="submit"
            className="form__button"
            disabled={isLoading || !nickname.trim()}
          >
            Сохранить
          </SubmitButton>

          {isSkippable && (
            <SecondaryButton
              type="button"
              onClick={onSkip}
              disabled={isLoading}
              className="secondary-btn"
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