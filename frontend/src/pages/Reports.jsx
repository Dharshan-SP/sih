import React, { useState } from 'react';
export default function Reports(){
const [title, setTitle] = useState('Weekly Vulnerability Report');
const [includeDetails, setIncludeDetails] = useState(true);
function generate(){
alert('Report generation stub - call backend to produce PDF/JSON');
}
return (
<main className="p-6 w-full">
<h1 className="text-2xl font-bold">Generate Report</h1>
<div className="mt-4 bg-white border rounded p-4">
<label className="block"><div className="text-sm text-slate-500">Title</div><input value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" /></label>
<label className="flex items-center gap-2 mt-3"><input type="checkbox" checked={includeDetails} onChange={e=>setIncludeDetails(e.target.checked)} /> Include detailed findings</label>
<div className="mt-4"><button onClick={generate} className="px-4 py-2 bg-slate-800 text-white rounded">Generate</button></div>
</div>
</main>
);
}