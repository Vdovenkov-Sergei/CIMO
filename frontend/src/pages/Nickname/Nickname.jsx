import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './Nickname.scss';

// Импортируем изображения (предположим, они лежат в src/assets/images/onboarding/)
import onboarding1 from '@/assets/images/onboarding1.png';
import onboarding2 from '@/assets/images/onboarding2.png';
import onboarding3 from '@/assets/images/onboarding3.png';

const Nickname = () => {
  const onboardingImages = [
    { id: 1, src: onboarding1, alt: 'Демонстрация функционала 1' },
    { id: 2, src: onboarding2, alt: 'Демонстрация функционала 2' },
    { id: 3, src: onboarding3, alt: 'Демонстрация функционала 3' },
  ];

  return (
    <div className="nickname-page">
      <header className="header">
        <img src="./src/assets/images/CIMO_logo.svg" class="logo" alt="" />
      </header>

      <main className="main-content container">
        <section className="onboarding">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            loop={true}
          >
            {onboardingImages.map((image) => (
              <SwiperSlide key={image.id}>
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="onboarding__image" 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section className="auth-form">
          <h2 className="auth-form__title">Придумайте никнейм</h2>
          <p className="auth-form__subtitle">Никнейм должен быть уникальным</p>

          <form className="form">
            <div className="form__group">
              <input 
                type="text" 
                placeholder="Никнейм" 
                className="form__input"
              />
            </div>

            <button type="submit" className="form__button">Сохранить</button>
            <button type="submit" className="form__button">Придумать позже</button>

          </form>
        </section>
      </main>

      <footer className="footer">
        <h2 className="footer__title">Наши контакты</h2>
        <a href="mailto:cinemood.corp@gmail.com" className="footer__email">cinemood.corp@gmail.com</a>
      </footer>
    </div>
  );
};

export default Nickname;