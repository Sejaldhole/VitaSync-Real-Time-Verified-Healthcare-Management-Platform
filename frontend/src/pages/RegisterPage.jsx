import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lora:ital,wght@0,600;0,700;1,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; width: 100%; }

  :root {
    --blue-50: #EFF6FF;
    --blue-100: #DBEAFE;
    --blue-400: #60A5FA;
    --blue-500: #3B82F6;
    --blue-600: #2563EB;
    --blue-700: #1D4ED8;
    --teal-400: #2DD4BF;
    --green-400: #4ADE80;
    --green-500: #22C55E;
    --red-400: #F87171;
    --red-500: #EF4444;
    --slate-300: #CBD5E1;
    --slate-400: #94A3B8;
    --slate-500: #64748B;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1E293B;
  }

  .page {
    width: 100vw; height: 100vh;
    display: flex; overflow: hidden;
    font-family: 'Nunito', sans-serif;
    background: #F0F6FF;
  }

  /* ── LEFT PANEL ── */
  .left-panel {
    flex: 1 1 52%; position: relative; overflow: hidden;
    display: flex; flex-direction: column;
    justify-content: center; padding: 60px 64px;
    background: linear-gradient(145deg, #1a56db 0%, #1e3a8a 60%, #0f2460 100%);
  }
  .left-panel::before {
    content: ''; position: absolute;
    width: 500px; height: 500px; border-radius: 50%;
    border: 60px solid rgba(255,255,255,0.05);
    top: -160px; right: -120px;
  }
  .left-panel::after {
    content: ''; position: absolute;
    width: 300px; height: 300px; border-radius: 50%;
    border: 40px solid rgba(255,255,255,0.05);
    bottom: -80px; left: -60px;
  }

  .blob { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; }
  .b1 { width: 320px; height: 320px; background: rgba(96,165,250,0.25); top: 40px; right: 60px; animation: bf 8s ease-in-out infinite alternate; }
  .b2 { width: 200px; height: 200px; background: rgba(45,212,191,0.2); bottom: 80px; right: 140px; animation: bf 10s ease-in-out infinite alternate-reverse; }
  .b3 { width: 160px; height: 160px; background: rgba(255,255,255,0.08); top: 50%; left: 30%; animation: bf 12s ease-in-out infinite alternate; }
  @keyframes bf { from{transform:translate(0,0) scale(1);} to{transform:translate(20px,-30px) scale(1.08);} }

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

  /* Steps */
  .steps { display: flex; flex-direction: column; gap: 20px; animation: fadeInUp 0.5s ease 0.3s both; }
  .step-item { display: flex; align-items: flex-start; gap: 16px; }
  .step-num {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    background: rgba(255,255,255,0.12);
    border: 1.5px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 900; color: var(--teal-400);
  }
  .step-title { font-size: 14px; font-weight: 800; color: #fff; }
  .step-sub   { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); margin-top: 2px; }

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
    background: #F0FDF4;
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

  .role-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--blue-50); color: var(--blue-600);
    border-radius: 100px; padding: 5px 14px;
    font-size: 11px; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 20px;
    animation: fadeInUp 0.4s ease both;
  }

  .form-title {
    font-family: 'Lora', serif;
    font-size: 28px; font-weight: 700;
    color: var(--slate-800); margin-bottom: 6px;
    animation: fadeInUp 0.4s ease 0.05s both;
  }
  .form-sub {
    font-size: 14px; font-weight: 600;
    color: var(--slate-400); margin-bottom: 28px;
    animation: fadeInUp 0.4s ease 0.1s both;
  }

  /* Password strength */
  .strength-bar {
    display: flex; gap: 4px; margin-top: 8px;
  }
  .strength-seg {
    flex: 1; height: 4px; border-radius: 4px;
    background: #E2E8F0;
    transition: background 0.3s;
  }
  .strength-seg.weak   { background: var(--red-400); }
  .strength-seg.fair   { background: #FBBF24; }
  .strength-seg.good   { background: var(--blue-400); }
  .strength-seg.strong { background: var(--green-500); }
  .strength-label {
    font-size: 11px; font-weight: 800; margin-top: 4px;
    letter-spacing: 0.05em; text-transform: uppercase;
  }
  .sl-weak   { color: var(--red-400); }
  .sl-fair   { color: #FBBF24; }
  .sl-good   { color: var(--blue-400); }
  .sl-strong { color: var(--green-500); }

  /* Fields */
  .fields { display: flex; flex-direction: column; gap: 14px; animation: fadeInUp 0.4s ease 0.15s both; }

  .field-group { display: flex; flex-direction: column; gap: 5px; }
  .field-label { font-size: 13px; font-weight: 800; color: var(--slate-700); }

  .field-input-wrap { position: relative; }
  .field-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%); font-size: 16px; pointer-events: none;
  }
  .field-input {
    width: 100%; padding: 13px 14px 13px 42px;
    border: 2px solid #E2E8F0; border-radius: 12px; outline: none;
    font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 600; color: var(--slate-800);
    background: #fff; transition: all 0.2s;
  }
  .field-input::placeholder { color: var(--slate-400); font-weight: 600; }
  .field-input:focus { border-color: var(--blue-400); box-shadow: 0 0 0 4px rgba(96,165,250,0.12); }
  .field-input.has-error { border-color: var(--red-400); box-shadow: 0 0 0 4px rgba(248,113,113,0.1); }
  .field-input.valid { border-color: var(--green-500); }

  .field-error { font-size: 12px; font-weight: 700; color: var(--red-500); }

  /* Valid tick */
  .valid-tick {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--green-500); font-size: 16px;
  }

  /* Pw toggle */
  .pw-toggle {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    font-size: 16px; color: var(--slate-400); padding: 0;
    transition: color 0.2s;
  }
  .pw-toggle:hover { color: var(--slate-600); }

  /* Error toast */
  .error-toast {
    display: flex; align-items: center; gap: 10px;
    background: #FEF2F2; border: 1.5px solid #FECACA;
    border-radius: 12px; padding: 12px 14px;
    animation: shake 0.4s ease;
  }
  @keyframes shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-6px);} 40%{transform:translateX(6px);} 60%{transform:translateX(-4px);} 80%{transform:translateX(4px);} }
  .toast-text { font-size: 13px; font-weight: 700; color: var(--red-500); }

  /* Success toast */
  .success-toast {
    display: flex; align-items: center; gap: 10px;
    background: #F0FDF4; border: 1.5px solid #BBF7D0;
    border-radius: 12px; padding: 12px 14px;
    animation: fadeInUp 0.3s ease both;
  }
  .success-text { font-size: 13px; font-weight: 700; color: var(--green-500); }

  /* Terms */
  .terms-row {
    display: flex; align-items: flex-start; gap: 10px; margin-top: 2px;
  }
  .terms-check {
    width: 18px; height: 18px; border-radius: 5px;
    border: 2px solid #E2E8F0; cursor: pointer;
    flex-shrink: 0; margin-top: 1px;
    accent-color: var(--blue-600);
  }
  .terms-text { font-size: 12px; font-weight: 700; color: var(--slate-500); line-height: 1.5; }
  .terms-text a { color: var(--blue-600); text-decoration: none; }
  .terms-text a:hover { text-decoration: underline; }

  /* Submit */
  .submit-btn {
    width: 100%; padding: 15px; border-radius: 14px; border: none;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 800; color: #fff;
    background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
    box-shadow: 0 8px 24px rgba(37,99,235,0.3);
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(37,99,235,0.45); }
  .submit-btn:active:not(:disabled) { transform: scale(0.98); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg);} }

  .login-link {
    margin-top: 20px; text-align: center;
    animation: fadeInUp 0.4s ease 0.25s both;
  }
  .login-link p { font-size: 13px; font-weight: 700; color: var(--slate-400); }
  .login-link a { color: var(--blue-600); text-decoration: none; font-weight: 800; cursor: pointer; }
  .login-link a:hover { text-decoration: underline; }

  @keyframes fadeInUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 768px) {
    .page { flex-direction: column; height: auto; min-height: 100vh; }
    .left-panel { flex: 0 0 auto; padding: 48px 28px; }
    .right-panel { flex: 0 0 auto; padding: 40px 24px; }
    .float-card { display: none; }
  }
