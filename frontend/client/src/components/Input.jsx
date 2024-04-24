import React from "react";
import { Input, Card } from "antd";
import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import axios from "axios";
import "./Input.css";

const InputComponent = ({ label, id, value, setValue }) => {
  const [showCard, setShowCard] = useState(true);
  const [inputMatch, setInputMatch] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    loadInput();
  }, []);

  const loadInput = async () => {
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

  const searchInput = debounce(async (text) => {
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
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <input
        onChange={(e) => searchInput(e.target.value)}
        type="text"
        id={id}
        name={label}
        placeholder="Enter text here"
        value={value}
        className="input-box"
      />
      <div className="input-container">
        {showCard &&
          inputMatch &&
          inputMatch.slice(0, 3).map((item, index, array) => (
            <div
              key={index}
              className={`suggestion-card ${
                index === array.length - 1 ? "last-suggestion" : ""
              }`}
              onClick={() => handleCardClick(item)}
            >
              {item.title}
            </div>
          ))}
      </div>
    </>
  );
};

export default InputComponent;
