// src/App.tsx
import React from "react"

export default function App() {
  const [hash, setHash] = React.useState(window.location.hash)
  React.useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  // Ultra-visible banner to prove this file is mounted:
  const bannerStyle: React.CSSProperties = {
    position: "fixed",
    left: 10,
    top: 10,
    zIndex: 99999,
    background: "#222",
    color: "#0f0",
    padding: "6px 10px",
    borderRadius: 6,
    fontFamily: "monospace",
    boxShadow: "0 4px 10px rgba(0,0,0,0.35)"
  }

  // Bottom-right connectivity test (no external imports):
  const pillStyle: React.CSSProperties = {
    position: "fixed",
    right: 16,
    bottom: 16,
    zIndex: 9999,
    background: "#555",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 999,
    fontFamily: "system-ui, sans-serif",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
  }

  const [pill, setPill] = React.useState<"checking"|"ok"|"down">("checking")
  const [count, setCount] = React.useState<number>(0)
  const [last, setLast] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    async function check() {
      try {
        const r = await fetch("/api/v1/devices", { headers: { Accept: "application/json" } })
        if (!r.ok) throw new Error(String(r.status))
        const js = await r.json()
        if (cancelled) return
        const devices = (js?.devices ?? []) as Array<{id:string; last_seen:string|null; total:number; status:string}>
        setCount(devices.length)
        setLast(devices[0]?.last_seen ?? null)
        setPill("ok")
      } catch (e) {
        if (!cancelled) setPill("down")
        console.warn("[Connectivity] error:", e)
      }
    }
    check()
    const t = setInterval(check, 10000)
    return () => { cancelled = true; clearInterval(t) }
  }, [])

  const pillBg = pill === "checking" ? "#888" : pill === "ok" ? "#0a0" : "#c00"

  return (
    <div style={{ padding: 24 }}>
      {/* TOP-LEFT banner (must be visible if App.tsx is used) */}
      <div style={bannerStyle}>APP.TSX ACTIVE</div>

      <h1>Neptune Devices (Inline Test)</h1>
      <p style={{opacity:.7}}>Hash: <code>{hash || "(none)"}</code></p>

      {/* Bottom-right pill */}
      <div style={{...pillStyle, background: pillBg}} onClick={() => setOpen(true)}>
        {pill === "checking" ? "Checking link…" : pill === "ok" ? "Cloud linked" : "No link"}
        {" · "}{count} device{count === 1 ? "" : "s"}{last ? ` · last ${last}` : ""}
      </div>

      {/* Modal listing devices (direct fetch) */}
      {open && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 10000,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{ background: "white", minWidth: 480, maxWidth: "90vw",
                     maxHeight: "80vh", padding: 16, overflow: "auto", borderRadius: 8 }}
            onClick={(e)=>e.stopPropagation()}
          >
            <h3 style={{marginTop:0}}>Cloud Devices</h3>
            <DeviceTable/>
          </div>
        </div>
      )}
    </div>
  )
}

function DeviceTable() {
  const [rows, setRows] = React.useState<Array<{id:string; last_seen:string|null; total:number; status:string}>>([])
  const [err, setErr] = React.useState<string | null>(null)
  React.useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch("/api/v1/devices", { headers: { Accept: "application/json" } })
        if (!r.ok) throw new Error(String(r.status))
        const js = await r.json()
        setRows(js?.devices ?? [])
      } catch (e:any) {
        setErr(String(e))
      }
    })()
  }, [])
  if (err) return <p style={{color:"crimson"}}>Error: {err}</p>
  if (!rows.length) return <p>No devices found.</p>
  return (
    <table style={{borderCollapse:"collapse", width:"100%"}}>
      <thead>
        <tr><th align="left">Device</th><th>Last Seen</th><th>Total</th><th>Status</th></tr>
      </thead>
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
  )
}