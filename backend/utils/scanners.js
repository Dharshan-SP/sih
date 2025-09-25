import { exec } from 'child_process';

export const runAllScanners = async (target, tools, intensity = 'low') => {
  const results = [];

  if (tools.includes('nmap')) {
    const nmapResult = await runNmap(target, intensity);
    results.push(nmapResult);
  }

  if (tools.includes('nikto')) {
    const niktoResult = await runNikto(target);
    results.push(niktoResult);
  }

  if (tools.includes('openvas')) {
    const openvasResult = await runOpenVAS(target);
    results.push(openvasResult);
  }

  return results;
};

// Run Nmap inside Docker
const runNmap = (target, intensity = 'low') => {
  let flags = '-sV'; // default

  if (intensity === 'medium') flags = '-sV -O';
  if (intensity === 'high') flags = '-sV -O -A';
  if (intensity === 'aggressive') flags = '-sV -O -A -T4';

  // Run Nmap inside the Docker tools image
  const command = `docker run --rm sih-tools nmap ${flags} ${target}`;
  return new Promise((resolve) => {
    exec(command, { timeout: 120000 }, (err, stdout, stderr) => {
      resolve({
        tool: 'nmap',
        command,
        output: stdout || stderr || (err && err.message) || 'Nmap scan failed.',
        vulnerabilities: [],
      });
    });
  });
};

// Run Nikto inside Docker
const runNikto = (target) => {
  const command = `docker run --rm sih-tools perl /usr/local/nikto/program/nikto.pl -host ${target}`;
  return new Promise((resolve) => {
    exec(command, { timeout: 120000 }, (err, stdout, stderr) => {
      resolve({
        tool: 'nikto',
        command,
        output: stdout || stderr || (err && err.message) || 'Nikto scan failed.',
        vulnerabilities: [],
      });
    });
  });
};

// Stub OpenVAS scanner (replace with API integration later)
const runOpenVAS = (target) => {
  return Promise.resolve({
    tool: 'openvas',
    vulnerabilities: [
      {
        cve: 'CVE-2021-67890',
        cvss: 9.0,
        description: 'Example OpenVAS vulnerability',
        component: 'Linux Kernel 5.10',
      },
    ],
  });
};
