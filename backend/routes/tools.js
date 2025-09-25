import express from 'express';
import { exec } from 'child_process';

const router = express.Router();

router.get('/nmap', (req, res) => {
  const target = req.query.target;
  if (!target) return res.status(400).send('Missing target');
  exec(`nmap ${target}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

router.get('/nikto', (req, res) => {
  const target = req.query.target;
  if (!target) return res.status(400).send('Missing target');
  exec(`nikto -h ${target}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

export default router;