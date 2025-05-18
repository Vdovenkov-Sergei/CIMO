import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Onboarding = ({ 
  images, 
  autoplayDelay = 3000,
  className = '' 
}) => {
  return (
    <section className={`onboarding ${className}`}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: autoplayDelay }}
        pagination={{ clickable: true }}
        loop={true}
      >
        {images.map((image) => (
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
  );
};

export default Onboarding;