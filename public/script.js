function clickFunction() {

    graph();
    const fromValue = document.getElementById("from-field").value;
    const toValue = document.getElementById("to-field").value;
    const fromLink = "https://en.m.wikipedia.org/wiki/" + fromValue;
    const toLink = "https://en.m.wikipedia.org/wiki/" + toValue;
  
    const data = {
      from: fromLink,
      to: toLink,
    };


    fetch('/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error saving data');
        }
        console.log('Data saved successfully!'); 
      })
      .catch(error => {
        console.error('Error:', error); 
      });
  }
  
  function graph() {
    const svg = d3.select("svg");
    const width = svg.attr("width");
    const height = svg.attr("height");
  
    const graphData = {
      nodes: [
        { name: "1" },
        { name: "2" },
        { name: "3" },
      ],
      links: [
        { source: "1", target: "2" },
        { source: "2", target: "3" },
      ],
    };
  
    var simulation = d3
      .forceSimulation(graph.nodes)
      .force(
        "link",
        d3.forceLink(graph.links).id(function(d){
            return d.name;
        })
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);
  
    const link = svg
      .append("g")
      .selectAll("line")
      .data(graphData.links)
      .enter()
      .append("line")
      .attr("stroke-width", 3)
      .style("stroke", "pink");
  
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(graphData.nodes)
      .enter()
      .append("circle")
      .attr("fill", "orange") 
      .style("stroke", "yellow")
      .attr("r", 5); 
  
    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.source.x)
        .attr("y2", d => d.source.y);
  
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }
  }