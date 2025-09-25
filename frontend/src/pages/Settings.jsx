import React from 'react';
export default function Settings(){
return (
<main className="p-6 w-full">
<h1 className="text-2xl font-bold">Settings</h1>
<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="p-4 bg-white border rounded">
<h3 className="font-semibold">Scanner Hosts</h3>
<p className="text-sm text-slate-500 mt-2">Configure scanner workers (Docker host, API keys for Nessus etc.)</p>
</div>
<div className="p-4 bg-white border rounded">
<h3 className="font-semibold">Auth & Users</h3>
<p className="text-sm text-slate-500 mt-2">Enable SSO, API token management and RBAC.</p>
</div>
</div>
</main>
);
}