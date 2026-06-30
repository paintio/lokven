'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UsbLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const text = await file.text();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/usb-login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: text.trim() }),
        },
      );

      if (!res.ok) throw new Error('Access denied');

      const data = await res.json();

      localStorage.setItem('admin_token', data.token);

      router.push('/admin');
    } catch (err) {
      alert('USB access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>USB Admin Login</h1>

      <input
        type="file"
        onChange={handleFile}
        disabled={loading}
      />
    </div>
  );
}