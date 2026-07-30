import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

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
    --teal-500: #14B8A6;
    --green-400: #4ADE80;
    --green-500: #22C55E;
    --red-400: #F87171;
    --red-500: #EF4444;
    --slate-100: #F1F5F9;
    --slate-200: #E2E8F0;
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

  /* ── LEFT SIDEBAR ── */
  .left-panel {
    flex: 0 0 340px; position: relative; overflow: hidden;
    display: flex; flex-direction: column;
    justify-content: space-between; padding: 48px 40px;
    background: linear-gradient(145deg, #1a56db 0%, #1e3a8a 60%, #0f2460 100%);
  }
  .left-panel::before {
    content: ''; position: absolute;
    width: 400px; height: 400px; border-radius: 50%;
    border: 50px solid rgba(255,255,255,0.05);
    top: -120px; right: -120px;
  }
  .left-panel::after {
    content: ''; position: absolute;
    width: 260px; height: 260px; border-radius: 50%;
    border: 36px solid rgba(255,255,255,0.05);
    bottom: -60px; left: -60px;
  }

  .blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
  .b1 { width: 260px; height: 260px; background: rgba(96,165,250,0.2); top: 30px; right: 20px; animation: bf 8s ease-in-out infinite alternate; }
  .b2 { width: 160px; height: 160px; background: rgba(45,212,191,0.18); bottom: 100px; right: 60px; animation: bf 11s ease-in-out infinite alternate-reverse; }
  @keyframes bf { from{transform:translate(0,0) scale(1);} to{transform:translate(16px,-24px) scale(1.08);} }

  .left-top { position: relative; z-index: 2; }
  .left-bottom { position: relative; z-index: 2; }

  /* Logo */
  .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 48px; }
  .logo-icon {
    width: 38px; height: 38px; border-radius: 11px;
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: #fff;
  }
  .logo-name { font-size: 20px; font-weight: 900; color: #fff; letter-spacing: -0.02em; }
  .logo-name span { color: var(--teal-400); }

  /* Stepper */
  .stepper { display: flex; flex-direction: column; gap: 0; }
  .step-row { display: flex; align-items: flex-start; gap: 16px; }
  .step-line-wrap { display: flex; flex-direction: column; align-items: center; }
  .step-circle {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 900;
    transition: all 0.3s;
    border: 2px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.4);
    background: transparent;
  }
  .step-circle.active {
    background: #fff; color: var(--blue-700);
    border-color: #fff;
    box-shadow: 0 0 0 4px rgba(255,255,255,0.15);
  }
  .step-circle.done {
    background: var(--teal-400); color: #fff;
    border-color: var(--teal-400);
  }
  .step-connector {
    width: 2px; height: 36px;
    background: rgba(255,255,255,0.12);
    margin: 4px 0;
    transition: background 0.3s;
  }
  .step-connector.done { background: var(--teal-400); }
  .step-info { padding-top: 6px; padding-bottom: 36px; }
  .step-title-text {
    font-size: 14px; font-weight: 800; color: rgba(255,255,255,0.4);
    transition: color 0.3s;
  }
  .step-title-text.active { color: #fff; }
  .step-title-text.done   { color: rgba(255,255,255,0.65); }
  .step-sub-text { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.3); margin-top: 2px; }

  /* Left bottom note */
  .security-note {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 14px; padding: 14px 16px;
  }
  .sn-icon { font-size: 22px; }
  .sn-title { font-size: 13px; font-weight: 800; color: #fff; }
  .sn-sub   { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.45); margin-top: 2px; }

  /* ── RIGHT CONTENT ── */
  .right-panel {
    flex: 1; overflow-y: auto;
    padding: 48px 56px;
    background: #fff;
    display: flex; flex-direction: column;
  }

  /* Top bar */
  .top-bar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 40px; flex-shrink: 0;
  }
  .progress-info { display: flex; flex-direction: column; gap: 6px; }
  .progress-label { font-size: 12px; font-weight: 800; color: var(--slate-400); letter-spacing: 0.08em; text-transform: uppercase; }
  .progress-bar-wrap { width: 220px; height: 6px; background: var(--slate-100); border-radius: 10px; overflow: hidden; }
  .progress-bar-fill {
    height: 100%; border-radius: 10px;
    background: linear-gradient(90deg, var(--blue-500), var(--teal-400));
    transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
  }

  .back-nav {
    background: none; border: none; cursor: pointer;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700;
    color: var(--slate-400);
    display: flex; align-items: center; gap: 6px;
    transition: color 0.2s;
  }
  .back-nav:hover { color: var(--slate-700); }

  /* Step header */
  .step-header { margin-bottom: 32px; flex-shrink: 0; animation: fadeInUp 0.4s ease both; }
  .step-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--blue-50); color: var(--blue-600);
    border-radius: 100px; padding: 4px 12px;
    font-size: 11px; font-weight: 800;
    letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 12px;
  }
  .step-heading {
    font-family: 'Lora', serif;
    font-size: 26px; font-weight: 700;
    color: var(--slate-800); margin-bottom: 6px;
  }
  .step-desc { font-size: 14px; font-weight: 600; color: var(--slate-400); }

  /* Form grid */
  .form-body { flex: 1; animation: fadeInUp 0.4s ease 0.05s both; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-1 { display: grid; grid-template-columns: 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .col-span-2 { grid-column: span 2; }

  .field-group { display: flex; flex-direction: column; gap: 5px; }
  .field-label { font-size: 13px; font-weight: 800; color: var(--slate-700); }
  .field-required { color: var(--red-400); margin-left: 2px; }

  .field-input-wrap { position: relative; }
  .field-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%); font-size: 15px; pointer-events: none;
  }
  .field-input, .field-textarea, .field-select {
    width: 100%; padding: 12px 14px 12px 40px;
    border: 2px solid var(--slate-200); border-radius: 12px; outline: none;
    font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 600; color: var(--slate-800);
    background: #fff; transition: all 0.2s;
  }
  .field-input::placeholder, .field-textarea::placeholder { color: var(--slate-400); font-weight: 600; }
  .field-input:focus, .field-textarea:focus, .field-select:focus {
    border-color: var(--blue-400);
    box-shadow: 0 0 0 4px rgba(96,165,250,0.12);
  }
  .field-input.has-error { border-color: var(--red-400); box-shadow: 0 0 0 4px rgba(248,113,113,0.1); }
  .field-input.valid { border-color: var(--green-500); }
  .field-select { padding-left: 40px; cursor: pointer; }
  .field-textarea { padding: 12px 14px; min-height: 100px; resize: vertical; }
  .field-textarea.no-icon { padding-left: 14px; }

  /* no-icon fields */
  .field-input.no-icon, .field-select.no-icon { padding-left: 14px; }

  .field-error { font-size: 12px; font-weight: 700; color: var(--red-500); }
  .field-hint  { font-size: 11px; font-weight: 600; color: var(--slate-400); }

  /* Show pw toggle */
  .pw-toggle {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    font-size: 15px; color: var(--slate-400); padding: 0;
    transition: color 0.2s;
  }
  .pw-toggle:hover { color: var(--slate-600); }

  /* Time fields row */
  .time-row { display: flex; align-items: center; gap: 12px; }
  .time-sep { font-size: 14px; font-weight: 800; color: var(--slate-400); flex-shrink: 0; }

  /* Section divider */
  .section-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0 16px;
  }
  .sd-line { flex: 1; height: 1px; background: var(--slate-200); }
  .sd-label { font-size: 11px; font-weight: 800; color: var(--slate-400); letter-spacing: 0.1em; text-transform: uppercase; }

  /* Toast */
  .error-toast {
    display: flex; align-items: center; gap: 10px;
    background: #FEF2F2; border: 1.5px solid #FECACA;
    border-radius: 12px; padding: 12px 14px; margin-bottom: 16px;
    animation: shake 0.4s ease;
  }
  @keyframes shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-6px);} 40%{transform:translateX(6px);} 60%{transform:translateX(-4px);} 80%{transform:translateX(4px);} }
  .toast-text { font-size: 13px; font-weight: 700; color: var(--red-500); }

  .success-toast {
    display: flex; align-items: center; gap: 10px;
    background: #F0FDF4; border: 1.5px solid #BBF7D0;
    border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;
    animation: fadeInUp 0.3s ease both;
  }
  .success-text { font-size: 13px; font-weight: 700; color: var(--green-500); }

  /* Bottom nav */
  .form-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 32px; flex-shrink: 0;
    padding-top: 24px; border-top: 2px solid var(--slate-100);
  }

  .btn-prev {
    padding: 13px 24px; border-radius: 12px;
    border: 2px solid var(--slate-200); background: #fff;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    color: var(--slate-600); cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    transition: all 0.2s;
  }
  .btn-prev:hover { border-color: var(--slate-300); background: var(--slate-100); }

  .btn-next {
    padding: 13px 28px; border-radius: 12px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    color: #fff; cursor: pointer;
    background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
    box-shadow: 0 8px 24px rgba(37,99,235,0.28);
    display: flex; align-items: center; gap: 8px;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .btn-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(37,99,235,0.4); }
  .btn-next:active:not(:disabled) { transform: scale(0.98); }
  .btn-next:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-next.teal {
    background: linear-gradient(135deg, var(--teal-500), var(--teal-400));
    box-shadow: 0 8px 24px rgba(20,184,166,0.28);
  }
  .btn-next.teal:hover:not(:disabled) { box-shadow: 0 12px 32px rgba(20,184,166,0.4); }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg);} }

  /* Review card */
  .review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .review-item {
    background: var(--slate-100); border-radius: 12px;
    padding: 12px 14px;
  }
  .review-item.full { grid-column: span 2; }
  .ri-label { font-size: 11px; font-weight: 800; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
  .ri-value { font-size: 14px; font-weight: 700; color: var(--slate-800); }

  @keyframes fadeInUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 900px) {
    .page { flex-direction: column; height: auto; min-height: 100vh; overflow: auto; }
    .left-panel { flex: 0 0 auto; padding: 36px 28px; }
    .right-panel { padding: 32px 24px; }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
    .review-grid { grid-template-columns: 1fr; }
    .review-item.full { grid-column: span 1; }
    .progress-bar-wrap { width: 140px; }
  }
