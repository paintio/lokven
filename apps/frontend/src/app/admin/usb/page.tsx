'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UsbPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const key = (await file.text()).trim();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/usb-login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: key }),
        }
      );

      if (!res.ok) throw new Error('Denied');

      const data = await res.json();

      document.cookie = `token=${data.token}; path=/; max-age=604800`;

      router.push('/admin');
    } catch (e) {
      setError('Access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 border rounded-xl w-[400px]">
        <h1 className="text-xl font-bold mb-4">USB Admin Access</h1>

        <input type="file" onChange={handleFile} />

        {loading && <p>Checking...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}