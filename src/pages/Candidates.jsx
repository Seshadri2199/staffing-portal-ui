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
  SHORTLISTED: { bg: "#ecfdf5", color: "#10b981", icon: "✅" },
  REJECTED: { bg: "#fef2f2", color: "#ef4444", icon: "❌" },
  ON_HOLD: { bg: "#fffbeb", color: "#f59e0b", icon: "⏸️" },
  PENDING: { bg: "#f5f3ff", color: "#8b5cf6", icon: "🕐" },
};

export default function Candidates() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

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

  const visible = list.filter((c) => {
    const s = search.toLowerCase();
    const matchSearch = c.candidateName?.toLowerCase().includes(s);
    const matchFilter = filter === "ALL" || c.feedback === filter;
    return matchSearch && matchFilter;
  });

  const inp = {
    width: "100%",
    height: 32,
    border: "1.5px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 11,
    padding: "0 8px",
    outline: "none",
    fontFamily: "Inter, sans-serif",
    background: "#fff",
    color: "#374151",
  };

  const th = {
    padding: "12px 10px",
    fontSize: 11,
    color: "#6b7280",
    fontWeight: 600,
    background: "#f9fafb",
    borderBottom: "2px solid #e5e7eb",
    textAlign: "left",
    whiteSpace: "nowrap",
  };

  const td = {
    padding: "10px 10px",
    fontSize: 12,
    borderBottom: "1px solid #f3f4f6",
    color: "#374151",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const filterBtns = [
    { key: "ALL", label: "All", color: "#667eea" },
    { key: "SHORTLISTED", label: "✅ Shortlisted", color: "#10b981" },
    { key: "REJECTED", label: "❌ Rejected", color: "#ef4444" },
    { key: "ON_HOLD", label: "⏸️ On Hold", color: "#f59e0b" },
    { key: "PENDING", label: "🕐 Pending", color: "#8b5cf6" },
  ];

  return (
    <div style={{ padding: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#1a1a2e",
              marginBottom: 4,
            }}
          >
            Candidates
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            {list.length} total candidates
          </p>
        </div>
        <input
          placeholder="🔍 Search name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inp, width: 200, height: 38, paddingLeft: 12 }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {filterBtns.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "7px 16px",
              fontSize: 12,
              borderRadius: 20,
              cursor: "pointer",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              background: filter === f.key ? f.color : "#fff",
              color: filter === f.key ? "#fff" : "#6b7280",
              boxShadow:
                filter === f.key
                  ? `0 4px 12px ${f.color}40`
                  : "0 1px 3px rgba(0,0,0,0.08)",
              border: filter === f.key ? "none" : "1px solid #e5e7eb",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              minWidth: 1400,
            }}
          >
            <thead>
              <tr>
                {[
                  "Recruiter Name",
                  "Candidate Name",
                  "PAN Number",
                  "Current Role",
                  "Company",
                  "Domain",
                  "Exp (yr)",
                  "Current Salary",
                  "Expected Salary",
                  "Location",
                  "Exp Location",
                  "Feedback",
                  "Actions",
                ].map((h) => (
                  <th key={h} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "#f0f7ff" }}>
                {[
                  "recruiterName",
                  "candidateName",
                  "panNumber",
                  "currentRole",
                  "companyName",
                  "domain",
                  "experienceYears",
                  "currentSalary",
                  "expectedSalary",
                  "currentLocation",
                  "expectedLocation",
                ].map((f) => (
                  <td key={f} style={td}>
                    <input
                      name={f}
                      value={form[f]}
                      onChange={onChange}
                      style={inp}
                      placeholder={f}
                    />
                  </td>
                ))}
                <td style={td}>
                  <select
                    name="feedback"
                    value={form.feedback}
                    onChange={onChange}
                    style={{ ...inp, cursor: "pointer" }}
                  >
                    <option value="PENDING">🕐 Pending</option>
                    <option value="SHORTLISTED">✅ Shortlisted</option>
                    <option value="REJECTED">❌ Rejected</option>
                    <option value="ON_HOLD">⏸️ On Hold</option>
                  </select>
                </td>
                <td style={td}>
                  <button
                    onClick={onSave}
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 14px",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {editId ? "✓ Update" : "+ Save"}
                  </button>
                </td>
              </tr>

              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={13}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#9ca3af",
                      fontSize: 13,
                    }}
                  >
                    No candidates found. Add your first one above!
                  </td>
                </tr>
              ) : (
                visible.map((c) => {
                  const fb = fbConfig[c.feedback] || fbConfig.PENDING;
                  return (
                    <tr
                      key={c.id}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f9fafb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#fff")
                      }
                    >
                      <td style={{ ...td, fontWeight: 500, color: "#667eea" }}>
                        {c.recruiterName}
                      </td>
                      <td style={{ ...td, fontWeight: 600, color: "#1a1a2e" }}>
                        {c.candidateName}
                      </td>
                      <td
                        style={{
                          ...td,
                          fontFamily: "monospace",
                          color: "#9ca3af",
                          fontSize: 11,
                        }}
                      >
                        {c.panNumber}
                      </td>
                      <td style={td}>{c.currentRole}</td>
                      <td style={{ ...td, fontWeight: 500 }}>
                        {c.companyName}
                      </td>
                      <td style={td}>
                        <span
                          style={{
                            background: "#f0f9ff",
                            color: "#0ea5e9",
                            borderRadius: 20,
                            padding: "2px 8px",
                            fontSize: 10,
                            fontWeight: 500,
                          }}
                        >
                          {c.domain}
                        </span>
                      </td>
                      <td style={td}>{c.experienceYears} yr</td>
                      <td style={{ ...td, color: "#6b7280" }}>
                        {c.currentSalary}
                      </td>
                      <td style={{ ...td, color: "#10b981", fontWeight: 500 }}>
                        {c.expectedSalary}
                      </td>
                      <td style={td}>📍 {c.currentLocation}</td>
                      <td style={td}>🎯 {c.expectedLocation}</td>
                      <td style={td}>
                        <span
                          style={{
                            background: fb.bg,
                            color: fb.color,
                            borderRadius: 20,
                            padding: "4px 10px",
                            fontSize: 11,
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {fb.icon} {c.feedback}
                        </span>
                      </td>
                      <td style={td}>
                        <button
                          onClick={() => onEdit(c)}
                          style={{
                            background: "#eef2ff",
                            border: "none",
                            color: "#667eea",
                            cursor: "pointer",
                            fontSize: 11,
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontWeight: 500,
                            marginRight: 6,
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => onDelete(c.id)}
                          style={{
                            background: "#fef2f2",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: 11,
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontWeight: 500,
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          🗑️
                        </button>
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
