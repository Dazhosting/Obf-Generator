import { useState } from 'react';

export default function Home() {
  const [code, setCode] = useState('');
  const [obfuscated, setObfuscated] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleObfuscate = async () => {
    setLoading(true);
    setError('');
    setObfuscated('');
    setCopied(false);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const data = await res.json();

      if (res.ok) {
        setObfuscated(data.obfuscated);
      } else {
        setError(data.error || 'Obfuscation failed');
      }
    } catch (err) {
      setError('Request failed');
    }

    setLoading(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(obfuscated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setObfuscated('');
    setError('');
    setCopied(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20, fontFamily: 'Segoe UI, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🛡️ JavaScript Obfuscator</h1>

      <textarea
        rows={10}
        placeholder="Tulis kode JavaScript di sini..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          border: '1px solid #ccc',
          borderRadius: 8,
          fontFamily: 'monospace',
          fontSize: 14,
          background: '#f9f9f9'
        }}
      />

      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <button
          onClick={handleObfuscate}
          disabled={loading || !code}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          {loading ? 'Memproses...' : 'Obfuscate'}
        </button>

        <button
          onClick={handleClear}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e53e3e',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>

      {error && <p style={{ color: 'red', marginTop: 10 }}>❌ {error}</p>}

      {obfuscated && (
        <div style={{ marginTop: 30 }}>
          <h2>✅ Hasil Obfuscation:</h2>
          <textarea
            rows={10}
            readOnly
            value={obfuscated}
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ccc',
              borderRadius: 8,
              fontFamily: 'monospace',
              fontSize: 14,
              background: '#eef'
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              marginTop: 10,
              padding: '8px 16px',
              backgroundColor: copied ? '#22c55e' : '#4a90e2',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            {copied ? '✔️ Disalin!' : '📋 Salin Hasil'}
          </button>
        </div>
      )}
    </div>
  );
  }
          
