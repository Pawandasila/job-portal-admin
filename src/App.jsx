import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Jobs from "./pages/Jobs";
import Applicants from "./pages/Applicants";
import Companies from "./pages/Companies";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Sidebar from "./components/Sidebar";

function AppRoutes({ collapsed, setCollapsed }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`flex-1 overflow-auto transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/applicants" element={<Applicants />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <AppRoutes
      collapsed={collapsed}
      setCollapsed={setCollapsed}
    />
  );
}

export default App;