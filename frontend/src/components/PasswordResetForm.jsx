import React from 'react';
import Input from './Input';
import SubmitButton from './SubmitButton';

const PasswordResetForm = ({
  password = '',
  confirmPassword = '',
  onPasswordChange = () => {},
  onConfirmPasswordChange = () => {},
  onSubmit = () => {},
  isLoading = false,
  error = '',
  backendError = '',
  successMessage = ''
}) => {
  const getSubtitleText = () => {
    if (backendError) return backendError;
    if (error) return error;
    if (successMessage) return successMessage;
    return 'Пароль должен включать заглавные и строчные буквы и цифры';
  };

  const getSubtitleClass = () => {
    let className = "auth-form__subtitle";
    if (backendError || error) className += " auth-form__subtitle--error";
    if (successMessage) className += " auth-form__subtitle--success";
    return className;
  };

  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Придумайте новый пароль</h2>
      <p className={getSubtitleClass()}>
        {getSubtitleText()}
      </p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <Input
            type="password"
            placeholder="Новый пароль"
            value={password}
            onChange={onPasswordChange}
            className="form__input"
            required
            minLength="8"
          />
        </div>
        
        <div className="form__group">
          <Input
            type="password"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            className="form__input"
            required
            minLength="8"
          />
        </div>

        <SubmitButton
          type="submit"
          className="form__button"
          disabled={isLoading || !password || !confirmPassword}
        >
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </SubmitButton>
      </form>
    </section>
  );
};

export default PasswordResetForm;