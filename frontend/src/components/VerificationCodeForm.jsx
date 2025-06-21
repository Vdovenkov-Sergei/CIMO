import React from 'react';
import Input from './Input';
import SubmitButton from './SubmitButton';
import SecondaryButton from './SecondaryButton';

const VerificationCodeForm = ({
  email = '',
  code = '',
  onCodeChange = () => {},
  onSubmit = () => {},
  onResend = () => {},
  isLoading = false,
  isResending = false,
  error = '',
  backendError = '',
  successMessage = '',
  countdown = 0
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getSubtitleText = () => {
    if (backendError) return backendError;
    if (error) return error;
    if (successMessage) return successMessage;
    return `На ${email} отправлен код`;
  };

  const getSubtitleClass = () => {
    let className = "auth-form__subtitle";
    if (backendError || error) className += " auth-form__subtitle--error";
    if (successMessage) className += " auth-form__subtitle--success";
    return className;
  };

  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Введите код подтверждения</h2>
      <p className={getSubtitleClass()}>
        {getSubtitleText()}
      </p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <Input
            type="text"
            placeholder="Введите код"
            value={code}
            onChange={onCodeChange}
            className="form__input"
            required
          />
        </div>

        <SubmitButton
          type="submit"
          className="form__button"
          disabled={isLoading || code.length !== 6}
        >
          Далее
        </SubmitButton>

        <SecondaryButton
          type="button"
          onClick={onResend}
          disabled={countdown > 0 || isResending}
          className={countdown > 0 || isResending ? "disabled" : ""}
        >
          {countdown > 0 ? `Отправить повторно (${formatTime(countdown)})` : 'Отправить повторно'}
        </SecondaryButton>
      </form>
    </section>
  );
};

export default VerificationCodeForm;