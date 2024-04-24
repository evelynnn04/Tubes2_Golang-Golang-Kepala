import React from 'react';
import { Input, Card } from 'antd';

const InputComponent = ({
  label,
  id,
  inputValue,
  showCard,
  inputMatch,
  handleInputChange,
  handleCardClick,
  selectedCard
}) => {
  return (
    <>
      <label htmlFor={id}>{label}</label> <br />
      <Input
        onChange={(e) => handleInputChange(e.target.value)}
        type="text"
        id={id}
        name={label}
        placeholder="Enter text here"
        value={inputValue}
      />
      <div>
        {showCard &&
          inputMatch &&
          inputMatch.slice(0, 3).map((item, index) => (
            <div key={index} style={{ width: '80%' }}>
              {selectedCard === item ? (
                <Card>{item.title}</Card>
              ) : (
                <Card id={`card${label}`} onClick={() => handleCardClick(item)}>{item.title}</Card>
              )}
            </div>
          ))
        }
      </div>
    </>
  );
};

export default InputComponent;
