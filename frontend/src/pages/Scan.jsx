import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Scan() {
  const [target, setTarget] = useState('');
  const [intensity, setIntensity] = useState('low');
  const [selectedTools, setSelectedTools] = useState(['nmap']); // default tool
  const navigate = useNavigate();

  const handleScan = () => {
    // Save the scan request to local storage
    localStorage.setItem('scanRequest', JSON.stringify({
      target,
      tools: selectedTools,
      intensity
    }));

    // Send the scan request to the server
    fetch('http://localhost:5000/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target,
        tools: selectedTools,
        intensity
      })
    });

    // Navigate to the results page
    navigate('/results');
  };

  return (
    <div className="p-10">
      <div style={{color: 'red'}}>DEBUG: Scan.jsx loaded</div>
      <h1 className="text-2xl font-bold mb-4">Scan Setup</h1>
      <input
        type="text"
        value={target}
        onChange={e => setTarget(e.target.value)}
        placeholder="Target"
        className="border p-2 mb-4 w-full"
      />
      <label className="block mb-2 font-semibold">Scan Intensity:</label>
      <select
        value={intensity}
        onChange={e => setIntensity(e.target.value)}
        className="border p-2 mb-4 w-full"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="aggressive">Aggressive</option>
      </select>
      <button
        onClick={handleScan}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Start Scan
      </button>
    </div>
  );
}