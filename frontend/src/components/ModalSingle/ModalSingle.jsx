import React from 'react';
import PropTypes from 'prop-types';
import './ModalSingle.scss';
import CancelButton from '../CancelButton';
import StartButton from '../StartButton';

const ModalSingle = ({
  isOpen = false,
  title = 'Начать подбор фильмов?',
  cancelText = 'Отмена',
  confirmText = 'Начать',
  onCancel,
  onConfirm,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__content">
        <h3 className="modal__title">{title}</h3>
        
        {children && <div className="modal__body">{children}</div>}
        
        <div className="modal__buttons">
          <CancelButton
            onClick={onCancel}>
            {cancelText}
          </CancelButton>
          
          <StartButton
            onClick={onConfirm}>
            {confirmText}
          </StartButton>
        </div>
      </div>
    </div>
  );
};

ModalSingle.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default ModalSingle;