`;

function getStrength(pw) {
  if (!pw) return { level: 0, label: "", cls: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    null,
    { label: "Weak",   cls: "weak"   },
    { label: "Fair",   cls: "fair"   },
    { label: "Good",   cls: "good"   },
    { label: "Strong", cls: "strong" },
  ];
  return { level: score, ...map[score] };
}

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [agreed, setAgreed]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [touched, setTouched]     = useState({});

  const strength = getStrength(password);

  const touch = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const nameError    = touched.name    && name.trim().length < 2      ? "Please enter your full name"           : "";
  const emailError   = touched.email   && !email.includes("@")        ? "Enter a valid email address"           : "";
  const pwError      = touched.pw      && password.length < 6         ? "Password must be at least 6 characters": "";
  const cfError      = touched.cf      && confirm !== password         ? "Passwords do not match"                : "";

  const isValid = name.trim().length >= 2 && email.includes("@") && password.length >= 6 && confirm === password && agreed;

  const handleRegister = async () => {
    setTouched({ name: true, email: true, pw: true, cf: true });
    if (!isValid) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role: "PATIENT",
      });

      setSuccess(response.data || "Account created successfully!");
      setTimeout(() => navigate("/login/patient"), 1500);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleRegister(); };

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
              <span className="badge-text">Free to Join</span>
            </div>

            <h1 className="lp-heading">
              Join Thousands of<br />
              Patients Who Trust<br />
              <em>VITASYNC</em>
            </h1>

            <p className="lp-sub">
              Create your free account in minutes and get instant access to hundreds of verified doctors across all specialties.
            </p>

            <div className="steps">
              {[
                { n: "1", title: "Create Your Account",    sub: "Fill in your basic details to get started" },
                { n: "2", title: "Browse Specialists",     sub: "Search by specialty, location or availability" },
                { n: "3", title: "Book Instantly",         sub: "Confirm your slot and get a reminder" },
              ].map((s) => (
                <div className="step-item" key={s.n}>
                  <div className="step-num">{s.n}</div>
                  <div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-sub">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="float-card">
            <div className="fc-icon">🎉</div>
            <div>
              <div className="fc-title">It's completely free</div>
              <div className="fc-sub">No credit card needed</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          <div className="logo">
            <div className="logo-icon">⚕️</div>
            <div className="logo-text">VITA<span>SYNC</span></div>
          </div>

          <button className="back-link" onClick={() => navigate("/")}>← Home</button>

          <div className="form-wrap">
            <div className="role-pill">🙋 Patient Registration</div>

            <h2 className="form-title">Create Account</h2>
            <p className="form-sub">Get started — it only takes a minute</p>

            <div className="fields">

              {error   && <div className="error-toast">  <span>⚠️</span><span className="toast-text">{error}</span></div>}
              {success && <div className="success-toast"><span>✅</span><span className="success-text">{success}</span></div>}

              {/* Full Name */}
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <div className="field-input-wrap">
                  <span className="field-icon">👤</span>
                  <input
                    className={`field-input ${nameError ? "has-error" : touched.name && name.trim().length >= 2 ? "valid" : ""}`}
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => touch("name")}
                    onKeyDown={handleKeyDown}
                    autoComplete="name"
                  />
                  {!nameError && touched.name && name.trim().length >= 2 && <span className="valid-tick">✓</span>}
                </div>
                {nameError && <span className="field-error">{nameError}</span>}
              </div>

              {/* Email */}
              <div className="field-group">
                <label className="field-label">Email Address</label>
                <div className="field-input-wrap">
                  <span className="field-icon">✉️</span>
                  <input
                    className={`field-input ${emailError ? "has-error" : touched.email && email.includes("@") ? "valid" : ""}`}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => touch("email")}
                    onKeyDown={handleKeyDown}
                    autoComplete="email"
                  />
                  {!emailError && touched.email && email.includes("@") && <span className="valid-tick">✓</span>}
                </div>
                {emailError && <span className="field-error">{emailError}</span>}
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="field-input-wrap">
                  <span className="field-icon">🔑</span>
                  <input
                    className={`field-input ${pwError ? "has-error" : ""}`}
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => touch("pw")}
                    onKeyDown={handleKeyDown}
                    autoComplete="new-password"
                  />
                  <button className="pw-toggle" type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
                {pwError && <span className="field-error">{pwError}</span>}
                {password.length > 0 && (
                  <>
                    <div className="strength-bar">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className={`strength-seg ${i <= strength.level ? strength.cls : ""}`} />
                      ))}
                    </div>
                    {strength.label && <div className={`strength-label sl-${strength.cls}`}>{strength.label}</div>}
                  </>
                )}
              </div>

              {/* Confirm Password */}
              <div className="field-group">
                <label className="field-label">Confirm Password</label>
                <div className="field-input-wrap">
                  <span className="field-icon">🔒</span>
                  <input
                    className={`field-input ${cfError ? "has-error" : touched.cf && confirm === password && confirm ? "valid" : ""}`}
                    type={showCf ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onBlur={() => touch("cf")}
                    onKeyDown={handleKeyDown}
                    autoComplete="new-password"
                  />
                  <button className="pw-toggle" type="button" onClick={() => setShowCf(!showCf)} tabIndex={-1}>
                    {showCf ? "🙈" : "👁️"}
                  </button>
                </div>
                {cfError && <span className="field-error">{cfError}</span>}
              </div>

              {/* Terms */}
              <div className="terms-row">
                <input
                  className="terms-check"
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label className="terms-text" htmlFor="terms">
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </label>
              </div>

              <button className="submit-btn" onClick={handleRegister} disabled={loading}>
                {loading ? <><div className="spinner" /> Creating Account…</> : <>Create Account →</>}
              </button>
            </div>

            <div className="login-link">
              <p>Already have an account? <a onClick={() => navigate("/login/patient")}>Sign in</a></p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default RegisterPage;