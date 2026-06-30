'use client';

import { getDeviceId } from '@/lib/device';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UsbLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const content = JSON.parse(await file.text());

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin-usb/verify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: content.token,
            deviceId: getDeviceId(),
          }),
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      document.cookie = `token=${data.token}; path=/`;
      document.cookie = `user=${JSON.stringify({
        role: 'admin',
        type: 'usb',
      })}; path=/`;

      router.push('/admin');
    } catch {
      alert('USB rejected');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Enterprise USB Login</h1>
      <input type="file" accept=".key,.json" onChange={handleFile} />
      {loading && <p>Verifying device...</p>}
    </div>
  );
}