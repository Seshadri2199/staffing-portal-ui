import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import JobRequirements from "./pages/JobRequirements";
import Candidates from "./pages/Candidates";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5" }}
      >
        <Sidebar />
        <div style={{ flex: 1, overflowY: "auto", background: "#f0f2f5" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<JobRequirements />} />
            <Route path="/candidates" element={<Candidates />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
