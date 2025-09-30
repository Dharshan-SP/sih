const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { runAllScanners } = require('../utils/scanners');
const dotenv = require('dotenv');
dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const { exec } = require('child_process');

// Parse Nmap output
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

// Function to run Recon-ng and parse output
function runReconNg(target) {
  return new Promise((resolve, reject) => {
    const command = `recon-ng -m recon/domains-hosts/brute_hosts -o SOURCE=${target}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Recon-ng error: ${stderr}`);
        return reject(error);
      }
      resolve(stdout);
    });
  });
}

// GET /api/scans → fetch scan history
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM scans ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
});
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM scans WHERE id=$1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Scan not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch scan by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch scan' });
  }
});
router.post('/', async (req, res) => {
  const { target, tools, intensity } = req.body;

  if (!target) return res.status(400).json({ error: 'Target is required' });

  try {
    const results = await runAllScanners(target, tools || ['nmap'], intensity || 'low');

    // Run Recon-ng if specified in tools
    if (tools && tools.includes('recon-ng')) {
      const reconOutput = await runReconNg(target);
      results.push({ tool: 'recon-ng', output: reconOutput });
    }

    const nmapResult = results.find(r => r.tool === 'nmap');
    let parsed = null;
    if (nmapResult) {
      parsed = parseNmapOutput(nmapResult.output);

      console.log('Parsed Nmap:', parsed); // DEBUG

      await pool.query(
        'INSERT INTO scans (target, date, vulns, open_ports, raw_output) VALUES ($1, $2, $3, $4, $5)',
        [
          parsed.target || target,       // fallback to provided target
          new Date(),                    // always provide date
          JSON.stringify([]),            // vulns as string
          parsed.open_ports || '',       // fallback empty string
          parsed.raw_output || ''
        ]
      );
    }

    res.status(201).json({ message: 'Scan completed', results, savedScan: parsed });
  } catch (error) {
    console.error('Scan POST error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
