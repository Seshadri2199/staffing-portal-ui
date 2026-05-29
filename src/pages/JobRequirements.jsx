import { useEffect, useState } from "react";
import API from "../api/axios";

const emptyForm = {
  jobCode: "",
  recruiterName: "",
  companyName: "",
  roleName: "",
  skills: "",
  mandatorySkills: "",
  salaryMin: "",
  salaryMax: "",
  experienceMin: "",
  experienceMax: "",
  location: "",
  spocName: "",
};

function dotColor(createdAt) {
  const hrs = (Date.now() - new Date(createdAt)) / 3600000;
  if (hrs < 24) return "#10b981";
  if (hrs <= 76) return "#f59e0b";
  return "#ef4444";
}

function dotLabel(createdAt) {
  const hrs = (Date.now() - new Date(createdAt)) / 3600000;
  if (hrs < 24) return "Fresh";
  if (hrs <= 76) return "Aging";
  return "Old";
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
    [j.companyName, j.jobCode, j.roleName, j.recruiterName].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

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
            Job Requirements
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            {jobs.length} total requirements
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { color: "#10b981", label: "Fresh <24h" },
              { color: "#f59e0b", label: "Aging 24-76h" },
              { color: "#ef4444", label: "Old >76h" },
            ].map((d) => (
              <div
                key={d.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: "#6b7280",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: d.color,
                  }}
                />
                {d.label}
              </div>
            ))}
          </div>
          <input
            placeholder="🔍 Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inp, width: 200, height: 38, paddingLeft: 12 }}
          />
        </div>
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
              minWidth: 1200,
            }}
          >
            <thead>
              <tr>
                <th style={{ ...th, width: 32 }}></th>
                <th style={{ ...th, width: 85 }}>Job Code</th>
                <th style={{ ...th, width: 95 }}>Recruiter</th>
                <th style={{ ...th, width: 100 }}>Company</th>
                <th style={{ ...th, width: 120 }}>Role</th>
                <th style={{ ...th, width: 130 }}>Skills</th>
                <th style={{ ...th, width: 130 }}>Mandatory Skills</th>
                <th style={{ ...th, width: 95 }}>Salary (LPA)</th>
                <th style={{ ...th, width: 75 }}>Exp (yr)</th>
                <th style={{ ...th, width: 90 }}>Location</th>
                <th style={{ ...th, width: 90 }}>SPOC</th>
                <th style={{ ...th, width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "#f0f7ff" }}>
                <td style={td}></td>
                {[
                  "jobCode",
                  "recruiterName",
                  "companyName",
                  "roleName",
                  "skills",
                  "mandatorySkills",
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
                  <div
                    style={{ display: "flex", gap: 4, alignItems: "center" }}
                  >
                    <input
                      name="salaryMin"
                      value={form.salaryMin}
                      onChange={onChange}
                      style={{ ...inp, width: 40 }}
                      placeholder="Min"
                    />
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>–</span>
                    <input
                      name="salaryMax"
                      value={form.salaryMax}
                      onChange={onChange}
                      style={{ ...inp, width: 40 }}
                      placeholder="Max"
                    />
                  </div>
                </td>
                <td style={td}>
                  <div
                    style={{ display: "flex", gap: 4, alignItems: "center" }}
                  >
                    <input
                      name="experienceMin"
                      value={form.experienceMin}
                      onChange={onChange}
                      style={{ ...inp, width: 34 }}
                      placeholder="Min"
                    />
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>–</span>
                    <input
                      name="experienceMax"
                      value={form.experienceMax}
                      onChange={onChange}
                      style={{ ...inp, width: 34 }}
                      placeholder="Max"
                    />
                  </div>
                </td>
                {["location", "spocName"].map((f) => (
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
                    colSpan={12}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#9ca3af",
                      fontSize: 13,
                    }}
                  >
                    No job requirements found. Add your first one above!
                  </td>
                </tr>
              ) : (
                visible.map((j) => (
                  <tr
                    key={j.jobCode}
                    style={{ transition: "background 0.15s" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f9fafb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    <td style={td}>
                      <div
                        title={dotLabel(j.createdAt)}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          margin: "0 auto",
                          background: dotColor(j.createdAt),
                          boxShadow: `0 0 6px ${dotColor(j.createdAt)}`,
                        }}
                      />
                    </td>
                    <td style={{ ...td, fontWeight: 600, color: "#667eea" }}>
                      {j.jobCode}
                    </td>
                    <td style={td}>{j.recruiterName}</td>
                    <td style={{ ...td, fontWeight: 500 }}>{j.companyName}</td>
                    <td style={td}>{j.roleName}</td>
                    <td style={td}>
                      {j.skills?.split(",").map((s) => (
                        <span
                          key={s}
                          style={{
                            background: "#eef2ff",
                            color: "#667eea",
                            borderRadius: 20,
                            padding: "2px 7px",
                            fontSize: 10,
                            marginRight: 3,
                            display: "inline-block",
                            fontWeight: 500,
                            marginBottom: 2,
                          }}
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </td>
                    <td style={td}>
                      {j.mandatorySkills?.split(",").map((s) => (
                        <span
                          key={s}
                          style={{
                            background: "#fef2f2",
                            color: "#ef4444",
                            borderRadius: 20,
                            padding: "2px 7px",
                            fontSize: 10,
                            marginRight: 3,
                            display: "inline-block",
                            fontWeight: 500,
                            marginBottom: 2,
                          }}
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </td>
                    <td style={td}>
                      <span style={{ fontWeight: 500, color: "#10b981" }}>
                        ₹{j.salaryMin}–{j.salaryMax}L
                      </span>
                    </td>
                    <td style={td}>
                      {j.experienceMin}–{j.experienceMax} yr
                    </td>
                    <td style={td}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        📍 {j.location}
                      </span>
                    </td>
                    <td style={td}>{j.spocName}</td>
                    <td style={td}>
                      <button
                        onClick={() => onEdit(j)}
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
                        onClick={() => onDelete(j.jobCode)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
