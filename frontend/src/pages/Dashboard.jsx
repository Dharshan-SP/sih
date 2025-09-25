import React from 'react';
import { Link } from 'react-router-dom';
export default function Dashboard(){
const metrics = [
{ title: "Active Targets", value: 7 },
{ title: "Open Vulnerabilities", value: 24 },
{ title: "Critical", value: 3 },
{ title: "Last Scan", value: "2025-09-17 10:38" }
];
return (
<main className="p-6 w-full">
<div className="flex items-center justify-between">
<div>
<h1 className="text-2xl font-bold">Dashboard</h1>
<p className="text-sm text-slate-500">At-a-glance view of your scan environment</p>
</div>
<div>
<Link to="/scan" className="px-4 py-2 bg-slate-800 text-white rounded">New Scan</Link>
</div>
</div>


<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
{metrics.map((m) => (
<div key={m.title} className="p-4 bg-white rounded shadow-sm border">
<div className="text-sm text-slate-500">{m.title}</div>
<div className="text-2xl font-semibold">{m.value}</div>
</div>
))}
</div>


<section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
<div className="col-span-2 p-4 bg-white rounded border shadow-sm">
<h3 className="font-semibold">Recent Scans</h3>
<table className="mt-3 w-full text-sm">
<thead className="text-left text-slate-500">
<tr><th>Target</th><th>Type</th><th>Vulns</th><th>Time</th><th></th></tr>
</thead>
<tbody>
<tr className="border-t"><td>example.com</td><td>Nmap + Nuclei</td><td>8</td><td>2025-09-17</td><td><Link to="/results" className="text-sky-600">View</Link></td></tr>
<tr className="border-t"><td>api.test.local</td><td>Nikto</td><td>1</td><td>2025-09-16</td><td><Link to="/results" className="text-sky-600">View</Link></td></tr>
</tbody>
</table>
</div>


<div className="p-4 bg-white rounded border shadow-sm">
<h3 className="font-semibold">Quick Actions</h3>
<div className="mt-3 space-y-2">
<Link to="/scan" className="block px-3 py-2 border rounded">Start new scan</Link>
<Link to="/history" className="block px-3 py-2 border rounded">View scan history</Link>
<Link to="/reports" className="block px-3 py-2 border rounded">Generate report</Link>
</div>
</div>
</section>
</main>
);
}