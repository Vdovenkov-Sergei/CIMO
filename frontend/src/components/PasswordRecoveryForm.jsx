import React from 'react';
import Input from './Input';
import SubmitButton from './SubmitButton';

const PasswordRecoveryForm = ({
  email = '',
  onEmailChange = () => {},
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
    return 'На Ваш электронный адрес будет отправлена ссылка для восстановления пароля';
  };

  const getSubtitleClass = () => {
    let className = "auth-form__subtitle";
    if (backendError || error) className += " auth-form__subtitle--error";
    if (successMessage) className += " auth-form__subtitle--success";
    return className;
  };

  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Восстановление пароля</h2>
      <p className={getSubtitleClass()}>
        {getSubtitleText()}
      </p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <Input
            type="email"
            placeholder="Введите ваш email"
            value={email}
            onChange={onEmailChange}
            className="form__input"
            required
          />
        </div>

        <SubmitButton
          type="submit"
          className="form__button"
          disabled={isLoading || !email.trim()}
        >
          {isLoading ? 'Отправка...' : 'Далее'}
        </SubmitButton>
      </form>
    </section>
  );
};

export default PasswordRecoveryForm;