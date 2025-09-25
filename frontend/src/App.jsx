import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ScanSetup from './pages/ScanSetup';
import Progress from './pages/Progress';
import Results from './pages/Results';
import History from './pages/History';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Help from './pages/Help';


export default function App() {
const [sidebarOpen, setSidebarOpen] = useState(true);
return (
<Router>
<div className="min-h-screen bg-slate-50 text-slate-800">
<Topbar onToggleSidebar={() => setSidebarOpen(s => !s)} />
<div className="flex">
<Sidebar open={sidebarOpen} />
<div className="flex-1">
<Routes>
<Route path="/" element={<Dashboard/>} />
<Route path="/scan" element={<ScanSetup/>} />
<Route path="/progress" element={<Progress/>} />
<Route path="/results" element={<Results/>} />
<Route path="/history" element={<History/>} />
<Route path="/reports" element={<Reports/>} />
<Route path="/settings" element={<Settings/>} />
<Route path="/help" element={<Help/>} />
</Routes>
</div>
</div>
</div>
</Router>
);
}
