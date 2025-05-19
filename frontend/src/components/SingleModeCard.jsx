import React, { useState } from 'react';
import ModalSingle from './ModalSingle/ModalSingle';

const SingleModeCard = ({
  title = "Одиночный режим",
  description = "Данный режим позволяет осуществлять подбор фильмов под Ваше настроение и предпочтения.",
  imageSrc = "src/assets/images/mode1.png",
  buttonText = "Начать одиночную сессию",
  confirmText = "Начать",
  onStartSession
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (onStartSession) {
      onStartSession();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="mode-card">
        <h3 className="mode-card__title">{title}</h3>
        <p className="mode-card__description">{description}</p>
        <div className="mode-card__image">
          <img src={imageSrc} alt="Одиночный режим" />
        </div>
        <button 
          onClick={handleButtonClick} 
          className="mode-card__button"
        >
          {buttonText}
        </button>
      </div>

      <ModalSingle
        isOpen={isModalOpen}
        title="Начать подбор фильмов?"
        confirmText={confirmText}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default SingleModeCard;