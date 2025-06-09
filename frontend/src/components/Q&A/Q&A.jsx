import React, { useState } from 'react';
import './Q&A.scss';

const FAQComponent = () => {
  const [openBlocks, setOpenBlocks] = useState({
    block1: false,
    block2: false,
    block3: false,
    block4: false,
    block5: false
  });

  const toggleBlock = (blockId) => {
    setOpenBlocks(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };
  
    const Check = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3FA860" className="bi bi-check-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
        </svg>
    );

    const X = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#EF4444" className="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>
    );


        

  return (
    <div className="faqWrapper">
      <h1 className='faqHeader'>FAQ</h1>
      <div className='faqContainer'>
        <div className='faqBlock'>
          <div 
            className='blockHeader' 
            onClick={() => toggleBlock('block1')}
          >
            Общие вопросы
            <span className={`arrowIcon ${openBlocks.block1 ? 'isOpen' : ''}`}>▼</span>
          </div>
          <div className={`blockContent ${openBlocks.block1 ? 'isOpen' : ''}`}>
            <div className='question'>
              <div className='questionText'>Что это за сервис и как он работает?</div>
              <div className='answerText'>Это онлайн-сервис для подбора фильмов в одиночном или парном режиме. Вы листаете карточки фильмов влево и вправо, отмечая, что нравится, а в парной сессии находите мэтчи — совпадения с другим пользователем. Рекомендательная система учитывает ваши выборы и помогает подобрать подходящие фильмы.</div>
            </div>
          </div>
        </div>
      </div>

      <div className='faqContainer'>
        <div className='faqBlock'>
          <div 
            className='blockHeader' 
            onClick={() => toggleBlock('block2')}
          >
            Выбор режима и запуск сессии
            <span className={`arrowIcon ${openBlocks.block2 ? 'isOpen' : ''}`}>▼</span>
          </div>
          <div className={`blockContent ${openBlocks.block2 ? 'isOpen' : ''}`}>
            <div className='question'>
              <div className='questionText'>Как начать одиночную сессию?</div>
              <div className='answerText'>В меню выберите <span className='highlight'>«Одиночная сессия»</span> и подтвердите начало — вы сразу перейдёте к подбору фильмов.</div>
            </div>
            <div className='question'>
              <div className='questionText'>Как пригласить человека в парную сессию?</div>
              <div className='answerText'>Выберите <span className='highlight'>«Парная сессия»</span>, скопируйте ссылку и отправьте её партнёру. Как только оба человека подключатся, сессия начнётся.</div>
            </div>
          </div>
        </div>
      </div>

      <div className='faqContainer'>
        <div className='faqBlock'>
          <div 
            className='blockHeader' 
            onClick={() => toggleBlock('block3')}
          >
            Взаимодействие с фильмами
            <span className={`arrowIcon ${openBlocks.block3 ? 'isOpen' : ''}`}>▼</span>
          </div>
          <div className={`blockContent ${openBlocks.block3 ? 'isOpen' : ''}`}>
            <div className='question'>
              <div className='questionText'>Как пользоваться свайпером?</div>
              <div className='answerText'>Листайте карточки фильмов свайпом или с помощью кнопок. Если фильм понравился — свайпайте вправо или нажимайте <Check/>, если нет — влево или <X />.</div>
            </div>
            <div className='question'>
              <div className='questionText'>Что входит в карточку фильма?</div>
              <div className='answerText'>Название, год, рейтинг, страны, жанры, режиссёры, актёры и краткое описание. Чтобы открыть полную информацию, нажмите на постер.</div>
            </div>
            <div className='question'>
              <div className='questionText'>Сколько фильмов в одной сессии?</div>
              <div className='answerText'>Количество фильмов не ограничено. Вы можете листать, пока не решите остановиться.</div>
            </div>
          </div>
        </div>
      </div>

      <div className='faqContainer'>
        <div className='faqBlock'>
          <div 
            className='blockHeader' 
            onClick={() => toggleBlock('block4')}
          >
            Мэтчи и подборки фильмов
            <span className={`arrowIcon ${openBlocks.block4 ? 'isOpen' : ''}`}>▼</span>
          </div>
          <div className={`blockContent ${openBlocks.block4 ? 'isOpen' : ''}`}>
            <div className='question'>
              <div className='questionText'>Что такое мэтч?</div>
              <div className='answerText'>Это фильм, который понравился и вам, и вашему партнёру. При совпадении оба участника получают уведомление, а фильм добавляется под свайпером и выделяется среди остальных.</div>
            </div>
            <div className='question'>
              <div className='questionText'>Где сохраняются понравившиеся фильмы?</div>
              <div className='answerText'>После сессии вы можете перенести понравившиеся фильмы в список отложенных — он доступен в вашем профиле. Там же можно переместить фильмы в список просмотренных и поставить им оценку.</div>
            </div>
          </div>
        </div>
      </div>

      <div className='faqContainer'>
        <div className='faqBlock'>
          <div 
            className='blockHeader' 
            onClick={() => toggleBlock('block5')}
          >
            Технические детали
            <span className={`arrowIcon ${openBlocks.block5 ? 'isOpen' : ''}`}>▼</span>
          </div>
          <div className={`blockContent ${openBlocks.block5 ? 'isOpen' : ''}`}>
            <div className='question'>
              <div className='questionText'>У меня что-то не работает. Что делать?</div>
              <div className='answerText'>Попробуйте обновить страницу. Если проблема сохраняется, напишите нам на почту поддержки: <a href="mailto:cinemood.corp@gmail.com" className='faq-link' >cinemood.corp@gmail.com</a>.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;