import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [code, setCode] = useState('');
  const [obfuscated, setObfuscated] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Prevent zoom on mobile
    const handleGestureStart = (e) => e.preventDefault();
    document.addEventListener('gesturestart', handleGestureStart);
    return () => {
      document.removeEventListener('gesturestart', handleGestureStart);
    };
  }, []);

  const handleObfuscate = async () => {
    setLoading(true);
    setError('');
    setObfuscated('');
    setCopied(false);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();

      if (res.ok) {
        setObfuscated(data.obfuscated);
      } else {
        setError(data.error || 'Obfuscation failed');
      }
    } catch {
      setError('❌ Request failed');
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

  const handleDownload = () => {
    const blob = new Blob([obfuscated], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obfuscated.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <title>JS Obfuscator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div style={{
        maxWidth: 900,
        margin: 'auto',
        padding: 20,
        fontFamily: 'Segoe UI, sans-serif',
        backgroundColor: '#1e1e2f',
        minHeight: '100vh',
        color: '#ffffffcc'
      }}>
        <h1 style={{ textAlign: 'center', color: '#4fc3f7' }}>🛡️ JavaScript Obfuscator</h1>

        <textarea
          rows={10}
          placeholder="Tulis kode JavaScript di sini..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            border: '1px solid #3b3b4f',
            borderRadius: 8,
            fontFamily: 'monospace',
            fontSize: 14,
            background: '#2c2c3c',
            color: '#fff',
            resize: 'vertical'
          }}
        />

        <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
          <button
            onClick={handleObfuscate}
            disabled={loading || !code}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4fc3f7',
              color: '#000',
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
              backgroundColor: '#f87171',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>

        {error && <p style={{ color: '#f87171', marginTop: 10 }}>❌ {error}</p>}

        {obfuscated && (
          <div style={{ marginTop: 30 }}>
            <h2 style={{ color: '#4fc3f7' }}>✅ Hasil Obfuscation:</h2>
            <textarea
              rows={10}
              readOnly
              value={obfuscated}
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #3b3b4f',
                borderRadius: 8,
                fontFamily: 'monospace',
                fontSize: 14,
                background: '#2c2c3c',
                color: '#fff'
              }}
            />

            <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
              <button
                onClick={handleCopy}
                style={{
                  padding: '8px 16px',
                  backgroundColor: copied ? '#22c55e' : '#4fc3f7',
                  color: copied ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                {copied ? '✔️ Disalin!' : '📋 Salin'}
              </button>

              <button
                onClick={handleDownload}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#38bdf8',
                  color: '#000',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                ⬇️ Download .js
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
      }
    
