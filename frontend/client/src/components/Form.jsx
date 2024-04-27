import React from "react";
import { InputComponent, isInputValid } from "./InputComponent";
import { useState, useEffect } from "react";
import MethodComponent from "./MethodOption";
import "./Form.css";
import * as d3 from "d3";
import graphJson from "../Graph.json";
// import { Result } from "antd";
import Result from "./Result.jsx";
export const graphData = graphJson;

// Gambar grafik multiple solution
function graph() {
  const canvas = document.getElementById("canvas");
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const svg = d3.select("#canvas").html("");

  const radius = width / (graphData.nodes.length * 20);

  // Gambar line
  const link = svg
    .append("g")
    .selectAll("line")
    .data(graphData.links)
    .enter()
    .append("line")
    .attr("stroke-width", 1)
    .style("stroke", "#c5c6c7");

  // Gambar node
  const node = svg
    .append("g")
    .selectAll("circle")
    .data(graphData.nodes)
    .enter()
    .append("circle")
    .attr("fill", (d) =>
      d.id === "from" || d.id === "to" ? "#000000" : "#c5c6c7"
    )
    .attr("r", radius);

  // Gambar text
  const nodeNameText = svg
    .append("g")
    .selectAll("text")
    .data(graphData.nodes)
    .enter()
    .append("text")
    .text((d) => d.name)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "hanging")
    .style("font-size", "12px")
    .style("fill", (d) =>
      d.id === "from" || d.id === "to" ? "#000000" : "#c5c6c7"
    );

  let zoom = d3.zoom().on("zoom", handleZoom);

  function handleZoom(e) {
    const currentTransform = e.transform;
    const radius = 5 * currentTransform.k;

    d3.selectAll("line")
      .attr("x1", (d) => currentTransform.applyX(d.source.x))
      .attr("y1", (d) => currentTransform.applyY(d.source.y))
      .attr("x2", (d) => currentTransform.applyX(d.target.x))
      .attr("y2", (d) => currentTransform.applyY(d.target.y));

    d3.selectAll("circle")
      .attr("cx", (d) => currentTransform.applyX(d.x))
      .attr("cy", (d) => currentTransform.applyY(d.y))
      .attr("r", radius);

    d3.selectAll("text")
      .attr("x", (d) => currentTransform.applyX(d.x))
      .attr("y", (d) => currentTransform.applyY(d.y) + 10)
      .style("font-size", `${12 * currentTransform.k}px`);
  }

  function initZoom() {
    d3.select("svg").call(zoom);
  }

  initZoom();

  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    nodeNameText.attr("x", (d) => d.x).attr("y", (d) => d.y + 10);
  }

  const simulation = d3
    .forceSimulation(graphData.nodes)
    .force(
      "link",
      d3.forceLink(graphData.links).id((d) => d.name)
    )
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 3))
    .on("tick", ticked);

  window.addEventListener("resize", () => {
    const newWidth = canvas.clientWidth;
    const newHeight = canvas.clientHeight;
    simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 3));
    simulation.alpha(1).restart();
  });
}

const FormComponent = ({ isLoading, setLoading }) => {
  const [selectedMethod, setSelectedMethod] = useState("bfs");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(true);

  // useEffect(() => {
  //   if (buttonEnabled) {
  //     setButtonEnabled(true);
  //     console.log("enabled")
  //   } else {
  //     setButtonEnabled(false);
  //     console.log("disabled")
  //   }
  // }, [fromValue, toValue, selectedMethod]);

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
    setButtonEnabled(false);
    console.log("button enabled: " + buttonEnabled);

    if (!isInputValid || !fromValue || !toValue || fromValue == toValue) {
      alert(
        "Input Invalid, make sure you choose the keywords from displayed card!"
      );
      return;
    }

    const data = {
      method: selectedMethod,
      from: fromLink,
      to: toLink,
    };

    fetch("http://localhost:8080/save-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        console.log("Message from server:", data.message);

        if (data.runtime) {
          console.log("Processing time:", data.runtime);
        }

        if (data.pathsFound !== undefined) {
          console.log("Number of paths found:", data.pathsFound);
        }

        if (data.message === "Data processed successfully!") {
          graph();
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      })
      .finally(() => {
        setLoading(false);
        setButtonEnabled(true);
      });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      autoComplete="off"
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
        <button className="find-button" type="submit" disabled={!buttonEnabled}>
          Find!
        </button>
      </div>
      {isDone && <Result />}
    </form>
  );
};

export default FormComponent;
