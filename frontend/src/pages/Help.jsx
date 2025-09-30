import React, { useState } from 'react';

const BOT_RESPONSES = {
  'what is sqli': `SQL injection (SQLi) is a web security vulnerability where an attacker manipulates
  an application's SQL queries by injecting malicious input. This can allow data theft,
  modification, or even full takeover of the database if inputs are not properly handled.`,
  'how to prevent sqli': `Prevent SQL injection by using parameterized queries / prepared statements,
  input validation and output encoding, least-privilege DB accounts, and using an ORM or query builder.
  Also enable Web Application Firewall (WAF) and perform regular security testing.`,
  'what is cve score': `CVE score usually refers to the CVSS (Common Vulnerability Scoring System) score.
  CVSS gives a numeric severity (0.0 - 10.0) for vulnerabilities based on metrics like
  attack complexity, impact, authentication, and privileges required. Higher = more severe.`
};

export default function Help() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: `Hi - I'm your personal assistant. Ask me ` }
  ]);
  const [input, setInput] = useState('');
  const [nextId, setNextId] = useState(2);

  const suggested = [
    'What is SQLi',
    'How to prevent SQLi',
    'What is CVE score'
  ];

  function addMessage(from, text) {
    setMessages(prev => [...prev, { id: nextId, from, text }]);
    setNextId(n => n + 1);
  }

  function handleUserQuery(raw) {
    const text = (raw || '').trim();
    if (!text) return;
    addMessage('user', text);

    // Normalize and pick canned response
    const key = text.toLowerCase().replace(/[?!.]+$/g, '');
    // exact matches first
    let response = BOT_RESPONSES[key];
    // fuzzy checks if not exact
    if (!response) {
      if (key.includes('sqli') || key.includes('sql injection')) {
        response = BOT_RESPONSES['what is sqli'];
      } else if (key.includes('prevent') && (key.includes('sqli') || key.includes('sql injection'))) {
        response = BOT_RESPONSES['how to prevent sqli'];
      } else if (key.includes('cve') || key.includes('cvss') || key.includes('score')) {
        response = BOT_RESPONSES['what is cve score'];
      } else {
        response = `Sorry — I don't have a prebuilt answer for that. Try one of the suggested questions, or ask about SQLi or CVE/CVSS.`;
      }
    }

    // bot reply (simulate small delay)
    setTimeout(() => addMessage('bot', response), 300);
  }

  const onSubmit = (e) => {
    e && e.preventDefault();
    handleUserQuery(input);
    setInput('');
  };

  const onSuggestedClick = (q) => {
    setInput(q);
    // send immediately
    setTimeout(() => {
      handleUserQuery(q);
      setInput('');
    }, 80);
  };

  return (
    <main className="p-6 w-full">
      <h1 className="text-2xl font-bold">Help & Docs</h1>

      <div className="mt-4 bg-white border rounded p-4 space-y-4 text-sm">
        <div>
          <div className="font-semibold">Getting started</div>
          <div className="text-slate-500">Use "Scan Setup" to create a new scan. For production deployments, configure scanner hosts in Settings.</div>
        </div>

        <div>
          <div className="font-semibold">Security</div>
          <div className="text-slate-500">Only authorized users should be able to trigger scans. Respect scanning policies and law.</div>
        </div>

        <div>
          <div className="font-semibold">NMAP Intensity Levels</div>
          <ul className="list-disc ml-5">
            <li>
              <strong>Low:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs">nmap -sV [target]</pre>
            </li>
            <li>
              <strong>Medium:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs">nmap -sV -O [target]</pre>
            </li>
            <li>
              <strong>High:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs">nmap -sV -O -A [target]</pre>
            </li>
            <li>
              <strong>Aggressive:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs">nmap -sV -O -A -T4 [target]</pre>
            </li>
          </ul>
        </div>

        {/* Static Chatbot UI */}
        <div>
          <div className="font-semibold mb-2">Assistant</div>

          <div className="border rounded p-3 mb-2 max-w-xl">
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {messages.map(m => (
                <div key={m.id} className={m.from === 'bot' ? 'text-sm text-slate-800' : 'text-sm text-right text-sky-700'}>
                  <div className={m.from === 'bot' ? 'inline-block bg-slate-50 p-2 rounded' : 'inline-block bg-sky-50 p-2 rounded'}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 items-center max-w-xl">
            <input
              aria-label="Ask the assistant"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a question (e.g. What is SQLi?)"
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded text-sm">Ask</button>
          </form>

          <div className="mt-3">
            <div className="text-xs text-slate-500 mb-1">Try these:</div>
            <div className="flex gap-2">
              {suggested.map(s => (
                <button
                  key={s}
                  onClick={() => onSuggestedClick(s)}
                  className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
