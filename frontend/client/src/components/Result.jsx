// import React from "react";
import "./Result.css";
import graphJson from '../Graph.json';

export const graphData = graphJson;

const Result = () => {
  const runtime = graphData.details[0].runtime;
  const result = graphData.details[1].totalpath;

  return (
    <div className="Result">
      <p>Runtime : {runtime} Result: {result}</p>
    </div>
  );
};

export default Result; 
