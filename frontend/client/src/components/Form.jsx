import React from 'react';
import InputComponent from './Input';
import { useState } from 'react';

const FormComponent = () => {
    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');

    function makeLink(str) {
        const temp = str.replace(/\s+/g, '_');
        const link = "https://en.wikipedia.org/wiki/" + temp;
        return link;
      }

    async function handleSubmit() {
        const fromLink = makeLink(fromValue);
        const toLink = makeLink(toValue);
      
        const data = {
          from: fromLink,
          to: toLink,
        };
      
        console.log(data);
      
        fetch('http://localhost:8080/save-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error saving data');
          }
          console.log('Data saved successfully!');
          console.log(fromLink);
          console.log(toLink);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }

    return (
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <InputComponent
          label="From"
          id="from-field"
          value={fromValue}
          setValue={setFromValue}
        />
        <br />
        <InputComponent
          label="To"
          id="to-field"
          value={toValue}
          setValue={setToValue}
        />
        <br />
        <button type="submit">
          Find
        </button>
      </form>
    );
  };
  
  export default FormComponent;