`;

const STEPS = [
  { title: "Personal Info",    sub: "Basic account details"    },
  { title: "Qualifications",   sub: "Medical background"       },
  { title: "Practice Details", sub: "Hospital & fees"          },
  { title: "Availability",     sub: "Schedule & slots"         },
  { title: "Review & Submit",  sub: "Confirm your information" },
];

const SPECIALIZATIONS = [
  "General Physician","Cardiologist","Dermatologist","Neurologist",
  "Orthopedic Surgeon","Pediatrician","Psychiatrist","Gynecologist",
  "Oncologist","Radiologist","ENT Specialist","Ophthalmologist",
  "Urologist","Endocrinologist","Gastroenterologist","Other",
];

function DoctorRequestPage() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [showPw, setShowPw]   = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    specialization: "", degree: "", experience: "",
    licenseNumber: "",
    hospitalName: "", hospitalAddress: "", consultationFees: "",
    startTime: "", endTime: "", slotDuration: "",
    about: "", profileImageUrl: "",
  });

  const update = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim())          return "Full name is required";
      if (!form.email.includes("@"))  return "Valid email is required";
      if (!/^\d{7,15}$/.test(form.phone.replace(/\s/g,""))) return "Valid phone number is required";
      if (form.password.length < 6)   return "Password must be at least 6 characters";
    }
    if (step === 1) {
      if (!form.specialization)       return "Please select a specialization";
      if (!form.degree.trim())        return "Degree is required";
      if (!form.experience)           return "Years of experience is required";
      if (!form.licenseNumber.trim()) return "License number is required";
    }
    if (step === 2) {
      if (!form.hospitalName.trim())    return "Hospital name is required";
      if (!form.hospitalAddress.trim()) return "Hospital address is required";
      if (!form.consultationFees)       return "Consultation fee is required";
    }
    if (step === 3) {
      if (!form.startTime) return "Start time is required";
      if (!form.endTime)   return "End time is required";
      if (!form.slotDuration) return "Slot duration is required";
    }
    return "";
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => Math.min(s + 1, 4));
  };

  const prev = () => { setError(""); setStep((s) => Math.max(s - 1, 0)); };

  const submit = async () => {
    setLoading(true); setError("");
    try {
      await api.post("/doctor-request", form);
      setSuccess("Your request has been submitted! We'll review and get back to you within 24–48 hours.");
      setTimeout(() => navigate("/"), 3000);
    } catch {
      setError("Submission failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const progressPct = ((step) / (STEPS.length - 1)) * 100;

  return (
    <>
      <style>{styles}</style>
      <div className="page">

        {/* ── LEFT SIDEBAR ── */}
        <div className="left-panel">
          <div className="blob b1" /><div className="blob b2" />

          <div className="left-top">
            <div className="logo">
              <div className="logo-icon">⚕️</div>
              <div className="logo-name">Vita<span>Sync</span></div>
            </div>

            <div className="stepper">
              {STEPS.map((s, i) => (
                <div key={i}>
                  <div className="step-row">
                    <div className="step-line-wrap">
                      <div className={`step-circle ${i < step ? "done" : i === step ? "active" : ""}`}>
                        {i < step ? "✓" : i + 1}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`step-connector ${i < step ? "done" : ""}`} />
                      )}
                    </div>
                    <div className="step-info">
                      <div className={`step-title-text ${i < step ? "done" : i === step ? "active" : ""}`}>
                        {s.title}
                      </div>
                      <div className="step-sub-text">{s.sub}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="left-bottom">
            <div className="security-note">
              <div className="sn-icon">🔒</div>
              <div>
                <div className="sn-title">Secure & Verified</div>
                <div className="sn-sub">Your data is encrypted and reviewed by our medical team</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div className="right-panel">

          {/* Top bar */}
          <div className="top-bar">
            <div className="progress-info">
              <div className="progress-label">Step {step + 1} of {STEPS.length}</div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
            <button className="back-nav" onClick={() => navigate("/")}>← Back to Home</button>
          </div>

          {/* ── STEP 0: Personal Info ── */}
          {step === 0 && (
            <>
              <div className="step-header">
                <div className="step-tag">👤 Step 1</div>
                <h2 className="step-heading">Personal Information</h2>
                <p className="step-desc">Tell us about yourself to create your doctor account</p>
              </div>
              <div className="form-body">
                {error && <div className="error-toast"><span>⚠️</span><span className="toast-text">{error}</span></div>}
                <div className="grid-2">
                  <div className="field-group col-span-2">
                    <label className="field-label">Full Name <span className="field-required">*</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">👤</span>
                      <input className="field-input" type="text" name="name" placeholder="Dr. John Sharma" value={form.name} onChange={update} />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Email Address <span className="field-required">*</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">✉️</span>
                      <input className="field-input" type="email" name="email" placeholder="doctor@example.com" value={form.email} onChange={update} />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Phone Number <span className="field-required">*</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">📱</span>
                      <input className="field-input" type="text" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={update} />
                    </div>
                  </div>

                  <div className="field-group col-span-2">
                    <label className="field-label">Password <span className="field-required">*</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">🔑</span>
                      <input className="field-input" type={showPw ? "text" : "password"} name="password" placeholder="Min. 6 characters" value={form.password} onChange={update} />
                      <button className="pw-toggle" type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}>{showPw ? "🙈" : "👁️"}</button>
                    </div>
                  </div>

                  <div className="field-group col-span-2">
                    <label className="field-label">Profile Image URL <span style={{fontWeight:600,color:'var(--slate-400)',fontSize:'11px'}}>(optional)</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">🖼️</span>
                      <input className="field-input" type="text" name="profileImageUrl" placeholder="https://..." value={form.profileImageUrl} onChange={update} />
                    </div>
                    <span className="field-hint">Paste a direct link to your professional photo</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 1: Qualifications ── */}
          {step === 1 && (
            <>
              <div className="step-header">
                <div className="step-tag">🎓 Step 2</div>
                <h2 className="step-heading">Medical Qualifications</h2>
                <p className="step-desc">Your credentials help patients trust your expertise</p>
              </div>
              <div className="form-body">
                {error && <div className="error-toast"><span>⚠️</span><span className="toast-text">{error}</span></div>}
                <div className="grid-2">
                  <div className="field-group col-span-2">
                    <label className="field-label">Specialization <span className="field-required">*</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">🩺</span>
                      <select className="field-select" name="specialization" value={form.specialization} onChange={update}>
                        <option value="">Select your specialization</option>
                        {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Degree / Qualification <span className="field-required">*</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">📜</span>
                      <input className="field-input" type="text" name="degree" placeholder="MBBS, MD, MS..." value={form.degree} onChange={update} />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Years of Experience <span className="field-required">*</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">⏳</span>
                      <input className="field-input" type="number" name="experience" placeholder="e.g. 8" min="0" max="60" value={form.experience} onChange={update} />
                    </div>
                  </div>

                  <div className="field-group col-span-2">
                    <label className="field-label">Medical License Number <span className="field-required">*</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">🪪</span>
                      <input className="field-input" type="text" name="licenseNumber" placeholder="MCI / State council number" value={form.licenseNumber} onChange={update} />
                    </div>
                    <span className="field-hint">Issued by Medical Council of India or your state medical council</span>
                  </div>

                  <div className="field-group col-span-2">
                    <label className="field-label">About You <span style={{fontWeight:600,color:'var(--slate-400)',fontSize:'11px'}}>(optional)</span></label>
                    <textarea className="field-textarea no-icon" name="about" placeholder="Briefly describe your practice, approach, and what patients can expect..." value={form.about} onChange={update} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: Practice Details ── */}
          {step === 2 && (
            <>
              <div className="step-header">
                <div className="step-tag">🏥 Step 3</div>
                <h2 className="step-heading">Practice Details</h2>
                <p className="step-desc">Where you practice and what you charge</p>
              </div>
              <div className="form-body">
                {error && <div className="error-toast"><span>⚠️</span><span className="toast-text">{error}</span></div>}
                <div className="grid-2">
                  <div className="field-group">
                    <label className="field-label">Hospital / Clinic Name <span className="field-required">*</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">🏥</span>
                      <input className="field-input" type="text" name="hospitalName" placeholder="Apollo Hospital" value={form.hospitalName} onChange={update} />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Consultation Fees (₹) <span className="field-required">*</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">💰</span>
                      <input className="field-input" type="number" name="consultationFees" placeholder="500" min="0" value={form.consultationFees} onChange={update} />
                    </div>
                  </div>

                  <div className="field-group col-span-2">
                    <label className="field-label">Hospital / Clinic Address <span className="field-required">*</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">📍</span>
                      <input className="field-input" type="text" name="hospitalAddress" placeholder="123, MG Road, Bengaluru, Karnataka 560001" value={form.hospitalAddress} onChange={update} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 3: Availability ── */}
          {step === 3 && (
            <>
              <div className="step-header">
                <div className="step-tag">📅 Step 4</div>
                <h2 className="step-heading">Availability & Schedule</h2>
                <p className="step-desc">Set your daily working hours and appointment slot size</p>
              </div>
              <div className="form-body">
                {error && <div className="error-toast"><span>⚠️</span><span className="toast-text">{error}</span></div>}
                <div className="grid-1">
                  <div className="field-group">
                    <label className="field-label">Working Hours <span className="field-required">*</span></label>
                    <div className="time-row">
                      <div className="field-input-wrap" style={{flex:1}}>
                        <span className="field-icon">🌅</span>
                        <input className="field-input" type="time" name="startTime" value={form.startTime} onChange={update} />
                      </div>
                      <span className="time-sep">to</span>
                      <div className="field-input-wrap" style={{flex:1}}>
                        <span className="field-icon">🌇</span>
                        <input className="field-input" type="time" name="endTime" value={form.endTime} onChange={update} />
                      </div>
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Appointment Slot Duration <span className="field-required">*</span></label>
                    <div className="field-input-wrap">
                      <span className="field-icon">⏱️</span>
                      <select className="field-select" name="slotDuration" value={form.slotDuration} onChange={update}>
                        <option value="">Select duration</option>
                        {[10,15,20,30,45,60].map((m) => (
                          <option key={m} value={m}>{m} minutes</option>
                        ))}
                      </select>
                    </div>
                    <span className="field-hint">
                      {form.startTime && form.endTime && form.slotDuration
                        ? (() => {
                            const [sh,sm] = form.startTime.split(":").map(Number);
                            const [eh,em] = form.endTime.split(":").map(Number);
                            const total = (eh*60+em) - (sh*60+sm);
                            const slots = total > 0 ? Math.floor(total / Number(form.slotDuration)) : 0;
                            return `Approx. ${slots} slots available per day`;
                          })()
                        : "Select times and duration to see available slots"
                      }
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 4: Review ── */}
          {step === 4 && (
            <>
              <div className="step-header">
                <div className="step-tag">✅ Step 5</div>
                <h2 className="step-heading">Review & Submit</h2>
                <p className="step-desc">Please verify your details before submitting your request</p>
              </div>
              <div className="form-body">
                {error   && <div className="error-toast"><span>⚠️</span><span className="toast-text">{error}</span></div>}
                {success && (
                  <div className="success-toast">
                    <span style={{fontSize:'22px'}}>🎉</span>
                    <div>
                      <div className="success-text">Request Submitted Successfully!</div>
                      <div style={{fontSize:'12px',fontWeight:600,color:'var(--slate-500)',marginTop:'2px'}}>{success}</div>
                    </div>
                  </div>
                )}

                {!success && (
                  <div className="review-grid">
                    {[
                      { label: "Full Name",          value: form.name          },
                      { label: "Email",              value: form.email         },
                      { label: "Phone",              value: form.phone         },
                      { label: "Specialization",     value: form.specialization},
                      { label: "Degree",             value: form.degree        },
                      { label: "Experience",         value: form.experience ? `${form.experience} years` : "" },
                      { label: "License Number",     value: form.licenseNumber },
                      { label: "Hospital / Clinic",  value: form.hospitalName  },
                      { label: "Consultation Fee",   value: form.consultationFees ? `₹${form.consultationFees}` : "" },
                      { label: "Working Hours",      value: form.startTime && form.endTime ? `${form.startTime} – ${form.endTime}` : "" },
                      { label: "Slot Duration",      value: form.slotDuration ? `${form.slotDuration} min` : "" },
                      { label: "Hospital Address",   value: form.hospitalAddress, full: true },
                      { label: "About",              value: form.about,           full: true },
                    ].map((item, i) => (
                      <div key={i} className={`review-item ${item.full ? "full" : ""}`}>
                        <div className="ri-label">{item.label}</div>
                        <div className="ri-value">{item.value || <span style={{color:'var(--slate-400)',fontWeight:600}}>—</span>}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Footer nav */}
          {!success && (
            <div className="form-footer">
              <button className="btn-prev" onClick={step === 0 ? () => navigate("/") : prev}>
                ← {step === 0 ? "Cancel" : "Previous"}
              </button>
              {step < 4 ? (
                <button className="btn-next" onClick={next}>
                  Continue →
                </button>
              ) : (
                <button className={`btn-next teal`} onClick={submit} disabled={loading}>
                  {loading ? <><div className="spinner" /> Submitting…</> : <>Submit Request ✓</>}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default DoctorRequestPage;
