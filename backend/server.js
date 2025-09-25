const express = require('express');
const { Pool } = require('pg');
const { exec } = require('child_process');
const cors = require('cors');
const { runAllScanners } = require('./utils/scanners'); // Add this import

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: 'sp', // your PostgreSQL username
  host: 'localhost',
  database: 'sihdb',
  port: 5432,
});

// Get scan history
app.get('/api/scans', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM scans ORDER BY date DESC');
  res.json(rows);
});

function parseNmapOutput(nmapOutput) {
  const lines = nmapOutput.split('\n');
  let target = '';
  let openPorts = [];

  for (const line of lines) {
    if (line.startsWith('Nmap scan report for')) {
      target = line.split('Nmap scan report for ')[1].split(' ')[0];
    }
    // Example: "5000/tcp open  http    Node.js Express framework"
    const portMatch = line.match(/^(\d+)\/tcp\s+open\s+(\w+)/);
    if (portMatch) {
      openPorts.push(portMatch[1]);
    }
  }

  return {
    target,
    open_ports: openPorts.join(','),
    raw_output: nmapOutput
  };
}

// Nmap scan endpoint
app.post('/api/scan', async (req, res) => {
  const { target, tools, intensity } = req.body;
  try {
    const results = await runAllScanners(target, tools || ['nmap'], intensity || 'low');
    res.json({ results, attackPath: [] });
  } catch (error) {
    res.json({
      results: [
        {
          tool: 'nmap',
          command: '',
          output: error.message || 'Scan failed.',
          vulnerabilities: [],
        }
      ],
      attackPath: []
    });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));