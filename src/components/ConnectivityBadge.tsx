import React from "react";
import { fetchDevices, type Device } from "../lib/api";

export const ConnectivityBadge: React.FC = () => {
  // Hide in production — this is a dev/debug tool
  if (import.meta.env.PROD) return null;
  const [ok, setOk] = React.useState<boolean | null>(null);
  const [count, setCount] = React.useState<number>(0);
  const [lastSeen, setLastSeen] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  async function refresh() {
    try {
      const devices: Device[] = await fetchDevices();
      setOk(true);
      setCount(devices.length);
      setLastSeen(devices[0]?.last_seen ?? null);
    } catch {
      setOk(false);
      setCount(0);
      setLastSeen(null);
    }
  }

  React.useEffect(() => {
    refresh();
    const t = setInterval(refresh, 10000);
    return () => clearInterval(t);
  }, []);

  const bg = ok === null ? "#888" : ok ? "#0a0" : "#c00";
  const title = ok === null ? "Checking…" : ok ? "Cloud linked" : "No link";

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", right: 16, bottom: 16, zIndex: 9999,
          background: bg, color: "white", padding: "8px 12px", borderRadius: 999,
          cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", fontFamily: "sans-serif"
        }}
        title="Click to view devices"
      >
        {title} · {count} device{count===1?"":"s"}{lastSeen ? ` · last ${lastSeen}` : ""}
      </div>

      {open && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 10000,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
          onClick={() => setOpen(false)}
        >
          <div style={{ background: "white", minWidth: 480, maxWidth: "90vw",
                        maxHeight: "80vh", padding: 16, overflow: "auto", borderRadius: 8 }}
               onClick={(e)=>e.stopPropagation()}
          >
            <h3 style={{marginTop:0}}>Cloud Devices</h3>
            <DeviceTable />
          </div>
        </div>
      )}
    </>
  );
};

function DeviceTable(){
  const [rows, setRows] = React.useState<Device[]>([]);
  const [err, setErr] = React.useState<string | null>(null);
  React.useEffect(()=>{ (async()=>{
    try { setRows(await fetchDevices()); } catch(e:any){ setErr(String(e)); }
  })(); },[]);
  if (err) return <p style={{color:"crimson"}}>Error: {err}</p>;
  if (!rows.length) return <p>No devices found.</p>;
  return (
    <table style={{borderCollapse:"collapse", width:"100%"}}>
      <thead><tr><th align="left">Device</th><th>Last Seen</th><th>Total</th><th>Status</th></tr></thead>
      <tbody>
        {rows.map(d=>(
          <tr key={d.id}>
            <td>{d.id}</td>
            <td align="center">{d.last_seen ?? "—"}</td>
            <td align="center">{d.total}</td>
            <td align="center">{d.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
