import { useNavigate, useLocation } from "react-router-dom";

const logo = require("../assets/logo.jpg");

const menuItems = [
  { label: "Dashboard", path: "/", icon: "📊" },
  { label: "Job Requirements", path: "/jobs", icon: "💼" },
  { label: "Candidates", path: "/candidates", icon: "👥" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        width: 240,
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 15px rgba(0,0,0,0.2)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <img
          src={logo}
          alt="TechNext Logo"
          style={{
            width: 55,
            height: 55,
            borderRadius: 10,
            objectFit: "contain",
            background: "#fff",
            padding: 4,
          }}
        />
        <div>
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 0.5,
            }}
          >
            TechNext
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 10,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Recruitment Portal
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 12px", flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            padding: "8px 12px",
            marginBottom: 4,
          }}
        >
          Main Menu
        </div>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 10,
                marginBottom: 4,
                cursor: "pointer",
                background: active
                  ? "linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))"
                  : "transparent",
                border: active
                  ? "1px solid rgba(102,126,234,0.4)"
                  : "1px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              >
                {item.label}
              </span>
              {active && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#667eea",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f093fb, #f5576c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            R
          </div>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              Recruiter
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Admin Access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
