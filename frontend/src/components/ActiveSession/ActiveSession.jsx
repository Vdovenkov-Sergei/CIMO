import React from 'react';
import PropTypes from 'prop-types';
import './ActiveSession.scss';

const ActiveSession = ({
  isOpen = false,
  title = 'У Вас уже есть активная сессия. Что Вы хотите с ней сделать?',
  cancelText = 'Завершить',
  confirmText = 'Продолжить',
  children,
  onCancel,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="active-session-modal">
      <div className="active-session-modal__content">
        <h3 className="active-session-modal__title">{title}</h3>
        
        {children && <div className="active-session-modal__body">{children}</div>}
        
        <div className="active-session-modal__buttons">
          <button
            className='finish-session'
            onClick={onCancel}
          >
            {cancelText}
          </button>
          
          <button
            className='restart-session'
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

ActiveSession.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default ActiveSession;