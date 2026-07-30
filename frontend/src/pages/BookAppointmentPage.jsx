import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lora:ital,wght@0,600;0,700;1,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; width: 100%; }

  :root {
    --blue-50:#EFF6FF; --blue-100:#DBEAFE; --blue-400:#60A5FA;
    --blue-500:#3B82F6; --blue-600:#2563EB; --blue-700:#1D4ED8;
    --teal-400:#2DD4BF; --teal-500:#14B8A6;
    --green-50:#F0FDF4; --green-400:#4ADE80; --green-500:#22C55E; --green-600:#16A34A;
    --red-50:#FEF2F2; --red-400:#F87171; --red-500:#EF4444;
    --amber-50:#FFFBEB; --amber-400:#FBBF24; --amber-500:#F59E0B; --amber-600:#D97706;
    --slate-50:#F8FAFC; --slate-100:#F1F5F9; --slate-200:#E2E8F0;
    --slate-300:#CBD5E1; --slate-400:#94A3B8; --slate-500:#64748B;
    --slate-600:#475569; --slate-700:#334155; --slate-800:#1E293B;
  }

  .book-page { min-height: 100vh; background: #F0F6FF; font-family: 'Nunito', sans-serif; }

  /* ── HERO ── */
  .hero {
    background: linear-gradient(145deg, #1a56db 0%, #1e3a8a 60%, #0f2460 100%);
    position: relative; overflow: hidden; padding: 40px 0 56px;
  }
  .hero::before {
    content:''; position:absolute; width:460px; height:460px; border-radius:50%;
    border:56px solid rgba(255,255,255,0.05); top:-140px; right:-80px;
  }
  .hero::after {
    content:''; position:absolute; width:260px; height:260px; border-radius:50%;
    border:36px solid rgba(255,255,255,0.05); bottom:-70px; left:-50px;
  }
  .blob { position:absolute; border-radius:50%; filter:blur(70px); pointer-events:none; }
  .b1 { width:280px; height:280px; background:rgba(96,165,250,0.2); top:10px; right:60px; animation:bf 8s ease-in-out infinite alternate; }
  .b2 { width:160px; height:160px; background:rgba(45,212,191,0.18); bottom:10px; right:260px; animation:bf 11s ease-in-out infinite alternate-reverse; }
  @keyframes bf { from{transform:translate(0,0) scale(1);} to{transform:translate(18px,-22px) scale(1.08);} }

  .hero-inner {
    position:relative; z-index:2;
    max-width:1200px; margin:0 auto; padding:0 32px;
  }
  .back-btn {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(255,255,255,0.1); border:1.5px solid rgba(255,255,255,0.2);
    border-radius:12px; padding:8px 16px;
    font-family:'Nunito',sans-serif; font-size:13px; font-weight:800;
    color:rgba(255,255,255,0.85); cursor:pointer; transition:all 0.2s; margin-bottom:24px;
  }
  .back-btn:hover { background:rgba(255,255,255,0.18); }

  .hero-row { display:flex; align-items:center; gap:22px; }

  /* Doctor mini card in hero */
  .hero-doc-photo {
    width:80px; height:80px; border-radius:20px;
    object-fit:cover; border:3px solid rgba(255,255,255,0.25);
    box-shadow:0 8px 28px rgba(0,0,0,0.25); flex-shrink:0;
  }
  .hero-doc-placeholder {
    width:80px; height:80px; border-radius:20px;
    background:rgba(255,255,255,0.12); border:3px solid rgba(255,255,255,0.2);
    display:flex; align-items:center; justify-content:center;
    font-size:28px; font-weight:900; color:rgba(255,255,255,0.9);
    font-family:'Nunito',sans-serif; flex-shrink:0;
  }
  .hero-doc-info {}
  .hero-eyebrow {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2);
    border-radius:100px; padding:4px 12px;
    font-size:10px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase;
    color:rgba(255,255,255,0.8); margin-bottom:10px;
  }
  .badge-dot { width:6px; height:6px; border-radius:50%; background:#4ADE80; box-shadow:0 0 6px #4ADE80; animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  .hero-name { font-family:'Lora',serif; font-size:clamp(22px,2.8vw,34px); font-weight:700; color:#fff; line-height:1.1; margin-bottom:6px; }
  .hero-spec { font-size:14px; font-weight:700; color:var(--teal-400); margin-bottom:12px; }
  .hero-tags { display:flex; flex-wrap:wrap; gap:8px; }
  .hero-tag {
    display:inline-flex; align-items:center; gap:5px;
    background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15);
    border-radius:9px; padding:5px 12px;
    font-size:12px; font-weight:700; color:rgba(255,255,255,0.82);
  }

  /* ── BODY ── */
  .page-body {
    max-width:1200px; margin:0 auto;
    padding:28px 32px 64px;
    display:grid; grid-template-columns:1fr 380px; gap:24px;
    position:relative; top:-28px;
  }

  /* ── CARD BASE ── */
  .card {
    background:#fff; border-radius:22px;
    border:2px solid var(--slate-200);
    box-shadow:0 2px 12px rgba(0,0,0,0.05);
    overflow:hidden; animation:fadeInUp 0.4s ease both;
  }
  .card-hdr {
    display:flex; align-items:center; gap:12px;
    padding:20px 24px 0;
  }
  .card-hdr-icon {
    width:36px; height:36px; border-radius:11px;
    display:flex; align-items:center; justify-content:center; font-size:17px;
  }
  .ic-blue  { background:var(--blue-50);  }
  .ic-green { background:var(--green-50); }
  .ic-amber { background:var(--amber-50); }
  .card-hdr-title { font-family:'Lora',serif; font-size:17px; font-weight:700; color:var(--slate-800); }

  /* ── LEFT COLUMN ── */
  .left-col { display:flex; flex-direction:column; gap:20px; }

  /* Date picker section */
  .date-section { padding:18px 24px 22px; }
  .section-label { font-size:12px; font-weight:800; color:var(--slate-500); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:10px; }
  .date-input-row { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
  .date-field {
    flex:1; min-width:180px; padding:12px 16px;
    border:2px solid var(--slate-200); border-radius:13px; outline:none;
    font-family:'Nunito',sans-serif; font-size:14px; font-weight:700;
    color:var(--slate-800); background:#fff; transition:all 0.2s;
  }
  .date-field:focus { border-color:var(--blue-400); box-shadow:0 0 0 4px rgba(96,165,250,0.1); }
  .date-hint { font-size:12px; font-weight:600; color:var(--slate-400); margin-top:8px; }

  /* Slots grid */
  .slots-section { padding:18px 24px 24px; }
  .slots-legend { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:14px; }
  .legend-item { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:var(--slate-500); }
  .legend-dot { width:10px; height:10px; border-radius:3px; }
  .ld-available { background:var(--blue-50); border:1.5px solid var(--blue-400); }
  .ld-selected  { background:var(--blue-600); }
  .ld-booked    { background:var(--slate-200); }

  .slots-grid { display:flex; flex-wrap:wrap; gap:9px; }
  .slot-btn {
    padding:9px 16px; border-radius:11px;
    font-family:'Nunito',sans-serif; font-size:13px; font-weight:800;
    cursor:pointer; transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);
    border:2px solid var(--slate-200); background:var(--slate-50); color:var(--slate-600);
  }
  .slot-btn:not(:disabled):hover {
    border-color:var(--blue-400); background:var(--blue-50); color:var(--blue-700);
    transform:translateY(-2px); box-shadow:0 6px 16px rgba(37,99,235,0.15);
  }
  .slot-btn.selected {
    border-color:var(--blue-600); background:var(--blue-600); color:#fff;
    box-shadow:0 6px 18px rgba(37,99,235,0.3); transform:translateY(-2px);
  }
  .slot-btn:disabled {
    background:var(--slate-100); border-color:var(--slate-200);
    color:var(--slate-300); cursor:not-allowed;
    text-decoration:line-through;
  }

  .no-slots {
    text-align:center; padding:32px 16px;
    background:var(--slate-50); border-radius:14px;
    border:2px dashed var(--slate-200); width:100%;
  }
  .no-slots-icon { font-size:32px; margin-bottom:8px; }
  .no-slots-text { font-size:13px; font-weight:700; color:var(--slate-400); }

  /* Patient form */
  .form-section { padding:18px 24px 24px; }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .form-group { display:flex; flex-direction:column; gap:5px; }
  .form-group.span2 { grid-column:span 2; }
  .form-label { font-size:12px; font-weight:800; color:var(--slate-700); }
  .form-req   { color:var(--red-400); margin-left:2px; }

  .form-input, .form-select, .form-textarea {
    width:100%; padding:11px 14px;
    border:2px solid var(--slate-200); border-radius:12px; outline:none;
    font-family:'Nunito',sans-serif; font-size:13px; font-weight:600;
    color:var(--slate-800); background:#fff; transition:all 0.2s;
  }
  .form-input::placeholder, .form-textarea::placeholder { color:var(--slate-400); }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color:var(--blue-400); box-shadow:0 0 0 4px rgba(96,165,250,0.1);
  }
  .form-input.err { border-color:var(--red-400); box-shadow:0 0 0 4px rgba(248,113,113,0.1); }
  .form-textarea { resize:vertical; min-height:88px; }
  .field-error { font-size:11px; font-weight:700; color:var(--red-500); }

  /* ── RIGHT COLUMN ── */
  .right-col { display:flex; flex-direction:column; gap:16px; }

  /* Summary card */
  .summary-card {
    background:#fff; border-radius:22px;
    border:2px solid var(--slate-200);
    box-shadow:0 2px 12px rgba(0,0,0,0.05);
    padding:22px; animation:fadeInUp 0.4s ease 0.1s both;
    position:sticky; top:24px;
  }
  .summary-title { font-family:'Lora',serif; font-size:18px; font-weight:700; color:var(--slate-800); margin-bottom:6px; }
  .summary-sub   { font-size:13px; font-weight:600; color:var(--slate-400); margin-bottom:20px; }

  /* Summary rows */
  .summary-rows { display:flex; flex-direction:column; gap:10px; margin-bottom:20px; }
  .summary-row {
    display:flex; align-items:flex-start; gap:10px;
    background:var(--slate-50); border-radius:12px; padding:11px 13px;
  }
  .sr-icon {
    width:32px; height:32px; border-radius:9px;
    display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0;
  }
  .sr-label { font-size:10px; font-weight:800; color:var(--slate-400); text-transform:uppercase; letter-spacing:0.06em; }
  .sr-value { font-size:13px; font-weight:800; color:var(--slate-800); margin-top:1px; }
  .sr-empty { color:var(--slate-300); font-weight:600; }

  /* Fee row */
  .fee-row {
    display:flex; align-items:center; justify-content:space-between;
    background:linear-gradient(135deg, var(--blue-50), #F0FDFA);
    border:1.5px solid var(--blue-100); border-radius:14px;
    padding:14px 16px; margin-bottom:16px;
  }
  .fee-label-text { font-size:12px; font-weight:800; color:var(--slate-500); text-transform:uppercase; letter-spacing:0.07em; }
  .fee-amount { font-size:24px; font-weight:900; color:var(--blue-700); }
  .fee-per    { font-size:11px; font-weight:600; color:var(--slate-400); }

  /* Confirm button */
  .confirm-btn {
    width:100%; padding:15px; border-radius:14px; border:none;
    font-family:'Nunito',sans-serif; font-size:15px; font-weight:900; color:#fff;
    background:linear-gradient(135deg, var(--blue-500), var(--blue-700));
    box-shadow:0 8px 24px rgba(37,99,235,0.3);
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
    transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .confirm-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 32px rgba(37,99,235,0.4); }
  .confirm-btn:active:not(:disabled) { transform:scale(0.98); }
  .confirm-btn:disabled { opacity:0.55; cursor:not-allowed; transform:none; }

  /* No-slot warning on button */
  .slot-warning {
    display:flex; align-items:center; gap:8px;
    background:var(--amber-50); border:1.5px solid #FDE68A;
    border-radius:12px; padding:11px 14px; margin-bottom:12px;
    font-size:13px; font-weight:700; color:var(--amber-600);
  }

  /* Spinner */
  .spinner {
    width:17px; height:17px;
    border:2px solid rgba(255,255,255,0.4);
    border-top-color:#fff; border-radius:50%;
    animation:spin 0.7s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg);} }

  /* Success overlay */
  .success-overlay {
    position:fixed; inset:0;
    background:rgba(15,23,42,0.55); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    z-index:100; padding:24px; animation:fadeIn 0.25s ease both;
  }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
  .success-box {
    background:#fff; border-radius:28px; padding:40px 36px;
    max-width:400px; width:100%; text-align:center;
    box-shadow:0 28px 80px rgba(0,0,0,0.2);
    animation:scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.88);} to{opacity:1;transform:scale(1);} }
  .success-circle {
    width:80px; height:80px; border-radius:50%;
    background:var(--green-50); border:3px solid #BBF7D0;
    display:flex; align-items:center; justify-content:center;
    font-size:38px; margin:0 auto 20px;
    animation:bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;
  }
  @keyframes bounceIn { from{transform:scale(0.5);opacity:0;} to{transform:scale(1);opacity:1;} }
  .success-title { font-family:'Lora',serif; font-size:24px; font-weight:700; color:var(--slate-800); margin-bottom:8px; }
  .success-sub   { font-size:14px; font-weight:600; color:var(--slate-500); line-height:1.6; margin-bottom:10px; }
  .success-detail {
    background:var(--slate-50); border-radius:14px; padding:14px 18px;
    margin:16px 0 24px; display:flex; flex-direction:column; gap:6px;
  }
  .sd-row { display:flex; align-items:center; justify-content:space-between; }
  .sd-label { font-size:12px; font-weight:700; color:var(--slate-400); }
  .sd-value { font-size:13px; font-weight:800; color:var(--slate-800); }
  .success-close {
    width:100%; padding:13px; border-radius:14px; border:none;
    font-family:'Nunito',sans-serif; font-size:14px; font-weight:800; color:#fff;
    background:linear-gradient(135deg, var(--green-500), var(--green-400));
    box-shadow:0 8px 24px rgba(34,197,94,0.3); cursor:pointer; transition:all 0.2s;
  }
  .success-close:hover { box-shadow:0 12px 30px rgba(34,197,94,0.4); }

  /* Error toast */
  .toast-container {
    position:fixed; bottom:28px; right:28px;
    display:flex; flex-direction:column; gap:10px; z-index:200;
  }
  .toast {
    display:flex; align-items:center; gap:10px;
    padding:13px 18px; border-radius:14px;
    box-shadow:0 8px 32px rgba(0,0,0,0.15);
    font-family:'Nunito',sans-serif; font-size:14px; font-weight:800; min-width:240px;
    animation:slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  .toast.error   { background:var(--red-500);   color:#fff; }
  .toast.success { background:var(--green-500); color:#fff; }

  /* Skeleton */
  .skel {
    border-radius:9px; margin-bottom:10px;
    background:linear-gradient(90deg,var(--slate-100) 25%,var(--slate-200) 50%,var(--slate-100) 75%);
    background-size:200% 100%; animation:shimmer 1.5s infinite;
  }
  @keyframes shimmer { to{background-position:-200% 0;} }

  @keyframes fadeInUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width:960px) {
    .page-body { grid-template-columns:1fr; top:0; padding-top:24px; }
    .summary-card { position:static; }
  }
  @media (max-width:600px) {
    .page-body { padding:16px 16px 48px; }
    .hero-inner { padding:0 20px; }
    .form-grid  { grid-template-columns:1fr; }
    .form-group.span2 { grid-column:span 1; }
    .hero-row   { flex-wrap:wrap; gap:14px; }
  }
`;

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function BookAppointmentPage() {
  const { doctorId } = useParams();
  const navigate     = useNavigate();

  const [doctor,          setDoctor]          = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [slots,           setSlots]           = useState([]);
  const [bookedSlots,     setBookedSlots]     = useState([]);
  const [selectedSlot,    setSelectedSlot]    = useState("");

  const [patientName,   setPatientName]   = useState("");
  const [patientAge,    setPatientAge]    = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientPhone,  setPatientPhone]  = useState("");
  const [reason,        setReason]        = useState("");
  const [symptoms,      setSymptoms]      = useState("");
  const [notes,         setNotes]         = useState("");

  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [touched,   setTouched]   = useState({});
  const [toasts,    setToasts]    = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => { getDoctor(); }, []);

  const addToast = (message, type = "error") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };

  const getDoctor = async () => {
    try {
      const res = await api.get("/doctors");
      setDoctor(res.data.find((d) => d.id === doctorId) || null);
    } catch (e) { console.log(e); }
  };

  const getSlots = async (date) => {
    setSlotsLoading(true);
    setSelectedSlot("");
    try {
      const res = await api.get("/appointments/available", { params: { doctorId, date } });
      setSlots(res.data.allSlots);
      setBookedSlots(res.data.bookedSlots);
    } catch (e) { console.log(e); }
    finally { setSlotsLoading(false); }
  };

  const touch = (f) => setTouched((p) => ({ ...p, [f]: true }));

  const nameErr   = touched.name   && !patientName.trim()    ? "Name is required"   : "";
  const ageErr    = touched.age    && !patientAge             ? "Age is required"    : "";
  const genderErr = touched.gender && !patientGender          ? "Please select gender" : "";
  const phoneErr  = touched.phone  && !/^\d{7,15}$/.test(patientPhone.replace(/\s/g,"")) ? "Valid phone required" : "";
  const reasonErr = touched.reason && !reason.trim()          ? "Reason is required" : "";

  const formValid = patientName.trim() && patientAge && patientGender &&
    /^\d{7,15}$/.test(patientPhone.replace(/\s/g,"")) && reason.trim();

  const bookAppointment = async () => {
    setTouched({ name:true, age:true, gender:true, phone:true, reason:true });
    if (!selectedSlot) { addToast("Please select a time slot first"); return; }
    if (!formValid)    { addToast("Please fill in all required fields"); return; }

    setLoading(true);
    try {
      await api.post("/appointments", {
        doctorId, appointmentDate,
        appointmentTime: selectedSlot,
        patientName, patientAge, patientGender, patientPhone,
        reason, symptoms, notes,
      });
      setSuccess(true);
      getSlots(appointmentDate);
      setSelectedSlot("");
    } catch (e) {
      addToast("Booking failed. Please try again.");
      console.log(e);
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setSuccess(false);
    setPatientName(""); setPatientAge(""); setPatientGender("");
    setPatientPhone(""); setReason(""); setSymptoms(""); setNotes("");
    setTouched({});
  };

  if (!doctor) return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight:"100vh", background:"#F0F6FF", fontFamily:"Nunito,sans-serif" }}>
        <div style={{ height:240, background:"linear-gradient(145deg,#1a56db,#0f2460)" }} />
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 32px" }}>
          {[60,40,80,50].map((w,i) => <div key={i} className="skel" style={{ height:16, width:`${w}%` }} />)}
        </div>
      </div>
    </>
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <style>{styles}</style>
      <div className="book-page">

        {/* ── HERO ── */}
        <div className="hero">
          <div className="blob b1" /><div className="blob b2" />
          <div className="hero-inner">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <div className="hero-row">
              {doctor.profileImageUrl ? (
                <img className="hero-doc-photo" src={doctor.profileImageUrl} alt={doctor.name}
                  onError={(e) => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
              ) : null}
              <div className="hero-doc-placeholder" style={{ display: doctor.profileImageUrl ? "none" : "flex" }}>
                {getInitials(doctor.name)}
              </div>
              <div className="hero-doc-info">
                <div className="hero-eyebrow"><span className="badge-dot" /> Book Appointment</div>
                <h1 className="hero-name">{doctor.name}</h1>
                <div className="hero-spec">{doctor.specialization}</div>
                <div className="hero-tags">
                  <span className="hero-tag">🎓 {doctor.degree}</span>
                  <span className="hero-tag">⏳ {doctor.experience} yrs exp</span>
                  <span className="hero-tag">🕐 {doctor.startTime} – {doctor.endTime}</span>
                  <span className="hero-tag">⏱ {doctor.slotDuration} min slots</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="page-body">

          {/* ── LEFT ── */}
          <div className="left-col">

            {/* Date picker */}
            <div className="card">
              <div className="card-hdr">
                <div className="card-hdr-icon ic-blue">📅</div>
                <div className="card-hdr-title">Select Appointment Date</div>
              </div>
              <div className="date-section">
                <div className="section-label">Choose a date</div>
                <div className="date-input-row">
                  <input
                    className="date-field"
                    type="date"
                    value={appointmentDate}
                    min={today}
                    onChange={(e) => {
                      setAppointmentDate(e.target.value);
                      getSlots(e.target.value);
                    }}
                  />
                </div>
                {!appointmentDate && (
                  <p className="date-hint">📌 Please select a date to see available time slots</p>
                )}
              </div>
            </div>

            {/* Slot picker */}
            <div className="card">
              <div className="card-hdr">
                <div className="card-hdr-icon ic-amber">🕐</div>
                <div className="card-hdr-title">
                  Available Slots
                  {slots.length > 0 && (
                    <span style={{ marginLeft:8, fontSize:13, fontWeight:700, color:"var(--slate-400)" }}>
                      ({slots.length - bookedSlots.length} free)
                    </span>
                  )}
                </div>
              </div>
              <div className="slots-section">
                {!appointmentDate ? (
                  <div className="no-slots">
                    <div className="no-slots-icon">📅</div>
                    <div className="no-slots-text">Select a date above to see available slots</div>
                  </div>
                ) : slotsLoading ? (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="skel" style={{ width:80, height:38, borderRadius:11, margin:0 }} />
                    ))}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="no-slots">
                    <div className="no-slots-icon">😔</div>
                    <div className="no-slots-text">No slots available for this date</div>
                  </div>
                ) : (
                  <>
                    <div className="slots-legend">
                      <div className="legend-item"><span className="legend-dot ld-available" /> Available</div>
                      <div className="legend-item"><span className="legend-dot ld-selected"  /> Selected</div>
                      <div className="legend-item"><span className="legend-dot ld-booked"    /> Booked</div>
                    </div>
                    <div className="slots-grid">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          className={`slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                          disabled={bookedSlots.includes(slot)}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Patient details form */}
            <div className="card">
              <div className="card-hdr">
                <div className="card-hdr-icon ic-green">👤</div>
                <div className="card-hdr-title">Patient Details</div>
              </div>
              <div className="form-section">
                <div className="form-grid">

                  <div className="form-group">
                    <label className="form-label">Full Name <span className="form-req">*</span></label>
                    <input className={`form-input ${nameErr ? "err" : ""}`} type="text"
                      placeholder="Patient's full name" value={patientName}
                      onChange={(e) => setPatientName(e.target.value)} onBlur={() => touch("name")} />
                    {nameErr && <span className="field-error">{nameErr}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Age <span className="form-req">*</span></label>
                    <input className={`form-input ${ageErr ? "err" : ""}`} type="number"
                      placeholder="Age" min="0" max="120" value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)} onBlur={() => touch("age")} />
                    {ageErr && <span className="field-error">{ageErr}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender <span className="form-req">*</span></label>
                    <select className={`form-select ${genderErr ? "err" : ""}`}
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)} onBlur={() => touch("gender")}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {genderErr && <span className="field-error">{genderErr}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number <span className="form-req">*</span></label>
                    <input className={`form-input ${phoneErr ? "err" : ""}`} type="text"
                      placeholder="+91 99999 99999" value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)} onBlur={() => touch("phone")} />
                    {phoneErr && <span className="field-error">{phoneErr}</span>}
                  </div>

                  <div className="form-group span2">
                    <label className="form-label">Reason for Visit <span className="form-req">*</span></label>
                    <input className={`form-input ${reasonErr ? "err" : ""}`} type="text"
                      placeholder="e.g. Routine checkup, fever, follow-up…" value={reason}
                      onChange={(e) => setReason(e.target.value)} onBlur={() => touch("reason")} />
                    {reasonErr && <span className="field-error">{reasonErr}</span>}
                  </div>

                  <div className="form-group span2">
                    <label className="form-label">Symptoms <span style={{ fontSize:11, fontWeight:600, color:"var(--slate-400)" }}>(optional)</span></label>
                    <textarea className="form-textarea"
                      placeholder="Describe your symptoms in detail…"
                      value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
                  </div>

                  <div className="form-group span2">
                    <label className="form-label">Additional Notes <span style={{ fontSize:11, fontWeight:600, color:"var(--slate-400)" }}>(optional)</span></label>
                    <textarea className="form-textarea"
                      placeholder="Any allergies, previous conditions, medications…"
                      value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT SUMMARY ── */}
          <div className="right-col">
            <div className="summary-card">
              <div className="summary-title">Booking Summary</div>
              <div className="summary-sub">Review your appointment details</div>

              <div className="summary-rows">
                {[
                  { icon:"👨‍⚕️", bg:"var(--blue-50)",  label:"Doctor",   value: doctor.name           },
                  { icon:"🩺",   bg:"var(--teal-50,#F0FDFA)", label:"Specialty", value: doctor.specialization },
                  { icon:"📅",   bg:"var(--amber-50)", label:"Date",     value: appointmentDate || null },
                  { icon:"🕐",   bg:"var(--green-50)", label:"Time Slot",value: selectedSlot    || null },
                  { icon:"👤",   bg:"var(--slate-100)",label:"Patient",  value: patientName.trim() || null },
                ].map((row, i) => (
                  <div className="summary-row" key={i}>
                    <div className="sr-icon" style={{ background: row.bg }}>{row.icon}</div>
                    <div>
                      <div className="sr-label">{row.label}</div>
                      <div className={`sr-value ${!row.value ? "sr-empty" : ""}`}>
                        {row.value || "Not selected"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="fee-row">
                <div>
                  <div className="fee-label-text">Consultation Fee</div>
                  <div className="fee-amount">₹{doctor.fees || "—"}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div className="fee-per">per visit</div>
                </div>
              </div>

              {!selectedSlot && appointmentDate && (
                <div className="slot-warning">⚠️ Please select a time slot</div>
              )}

              <button
                className="confirm-btn"
                onClick={bookAppointment}
                disabled={loading}
              >
                {loading
                  ? <><div className="spinner" /> Booking…</>
                  : <>📅 Confirm Booking</>
                }
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── SUCCESS MODAL ── */}
      {success && (
        <div className="success-overlay">
          <div className="success-box">
            <div className="success-circle">✅</div>
            <div className="success-title">Appointment Booked!</div>
            <div className="success-sub">
              Your appointment has been confirmed. Please arrive 10 minutes before your scheduled time.
            </div>
            <div className="success-detail">
              <div className="sd-row">
                <span className="sd-label">Doctor</span>
                <span className="sd-value">{doctor.name}</span>
              </div>
              <div className="sd-row">
                <span className="sd-label">Date</span>
                <span className="sd-value">{appointmentDate}</span>
              </div>
              <div className="sd-row">
                <span className="sd-label">Patient</span>
                <span className="sd-value">{patientName}</span>
              </div>
              <div className="sd-row">
                <span className="sd-label">Fee</span>
                <span className="sd-value">₹{doctor.consultationFees}</span>
              </div>
            </div>
            <button className="success-close" onClick={resetForm}>
              Done ✓
            </button>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === "error" ? "❌" : "✅"} {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

export default BookAppointmentPage;