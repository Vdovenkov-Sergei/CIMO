import React from 'react';
import Input from './Input'; // Импорт вашего компонента Input
import SubmitButton from './SubmitButton'; // Импорт вашего компонента Button

const PasswordResetForm = ({
  password = '',
  confirmPassword = '',
  onPasswordChange = () => {},
  onConfirmPasswordChange = () => {},
  onSubmit = () => {},
  isLoading = false
}) => {
  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Придумайте новый пароль</h2>
      <p className="auth-form__subtitle">
        Пароль должен включать заглавные и строчные буквы и цифры
      </p>

      <form className="form" onSubmit={onSubmit}>
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
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </SubmitButton>
      </form>
    </section>
  );
};

export default PasswordResetForm;