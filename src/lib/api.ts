async function getJSON<T>(path: string): Promise<T> {
  // In dev, Vite forwards /api/... to the mock cloud on 9000
  const r = await fetch(path, { headers: { Accept: 'application/json' } });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`GET ${path} failed: ${r.status} ${text}`);
  }
  return r.json();
}

export type Device = { id: string; last_seen: string | null; total: number; status: string };

export async function fetchDevices(): Promise<Device[]> {
  const js = await getJSON<{ devices: Device[] }>('/api/v1/devices');
  return js.devices;
}
