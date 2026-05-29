import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
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
    if (to && d > new Date(to)) return false;
    return true;
  });

  const count = (key) => filtered.filter((c) => c.feedback === key).length;

  const stats = [
    {
      label: "Total Jobs",
      value: jobs.length,
      color: "#667eea",
      bg: "#eef2ff",
      icon: "💼",
    },
    {
      label: "Total Profiles",
      value: filtered.length,
      color: "#06b6d4",
      bg: "#ecfeff",
      icon: "👥",
    },
    {
      label: "Shortlisted",
      value: count("SHORTLISTED"),
      color: "#10b981",
      bg: "#ecfdf5",
      icon: "✅",
    },
    {
      label: "Rejected",
      value: count("REJECTED"),
      color: "#ef4444",
      bg: "#fef2f2",
      icon: "❌",
    },
    {
      label: "On Hold",
      value: count("ON_HOLD"),
      color: "#f59e0b",
      bg: "#fffbeb",
      icon: "⏸️",
    },
    {
      label: "Pending",
      value: count("PENDING"),
      color: "#8b5cf6",
      bg: "#f5f3ff",
      icon: "🕐",
    },
  ];

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#1a1a2e",
            marginBottom: 4,
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280" }}>
          Welcome back! Here's your recruitment overview.
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#374151",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          📅 Filter by date range
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#6b7280",
                display: "block",
                marginBottom: 6,
              }}
            >
              From
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={{
                height: 38,
                border: "1.5px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 12,
                padding: "0 12px",
                outline: "none",
                color: "#374151",
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#6b7280",
                display: "block",
                marginBottom: 6,
              }}
            >
              To
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{
                height: 38,
                border: "1.5px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 12,
                padding: "0 12px",
                outline: "none",
                color: "#374151",
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>
          <button
            onClick={() => {
              setFrom("");
              setTo("");
            }}
            style={{
              height: 38,
              padding: "0 20px",
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 12,
              cursor: "pointer",
              background: "#fff",
              color: "#6b7280",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "18px 16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div
              style={{
                fontSize: 11,
                color: "#6b7280",
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              {s.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#1a1a2e",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            💼 Recent Job Requirements
          </div>
          {jobs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "30px 0",
                color: "#9ca3af",
                fontSize: 13,
              }}
            >
              No job requirements yet
            </div>
          ) : (
            jobs.slice(0, 5).map((j) => (
              <div
                key={j.jobCode}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #f3f4f6",
                  fontSize: 12,
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: "#1a1a2e", fontSize: 13 }}
                  >
                    {j.companyName}
                  </div>
                  <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 2 }}>
                    {j.jobCode} · {j.location}
                  </div>
                </div>
                <div
                  style={{
                    background: "#eef2ff",
                    color: "#667eea",
                    borderRadius: 20,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  {j.roleName}
                </div>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#1a1a2e",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            📊 Feedback Summary
          </div>
          {[
            {
              label: "Shortlisted",
              key: "SHORTLISTED",
              color: "#10b981",
              bg: "#ecfdf5",
              icon: "✅",
            },
            {
              label: "Rejected",
              key: "REJECTED",
              color: "#ef4444",
              bg: "#fef2f2",
              icon: "❌",
            },
            {
              label: "On Hold",
              key: "ON_HOLD",
              color: "#f59e0b",
              bg: "#fffbeb",
              icon: "⏸️",
            },
            {
              label: "Pending",
              key: "PENDING",
              color: "#8b5cf6",
              bg: "#f5f3ff",
              icon: "🕐",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: 10,
                marginBottom: 8,
                background: item.bg,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                <span>{item.icon}</span> {item.label}
              </div>
              <span
                style={{ fontSize: 18, fontWeight: 700, color: item.color }}
              >
                {count(item.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
