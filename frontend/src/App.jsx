// import { useEffect } from 'react';
import * as d3 from 'd3'; 
import './App.css';
const fs = require("fs")

function graph() {
  const svg = d3.select("#canvas").html(""); 
  const width = 600;
  const height = 600;

  const graphData = {
    nodes: [
      { name: "1" },
      { name: "2" },
      { name: "3" },
      { name: "4" },
      { name: "5" },
    ],
    links: [
      { source: "1", target: "2" },
      { source: "2", target: "3" },
      { source: "1", target: "4" },
      { source: "4", target: "3" },
      { source: "1", target: "5" },
      { source: "5", target: "3" },
    ],
  };

  const link = svg.append("g")
    .selectAll("line")
    .data(graphData.links)
    .enter()
    .append("line")
    .attr("stroke-width", 3)
    .style("stroke", "pink");

  const node = svg.append("g")
    .selectAll("circle")
    .data(graphData.nodes)
    .enter()
    .append("circle")
    .attr("fill", "orange")
    .style("stroke", "yellow")
    .attr("r", 5);

  const nodeNameText = svg.append("g")
    .selectAll("text")
    .data(graphData.nodes)
    .enter()
    .append("text")
    .text(d => d.name)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "hanging")
    .style("font-size", "12px")
    .style("fill", "white")
    .attr("x", d => d.x)
    .attr("y", d => d.y + 10); 

  function ticked() {
    link.attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node.attr("cx", d => d.x)
      .attr("cy", d => d.y);

    nodeNameText
      .attr("x", d => d.x)
      .attr("y", d => d.y + 10); 
  }

  d3.forceSimulation(graphData.nodes)
    .force("link", d3.forceLink(graphData.links).id(d => d.name))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 3))
    .on("tick", ticked);
}

function writeToJSON(fromLink, toink){
  
  const newDataJSON = JSON.stringify(fromValue, toValue, null, 2);
  const filePath = 'link.json';

  fs.writeFile(filePath, newDataJSON, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('File "link.json" has been updated successfully.');
    }
  });
}


function handleSubmit(){
  const fromValue = document.getElementById("from-field").value;
  const toValue = document.getElementById("to-field").value;
  const fromLink = "https://en.wikipedia.org/wiki/" + fromValue;
  const toink = "https://en.wikipedia.org/wiki/" + toValue;
  writeToJSON(fromLink, toink);
  graph();
}

function App() {
  return (
    <div className="container">
      <div id="content-top">
        <h1>WIKIRACE</h1> 
        <h2>Presented by Golang-Golang Kepala</h2>
      </div>
      <div id="content-bottom">
        <div id="content-bottom-left">
          <form action="">
            <label htmlFor="from-field">From</label> <br />
            <input type="text" id="from-field" name="From" placeholder="Enter text here" /><br />
            <label htmlFor="to-field">To</label> <br />
            <input type="text" id="to-field" name="To" placeholder="Enter text here" /> <br />
            <button type="button" onClick={handleSubmit}>Find</button>
          </form>
        </div>
        <div id="content-bottom-right">
          <div id="canvas-container">
            <svg width="600px" height="400px" id="canvas"></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
