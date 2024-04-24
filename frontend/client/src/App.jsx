import * as d3 from 'd3';
import "./App.css"
import Title from './components/Title';
import FormComponent from './components/Form';

// Global variabel
var graphData;

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



function App() {


  return (

    <div className="container" style={{ position: 'relative' }}>
      <Title
      title = "WIKIRACE"
      subtitle= "Presented By Golang Golang Kepala" />
      
      <div id="content-bottom">
        <div id="content-bottom-left">
          <FormComponent/>
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

