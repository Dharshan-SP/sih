const handleScan = () => {
  fetch('http://localhost:5000/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      target: targetValue,
      tools: selectedTools,
      intensity: selectedIntensity // Make sure this is set!
    })
  })
    .then(res => res.json())
    .then(data => {
      // handle results, e.g., navigate to results page or display them
      console.log(data);
    });
};import { runAllScanners } from '../utils/scanners.js';

export const runScan = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Empty request body' });
    }

    const { target, tools, intensity } = req.body;

    if (!target) return res.status(400).json({ error: 'Target is required' });

    // Run all requested scanners
    const results = await runAllScanners(target, tools || [], intensity || 'low');

    // Aggregate vulnerabilities for attack path generation
    const aggregatedVulns = results.flatMap((r) =>
      r.vulnerabilities.map((v) => ({
        ...v,
        tool: r.tool
      }))
    );

    // Simple attack path stub: chain vulnerabilities with CVSS >= 7
    const attackPath = aggregatedVulns
      .filter(v => v.cvss >= 7)
      .map(v => ({
        step: `Exploit ${v.cve} in ${v.component}`,
        tool: v.tool,
      }));

    res.json({
      target,
      intensity, // Add this line
      results,
      attackPath
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Scan failed', details: err.message });
  }
};
