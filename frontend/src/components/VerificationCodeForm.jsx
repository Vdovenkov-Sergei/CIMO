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
  successMessage = '',
  countdown = 0
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Введите код верификации</h2>
      <p className={`auth-form__subtitle ${
        error ? 'auth-form__subtitle--error' : 
        successMessage ? 'auth-form__subtitle--success' : ''
      }`}>
        {error || successMessage || `На ${email} отправлен код подтверждения`}
      </p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <Input
            type="text"
            placeholder="Введите 6-значный код"
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
          {isLoading ? 'Проверка...' : 'Далее'}
        </SubmitButton>

        <SecondaryButton
          type="button"
          onClick={onResend}
          disabled={countdown > 0 || isResending}
        >
          {countdown > 0 ? `Отправить повторно (${formatTime(countdown)})` : 'Отправить повторно'}
        </SecondaryButton>
      </form>
    </section>
  );
};

export default VerificationCodeForm;