import React from 'react';
import './Title.css'

const Title = ({ title, subtitle }) => {
    return (
      <div className="title-container">
        <h1 className="title">{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
    );
  };
  
  export default Title;