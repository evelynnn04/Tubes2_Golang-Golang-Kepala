import React from "react";
import "./Title.css";

const Title = ({ title, subtitle }) => {
  return (
    <div className="title-container">
      <h1 className="title">WIKIRACE</h1>
      <p className="subtitle">Presented By Golang Golang Kepala</p>
    </div>
  );
};

export default Title;
