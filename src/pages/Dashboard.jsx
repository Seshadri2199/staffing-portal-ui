import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [jobs, setJobs] = useState([]);
  const [cands, setCands] = useState([]);

  useEffect(() => {
    API.get("/jobs").then((r) => setJobs(r.data));
    API.get("/candidates").then((r) => setCands(r.data));
  }, []);

  const filtered = cands.filter((c) => {
    if (!from && !to) return true;
    const d = new Date(c.createdAt);
    if (from && d < new Date(from)) return false;
    if (to && d > new Date(to + "T23:59:59")) return false;
    return true;
  });

  const tot = filtered.length;
  const cf = (key) => filtered.filter((c) => c.feedback === key).length;
  const pct = (v, t) => (t > 0 ? Math.round((v / t) * 100) : 0);

  const avatarColors = [
    "#1e40af",
    "#0891b2",
    "#16a34a",
    "#d97706",
    "#7c3aed",
    "#dc2626",
    "#0f766e",
    "#be185d",
  ];

  function initials(name) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function freshnessInfo(createdAt) {
    if (!createdAt) return { c: "#94a3b8", l: "Unknown", bg: "#f1f5f9" };
    const h = (Date.now() - new Date(createdAt)) / 3600000;
    if (h < 24) return { c: "#16a34a", l: "Fresh", bg: "#f0fdf4" };
    if (h <= 76) return { c: "#d97706", l: "Aging", bg: "#fffbeb" };
    return { c: "#dc2626", l: "Old", bg: "#fef2f2" };
  }

  const kpis = [
    {
      label: "Total Jobs",
      value: jobs.length,
      icon: "💼",
      stripe: "#1e40af",
      ibg: "#eff6ff",
      tag: "Active",
      tagColor: "#1e40af",
      foot: "Job requirements posted",
    },
    {
      label: "Total Profiles",
      value: tot,
      icon: "👥",
      stripe: "#0891b2",
      ibg: "#ecfeff",
      tag: from || to ? "Filtered" : "All",
      tagColor: "#0891b2",
      foot: "Candidates in range",
    },
    {
      label: "Shortlisted",
      value: cf("SHORTLISTED"),
      icon: "✅",
      stripe: "#16a34a",
      ibg: "#f0fdf4",
      tag: pct(cf("SHORTLISTED"), tot) + "%",
      tagColor: "#16a34a",
      foot: "Selected candidates",
    },
    {
      label: "Rejected",
      value: cf("REJECTED"),
      icon: "❌",
      stripe: "#dc2626",
      ibg: "#fef2f2",
      tag: pct(cf("REJECTED"), tot) + "%",
      tagColor: "#dc2626",
      foot: "Did not qualify",
    },
    {
      label: "On Hold",
      value: cf("ON_HOLD"),
      icon: "⏸️",
      stripe: "#d97706",
      ibg: "#fffbeb",
      tag: pct(cf("ON_HOLD"), tot) + "%",
      tagColor: "#d97706",
      foot: "Under consideration",
    },
    {
      label: "Pending",
      value: cf("PENDING"),
      icon: "🕐",
      stripe: "#7c3aed",
      ibg: "#f5f3ff",
      tag: pct(cf("PENDING"), tot) + "%",
      tagColor: "#7c3aed",
      foot: "Awaiting review",
    },
  ];

  const rangeLabel =
    from && to
      ? `Showing: ${from} → ${to}`
      : from
        ? `From ${from}`
        : to
          ? `Until ${to}`
          : "Showing all time data";

  const s = {
    app: {
      background: "#f1f5f9",
      minHeight: "100vh",
      padding: 24,
      fontFamily: "Segoe UI, sans-serif",
    },
    topbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
      background: "#fff",
      borderRadius: 14,
      padding: "16px 24px",
      border: "1px solid #e2e8f0",
    },
    tbIcon: {
      width: 46,
      height: 46,
      background: "#1e40af",
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
    },
    tbTitle: { fontSize: 18, fontWeight: 800, color: "#0f172a" },
    tbSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
    dateWrap: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "#f8fafc",
      border: "1.5px solid #e2e8f0",
      borderRadius: 10,
      padding: "8px 16px",
    },
    dateLabel: {
      fontSize: 10,
      color: "#94a3b8",
      fontWeight: 700,
      textTransform: "uppercase",
    },
    dateInput: {
      border: "none",
      outline: "none",
      fontSize: 12,
      color: "#0f172a",
      background: "transparent",
      width: 108,
      fontFamily: "Segoe UI, sans-serif",
    },
    btnP: {
      background: "#1e40af",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "8px 18px",
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer",
    },
    btnS: {
      background: "#fff",
      color: "#1e40af",
      border: "1.5px solid #1e40af",
      borderRadius: 8,
      padding: "8px 18px",
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer",
    },
    kpiGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(6,1fr)",
      gap: 14,
      marginBottom: 20,
    },
    kpi: {
      background: "#fff",
      borderRadius: 14,
      padding: 18,
      border: "1px solid #e2e8f0",
      position: "relative",
      overflow: "hidden",
    },
    kpiNum: {
      fontSize: 36,
      fontWeight: 900,
      color: "#0f172a",
      lineHeight: 1,
      marginBottom: 4,
    },
    kpiLbl: {
      fontSize: 11,
      color: "#64748b",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    kpiFoot: {
      fontSize: 11,
      marginTop: 10,
      paddingTop: 10,
      borderTop: "1px solid #f1f5f9",
      color: "#94a3b8",
    },
    card: {
      background: "#fff",
      borderRadius: 14,
      padding: 20,
      border: "1px solid #e2e8f0",
    },
    cardHdr: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingBottom: 14,
      borderBottom: "1px solid #f1f5f9",
    },
    cardTitle: { fontSize: 15, fontWeight: 800, color: "#0f172a" },
    cardMeta: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
    chip: {
      fontSize: 11,
      fontWeight: 700,
      padding: "4px 14px",
      borderRadius: 6,
      background: "#eff6ff",
      color: "#1e40af",
    },
    jrow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 14px",
      borderRadius: 10,
      marginBottom: 8,
      background: "#f8fafc",
      border: "1px solid #f1f5f9",
    },
    jco: { fontSize: 13, fontWeight: 700, color: "#0f172a" },
    jmeta: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
    jspoc: { fontSize: 11, color: "#64748b", marginTop: 2 },
    legend: {
      display: "flex",
      gap: 16,
      marginTop: 16,
      paddingTop: 14,
      borderTop: "1px solid #f1f5f9",
    },
  };

  return (
    <div style={s.app}>
      <div style={s.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={s.tbIcon}>🏢</div>
          <div>
            <div style={s.tbTitle}>TechNext Recruitment Portal</div>
            <div style={s.tbSub}>{rangeLabel}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={s.dateWrap}>
            <span style={s.dateLabel}>From</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={s.dateInput}
            />
            <span style={{ color: "#cbd5e1" }}>→</span>
            <span style={s.dateLabel}>To</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={s.dateInput}
            />
          </div>
          <button
            style={s.btnP}
            onClick={() => {
              setFrom(today);
              setTo(today);
            }}
          >
            Today
          </button>
          <button
            style={s.btnS}
            onClick={() => {
              setFrom("");
              setTo("");
            }}
          >
            All Time
          </button>
        </div>
      </div>

      <div style={s.kpiGrid}>
        {kpis.map((k, i) => (
          <div key={i} style={s.kpi}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: k.stripe,
                borderRadius: "14px 14px 0 0",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: k.ibg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                {k.icon}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: k.ibg,
                  color: k.tagColor,
                }}
              >
                {k.tag}
              </span>
            </div>
            <div style={s.kpiNum}>{k.value}</div>
            <div style={s.kpiLbl}>{k.label}</div>
            <div style={s.kpiFoot}>{k.foot}</div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.cardHdr}>
          <div>
            <div style={s.cardTitle}>💼 Recent Job Requirements</div>
            <div style={s.cardMeta}>
              Latest active job postings with freshness status
            </div>
          </div>
          <span style={s.chip}>{jobs.length} Jobs</span>
        </div>

        {jobs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 50,
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            No job requirements yet
          </div>
        ) : (
          jobs.slice(0, 5).map((j, i) => {
            const f = freshnessInfo(j.createdAt);
            const color = avatarColors[i % avatarColors.length];
            return (
              <div key={j.jobCode} style={s.jrow}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {initials(j.companyName)}
                  </div>
                  <div>
                    <div style={s.jco}>{j.companyName}</div>
                    <div style={s.jmeta}>
                      {j.jobCode} &nbsp;·&nbsp; 📍 {j.location}
                    </div>
                    <div style={s.jspoc}>SPOC: {j.spocName}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 6,
                      background: f.bg,
                      color: f.c,
                    }}
                  >
                    {f.l}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "5px 14px",
                      borderRadius: 8,
                      background: `${color}15`,
                      color,
                    }}
                  >
                    {j.roleName}
                  </span>
                </div>
              </div>
            );
          })
        )}

        <div style={s.legend}>
          {[
            { c: "#16a34a", l: "Fresh — posted within 24 hours" },
            { c: "#d97706", l: "Aging — 24 to 76 hours old" },
            { c: "#dc2626", l: "Old — more than 76 hours" },
          ].map((item) => (
            <div
              key={item.l}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: item.c,
                }}
              />
              {item.l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
