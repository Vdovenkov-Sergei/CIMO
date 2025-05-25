import React from 'react';
import { Link } from 'react-router-dom';
import Input from './Input';
import SubmitButton from './SubmitButton';

const RegisterForm = ({
  login,
  password,
  confirmPassword,
  onLoginChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  isLoading = false
}) => {
  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Добро пожаловать!</h2>
      <p className="auth-form__subtitle">Пожалуйста, заполните форму</p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <Input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={onLoginChange}
            className="form__input"
          />
        </div>

        <div className="form__group">
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={onPasswordChange}
            className="form__input"
          />
        </div>

        <div className="form__group">
          <Input
            type="password"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            className="form__input"
          />
        </div>

        <SubmitButton 
          type="submit" 
          className="form__button"
          disabled={isLoading}
        >
          {isLoading ? 'Загрузка...' : 'Далее'}
        </SubmitButton>

        <p className="form__footer-text">
          Есть аккаунт?{' '}
          <Link to="/" className="form__link">Войти</Link>
        </p>
      </form>
    </section>
  );
};

export default RegisterForm;