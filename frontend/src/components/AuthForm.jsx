import React from 'react';
import { Link } from 'react-router-dom';
import Input from './Input'; // Предполагается, что Input уже реализован
import SubmitButton from './SubmitButton'; // Предполагается, что SubmitButton уже реализован

const AuthForm = ({ 
  login, 
  password, 
  onLoginChange, 
  onPasswordChange, 
  onSubmit, 
  isLoading = false 
}) => {
  return (
    <section className="auth-form">
      <h2 className="auth-form__title">С возвращением!</h2>
      <p className="auth-form__subtitle">Пожалуйста, авторизуйтесь</p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <Input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={onLoginChange}
          />
        </div>

        <div className="form__group">
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={onPasswordChange}
          />
          <Link to="/forgotPassword" className="form__link">
            Забыли пароль?
          </Link>
        </div>

        <SubmitButton disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Войти'}
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