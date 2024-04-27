// DisplayGraph.jsx
import * as d3 from "d3";
import graphJson from '../Graph.json';
export const graphData = graphJson;

export function graph() {
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
      )
  
    let zoom = d3.zoom()
    .on('zoom', handleZoom);
  
    function handleZoom(e) {
      const currentTransform = e.transform;
      const radius = 5 * currentTransform.k;
    
      d3.selectAll('line')
        .attr('x1', (d) => currentTransform.applyX(d.source.x))
        .attr('y1', (d) => currentTransform.applyY(d.source.y))
        .attr('x2', (d) => currentTransform.applyX(d.target.x))
        .attr('y2', (d) => currentTransform.applyY(d.target.y));
    
      d3.selectAll('circle')
        .attr('cx', (d) => currentTransform.applyX(d.x))
        .attr('cy', (d) => currentTransform.applyY(d.y))
        .attr('r', radius);
    
      d3.selectAll('text')
        .attr('x', (d) => currentTransform.applyX(d.x))
        .attr('y', (d) => currentTransform.applyY(d.y) + 10)
        .style('font-size', `${12 * currentTransform.k}px`); 
    }
      
    function initZoom() {
      d3.select('svg')
        .call(zoom);
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