import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

export default function Results() {
  const { id } = useParams(); // if present, view saved scan by id
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For live-scan POST flow:
  const [results, setResults] = useState([]);       // array of tool results (nmap, nikto...)
  const [attackPath, setAttackPath] = useState([]); // suggested attack path from server
  const [target, setTarget] = useState('');         // target being scanned

  // For saved-scan GET/:id flow:
  const [savedScan, setSavedScan] = useState(null); // single DB row

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      // If id is present → fetch saved scan from DB
      if (id) {
        try {
          const res = await fetch(`${API_URL}/api/scans/${id}`);
          if (!res.ok) throw new Error(`Server returned ${res.status}`);
          const data = await res.json();
          setSavedScan(data);
        } catch (err) {
          console.error('Failed to fetch saved scan:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
        return;
      }

      // No id → attempt live scan using scanRequest from localStorage
      const scanRequest = (() => {
        try {
          return JSON.parse(localStorage.getItem('scanRequest'));
        } catch {
          return null;
        }
      })();

      if (!scanRequest) {
        // No stored request → navigate back to scan setup
        navigate('/scan');
        return;
      }

      setTarget(scanRequest.target || '');

      try {
        const res = await fetch(`${API_URL}/api/scans`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scanRequest),
        });

        if (!res.ok) {
          // try to parse server error JSON for more detail
          let msg = `Server returned ${res.status}`;
          try {
            const errBody = await res.json();
            msg = errBody.error || msg;
          } catch {}
          throw new Error(msg);
        }

        const data = await res.json();
        // If backend used the multi-tool format: { results: [...], attackPath: [...] }
        setResults(Array.isArray(data.results) ? data.results : []);
        setAttackPath(Array.isArray(data.attackPath) ? data.attackPath : []);
      } catch (err) {
        console.error('Live scan failed:', err);
        setError(err.message || 'Scan failed');
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  if (loading) return <div className="p-10">Loading... {id ? '' : `Running scan on ${target || ''}`} </div>;
  if (error) return <div className="p-10 text-red-600">Error: {error}</div>;

  // Helper: render a single tool result block
  const ToolBlock = ({ r }) => (
    <div className="border p-4 rounded shadow mb-4">
      <h2 className="font-bold mb-2">{(r.tool || 'TOOL').toUpperCase()}</h2>
      {r.command && (
        <div className="mb-2 text-sm text-gray-700">
          <strong>Command:</strong> <code>{r.command}</code>
        </div>
      )}
      {r.output && (
        <pre className="bg-gray-100 p-2 rounded text-xs mb-2 whitespace-pre-wrap break-words">{r.output}</pre>
      )}
      {Array.isArray(r.vulnerabilities) && r.vulnerabilities.length > 0 && (
        <ul className="list-disc ml-5">
          {r.vulnerabilities.map((v, i) => (
            <li key={i}>
              <strong>{v.cve}</strong> | CVSS: {v.cvss} | Component: {v.component}
              <div className="text-sm text-gray-700">{v.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // If viewing saved scan (DB row)
  if (savedScan) {
    // savedScan fields based on your DB: id, target, date, vulns (text), open_ports, raw_output
    const parsedVulns = (() => {
      if (!savedScan.vulns) return [];
      try { return JSON.parse(savedScan.vulns); } catch { return [savedScan.vulns]; }
    })();

    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Saved Scan #{savedScan.id} — {savedScan.target}</h1>
        <button
          onClick={() => navigate('/history')}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to History
        </button>

        <div className="space-y-6">
          <div className="border p-4 rounded shadow">
            <h2 className="font-bold mb-2">Nmap Raw Output</h2>
            <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">{savedScan.raw_output}</pre>
            <div className="mt-2"><strong>Open Ports:</strong> {savedScan.open_ports || '-'}</div>
            <div className="mt-1"><strong>Date:</strong> {new Date(savedScan.date).toLocaleString()}</div>
          </div>

          <div className="border p-4 rounded shadow">
            <h2 className="font-bold mb-2">Parsed Vulnerabilities</h2>
            {parsedVulns.length === 0 ? (
              <div className="text-gray-500">No vulnerabilities recorded.</div>
            ) : (
              <ul className="list-disc ml-5">
                {parsedVulns.map((v, i) => <li key={i}>{typeof v === 'string' ? v : JSON.stringify(v)}</li>)}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise render live scan results (array of tool outputs)
  const nmapResult = results.find(r => r.tool?.toLowerCase() === 'nmap');

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
        {/* Nmap */}
        {nmapResult && <ToolBlock r={nmapResult} />}

        {/* Other tools */}
        {results.filter(r => r.tool?.toLowerCase() !== 'nmap').map((r, i) => (
          <ToolBlock key={i} r={r} />
        ))}

        {/* Attack path */}
        {Array.isArray(attackPath) && attackPath.length > 0 && (
          <div className="border p-4 rounded shadow">
            <h2 className="font-bold mb-2">Suggested Attack Path</h2>
            <ol className="list-decimal ml-5">
              {attackPath.map((step, i) => <li key={i}>{step.step || JSON.stringify(step)}</li>)}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
