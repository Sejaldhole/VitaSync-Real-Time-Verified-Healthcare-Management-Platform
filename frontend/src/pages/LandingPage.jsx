import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lora:ital,wght@0,600;0,700;1,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --white: #ffffff;
    --bg: #F0F6FF;
    --blue-50: #EFF6FF;
    --blue-100: #DBEAFE;
    --blue-400: #60A5FA;
    --blue-500: #3B82F6;
    --blue-600: #2563EB;
    --blue-700: #1D4ED8;
    --teal-400: #2DD4BF;
    --teal-500: #14B8A6;
    --green-400: #4ADE80;
    --green-500: #22C55E;
    --slate-400: #94A3B8;
    --slate-500: #64748B;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1E293B;
    --red-400: #F87171;
    --orange-400: #FB923C;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  .page {
    width: 100vw;
    height: 100vh;
    display: flex;
    overflow: hidden;
    font-family: 'Nunito', sans-serif;
    background: var(--bg);
  }

  /* ── LEFT PANEL ── */
  .left-panel {
    flex: 1 1 55%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 64px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(145deg, #1a56db 0%, #1e3a8a 60%, #0f2460 100%);
  }

  /* Decorative circles */
  .left-panel::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    border: 60px solid rgba(255,255,255,0.05);
    top: -160px; right: -120px;
  }
  .left-panel::after {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    border: 40px solid rgba(255,255,255,0.05);
    bottom: -80px; left: -60px;
  }

  .left-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
  }
  .lb-1 { width: 320px; height: 320px; background: rgba(96,165,250,0.25); top: 40px; right: 60px; animation: blobFloat 8s ease-in-out infinite alternate; }
  .lb-2 { width: 200px; height: 200px; background: rgba(45,212,191,0.2); bottom: 80px; right: 140px; animation: blobFloat 10s ease-in-out infinite alternate-reverse; }
  .lb-3 { width: 160px; height: 160px; background: rgba(255,255,255,0.08); top: 50%; left: 30%; animation: blobFloat 12s ease-in-out infinite alternate; }

  @keyframes blobFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(20px, -30px) scale(1.08); }
  }

  /* Left content */
  .left-content { position: relative; z-index: 2; }

  .lp-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 100px;
    padding: 6px 16px;
    margin-bottom: 36px;
    animation: fadeInUp 0.5s ease both;
  }
  .lp-badge-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--green-400);
    box-shadow: 0 0 10px var(--green-400);
    animation: pulse 2s ease infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  .lp-badge-text { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.85); }

  .lp-heading {
    font-family: 'Lora', serif;
    font-size: clamp(34px, 3.5vw, 52px);
    font-weight: 700;
    line-height: 1.12;
    color: #fff;
    margin-bottom: 20px;
    animation: fadeInUp 0.5s ease 0.1s both;
  }
  .lp-heading span {
    font-style: italic;
    color: var(--teal-400);
  }

  .lp-sub {
    font-size: 15px;
    font-weight: 400;
    color: rgba(255,255,255,0.65);
    line-height: 1.75;
    max-width: 420px;
    margin-bottom: 48px;
    animation: fadeInUp 0.5s ease 0.2s both;
  }

  /* Stats row */
  .stats-row {
    display: flex; gap: 32px;
    animation: fadeInUp 0.5s ease 0.3s both;
  }
  .stat-item { display: flex; flex-direction: column; gap: 2px; }
  .stat-num {
    font-size: 26px; font-weight: 900; color: #fff; line-height: 1;
  }
  .stat-num span { color: var(--teal-400); font-size: 18px; }
  .stat-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); letter-spacing: 0.05em; text-transform: uppercase; }

  .stats-divider { width: 1px; background: rgba(255,255,255,0.12); align-self: stretch; }

  /* Floating card */
  .float-card {
    position: absolute;
    background: #fff;
    border-radius: 18px;
    padding: 16px 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.18);
    display: flex; align-items: center; gap: 12px;
    animation: cardFloat 6s ease-in-out infinite;
    z-index: 3;
  }
  .fc-1 { bottom: 100px; right: 40px; animation-delay: 0s; }
  .fc-2 { top: 100px; right: 200px; animation-delay: 2s; }
  @keyframes cardFloat {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-12px); }
  }
  .fc-icon {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
    flex-shrink: 0;
  }
  .fc-icon-blue  { background: var(--blue-50); }
  .fc-icon-green { background: #F0FDF4; }
  .fc-title { font-size: 13px; font-weight: 800; color: var(--slate-800); }
  .fc-sub   { font-size: 11px; font-weight: 600; color: var(--slate-400); }

  /* ── RIGHT PANEL ── */
  .right-panel {
    flex: 0 0 45%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 48px 52px;
    background: #fff;
    overflow-y: auto;
    position: relative;
  }

  .right-logo {
    display: flex; align-items: center; gap: 10px;
    position: absolute; top: 32px; left: 40px;
  }
  .logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: #fff;
  }
  .logo-text { font-size: 16px; font-weight: 900; color: var(--slate-800); }
  .logo-text span { color: var(--blue-600); }

  .right-inner { width: 100%; max-width: 360px; }

  /* Default view */
  .right-title {
    font-family: 'Lora', serif;
    font-size: 28px; font-weight: 700;
    color: var(--slate-800);
    margin-bottom: 8px;
    animation: fadeInUp 0.5s ease both;
  }
  .right-sub {
    font-size: 14px; color: var(--slate-500); font-weight: 600;
    margin-bottom: 36px;
    animation: fadeInUp 0.5s ease 0.05s both;
  }

  /* Role cards */
  .role-cards { display: flex; flex-direction: column; gap: 14px; animation: fadeInUp 0.5s ease 0.1s both; }

  .role-card {
    cursor: pointer;
    border: 2px solid #E2E8F0;
    border-radius: 18px;
    padding: 20px 22px;
    display: flex; align-items: center; gap: 16px;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    background: #fff;
    position: relative; overflow: hidden;
  }
  .role-card::after {
    content: '→';
    position: absolute; right: 20px;
    font-size: 18px; color: var(--slate-400);
    transition: all 0.25s;
  }
  .role-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(37,99,235,0.12);
  }
  .role-card:hover::after { right: 14px; color: var(--blue-600); }
  .role-card.patient:hover { border-color: var(--blue-400); }
  .role-card.doctor:hover  { border-color: var(--teal-400);  }

  .rc-icon {
    width: 50px; height: 50px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; font-size: 24px;
    flex-shrink: 0;
  }
  .rc-icon-blue  { background: var(--blue-50);  }
  .rc-icon-teal  { background: #F0FDFA; }
  .rc-title { font-size: 16px; font-weight: 800; color: var(--slate-800); }
  .rc-sub   { font-size: 12px; font-weight: 600; color: var(--slate-400); }

  .admin-row {
    margin-top: 28px; text-align: center;
    animation: fadeInUp 0.5s ease 0.2s both;
  }
  .admin-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--slate-400);
    transition: color 0.2s;
  }
  .admin-btn:hover { color: var(--slate-600); }

  /* Portal view */
  .portal-wrap { animation: scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .back-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700;
    color: var(--slate-400);
    display: flex; align-items: center; gap: 6px;
    padding: 0; margin-bottom: 24px;
    transition: color 0.2s;
  }
  .back-btn:hover { color: var(--slate-700); }

  .portal-header {
    display: flex; align-items: center; gap: 14px; margin-bottom: 28px;
  }
  .ph-icon {
    width: 52px; height: 52px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center; font-size: 26px;
  }
  .ph-icon-blue { background: var(--blue-50); }
  .ph-icon-teal { background: #F0FDFA; }
  .ph-title { font-family: 'Lora', serif; font-size: 24px; font-weight: 700; color: var(--slate-800); }
  .ph-sub   { font-size: 13px; font-weight: 600; color: var(--slate-400); }

  .portal-actions { display: flex; flex-direction: column; gap: 12px; }

  .btn {
    width: 100%; padding: 15px 20px; border-radius: 14px; border: none;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 800; letter-spacing: 0.01em;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .btn:hover { transform: translateY(-2px); }
  .btn:active { transform: scale(0.98); }

  .btn-blue {
    background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
    color: #fff;
    box-shadow: 0 8px 24px rgba(37,99,235,0.3);
  }
  .btn-blue:hover { box-shadow: 0 12px 32px rgba(37,99,235,0.45); }

  .btn-outline-blue {
    background: #fff; border: 2px solid var(--blue-100); color: var(--blue-600);
  }
  .btn-outline-blue:hover { border-color: var(--blue-400); background: var(--blue-50); }

  .btn-teal {
    background: linear-gradient(135deg, var(--teal-500), var(--teal-400));
    color: #fff;
    box-shadow: 0 8px 24px rgba(20,184,166,0.3);
  }
  .btn-teal:hover { box-shadow: 0 12px 32px rgba(20,184,166,0.45); }

  .btn-outline-teal {
    background: #fff; border: 2px solid #CCFBF1; color: var(--teal-500);
  }
  .btn-outline-teal:hover { border-color: var(--teal-400); background: #F0FDFA; }

  .divider {
    display: flex; align-items: center; gap: 10px; margin: 2px 0;
  }
  .dv-line { flex: 1; height: 1px; background: #E2E8F0; }
  .dv-text { font-size: 11px; font-weight: 700; color: var(--slate-400); letter-spacing: 0.1em; text-transform: uppercase; }

  /* Animations */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Responsive: stack on small screens */
  @media (max-width: 768px) {
    .page { flex-direction: column; height: auto; min-height: 100vh; }
    .left-panel { flex: 0 0 auto; padding: 48px 28px; }
    .right-panel { flex: 0 0 auto; padding: 40px 24px; }
    .float-card { display: none; }
    .stats-row { gap: 20px; }
  }
`;

function LandingPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <>
      <style>{styles}</style>
      <div className="page">

        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          <div className="lb-1 left-blob" />
          <div className="lb-2 left-blob" />
          <div className="lb-3 left-blob" />

          <div className="left-content">
            <div className="lp-badge">
              <span className="lp-badge-dot" />
              <span className="lp-badge-text">Trusted Healthcare Platform</span>
            </div>

            <h1 className="lp-heading">
              Book Your Doctor<br />
              Appointment<br />
              <span>Instantly & Safely</span>
            </h1>

            <p className="lp-sub">
              Connect with verified specialists, view real-time availability, and manage your entire healthcare journey from one seamless platform.
            </p>

            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-num">500<span>+</span></div>
                <div className="stat-label">Doctors</div>
              </div>
              <div className="stats-divider" />
              <div className="stat-item">
                <div className="stat-num">20k<span>+</span></div>
                <div className="stat-label">Patients</div>
              </div>
              <div className="stats-divider" />
              <div className="stat-item">
                <div className="stat-num">98<span>%</span></div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <div className="float-card fc-1">
            <div className="fc-icon fc-icon-green">✅</div>
            <div>
              <div className="fc-title">Appointment Confirmed</div>
              <div className="fc-sub">Dr. Sharma · 3:00 PM Today</div>
            </div>
          </div>
          <div className="float-card fc-2">
            <div className="fc-icon fc-icon-blue">🩺</div>
            <div>
              <div className="fc-title">500+ Specialists</div>
              <div className="fc-sub">All verified & available</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          <div className="right-logo">
            <div className="logo-icon">⚕️</div>
            <div className="logo-text">VITA<span>SYNC</span></div>
          </div>

          <div className="right-inner">

            {selectedRole === "" && (
              <>
                <h2 className="right-title">Get Started</h2>
                <p className="right-sub">Choose how you'd like to continue</p>

                <div className="role-cards">
                  <div className="role-card patient" onClick={() => setSelectedRole("PATIENT")}>
                    <div className="rc-icon rc-icon-blue">🙋</div>
                    <div>
                      <div className="rc-title">I'm a Patient</div>
                      <div className="rc-sub">Find & book appointments</div>
                    </div>
                  </div>

                  <div className="role-card doctor" onClick={() => setSelectedRole("DOCTOR")}>
                    <div className="rc-icon rc-icon-teal">👨‍⚕️</div>
                    <div>
                      <div className="rc-title">I'm a Doctor</div>
                      <div className="rc-sub">Manage your practice</div>
                    </div>
                  </div>
                </div>

                <div className="admin-row">
                  <button className="admin-btn" onClick={() => navigate("/login/admin")}>
                    Admin Access
                  </button>
                </div>
              </>
            )}

            {selectedRole === "PATIENT" && (
              <div className="portal-wrap">
                <button className="back-btn" onClick={() => setSelectedRole("")}>← Back</button>
                <div className="portal-header">
                  <div className="ph-icon ph-icon-blue">🙋</div>
                  <div>
                    <div className="ph-title">Patient Portal</div>
                    <div className="ph-sub">Sign in or create your account</div>
                  </div>
                </div>
                <div className="portal-actions">
                  <button className="btn btn-blue" onClick={() => navigate("/login/patient")}>
                    Sign In →
                  </button>
                  <div className="divider">
                    <div className="dv-line" /><span className="dv-text">or</span><div className="dv-line" />
                  </div>
                  <button className="btn btn-outline-blue" onClick={() => navigate("/register/patient")}>
                    Create Account
                  </button>
                </div>
              </div>
            )}

            {selectedRole === "DOCTOR" && (
              <div className="portal-wrap">
                <button className="back-btn" onClick={() => setSelectedRole("")}>← Back</button>
                <div className="portal-header">
                  <div className="ph-icon ph-icon-teal">👨‍⚕️</div>
                  <div>
                    <div className="ph-title">Doctor Portal</div>
                    <div className="ph-sub">Sign in or join the platform</div>
                  </div>
                </div>
                <div className="portal-actions">
                  <button className="btn btn-teal" onClick={() => navigate("/login/doctor")}>
                    Doctor Sign In →
                  </button>
                  <div className="divider">
                    <div className="dv-line" /><span className="dv-text">new here?</span><div className="dv-line" />
                  </div>
                  <button className="btn btn-outline-teal" onClick={() => navigate("/doctor-request")}>
                    Join as a Doctor
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;