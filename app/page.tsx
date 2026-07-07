'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!passcode) return;
    setBusy(true);
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    if (res.ok) {
      window.location.href = '/';
    } else {
      setError('パスワードが一致しません。');
      setBusy(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 440, paddingTop: '14vh' }}>
      <div className="card" style={{ borderTop: '3px solid var(--sophia)' }}>
        <div className="eyebrow">MEMBERS ONLY</div>
        <h1 style={{ fontSize: '2rem', lineHeight: 1.3 }}>Green Sophia<br />SNS Copilot</h1>
        <p className="muted" style={{ marginTop: 14 }}>
          パスワードを入力してください。
        </p>
        <div className="field" style={{ marginTop: 24 }}>
          <input
            type="password"
            placeholder="パスワード"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoFocus
          />
        </div>
        {error && <p style={{ color: '#B5482E', fontSize: '.86rem', margin: '0 0 12px' }}>{error}</p>}
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={submit} disabled={busy}>
          {busy ? '確認しています' : '入室する'}
        </button>
        <p className="muted" style={{ marginTop: 18, fontSize: '.8rem' }}>
          分からない場合は、情報班に確認してください。
        </p>
      </div>
    </div>
  );
}
