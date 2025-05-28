import React from 'react';
import { Link } from 'react-router-dom';
import Input from './Input';
import SubmitButton from './SubmitButton';

const AuthForm = ({ 
  login, 
  password, 
  onLoginChange, 
  onPasswordChange, 
  onSubmit, 
  isLoading = false,
  error = '',
  backendError = '',
  successMessage = ''
}) => {
  const getSubtitleText = () => {
    if (backendError) return backendError;
    if (error) return error;
    if (successMessage) return successMessage;
    return 'Пожалуйста, авторизуйтесь';
  };

  const getSubtitleClass = () => {
    let className = "auth-form__subtitle";
    if (backendError || error) className += " auth-form__subtitle--error";
    if (successMessage) className += " auth-form__subtitle--success";
    return className;
  };

  return (
    <section className="auth-form">
      <h2 className="auth-form__title">С возвращением!</h2>
      <p className={getSubtitleClass()}>
        {getSubtitleText()}
      </p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <Input
            type="text"
            placeholder="Почта или никнейм"
            value={login}
            onChange={onLoginChange}
            required
          />
        </div>

        <div className="form__group">
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={onPasswordChange}
            required
          />
          <Link to="/forgotPassword" className="form__link">
            Забыли пароль?
          </Link>
        </div>

        <SubmitButton disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </SubmitButton>

        <p className="form__footer-text">
          Нет аккаунта?{' '}
          <Link to="/signup" className="form__link">
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </section>
  );
};

export default AuthForm;