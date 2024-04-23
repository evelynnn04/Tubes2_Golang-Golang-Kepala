import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Card } from 'antd';
import debounce from 'lodash/debounce';
import * as d3 from 'd3';

function graph() {
  const svg = d3.select('#canvas').html('');
  const width = 600;
  const height = 600;

  const graphData = {
    nodes: [
      { name: '1' },
      { name: '2' },
      { name: '3' },
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

  const link = svg
    .append('g')
    .selectAll('line')
    .data(graphData.links)
    .enter()
    .append('line')
    .attr('stroke-width', 3)
    .style('stroke', 'pink');

  const node = svg
    .append('g')
    .selectAll('circle')
    .data(graphData.nodes)
    .enter()
    .append('circle')
    .attr('fill', 'orange')
    .style('stroke', 'yellow')
    .attr('r', 5);

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
    .style('fill', 'white')
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y + 10);

  function ticked() {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

    nodeNameText.attr('x', (d) => d.x).attr('y', (d) => d.y + 10);
  }

  d3.forceSimulation(graphData.nodes)
    .force('link', d3.forceLink(graphData.links).id((d) => d.name))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 3))
    .on('tick', ticked);
}

async function handleSubmit() {
  const fromValue = document.getElementById('from-field').value;
  const toValue = document.getElementById('to-field').value;
  const fromLink = 'https://en.wikipedia.org/wiki/' + fromValue;
  const toLink = 'https://en.wikipedia.org/wiki/' + toValue;

  const data = {
    from: fromLink,
    to: toLink,
  };

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
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  graph();
}

function makeLink(str) {
  // const temp1 = str.replace(/\b\w/g, (char) => char.toUpperCase());
  const temp2 = str.replace(/\s+/g, '_');
  const link = "https://en.wikipedia.org/wiki/" + temp2;
  return link;
}

function App() {
  const [inputMatch, setInputMatch] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    loadInput();
  }, []);

  const loadInput = async () => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&list=search&srsearch=`
      );
      console.log(response.status);
      console.log('Response data:', response.data);
      setInputMatch(response.data.query);
    } catch (error) {
      console.error(error);
    }
  };

  const searchInput = debounce(async (text) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&list=search&srsearch=${text}`
      );
      setInputMatch(response.data.query.search);
      console.log(response.status);
    } catch (error) {
      console.error(error);
    }
  }, 50);

  const handleCardClick = (item) => {
    setSelectedCard(item);
    if (item) {
      console.log('Selected card:', item);
      console.log("actual: " + item.link);
      const itemSelected = makeLink(item.title);
      console.log("selected: " + itemSelected);
    } else {
      console.log('No card selected');
    }
  };
  
  return (
    <div className="container">
      <div id="content-top">
        <h1>WIKIRACE</h1>
        <h2>Presented by Golang-Golang Kepala</h2>
      </div>
      <div id="content-bottom">
        <div id="content-bottom-left">
          <form>
            <label htmlFor="from-field">From</label> <br />
            <Input
              onChange={(e) => searchInput(e.target.value)}
              type="text"
              id="from-field"
              name="From"
              placeholder="Enter text here"
            />
              {inputMatch &&
                inputMatch.map((item, index) => (
                  <div key={index}>
                    {selectedCard === item ? (
                      <Card disabled>{item.title}</Card>
                    ) : (
                      <Card onClick={() => handleCardClick(item)}>{item.title}</Card>
                    )}
                  </div>
                ))}
            <br />
            <label htmlFor="to-field">From</label> <br />
            <Input
              onChange={(e) => searchInput(e.target.value)}
              type="text"
              id="to-field"
              name="From"
              placeholder="Enter text here"
            />
              {inputMatch &&
                inputMatch.map((item, index) => (
                  <div key={index}>
                    {selectedCard === item ? (
                      <Card disabled>{item.title}</Card>
                    ) : (
                      <Card onClick={() => handleCardClick(item)}>{item.title}</Card>
                    )}
                  </div>
                ))}
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
