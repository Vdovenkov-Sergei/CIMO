import React from 'react';
import Input from './Input'; // Ваш существующий компонент Input
import SubmitButton from './SubmitButton'; // Ваш существующий компонент Button

const PasswordRecoveryForm = ({
  email = '',
  onEmailChange = () => {},
  onSubmit = () => {},
  isLoading = false
}) => {
  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Введите почту</h2>
      <p className="auth-form__subtitle">
        На Ваш электронный адрес будет отправлена ссылка для восстановления пароля
      </p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <Input
            type="email"
            placeholder="Почта"
            value={email}
            onChange={onEmailChange}
            className="form__input"
          />
        </div>

        <SubmitButton
          type="submit"
          className="form__button"
          disabled={isLoading}
        >
          {isLoading ? 'Отправка...' : 'Далее'}
        </SubmitButton>
      </form>
    </section>
  );
};

export default PasswordRecoveryForm;