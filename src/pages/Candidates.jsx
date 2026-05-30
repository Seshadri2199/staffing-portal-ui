import { useEffect, useState } from "react";
import API from "../api/axios";

const emptyForm = {
  recruiterName: "",
  candidateName: "",
  panNumber: "",
  currentRole: "",
  companyName: "",
  domain: "",
  experienceYears: "",
  currentSalary: "",
  expectedSalary: "",
  currentLocation: "",
  expectedLocation: "",
  feedback: "PENDING",
};

const fbConfig = {
  SHORTLISTED: {
    bg: "#d1fae5",
    color: "#065f46",
    border: "#6ee7b7",
    icon: "✅",
  },
  REJECTED: { bg: "#fee2e2", color: "#7f1d1d", border: "#fca5a5", icon: "❌" },
  ON_HOLD: { bg: "#fef3c7", color: "#78350f", border: "#fcd34d", icon: "⏸" },
  PENDING: { bg: "#ede9fe", color: "#4c1d95", border: "#c4b5fd", icon: "🕐" },
};

const filterBtns = [
  { key: "ALL", label: "All", color: "#1e40af", light: "#dbeafe" },
  {
    key: "SHORTLISTED",
    label: "Shortlisted",
    color: "#065f46",
    light: "#d1fae5",
  },
  { key: "REJECTED", label: "Rejected", color: "#7f1d1d", light: "#fee2e2" },
  { key: "ON_HOLD", label: "On Hold", color: "#78350f", light: "#fef3c7" },
  { key: "PENDING", label: "Pending", color: "#4c1d95", light: "#ede9fe" },
];

const COLS = [
  { label: "Recruiter", key: "recruiterName" },
  { label: "Candidate", key: "candidateName" },
  { label: "PAN Number", key: "panNumber" },
  { label: "Current Role", key: "currentRole" },
  { label: "Company", key: "companyName" },
  { label: "Domain", key: "domain" },
  { label: "Exp (yr)", key: "experienceYears" },
  { label: "Curr. Salary", key: "currentSalary" },
  { label: "Exp. Salary", key: "expectedSalary" },
  { label: "Location", key: "currentLocation" },
  { label: "Pref. Location", key: "expectedLocation" },
];

