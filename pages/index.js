import { useState } from 'react';

export default function Home() {
  const [code, setCode] = useState('');
  const [obfuscated, setObfuscated] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleObfuscate = async () => {
    setLoading(true);
    setError('');
    setObfuscated('');

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

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🛡️ Generator Obfuscation</h1>
      <textarea
        rows={10}
        placeholder="Tulis kode JavaScript di sini..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: '100%', padding: 10, fontFamily: 'monospace', fontSize: 14 }}
      />
      <br />
      <button
        onClick={handleObfuscate}
        disabled={loading || !code}
        style={{
          marginTop: 10,
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer'
        }}
      >
        {loading ? 'Proses...' : 'Obfuscate'}
      </button>

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {obfuscated && (
        <>
          <h2>✅ Hasil Obfuscation:</h2>
          <textarea
            rows={10}
            readOnly
            value={obfuscated}
            style={{ width: '100%', padding: 10, fontFamily: 'monospace', fontSize: 14 }}
          />
        </>
      )}
    </div>
  );
}
