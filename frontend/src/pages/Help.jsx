import React from 'react';
export default function Help(){
return (
<main className="p-6 w-full">
<h1 className="text-2xl font-bold">Help & Docs</h1>
<div className="mt-4 bg-white border rounded p-4 space-y-4 text-sm">
<div>
<div className="font-semibold">Getting started</div>
<div className="text-slate-500">Use "Scan Setup" to create a new scan. For production deployments, configure scanner hosts in Settings.</div>
</div>
<div>
<div className="font-semibold">Security</div>
<div className="text-slate-500">Only authorized users should be able to trigger scans. Respect scanning policies and law.</div>
</div>
<div>
<div className="font-semibold">NMAP Intensity Levels</div>
<ul className="list-disc ml-5">
<li>
<strong>Low:</strong>
<pre className="bg-gray-100 p-2 rounded text-xs">nmap -sV [target]</pre>
</li>
<li>
<strong>Medium:</strong>
<pre className="bg-gray-100 p-2 rounded text-xs">nmap -sV -O [target]</pre>
</li>
<li>
<strong>High:</strong>
<pre className="bg-gray-100 p-2 rounded text-xs">nmap -sV -O -A [target]</pre>
</li>
<li>
<strong>Aggressive:</strong>
<pre className="bg-gray-100 p-2 rounded text-xs">nmap -sV -O -A -T4 [target]</pre>
</li>
</ul>
</div>
</div>
</main>
);
}