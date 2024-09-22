// src/components/Results.js
import React from "react";

const Results = ({ results }) => (
  <div className="results">
    <h2>Uptime Results:</h2>
    <ul>
      {results.map((result) => (
        <li key={result.region}>
          <strong>{result.region}:</strong> {result.status}{" "}
          {result.responseTime !== null &&
            `(Response Time: ${result.responseTime} ms)`}
        </li>
      ))}
    </ul>
  </div>
);

export default Results;