export default function Candidates() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [recruiterFilter, setRecruiterFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);
  const fetchAll = () => API.get("/candidates").then((r) => setList(r.data));
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async () => {
    if (editId) {
      await API.put(`/candidates/${editId}`, form);
      setEditId(null);
    } else {
      await API.post("/candidates", form);
    }
    setForm(emptyForm);
    fetchAll();
  };

  const onEdit = (c) => {
    setForm(c);
    setEditId(c.id);
  };
  const onDelete = async (id) => {
    if (window.confirm("Delete this candidate?")) {
      await API.delete(`/candidates/${id}`);
      fetchAll();
    }
  };

  const recruiterNames = [
    ...new Set(list.map((c) => c.recruiterName).filter(Boolean)),
  ].sort();
  const companyNames = [
    ...new Set(list.map((c) => c.companyName).filter(Boolean)),
  ].sort();

  const visible = list.filter((c) => {
    const matchSearch = c.candidateName
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || c.feedback === filter;
    const matchRecruiter =
      !recruiterFilter || c.recruiterName === recruiterFilter;
    const matchCompany = !companyFilter || c.companyName === companyFilter;
    return matchSearch && matchFilter && matchRecruiter && matchCompany;
  });

  const inp = {
    width: "100%",
    height: 34,
    border: "1.5px solid #cbd5e1",
    borderRadius: 7,
    fontSize: 12,
    padding: "0 10px",
    outline: "none",
    fontFamily: "inherit",
    background: "#fff",
    color: "#1e293b",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        padding: "32px 36px",
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Candidates
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0 0" }}>
            {visible.length} of {list.length} records
          </p>
        </div>
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 15,
              color: "#94a3b8",
            }}
          >
            🔍
          </span>
          <input
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              paddingLeft: 36,
              paddingRight: 16,
              height: 42,
              border: "1.5px solid #e2e8f0",
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              color: "#0f172a",
              background: "#fff",
              width: 230,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          padding: "14px 20px",
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {filterBtns.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: "6px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background: active ? f.color : f.light,
                  color: active ? "#fff" : f.color,
                  border: `1.5px solid ${active ? f.color : "transparent"}`,
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div
          style={{
            width: 1,
            height: 26,
            background: "#e2e8f0",
            margin: "0 4px",
          }}
        />
        <select
          value={recruiterFilter}
          onChange={(e) => setRecruiterFilter(e.target.value)}
          style={{
            height: 36,
            border: "1.5px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 13,
            padding: "0 12px",
            outline: "none",
            fontFamily: "inherit",
            background: "#f8fafc",
            color: "#374151",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          <option value="">👤 All Recruiters</option>
          {recruiterNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          style={{
            height: 36,
            border: "1.5px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 13,
            padding: "0 12px",
            outline: "none",
            fontFamily: "inherit",
            background: "#f8fafc",
            color: "#374151",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          <option value="">🏢 All Companies</option>
          {companyNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {(recruiterFilter || companyFilter) && (
          <button
            onClick={() => {
              setRecruiterFilter("");
              setCompanyFilter("");
            }}
            style={{
              height: 36,
              padding: "0 14px",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "inherit",
              background: "#fef2f2",
              color: "#dc2626",
              border: "1.5px solid #fecaca",
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1500,
            }}
          >
            <thead>
              <tr style={{ background: "#1e293b" }}>
                {COLS.map((c) => (
                  <th
                    key={c.key}
                    style={{
                      padding: "14px 14px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94a3b8",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                    }}
                  >
                    {c.label}
                  </th>
                ))}
                <th
                  style={{
                    padding: "14px 14px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textAlign: "left",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  Feedback
                </th>
                <th
                  style={{
                    padding: "14px 14px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textAlign: "left",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Input Row */}
              <tr
                style={{
                  background: "#f0f7ff",
                  borderBottom: "2px solid #bfdbfe",
                }}
              >
                {COLS.map((c) => (
                  <td key={c.key} style={{ padding: "8px 10px" }}>
                    <input
                      name={c.key}
                      value={form[c.key]}
                      onChange={onChange}
                      placeholder={c.label}
                      style={inp}
                    />
                  </td>
                ))}
                <td style={{ padding: "8px 10px" }}>
                  <select
                    name="feedback"
                    value={form.feedback}
                    onChange={onChange}
                    style={{ ...inp, cursor: "pointer" }}
                  >
                    <option value="PENDING">🕐 Pending</option>
                    <option value="SHORTLISTED">✅ Shortlisted</option>
                    <option value="REJECTED">❌ Rejected</option>
                    <option value="ON_HOLD">⏸ On Hold</option>
                  </select>
                </td>
                <td style={{ padding: "8px 10px" }}>
                  <button
                    onClick={onSave}
                    style={{
                      height: 34,
                      padding: "0 20px",
                      background: editId ? "#0f766e" : "#1d4ed8",
                      color: "#fff",
                      border: "none",
                      borderRadius: 7,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {editId ? "✓ Update" : "+ Add"}
                  </button>
                </td>
              </tr>

              {/* Data Rows */}
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={14}
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      color: "#94a3b8",
                      fontSize: 14,
                    }}
                  >
                    No candidates found. Add your first one above!
                  </td>
                </tr>
              ) : (
                visible.map((c, idx) => {
                  const fb = fbConfig[c.feedback] || fbConfig.PENDING;
                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        background: idx % 2 === 0 ? "#fff" : "#fafafa",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f0f9ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          idx % 2 === 0 ? "#fff" : "#fafafa")
                      }
                    >
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1d4ed8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.recruiterName}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0f172a",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.candidateName}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 12,
                          color: "#64748b",
                          fontFamily: "monospace",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.panNumber}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: "#334155",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.currentRole}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#0f172a",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.companyName}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            background: "#e0f2fe",
                            color: "#0369a1",
                            borderRadius: 6,
                            padding: "3px 10px",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {c.domain}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: "#334155",
                          textAlign: "center",
                        }}
                      >
                        {c.experienceYears} yr
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: "#64748b",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.currentSalary}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#059669",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.expectedSalary}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: "#334155",
                          whiteSpace: "nowrap",
                        }}
                      >
                        📍 {c.currentLocation}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: "#334155",
                          whiteSpace: "nowrap",
                        }}
                      >
                        🎯 {c.expectedLocation}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            background: fb.bg,
                            color: fb.color,
                            border: `1px solid ${fb.border}`,
                            borderRadius: 6,
                            padding: "4px 12px",
                            fontSize: 12,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {fb.icon} {c.feedback.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => onEdit(c)}
                            style={{
                              padding: "5px 12px",
                              fontSize: 12,
                              fontWeight: 600,
                              borderRadius: 6,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              background: "#eff6ff",
                              color: "#1d4ed8",
                              border: "1px solid #bfdbfe",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(c.id)}
                            style={{
                              padding: "5px 12px",
                              fontSize: 12,
                              fontWeight: 600,
                              borderRadius: 6,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              background: "#fef2f2",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                            }}
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
