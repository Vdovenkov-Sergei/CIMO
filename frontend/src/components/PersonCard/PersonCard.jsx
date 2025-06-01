import React from 'react';
import './PersonCard.scss';

const PersonCard = ({ personObj }) => {
  const getRoleLabel = (role) => {
    switch (role) {
      case 'DIRECTOR':
        return 'Режиссёр';
      case 'ACTOR':
        return 'Актёр';
      case 'BOTH':
        return 'Режиссёр, актёр';
    }
  };

  return (
    <div className="person-card">
      <img 
        src={personObj.person.photo_url} 
        alt={personObj.person.name} 
        className="person-card__photo"
        onError={(e) => {
          e.target.src = '/default-person.jpg';
        }}
      />
      <div className="person-card__info">
        <h4 className="person-card__name">{personObj.person.name}</h4>
        <p className="person-card__role">{getRoleLabel(personObj.role)}</p>
      </div>
    </div>
  );
};

export default PersonCard;
