import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch scan history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/api/scans`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch scans:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="p-6">Loading scan history...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <main className="p-6 w-full">
      <h1 className="text-2xl font-bold">Scan History</h1>
      <div className="mt-4 bg-white border rounded p-4 overflow-x-auto">
        {items.length === 0 ? (
          <div className="text-gray-500">No scans found.</div>
        ) : (
          <table className="w-full text-sm table-auto">
            <thead className="text-left text-slate-500 border-b">
              <tr>
                <th className="px-2 py-1">Scan ID</th>
                <th className="px-2 py-1">Target</th>
                <th className="px-2 py-1">Date</th>
                <th className="px-2 py-1">Findings</th>
                <th className="px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-1">{i.id}</td>
                  <td className="px-2 py-1">{i.target}</td>
                  <td className="px-2 py-1">{new Date(i.date).toLocaleString()}</td>
                  <td className="px-2 py-1">
                    {i.vulns
                      ? (() => {
                          try {
                            const vulns = JSON.parse(i.vulns);
                            return vulns.length > 0 ? vulns.join(', ') : '-';
                          } catch {
                            return i.vulns;
                          }
                        })()
                      : '-'}
                  </td>
                  <td className="px-2 py-1">
                    <Link to={`/results/${i.id}`} className="text-sky-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
