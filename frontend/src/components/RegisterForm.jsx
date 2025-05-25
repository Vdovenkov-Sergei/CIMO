import React from 'react';
import { Link } from 'react-router-dom';
import Input from './Input';
import SubmitButton from './SubmitButton';

const RegisterForm = ({
  email,
  password,
  confirmPassword,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  isLoading = false,
  error = '',
  successMessage = '',
  buttonText = 'Далее'
}) => {
  // Определяем текст подзаголовка в зависимости от состояния
  const getSubtitleText = () => {
    if (error) return error;
    if (successMessage) return successMessage;
    return "Пожалуйста, заполните форму";
  };

  // Определяем класс для подзаголовка в зависимости от состояния
  const subtitleClass = () => {
    let className = "auth-form__subtitle";
    if (error) className += " auth-form__subtitle--error";
    if (successMessage) className += " auth-form__subtitle--success";
    return className;
  };

  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Добро пожаловать!</h2>
      <p className={subtitleClass()}>
        {getSubtitleText()}
      </p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <Input
            type="email"
            placeholder="Почта"
            value={email}
            onChange={onEmailChange}
            className="form__input"
            required
          />
        </div>

        <div className="form__group">
          <Input
            type="password"
            placeholder="Пароль"
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
          />
        </div>

        <SubmitButton 
          type="submit" 
          className="form__button"
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : buttonText}
        </SubmitButton>

        <p className="form__footer-text">
          Есть аккаунт?{' '}
          <Link to="/login" className="form__link">Войти</Link>
        </p>
      </form>
    </section>
  );
};

export default RegisterForm;