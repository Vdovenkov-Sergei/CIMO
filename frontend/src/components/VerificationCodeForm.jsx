import React from 'react';
import Input from './Input'; // Ваш компонент Input
import SubmitButton from './SubmitButton'; // Ваш компонент Button

const VerificationCodeForm = ({
  code = '',
  onCodeChange = () => {},
  onSubmit = () => {},
  isLoading = false
}) => {
  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Введите код верификации</h2>
      <p className="auth-form__subtitle">
        На Ваш электронный адрес отправлен код подтверждения
      </p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <Input
            type="text"
            placeholder="Код подтверждения"
            value={code}
            onChange={onCodeChange}
            className="form__input"
            maxLength={6} // Обычно коды верификации имеют фиксированную длину
          />
        </div>

        <SubmitButton
          type="submit"
          className="form__button"
          disabled={isLoading || code.length < 4} // Минимум 4 символа для кода
        >
          {isLoading ? 'Проверка...' : 'Далее'}
        </SubmitButton>

      </form>
    </section>
  );
};

export default VerificationCodeForm;