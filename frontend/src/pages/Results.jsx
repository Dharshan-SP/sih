const API_URL = 'http://localhost:5000';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [attackPath, setAttackPath] = useState([]);
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scanRequest = JSON.parse(localStorage.getItem('scanRequest'));
    if (!scanRequest) return navigate('/scan');

    setTarget(scanRequest.target);

    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_URL}/api/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scanRequest),
        });
        const data = await res.json();
        setResults(data.results);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch scan results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

  if (loading) return <div className="p-10">Running scan on {target}...</div>;

  const nmapResult = Array.isArray(results)
    ? results.find(r => r.tool && r.tool.toLowerCase() === 'nmap')
    : null;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Scan Results for {target}</h1>
      <button
        onClick={() => navigate('/scan')}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Scan Setup
      </button>
      <div className="space-y-6">
        {/* Nmap Results Section */}
        {nmapResult && (
          <div className="border p-4 rounded shadow">
            <h2 className="font-bold mb-2">Nmap Scan Output</h2>
            <div className="mb-2 text-sm text-gray-700">
              <strong>Command:</strong>{' '}
              <code>{nmapResult.command}</code>
            </div>
            <pre className="bg-gray-100 p-2 rounded text-xs mb-2">
              {nmapResult.output}
            </pre>
          </div>
        )}

        {/* Other Tool Results */}
        {results.map((r, idx) => (
          r.tool.toLowerCase() !== 'nmap' && (
            <div key={idx} className="border p-4 rounded shadow">
              <h2 className="font-bold mb-2">{r.tool.toUpperCase()}</h2>
              {r.output && (
                <pre className="bg-gray-100 p-2 rounded text-xs mb-2">{r.output}</pre>
              )}
              <ul className="list-disc ml-5">
                {r.vulnerabilities.map((v, i) => (
                  <li key={i}>
                    <strong>{v.cve}</strong> | CVSS: {v.cvss} | Component: {v.component}
                    <div className="text-sm text-gray-700">{v.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          )
        ))}

        {attackPath.length > 0 && (
          <div className="border p-4 rounded shadow">
            <h2 className="font-bold mb-2">Suggested Attack Path</h2>
            <ul className="list-decimal ml-5">
              {attackPath.map((step, i) => (
                <li key={i}>
                  {step.step} (via {step.tool.toUpperCase()})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}