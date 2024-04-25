import React from "react";
import { useState } from "react";
import InputComponent from "./InputComponent";
import MethodComponent from "./MethodOption";
import "./Form.css";

const FormComponent = () => {
  const [selectedMethod, setSelectedMethod] = useState("bfs");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");

  const methodOptions = [
    { value: "bfs", text: "BFS" },
    { value: "ids", text: "IDS" },
  ];

  function makeLink(str) {
    const temp = str.replace(/\s+/g, "_");
    const link = "https://en.wikipedia.org/wiki/" + temp;
    return link;
  }

  async function handleSubmit() {
    const fromLink = makeLink(fromValue);
    const toLink = makeLink(toValue);

    const data = {
      method: selectedMethod,
      from: fromLink,
      to: toLink,
    };

    console.log(data);

    fetch("http://localhost:8080/save-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error saving data");
        }
        console.log("Data saved successfully!");
        console.log(fromLink);
        console.log(toLink);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      autocomplete="off"
    >
      <div className="container">
        <div className="top">
          <MethodComponent
            labelId="methodOption"
            selectId="method"
            options={methodOptions}
            onMethodChange={setSelectedMethod}
            className="method-select"
          />
        </div>
        <div className="bottom">
          <InputComponent
            label="From"
            id="from-field"
            value={fromValue}
            setValue={setFromValue}
            autoComplete="off"
            className="input-box"
          />
          <InputComponent
            label="To"
            id="to-field"
            value={toValue}
            setValue={setToValue}
            autoComplete="off"
            className="input-box"
          />
        </div>
        <br />
        <button className="find-button" type="submit">
          Find!
        </button>
      </div>
    </form>
  );
};

export default FormComponent;
