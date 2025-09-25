const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function parseNmapOutput(nmapOutput) {
  const lines = nmapOutput.split('\n');
  let target = '';
  let openPorts = [];

  for (const line of lines) {
    if (line.startsWith('Nmap scan report for')) {
      target = line.split('Nmap scan report for ')[1].split(' ')[0];
    }
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

// Get scan history
router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM scans ORDER BY date DESC');
  res.json(rows);
});

// Add new scan
router.post('/', async (req, res) => {
  const { id, date, vulns, nmap_output } = req.body;
  const parsed = parseNmapOutput(nmap_output);

  await pool.query(
    'INSERT INTO scans (id, target, date, vulns, open_ports, raw_output) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, parsed.target, date, vulns, parsed.open_ports, parsed.raw_output]
  );
  res.status(201).send('Scan added');
});

module.exports = router;