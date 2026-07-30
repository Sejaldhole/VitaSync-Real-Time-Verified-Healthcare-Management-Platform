import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lora:ital,wght@0,600;0,700;1,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root { height: 100%; width: 100%; }

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
    --red-400: #F87171;
    --red-500: #EF4444;
    --slate-300: #CBD5E1;
    --slate-400: #94A3B8;
    --slate-500: #64748B;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1E293B;
    --amber-400: #FBBF24;
    --amber-500: #F59E0B;
  }

  .page {
    width: 100vw; height: 100vh;
    display: flex; overflow: hidden;
    font-family: 'Nunito', sans-serif;
    background: var(--bg);
  }

  /* ── LEFT PANEL ── */
  .left-panel {
    flex: 1 1 52%;
    position: relative; overflow: hidden;
    display: flex; flex-direction: column;
    justify-content: center; padding: 60px 64px;
    background: linear-gradient(145deg, #1a56db 0%, #1e3a8a 60%, #0f2460 100%);
  }
  .left-panel::before {
    content: '';
    position: absolute; width: 500px; height: 500px;
    border-radius: 50%; border: 60px solid rgba(255,255,255,0.05);
    top: -160px; right: -120px;
  }
  .left-panel::after {
    content: '';
    position: absolute; width: 300px; height: 300px;
    border-radius: 50%; border: 40px solid rgba(255,255,255,0.05);
    bottom: -80px; left: -60px;
  }

  .blob {
    position: absolute; border-radius: 50%;
    filter: blur(70px); pointer-events: none;
  }
  .b1 { width: 320px; height: 320px; background: rgba(96,165,250,0.25); top: 40px; right: 60px; animation: bf 8s ease-in-out infinite alternate; }
  .b2 { width: 200px; height: 200px; background: rgba(45,212,191,0.2); bottom: 80px; right: 140px; animation: bf 10s ease-in-out infinite alternate-reverse; }
  .b3 { width: 160px; height: 160px; background: rgba(255,255,255,0.08); top: 50%; left: 30%; animation: bf 12s ease-in-out infinite alternate; }
  @keyframes bf { from { transform: translate(0,0) scale(1); } to { transform: translate(20px,-30px) scale(1.08); } }

  .left-content { position: relative; z-index: 2; }

  .lp-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 100px; padding: 6px 16px;
    margin-bottom: 36px;
    animation: fadeInUp 0.5s ease both;
  }
  .badge-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--green-400);
    box-shadow: 0 0 10px var(--green-400);
    animation: pulse 2s ease infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  .badge-text { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.85); }

  .lp-heading {
    font-family: 'Lora', serif;
    font-size: clamp(30px, 3vw, 46px);
    font-weight: 700; line-height: 1.15;
    color: #fff; margin-bottom: 18px;
    animation: fadeInUp 0.5s ease 0.1s both;
  }
  .lp-heading em { font-style: italic; color: var(--teal-400); }

  .lp-sub {
    font-size: 15px; font-weight: 400;
    color: rgba(255,255,255,0.6);
    line-height: 1.75; max-width: 400px;
    margin-bottom: 44px;
    animation: fadeInUp 0.5s ease 0.2s both;
  }

  /* Features list */
  .features { display: flex; flex-direction: column; gap: 16px; animation: fadeInUp 0.5s ease 0.3s both; }
  .feature-item { display: flex; align-items: center; gap: 14px; }
  .fi-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .fi-title { font-size: 14px; font-weight: 800; color: #fff; }
  .fi-sub   { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); }

  /* Floating card */
  .float-card {
    position: absolute; background: #fff;
    border-radius: 18px; padding: 14px 18px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.18);
    display: flex; align-items: center; gap: 12px;
    z-index: 3; bottom: 80px; right: 36px;
    animation: cardFloat 6s ease-in-out infinite;
  }
  @keyframes cardFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
  .fc-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--blue-50);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .fc-title { font-size: 13px; font-weight: 800; color: var(--slate-800); }
  .fc-sub   { font-size: 11px; font-weight: 600; color: var(--slate-400); }

  /* ── RIGHT PANEL ── */
  .right-panel {
    flex: 0 0 48%;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    padding: 48px 52px;
    background: #fff; overflow-y: auto; position: relative;
  }

  /* Logo */
  .logo {
    position: absolute; top: 32px; left: 40px;
    display: flex; align-items: center; gap: 10px;
  }
  .logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: #fff;
  }
  .logo-text { font-size: 16px; font-weight: 900; color: var(--slate-800); }
  .logo-text span { color: var(--blue-600); }

  /* Back nav */
  .back-link {
    position: absolute; top: 36px; right: 40px;
    background: none; border: none; cursor: pointer;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700;
    color: var(--slate-400);
    display: flex; align-items: center; gap: 6px;
    transition: color 0.2s;
  }
  .back-link:hover { color: var(--slate-700); }

  .form-wrap { width: 100%; max-width: 360px; }

  /* Role pill */
  .role-pill {
    display: inline-flex; align-items: center; gap: 8px;
    border-radius: 100px; padding: 5px 14px;
    font-size: 11px; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 20px;
    animation: fadeInUp 0.4s ease both;
  }
  .pill-patient { background: var(--blue-50);  color: var(--blue-600); }
  .pill-doctor  { background: #F0FDFA;         color: var(--teal-500); }
  .pill-admin   { background: #FFFBEB;         color: var(--amber-500); }

  .form-title {
    font-family: 'Lora', serif;
    font-size: 28px; font-weight: 700;
    color: var(--slate-800); margin-bottom: 6px;
    animation: fadeInUp 0.4s ease 0.05s both;
  }
  .form-sub {
    font-size: 14px; font-weight: 600;
    color: var(--slate-400); margin-bottom: 32px;
    animation: fadeInUp 0.4s ease 0.1s both;
  }
  .form-sub a {
    color: var(--blue-600); text-decoration: none; font-weight: 800;
    transition: color 0.2s;
  }
  .form-sub a:hover { color: var(--blue-700); }

  /* Form fields */
  .fields { display: flex; flex-direction: column; gap: 16px; animation: fadeInUp 0.4s ease 0.15s both; }

  .field-group { display: flex; flex-direction: column; gap: 6px; }
  .field-label {
    font-size: 13px; font-weight: 800;
    color: var(--slate-700); letter-spacing: 0.02em;
  }
  .field-input-wrap { position: relative; }
  .field-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    font-size: 16px; pointer-events: none;
  }
  .field-input {
    width: 100%; padding: 13px 14px 13px 42px;
    border: 2px solid #E2E8F0;
    border-radius: 12px; outline: none;
    font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 600;
    color: var(--slate-800);
    background: #fff;
    transition: all 0.2s;
  }
  .field-input::placeholder { color: var(--slate-400); font-weight: 600; }
  .field-input:focus { border-color: var(--blue-400); box-shadow: 0 0 0 4px rgba(96,165,250,0.12); }
  .field-input.error { border-color: var(--red-400); box-shadow: 0 0 0 4px rgba(248,113,113,0.1); }
  .field-input.teal:focus { border-color: var(--teal-400); box-shadow: 0 0 0 4px rgba(45,212,191,0.12); }

  /* Password toggle */
  .pw-toggle {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    font-size: 16px; color: var(--slate-400);
    padding: 0; line-height: 1;
    transition: color 0.2s;
  }
  .pw-toggle:hover { color: var(--slate-600); }

  .field-error { font-size: 12px; font-weight: 700; color: var(--red-500); }

  /* Error toast */
  .error-toast {
    display: flex; align-items: center; gap: 10px;
    background: #FEF2F2; border: 1.5px solid #FECACA;
    border-radius: 12px; padding: 12px 14px;
    animation: shake 0.4s ease;
  }
  @keyframes shake {
    0%,100%{transform:translateX(0);}
    20%{transform:translateX(-6px);}
    40%{transform:translateX(6px);}
    60%{transform:translateX(-4px);}
    80%{transform:translateX(4px);}
  }
  .toast-text { font-size: 13px; font-weight: 700; color: var(--red-500); }

  /* Submit button */
  .submit-btn {
    width: 100%; padding: 15px;
    border-radius: 14px; border: none;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 800;
    color: #fff; margin-top: 8px;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; overflow: hidden;
  }
  .submit-btn:hover { transform: translateY(-2px); }
  .submit-btn:active { transform: scale(0.98); }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .btn-blue {
    background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
    box-shadow: 0 8px 24px rgba(37,99,235,0.3);
  }
  .btn-blue:hover:not(:disabled) { box-shadow: 0 12px 32px rgba(37,99,235,0.45); }

  .btn-teal {
    background: linear-gradient(135deg, var(--teal-500), var(--teal-400));
    box-shadow: 0 8px 24px rgba(20,184,166,0.3);
  }
  .btn-teal:hover:not(:disabled) { box-shadow: 0 12px 32px rgba(20,184,166,0.45); }

  .btn-amber {
    background: linear-gradient(135deg, var(--amber-500), var(--amber-400));
    box-shadow: 0 8px 24px rgba(245,158,11,0.3);
  }
  .btn-amber:hover:not(:disabled) { box-shadow: 0 12px 32px rgba(245,158,11,0.45); }

  /* Spinner */
  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Register link (patient only) */
  .register-link {
    margin-top: 20px; text-align: center;
    animation: fadeInUp 0.4s ease 0.25s both;
  }
  .register-link p { font-size: 13px; font-weight: 700; color: var(--slate-400); }
  .register-link a { color: var(--blue-600); text-decoration: none; font-weight: 800; }
  .register-link a:hover { text-decoration: underline; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .page { flex-direction: column; height: auto; min-height: 100vh; }
    .left-panel { flex: 0 0 auto; padding: 48px 28px; }
    .right-panel { flex: 0 0 auto; padding: 40px 24px; }
    .float-card { display: none; }
    .back-link { top: 16px; right: 16px; }
    .logo { top: 16px; left: 16px; }
  }
`;

const ROLE_CONFIG = {
  patient: {
    label: "Patient",
    emoji: "🙋",
    pillClass: "pill-patient",
    btnClass: "btn-blue",
    inputClass: "",
    heading: "Welcome Back",
    sub: "Sign in to manage your appointments",
    feature: "Book appointments in seconds",
  },
  doctor: {
    label: "Doctor",
    emoji: "👨‍⚕️",
    pillClass: "pill-doctor",
    btnClass: "btn-teal",
    inputClass: "teal",
    heading: "Doctor Portal",
    sub: "Sign in to manage your practice",
    feature: "Manage your schedule & patients",
  },
  admin: {
    label: "Admin",
    emoji: "🛡️",
    pillClass: "pill-admin",
    btnClass: "btn-amber",
    inputClass: "",
    heading: "Admin Access",
    sub: "Restricted to authorized personnel",
    feature: "Full platform control",
  },
};

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();
  const { role } = useParams();
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.patient;

  const validate = () => {
    let valid = true;
    setEmailError("");
    setError("");
    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }
    if (password.length < 1) {
      setError("Password is required");
      valid = false;
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", { email, password });

      if (
        response.data === "User not found!" ||
        response.data === "Invalid password!"
      ) {
        setError(response.data);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", response.data);

      if (role === "patient") navigate("/dashboard");
      else if (role === "doctor") navigate("/doctor-dashboard");
      else if (role === "admin") navigate("/admin-dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page">

        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />

          <div className="left-content">
            <div className="lp-badge">
              <span className="badge-dot" />
              <span className="badge-text">Secure Login</span>
            </div>

            <h1 className="lp-heading">
              Your Health<br />
              Journey Starts<br />
              <em>Right Here</em>
            </h1>

            <p className="lp-sub">
              Access your personalized dashboard, connect with doctors, and take control of your healthcare — all securely protected.
            </p>

            <div className="features">
              {[
                { icon: "🔒", title: "Secure & Encrypted", sub: "Your data is always safe with us" },
                { icon: "⚡", title: "Instant Access", sub: cfg.feature },
                { icon: "📱", title: "Available 24/7", sub: "Book anytime, from anywhere" },
              ].map((f, i) => (
                <div className="feature-item" key={i}>
                  <div className="fi-icon">{f.icon}</div>
                  <div>
                    <div className="fi-title">{f.title}</div>
                    <div className="fi-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="float-card">
            <div className="fc-icon">🛡️</div>
            <div>
              <div className="fc-title">256-bit Encrypted</div>
              <div className="fc-sub">Bank-level security</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          <div className="logo">
            <div className="logo-icon">⚕️</div>
            <div className="logo-text">VITA<span>SYNC</span></div>
          </div>

          <button className="back-link" onClick={() => navigate("/")}>
            ← Home
          </button>

          <div className="form-wrap">
            <div className={`role-pill ${cfg.pillClass}`}>
              {cfg.emoji} {cfg.label} Login
            </div>

            <h2 className="form-title">{cfg.heading}</h2>
            <p className="form-sub">{cfg.sub}</p>

            <div className="fields">
              {error && (
                <div className="error-toast">
                  <span>⚠️</span>
                  <span className="toast-text">{error}</span>
                </div>
              )}

              {/* Email */}
              <div className="field-group">
                <label className="field-label">Email Address</label>
                <div className="field-input-wrap">
                  <span className="field-icon">✉️</span>
                  <input
                    className={`field-input ${cfg.inputClass} ${emailError ? "error" : ""}`}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    onKeyDown={handleKeyDown}
                    autoComplete="email"
                  />
                </div>
                {emailError && <span className="field-error">{emailError}</span>}
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="field-input-wrap">
                  <span className="field-icon">🔑</span>
                  <input
                    className={`field-input ${cfg.inputClass}`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="current-password"
                  />
                  <button
                    className="pw-toggle"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                className={`submit-btn ${cfg.btnClass}`}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <><div className="spinner" /> Signing in...</>
                ) : (
                  <>Sign In →</>
                )}
              </button>
            </div>

            {role === "patient" && (
              <div className="register-link">
                <p>Don't have an account? <a onClick={() => navigate("/register/patient")} style={{cursor:"pointer"}}>Create one</a></p>
              </div>
            )}
            {role === "doctor" && (
              <div className="register-link">
                <p>New doctor? <a onClick={() => navigate("/doctor-request")} style={{cursor:"pointer"}}>Join the platform</a></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;