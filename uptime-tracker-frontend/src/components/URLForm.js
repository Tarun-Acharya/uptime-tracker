// src/components/URLForm.js
import React, { useState } from "react";
import axios from "axios";

const URLForm = ({ setResults, setLoading }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://your-backend-api.com/check", {
        url,
      });
      setResults(response.data);
    } catch (error) {
      console.error(error);
      alert("Error checking uptime. Please try again.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL"
        required
      />
      <button type="submit">Check Uptime</button>
    </form>
  );
};

export default URLForm;
