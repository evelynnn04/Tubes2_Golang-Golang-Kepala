import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Card } from 'antd';
import debounce from 'lodash/debounce';
import * as d3 from 'd3';
import "./App.css"

// Global variabel
var fromLink, toLink, graphData;

// Gambar grafik multiple solution
function graph() {
  const canvas = document.getElementById('canvas');
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const svg = d3.select('#canvas').html('');
  
  // Dummy buat ngetes doang
  graphData = {
    nodes: [
      { name: '1', id: "from" },
      { name: '2' },
      { name: '3', id: "to" },
      { name: '4' },
      { name: '5' },
    ],
    links: [
      { source: '1', target: '2' },
      { source: '2', target: '3' },
      { source: '1', target: '4' },
      { source: '4', target: '3' },
      { source: '1', target: '5' },
      { source: '5', target: '3' },
    ],
  };

  const radius = width / (graphData.nodes.length * 20);

  // Gambar line
  const link = svg
    .append('g')
    .selectAll('line')
    .data(graphData.links)
    .enter()
    .append('line')
    .attr('stroke-width', 1)
    .style('stroke', '#c5c6c7');

  // Gambar node
  const node = svg
    .append('g')
    .selectAll('circle')
    .data(graphData.nodes)
    .enter()
    .append('circle')
    .attr('fill', (d) => (d.id === 'from' || d.id === 'to' ? '#66FCF1' : '#c5c6c7'))
    .attr('r', radius);

  // Gambar text
  const nodeNameText = svg
    .append('g')
    .selectAll('text')
    .data(graphData.nodes)
    .enter()
    .append('text')
    .text((d) => d.name)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'hanging')
    .style('font-size', '12px')
    .style('fill', 'white');

  function ticked() {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

    nodeNameText.attr('x', (d) => d.x).attr('y', (d) => d.y + 10);
  }

  const simulation = d3.forceSimulation(graphData.nodes)
    .force('link', d3.forceLink(graphData.links).id((d) => d.name))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 3))
    .on('tick', ticked);

  // Update simulation forces when the window is resized
  window.addEventListener('resize', () => {
    const newWidth = canvas.clientWidth;
    const newHeight = canvas.clientHeight;
    simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 3));
    simulation.alpha(1).restart(); // Restart simulation to apply changes
  });
}


async function handleSubmit() {
  
  const data = {
    from: fromLink,
    to: toLink,
  };

  console.log(data);

  fetch('/save-data', {
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
  graph();
}

// Convert title jadi link
function makeLink(str) {
  const temp = str.replace(/\s+/g, '_');
  const link = "https://en.wikipedia.org/wiki/" + temp;
  return link;
}

// Tambahin div loading 


function App() {
  const [fromInputMatch, setFromInputMatch] = useState([]);
  const [toInputMatch, setToInputMatch] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardTo, setShowCardTo] = useState(true);
  const [showCardFrom, setShowCardFrom] = useState(true);
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);

  useEffect(() => {
    loadInputFrom();
    loadInputTo();
  }, []);

  const loadInputFrom = async () => {
    console.log(showCardFrom);
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&list=search&srsearch=`
      );
      setFromInputMatch(response.data.query);
    } catch (error) {
      console.error(error);
    }
  };

  const searchInputFrom = debounce(async (text) => {
    setFromValue(text);
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&list=search&srsearch=${text}`
      );
      setFromInputMatch(response.data.query.search);
      setShowCardFrom(true);
    } catch (error) {
      console.error(error);
    }
  }, 50);

  const loadInputTo = async () => {
    console.log(showCardTo);
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&list=search&srsearch=`
      );
      setToInputMatch(response.data.query);
    } catch (error) {
      console.error(error);
    }
  };

  const searchInputTo = debounce(async (text) => {
    setToValue(text);
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&list=search&srsearch=${text}`
      );
      setToInputMatch(response.data.query.search);
      setShowCardTo(true);
    } catch (error) {
      console.error(error);
    }
  }, 50);

  const handleCardClickFrom = (item) => {
    setShowCardFrom(false);
    setSelectedCard(item);
    fromLink = makeLink(item.title);
    setFromValue(item.title);
    console.log(fromLink);
  };

  const handleCardClickTo = (item) => {
    setShowCardTo(false);
    setSelectedCard(item);
    toLink = makeLink(item.title);
    setToValue(item.title);
    console.log(toLink);
  };

  return (

    <div className="container" style={{ position: 'relative' }}>
      <div id="content-top">
        <h1>WIKIRACE</h1>
        <h2>Presented by Golang-Golang Kepala</h2>
      </div>
      <div id="content-bottom">
        <div id="content-bottom-left">
          <form>
            <label htmlFor="from-field">From</label> <br />
            <Input
              onChange={(e) => searchInputFrom(e.target.value)}
              type="text"
              id="from-field"
              name="From"
              placeholder="Enter text here"
              value= {fromValue}
            />
            <div>
              {showCardFrom &&
                fromInputMatch &&
                  fromInputMatch.slice(0, 3).map((item, index) => (
                    <div key={index} style={{width: '80%'}}>
                      {selectedCard === item ? (
                        <Card>{item.title}</Card>
                      ) : (
                        <Card id="cardFrom" onClick={() => handleCardClickFrom(item)}>{item.title}</Card>
                      )}
                    </div>
                  ))
               }
            </div>
            <br />
            <label htmlFor="to-field">To</label> <br />
            <Input
              onChange={(e) => searchInputTo(e.target.value)}
              type="text"
              id="to-field"
              name="To"
              placeholder="Enter text here"
              value= {toValue}
            />
            <div>
              {showCardTo &&
                toInputMatch &&
                  toInputMatch.slice(0, 3).map((item, index) => (
                    <div key={index} style={{width: '80%'}}>
                      {selectedCard === item ? (
                        <Card>{item.title}</Card>
                      ) : (
                        <Card id="cardTo" onClick={() => handleCardClickTo(item)}>{item.title}</Card>
                      )}
                    </div>
                  ))
               }
            </div>
            <br />
            <button type="button" onClick={handleSubmit}>
              Find
            </button>
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

