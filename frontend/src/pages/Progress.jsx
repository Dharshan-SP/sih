import React, { useEffect, useState } from 'react';

export default function Progress() {
    const [logs, setLogs] = useState(["Initializing scan..."]);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        const t = setInterval(() => {
            setPercent(p => Math.min(100, p + Math.floor(Math.random() * 10)));
            setLogs(l => [...l, `Step ${l.length}: running check ${Math.floor(Math.random() * 100)}`]);
        }, 1200);

        const q = setTimeout(() => {
            clearInterval(t);
            setLogs(l => [...l, 'Scan complete. Results available.']);
            setPercent(100);

            // Save scan result to backend
            const scan = {
                id: `scan_${Date.now()}`,
                target: 'example.com', // Replace with actual target if available
                date: new Date().toISOString().slice(0, 10),
                vulns: Math.floor(Math.random() * 10) + 1 // Simulate findings
            };
            fetch('http://localhost:5000/api/scans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scan)
            });
        }, 1200 * 8);

        return () => { clearInterval(t); clearTimeout(q); };
    }, []);

    return (
        <main className="p-6 w-full">
            <h1 className="text-2xl font-bold">Scan Progress</h1>
            <p className="text-sm text-slate-500">Live view of currently running scan.</p>
            <div className="mt-4 p-4 bg-white rounded border">
                <div className="w-full bg-gray-100 rounded h-3 overflow-hidden">
                    <div style={{ width: `${percent}%` }} className="h-3 bg-slate-800 transition-all" />
                </div>
                <div className="mt-3 h-48 overflow-auto bg-black text-green-300 p-3 font-mono text-xs rounded">
                    {logs.map((l, i) => <div key={i}>{l}</div>)}
                </div>
            </div>
        </main>
    );
}