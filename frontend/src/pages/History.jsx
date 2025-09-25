import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function History() {
  const [items, setItems] = useState([]);

  // Fetch history from backend
  useEffect(() => {
    fetch('/api/scans')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  // Add a scan to history (call this after a scan)
  const addScan = async (scan) => {
    await fetch('/api/scans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scan)
    });
    setItems([scan, ...items]);
  };

  return (
    <main className="p-6 w-full">
      <h1 className="text-2xl font-bold">Scan History</h1>
      <div className="mt-4 bg-white border rounded p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th>Scan ID</th>
              <th>Target</th>
              <th>Date</th>
              <th>Findings</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id} className="border-t">
                <td>{i.id}</td>
                <td>{i.target}</td>
                <td>{i.date}</td>
                <td>{i.vulns}</td>
                <td>
                  <Link to="/results" className="text-sky-600">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}