import React from "react";
import "./MethodOption.css";

const MethodComponent = ({ labelId, selectId, options, onMethodChange }) => {
  return (
    <div className="method-container">
      <label id={labelId}>Method</label>
      <select id={selectId} onChange={(e) => onMethodChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MethodComponent;
