import React from 'react';
import { Input, Card } from 'antd';
import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import axios from 'axios';

const InputComponent = ({
  label,
  id,
  value,
  setValue
}) => {
  const [showCard, setShowCard] = useState(true);
  const [inputMatch, setInputMatch] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    loadInput();
  }, []);

  const loadInput= async () => {
    console.log(showCard);
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&list=search&srsearch=`
      );
      setInputMatch(response.data.query);
    } catch (error) {
      console.error(error);
    }
  };

  const searchInput= debounce(async (text) => {
    setValue(text);
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&list=search&srsearch=${text}`
      );
      setInputMatch(response.data.query.search);
      setShowCard(true);
    } catch (error) {
      console.error(error);
    }
  }, 50);

  const handleCardClick = (item) => {
    setShowCard(false);
    setSelectedCard(item);
    setValue(item.title);
  };

  return (
    <>
      <label htmlFor={id}>{label}</label> <br />
      <Input
        onChange={(e) => searchInput(e.target.value)}
        type="text"
        id={id}
        name={label}
        placeholder="Enter text here"
        value={value}
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
