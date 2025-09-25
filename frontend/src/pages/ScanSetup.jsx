import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ScanSetup() {
  const navigate = useNavigate();
  const [target, setTarget] = useState('');
  const [tools, setTools] = useState({ nmap: false, nikto: false, openvas: false });
  const [intensity, setIntensity] = useState('low');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedTools = Object.keys(tools).filter(t => tools[t]);
    if (!target || selectedTools.length === 0) return alert('Enter target and select at least one tool');

    // Store scan request in localStorage to pass to results page
    localStorage.setItem('scanRequest', JSON.stringify({ target, tools: selectedTools, intensity }));
    navigate('/results');
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Scan Setup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Target URL or IP:</label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="example.com"
          />
        </div>
        <div>
          <label className="block mb-1">Select Tools:</label>
          {['nmap', 'nikto', 'openvas'].map((tool) => (
            <label key={tool} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={tools[tool]}
                onChange={() => setTools({ ...tools, [tool]: !tools[tool] })}
                className="mr-1"
              />
              {tool.toUpperCase()}
            </label>
          ))}
        </div>
        {tools.nmap && (
          <div>
            <label className="block mb-1">Scan Intensity:</label>
            <select
              value={intensity}
              onChange={e => setIntensity(e.target.value)}
              className="border p-2 w-full rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        )}
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Run Scan
        </button>
      </form>
    </div>
  );
}
