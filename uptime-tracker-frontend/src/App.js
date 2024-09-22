// src/App.js
import React, { useState } from "react";
import Header from "./components/Header";
import URLForm from "./components/URLForm";
import Results from "./components/Results";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="App">
      <Header />
      <URLForm setResults={setResults} setLoading={setLoading} />
      {loading && <p>Checking uptime...</p>}
      {results && <Results results={results} />}
      <Footer />
    </div>
  );
}

export default App;
