import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [view, setView] = useState<"landing" | "dashboard">("landing");

  const handleLaunch = () => {
    setView("dashboard");
  };

  const handleLogout = () => {
    setView("landing");
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 font-sans">
      {view === "landing" ? (
        <LandingPage onLaunch={handleLaunch} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}
