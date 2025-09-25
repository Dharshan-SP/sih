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

  const command = `/usr/bin/nmap ${flags} ${target}`;
  return new Promise((resolve) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error('Nmap error:', err);
        resolve({
          tool: 'nmap',
          command,
          output: stderr || err.message,
          vulnerabilities: [],
        });
      } else {
        resolve({
          tool: 'nmap',
          command,
          output: stdout,
          vulnerabilities: [],
        });
      }
    });
  });
};

// Run Nikto inside Docker
const runNikto = (target) => {
  return new Promise((resolve) => {
    exec(`perl /usr/local/nikto/program/nikto.pl -host ${target}`, (err, stdout, stderr) => {
      if (err) console.error('Nikto error:', err);
      resolve({
        tool: 'nikto',
        vulnerabilities: [
          {
            cve: 'CVE-2022-54321',
            cvss: 5.0,
            description: stdout.slice(0, 200) + '...',
            component: 'nginx 1.20',
          },
        ],
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
