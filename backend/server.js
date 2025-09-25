const express = require('express');
const { Pool } = require('pg');
const { exec } = require('child_process');
const cors = require('cors');

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
  const { target } = req.body;
  const nmapCmd = `nmap ${target}`;
  exec(nmapCmd, { timeout: 60000 }, (error, stdout, stderr) => {
    // Always return 200 OK with a result, even on error
    const output = stdout || stderr || (error && error.message) || 'Nmap scan failed.';
    const parsed = parseNmapOutput(output);
    res.json({
      results: [
        {
          tool: 'nmap',
          command: nmapCmd,
          output: parsed.raw_output,
          vulnerabilities: [],
        }
      ],
      attackPath: []
    });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));