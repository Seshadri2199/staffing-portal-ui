import { useEffect, useState } from "react";
import API from "../api/axios";

const emptyForm = {
  jobCode: "",
  companyName: "",
  roleName: "",
  skills: "",
  mandatorySkills: "",
  salary: "",
  experience: "",
  relevantExperience: "",
  location: "",
  spocName: "",
};

function dotColor(createdAt) {
  const hrs = (Date.now() - new Date(createdAt)) / 3600000;
  if (hrs < 24) return { color: "#16a34a", bg: "#dcfce7", label: "Fresh" };
  if (hrs <= 76) return { color: "#d97706", bg: "#fef3c7", label: "Aging" };
  return { color: "#dc2626", bg: "#fee2e2", label: "Old" };
}

export default function JobRequirements() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);
  const fetchJobs = () => API.get("/jobs").then((r) => setJobs(r.data));
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async () => {
    if (editId) {
      await API.put(`/jobs/${editId}`, form);
      setEditId(null);
    } else {
      await API.post("/jobs", form);
    }
    setForm(emptyForm);
    fetchJobs();
  };

  const onEdit = (j) => {
    setForm(j);
    setEditId(j.jobCode);
  };
  const onDelete = async (jobCode) => {
    if (window.confirm("Delete this job?")) {
      await API.delete(`/jobs/${jobCode}`);
      fetchJobs();
    }
  };

  const visible = jobs.filter((j) =>
    [j.companyName, j.jobCode, j.roleName].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

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

  const headers = [
    "",
    "Job Code",
    "Company",
    "Role",
    "Skills",
    "Mandatory Skills",
    "Salary",
    "Experience",
    "Relevant Exp",
    "Location",
    "SPOC",
    "Actions",
  ];
  const fields = [
    "jobCode",
    "companyName",
    "roleName",
    "skills",
    "mandatorySkills",
    "salary",
    "experience",
    "relevantExperience",
    "location",
    "spocName",
  ];

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
            Job Requirements
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0 0" }}>
            {visible.length} of {jobs.length} requirements
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Freshness Legend */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {[
              { color: "#16a34a", label: "Fresh <24h" },
              { color: "#d97706", label: "Aging 24–76h" },
              { color: "#dc2626", label: "Old >76h" },
            ].map((d) => (
              <div
                key={d.label}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: d.color,
                    boxShadow: `0 0 5px ${d.color}80`,
                  }}
                />
                <span
                  style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}
                >
                  {d.label}
                </span>
              </div>
            ))}
          </div>
          {/* Search */}
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
              placeholder="Search jobs..."
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
                width: 220,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            />
          </div>
        </div>
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
              minWidth: 1200,
            }}
          >
            <thead>
              <tr style={{ background: "#1e293b" }}>
                {headers.map((h) => (
                  <th
                    key={h}
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
                    {h}
                  </th>
                ))}
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
                <td style={{ padding: "8px 10px" }} />
                {fields.map((f) => (
                  <td key={f} style={{ padding: "8px 10px" }}>
                    <input
                      name={f}
                      value={form[f]}
                      onChange={onChange}
                      placeholder={f}
                      style={inp}
                    />
                  </td>
                ))}
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
                    colSpan={12}
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      color: "#94a3b8",
                      fontSize: 14,
                    }}
                  >
                    No job requirements found. Add your first one above!
                  </td>
                </tr>
              ) : (
                visible.map((j, idx) => {
                  const fresh = dotColor(j.createdAt);
                  return (
                    <tr
                      key={j.jobCode}
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
                      <td style={{ padding: "12px 14px", textAlign: "center" }}>
                        <div
                          title={fresh.label}
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: fresh.color,
                            margin: "0 auto",
                            boxShadow: `0 0 6px ${fresh.color}90`,
                          }}
                        />
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#1d4ed8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {j.jobCode}
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
                        {j.companyName}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: "#334155",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {j.roleName}
                      </td>
                      <td style={{ padding: "12px 10px" }}>
                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 3 }}
                        >
                          {j.skills?.split(",").map((s) => (
                            <span
                              key={s}
                              style={{
                                background: "#eff6ff",
                                color: "#1d4ed8",
                                borderRadius: 5,
                                padding: "2px 8px",
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "12px 10px" }}>
                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 3 }}
                        >
                          {j.mandatorySkills?.split(",").map((s) => (
                            <span
                              key={s}
                              style={{
                                background: "#fef2f2",
                                color: "#dc2626",
                                borderRadius: 5,
                                padding: "2px 8px",
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              {s.trim()}
                            </span>
                          ))}
                        </div>
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
                        {j.salary}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: "#334155",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {j.experience}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: "#334155",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {j.relevantExperience}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: "#334155",
                          whiteSpace: "nowrap",
                        }}
                      >
                        📍 {j.location}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: "#334155",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {j.spocName}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => onEdit(j)}
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
                            onClick={() => onDelete(j.jobCode)}
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
