import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lora:ital,wght@0,600;0,700;1,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; width: 100%; }

  :root {
    --blue-50:#EFF6FF; --blue-100:#DBEAFE; --blue-400:#60A5FA;
    --blue-500:#3B82F6; --blue-600:#2563EB; --blue-700:#1D4ED8;
    --teal-400:#2DD4BF; --teal-500:#14B8A6;
    --green-50:#F0FDF4; --green-400:#4ADE80; --green-500:#22C55E; --green-600:#16A34A;
    --red-50:#FEF2F2; --red-400:#F87171; --red-500:#EF4444; --red-600:#DC2626;
    --amber-50:#FFFBEB; --amber-400:#FBBF24; --amber-500:#F59E0B; --amber-600:#D97706;
    --purple-50:#F5F3FF; --purple-500:#8B5CF6; --purple-600:#7C3AED;
    --slate-50:#F8FAFC; --slate-100:#F1F5F9; --slate-200:#E2E8F0;
    --slate-300:#CBD5E1; --slate-400:#94A3B8; --slate-500:#64748B;
    --slate-600:#475569; --slate-700:#334155; --slate-800:#1E293B;
  }

  .dash-page { min-height: 100vh; background: #F0F6FF; font-family: 'Nunito', sans-serif; }

  .dash-body {
    display: flex; gap: 24px;
    width: 100%;
    padding: 28px 32px 64px;
  }

  /* ══════════════════════════════
     LEFT SIDEBAR
  ══════════════════════════════ */
  .sidebar {
    flex: 0 0 260px; width: 260px;
    display: flex; flex-direction: column; gap: 16px;
    position: sticky; top: 24px; align-self: flex-start;
  }

  /* Doctor card */
  .doc-card {
    background: #fff; border-radius: 20px;
    border: 2px solid var(--slate-200);
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    overflow: hidden;
  }
  .doc-card-banner {
    height: 72px;
    background: linear-gradient(135deg, #1a56db, #0f2460);
    position: relative;
  }
  .doc-card-banner::after {
    content:''; position:absolute; inset:0;
    background:url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20.5V18H0v5h5v5H0v5h10v-5h5v5h10v-5h5v5h10V23h-5v-5h5v-5H20v2.5z'/%3E%3C/g%3E%3C/svg%3E");
  }
  .doc-avatar-wrap {
    position: absolute; bottom: -28px; left: 50%;
    transform: translateX(-50%);
    width: 56px; height: 56px;
  }
  .doc-avatar {
    width: 56px; height: 56px; border-radius: 16px;
    background: linear-gradient(135deg, var(--teal-500), var(--blue-600));
    border: 3px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 900; color: #fff;
    font-family: 'Nunito', sans-serif;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  }
  .doc-info { padding: 38px 18px 18px; text-align: center; }
  .doc-info-name {
    font-family: 'Lora', serif;
    font-size: 17px; font-weight: 700; color: var(--slate-800);
    margin-bottom: 3px;
  }
  .doc-info-spec { font-size: 12px; font-weight: 700; color: var(--blue-600); margin-bottom: 14px; }
  .online-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--green-50); color: var(--green-600);
    border-radius: 100px; padding: 4px 12px;
    font-size: 11px; font-weight: 800;
  }
  .online-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green-500); box-shadow: 0 0 6px var(--green-400);
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

  /* Stat mini grid in sidebar */
  .sidebar-stats {
    background: #fff; border-radius: 20px;
    border: 2px solid var(--slate-200);
    padding: 18px 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .ss-title {
    font-size: 11px; font-weight: 800; color: var(--slate-400);
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px;
  }
  .ss-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
  .ss-item { background: var(--slate-50); border-radius: 12px; padding: 10px 6px; text-align: center; }
  .ss-num  { font-size: 22px; font-weight: 900; line-height: 1; }
  .ss-label{ font-size: 10px; font-weight: 800; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 3px; }
  .c-blue  { color: var(--blue-600);  }
  .c-green { color: var(--green-600); }
  .c-red   { color: var(--red-500);   }
  .c-amber { color: var(--amber-600); }
  .c-purple{ color: var(--purple-600);}

  /* Leave card */
  .leave-card {
    background: #fff; border-radius: 20px;
    border: 2px solid var(--slate-200);
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .leave-title {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 800; color: var(--slate-700);
    margin-bottom: 14px;
  }
  .leave-icon {
    width: 30px; height: 30px; border-radius: 9px;
    background: var(--amber-50); color: var(--amber-600);
    display: flex; align-items: center; justify-content: center; font-size: 15px;
  }
  .date-input {
    width: 100%; padding: 11px 14px;
    border: 2px solid var(--slate-200); border-radius: 12px; outline: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700; color: var(--slate-800);
    background: #fff; transition: all 0.2s; margin-bottom: 10px;
  }
  .date-input:focus { border-color: var(--amber-400); box-shadow: 0 0 0 4px rgba(251,191,36,0.1); }
  .leave-hint { font-size: 11px; font-weight: 600; color: var(--slate-400); margin-bottom: 12px; line-height: 1.5; }
  .leave-btn {
    width: 100%; padding: 11px; border-radius: 12px; border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 800; color: #fff;
    background: linear-gradient(135deg, var(--amber-500), var(--amber-400));
    box-shadow: 0 6px 18px rgba(245,158,11,0.28);
    cursor: pointer; transition: all 0.25s;
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .leave-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(245,158,11,0.38); }
  .leave-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ══════════════════════════════
     MAIN CONTENT
  ══════════════════════════════ */
  .main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 20px; }

  /* Header */
  .main-header { animation: fadeInUp 0.4s ease both; }
  .main-eyebrow {
    font-size: 11px; font-weight: 800; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--blue-600); margin-bottom: 4px;
  }
  .main-title {
    font-family: 'Lora', serif;
    font-size: 26px; font-weight: 700; color: var(--slate-800);
  }
  .main-sub { font-size: 14px; font-weight: 600; color: var(--slate-400); margin-top: 4px; }

  /* Stat cards row */
  .stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
    animation: fadeInUp 0.4s ease 0.05s both;
  }
  .stat-card {
    background: #fff; border-radius: 18px;
    border: 2px solid transparent;
    padding: 18px 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    display: flex; align-items: center; gap: 14px;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.09); }
  .stat-card.sc-blue   { border-color: var(--blue-100);  }
  .stat-card.sc-green  { border-color: #BBF7D0;           }
  .stat-card.sc-red    { border-color: #FECACA;           }
  .stat-ic {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
  }
  .sic-blue   { background: var(--blue-50);  }
  .sic-green  { background: var(--green-50); }
  .sic-red    { background: var(--red-50);   }
  .stat-num { font-size: 28px; font-weight: 900; line-height: 1; }
  .stat-lbl { font-size: 12px; font-weight: 700; color: var(--slate-400); margin-top: 3px; }

  /* Tabs */
  .tabs-row {
    display: flex; gap: 4px;
    background: var(--slate-100); border-radius: 14px;
    padding: 4px; animation: fadeInUp 0.4s ease 0.1s both;
  }
  .tab-btn {
    flex: 1; padding: 9px 12px; border-radius: 10px; border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 800; color: var(--slate-500);
    background: transparent; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .tab-btn:hover { color: var(--slate-700); }
  .tab-btn.active {
    background: #fff; color: var(--blue-600);
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .tab-badge {
    min-width: 18px; height: 18px; border-radius: 9px;
    font-size: 10px; font-weight: 900;
    display: inline-flex; align-items: center; justify-content: center; padding: 0 5px;
    transition: all 0.2s;
  }
  .tab-btn.active .tab-badge { background: var(--blue-600); color: #fff; }
  .tb-amber { background: #FEF3C7; color: var(--amber-700,#B45309); }
  .tb-green { background: #D1FAE5; color: #15803D; }
  .tb-red   { background: #FEE2E2; color: #B91C1C; }

  /* Empty state */
  .empty-state {
    text-align: center; padding: 60px 24px;
    background: #fff; border-radius: 20px;
    border: 2px dashed var(--slate-200);
    animation: fadeInUp 0.4s ease both;
  }
  .empty-icon  { font-size: 40px; margin-bottom: 12px; }
  .empty-title { font-family: 'Lora', serif; font-size: 18px; font-weight: 700; color: var(--slate-700); margin-bottom: 6px; }
  .empty-sub   { font-size: 13px; font-weight: 600; color: var(--slate-400); }

  /* Appointment cards */
  .appt-list { display: flex; flex-direction: column; gap: 14px; }

  .appt-card {
    background: #fff; border-radius: 20px;
    border: 2px solid var(--slate-200);
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    overflow: hidden;
    transition: box-shadow 0.2s;
    animation: fadeInUp 0.4s ease both;
  }
  .appt-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.09); }
  .appt-card.booked    { border-left: 4px solid var(--blue-400); }
  .appt-card.completed { border-left: 4px solid var(--green-400); }
  .appt-card.cancelled { border-left: 4px solid var(--red-400); background: var(--slate-50); }
  .appt-card.cancelled .patient-name { color: var(--slate-500); }
  .appt-card.cancelled .appt-chip    { color: var(--slate-500); background: var(--slate-200); }
  .appt-card.cancelled .patient-meta { color: var(--slate-400); }

  /* Card header */
  .appt-header {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 20px 0;
  }
  .patient-avatar {
    width: 48px; height: 48px; border-radius: 14px;
    background: linear-gradient(135deg, var(--purple-500), var(--blue-600));
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 900; color: #fff; flex-shrink: 0;
    font-family: 'Nunito', sans-serif;
  }
  .patient-name {
    font-family: 'Lora', serif;
    font-size: 17px; font-weight: 700; color: var(--slate-800);
  }
  .patient-meta {
    font-size: 12px; font-weight: 700; color: var(--slate-400); margin-top: 2px;
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .pmeta-sep { color: var(--slate-200); }

  .appt-status-badge {
    margin-left: auto; flex-shrink: 0;
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 100px;
    font-size: 10px; font-weight: 900;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .appt-dot { width: 5px; height: 5px; border-radius: 50%; }
  .sb-booked    { background: var(--blue-50);  color: var(--blue-700);  }
  .sb-booked    .appt-dot { background: var(--blue-500); animation: pulse 2s infinite; }
  .sb-completed { background: var(--green-50); color: var(--green-600); }
  .sb-completed .appt-dot { background: var(--green-500); }
  .sb-cancelled { background: var(--red-50);   color: var(--red-600);   }
  .sb-cancelled .appt-dot { background: var(--red-400); }

  /* Card body */
  .appt-body { padding: 14px 20px; }

  .appt-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 12px; }
  .appt-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 9px;
    font-size: 12px; font-weight: 700;
    background: var(--slate-100); color: var(--slate-700);
  }
  .appt-chip.highlight { background: var(--blue-50); color: var(--blue-700); }

  /* Detail grid for upcoming */
  .detail-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;
  }
  .detail-item {
    background: var(--slate-50); border-radius: 11px; padding: 10px 12px;
  }
  .di-label { font-size: 10px; font-weight: 800; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
  .di-value { font-size: 13px; font-weight: 700; color: var(--slate-700); line-height: 1.4; }
  .detail-item.span-2 { grid-column: span 2; }

  /* Card footer */
  .appt-footer {
    display: flex; align-items: center; justify-content: flex-end;
    padding: 12px 20px 16px; gap: 10px;
    border-top: 1.5px solid var(--slate-100); margin-top: 2px;
  }

  .btn-complete {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 12px; border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 800; color: #fff;
    background: linear-gradient(135deg, var(--green-500), var(--green-400));
    box-shadow: 0 6px 18px rgba(34,197,94,0.28);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .btn-complete:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(34,197,94,0.4); }
  .btn-complete:active { transform: scale(0.97); }

  /* Confirm overlay */
  .overlay {
    position: fixed; inset: 0;
    background: rgba(15,23,42,0.5);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 24px;
    animation: fadeIn 0.2s ease both;
  }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
  .confirm-box {
    background: #fff; border-radius: 24px; padding: 32px;
    max-width: 360px; width: 100%;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18);
    animation: scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.92);} to{opacity:1;transform:scale(1);} }
  .confirm-icon  { font-size: 36px; margin-bottom: 14px; }
  .confirm-title { font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: var(--slate-800); margin-bottom: 8px; }
  .confirm-sub   { font-size: 13px; font-weight: 600; color: var(--slate-500); line-height: 1.6; margin-bottom: 24px; }
  .confirm-row   { display: flex; gap: 10px; }
  .confirm-no {
    flex: 1; padding: 12px; border-radius: 12px;
    border: 2px solid var(--slate-200); background: #fff;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    color: var(--slate-600); cursor: pointer; transition: all 0.2s;
  }
  .confirm-no:hover { background: var(--slate-100); }
  .confirm-yes {
    flex: 1; padding: 12px; border-radius: 12px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    color: #fff; background: var(--green-500); cursor: pointer; transition: all 0.2s;
  }
  .confirm-yes:hover { background: var(--green-600); }

  /* Toast */
  .toast-container {
    position: fixed; bottom: 28px; right: 28px;
    display: flex; flex-direction: column; gap: 10px; z-index: 200;
  }
  .toast {
    display: flex; align-items: center; gap: 10px;
    padding: 13px 18px; border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 800; min-width: 240px;
    animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  .toast.success { background: var(--green-500); color: #fff; }
  .toast.error   { background: var(--red-500);   color: #fff; }
  .toast.info    { background: var(--blue-600);  color: #fff; }

  /* Skeleton */
  .skel {
    border-radius: 8px; margin-bottom: 10px;
    background: linear-gradient(90deg,var(--slate-100) 25%,var(--slate-200) 50%,var(--slate-100) 75%);
    background-size: 200% 100%; animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer { to{background-position:-200% 0;} }

  @keyframes fadeInUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width:1024px) {
    .dash-body { flex-direction:column; padding:16px 16px 48px; }
    .sidebar { position:static; flex:none; width:100%; }
    .stats-row { grid-template-columns:1fr 1fr 1fr; }
  }
  @media (max-width:600px) {
    .dash-body { padding:12px 12px 48px; }
    .stats-row { grid-template-columns:1fr; }
    .detail-grid { grid-template-columns:1fr; }
    .detail-item.span-2 { grid-column:span 1; }
    .appt-header { flex-wrap:wrap; }
    .appt-status-badge { margin-left:0; }
  }
`;

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function DoctorDashboardPage() {
  const [appointments,    setAppointments]    = useState([]);
  const [unavailableDate, setUnavailableDate] = useState("");
  const [doctor,          setDoctor]          = useState(null);
  const [tab,             setTab]             = useState("upcoming");
  const [confirmId,       setConfirmId]       = useState(null);
  const [toasts,          setToasts]          = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [leaving,         setLeaving]         = useState(false);

  useEffect(() => { getAppointments(); getProfile(); }, []);

  const getProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      const me = res.data;
      // Try to get full doctor profile (includes photo, specialization, etc.)
      try {
        const allDocs = await api.get("/doctors");
        const fullProfile = allDocs.data.find(
          (d) => d.email === me.email || d.id === me.id
        );
        setDoctor(fullProfile || me);
      } catch {
        setDoctor(me);
      }
    } catch (e) { console.log(e); }
  };

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const getAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/appointments/doctor");
      setAppointments(res.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const completeAppointment = async () => {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmId(null);
    try {
      await api.put(`/appointments/complete/${id}`);
      addToast("Appointment marked as completed ✅");
      getAppointments();
    } catch (e) {
      addToast("Failed to complete appointment", "error");
      console.log(e);
    }
  };

  const addUnavailableDate = async () => {
    if (!unavailableDate) return;
    setLeaving(true);
    try {
      await api.put(`/appointments/unavailable-date?date=${unavailableDate}`);
      addToast(`Leave marked for ${unavailableDate} 📅`, "info");
      setUnavailableDate("");
    } catch (e) {
      addToast("Failed to add leave date", "error");
      console.log(e);
    } finally { setLeaving(false); }
  };

  const upcoming   = appointments.filter((a) => a.status === "BOOKED");
  const completed  = appointments.filter((a) => a.status === "COMPLETED");
  const cancelled  = appointments.filter((a) => a.status === "CANCELLED");

  const tabList = [
    { key: "upcoming",  label: "Upcoming",  count: upcoming.length,  badgeCls: "tb-amber" },
    { key: "completed", label: "Completed", count: completed.length, badgeCls: "tb-green" },
    { key: "cancelled", label: "Cancelled", count: cancelled.length, badgeCls: "tb-red"   },
  ];

  const visible = tab === "upcoming" ? upcoming : tab === "completed" ? completed : cancelled;

  return (
    <>
      <style>{styles}</style>
      <div className="dash-page">
        <Navbar title="VitaSync" dashboardPath="/doctor-dashboard" />

        <div className="dash-body">

          {/* ══ SIDEBAR ══ */}
          <div className="sidebar">

            {/* Doctor card */}
            <div className="doc-card">
              <div className="doc-card-banner">
                <div className="doc-avatar-wrap">
                  {doctor?.profileImageUrl ? (
                    <img
                      src={doctor.profileImageUrl}
                      alt={doctor.name}
                      style={{
                        width: 56, height: 56, borderRadius: 16,
                        objectFit: "cover", border: "3px solid #fff",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                        display: "block"
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="doc-avatar"
                    style={{ display: doctor?.profileImageUrl ? "none" : "flex" }}
                  >
                    {doctor?.name ? getInitials(doctor.name) : "⚕️"}
                  </div>
                </div>
              </div>
              <div className="doc-info">
                <div className="doc-info-name">{doctor?.name || "Doctor"}</div>
                <div className="doc-info-spec">{doctor?.specialization || "Your Doctor Portal"}</div>
                <div className="online-badge">
                  <span className="online-dot" /> On Duty
                </div>
              </div>
            </div>

            {/* Stat mini */}
            <div className="sidebar-stats">
              <div className="ss-title">Today's Overview</div>
              <div className="ss-grid">
                <div className="ss-item">
                  <div className={`ss-num c-blue`}>{upcoming.length}</div>
                  <div className="ss-label">Upcoming</div>
                </div>
                <div className="ss-item">
                  <div className={`ss-num c-green`}>{completed.length}</div>
                  <div className="ss-label">Done</div>
                </div>
                <div className="ss-item">
                  <div className={`ss-num c-red`}>{cancelled.length}</div>
                  <div className="ss-label">Cancelled</div>
                </div>
              </div>
            </div>

            {/* Leave manager */}
            <div className="leave-card">
              <div className="leave-title">
                <div className="leave-icon">📅</div>
                Mark Leave / Unavailability
              </div>
              <input
                className="date-input"
                type="date"
                value={unavailableDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setUnavailableDate(e.target.value)}
              />
              <p className="leave-hint">
                Patients won't be able to book appointments on this date.
              </p>
              <button
                className="leave-btn"
                onClick={addUnavailableDate}
                disabled={!unavailableDate || leaving}
              >
                {leaving ? "Saving…" : "📌 Mark as Unavailable"}
              </button>
            </div>
          </div>

          {/* ══ MAIN ══ */}
          <div className="main">

            {/* Header */}
            <div className="main-header">
              <div className="main-eyebrow">👨‍⚕️ Doctor Dashboard</div>
              <h1 className="main-title">My Appointments</h1>
              <p className="main-sub">Manage your patient schedule and update appointment statuses</p>
            </div>

            {/* Stats row */}
            <div className="stats-row">
              {[
                { label: "Upcoming",  num: upcoming.length,  icon: "📅", cardCls: "sc-blue",  icCls: "sic-blue",  numCls: "c-blue"  },
                { label: "Completed", num: completed.length, icon: "✅", cardCls: "sc-green", icCls: "sic-green", numCls: "c-green" },
                { label: "Cancelled", num: cancelled.length, icon: "❌", cardCls: "sc-red",   icCls: "sic-red",   numCls: "c-red"   },
              ].map((s, i) => (
                <div className={`stat-card ${s.cardCls}`} key={i}>
                  <div className={`stat-ic ${s.icCls}`}>{s.icon}</div>
                  <div>
                    <div className={`stat-num ${s.numCls}`}>{s.num}</div>
                    <div className="stat-lbl">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="tabs-row">
              {tabList.map((t) => (
                <button
                  key={t.key}
                  className={`tab-btn ${tab === t.key ? "active" : ""}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.key === "upcoming" ? "📅" : t.key === "completed" ? "✅" : "❌"} {t.label}
                  <span className={`tab-badge ${tab === t.key ? "" : t.badgeCls}`}>{t.count}</span>
                </button>
              ))}
            </div>

            {/* Appointment list */}
            {loading ? (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ background:"#fff", borderRadius:20, border:"2px solid var(--slate-200)", padding:24 }}>
                    <div className="skel" style={{ height:20, width:"40%" }} />
                    <div className="skel" style={{ height:14, width:"60%" }} />
                    <div className="skel" style={{ height:14, width:"80%" }} />
                  </div>
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">{tab === "upcoming" ? "📅" : tab === "completed" ? "✅" : "❌"}</div>
                <div className="empty-title">No {tab} appointments</div>
                <div className="empty-sub">
                  {tab === "upcoming"
                    ? "Your upcoming patient appointments will appear here"
                    : `${tab.charAt(0).toUpperCase() + tab.slice(1)} appointments will show up here`}
                </div>
              </div>
            ) : (
              <div className="appt-list">
                {visible.map((a, idx) => (
                  <div
                    className={`appt-card ${a.status.toLowerCase()}`}
                    key={a.id}
                    style={{ animationDelay: `${idx * 0.06}s` }}
                  >
                    {/* Header */}
                    <div className="appt-header">
                      <div className="patient-avatar">{getInitials(a.patientName)}</div>
                      <div>
                        <div className="patient-name">{a.patientName}</div>
                        <div className="patient-meta">
                          {a.patientAge    && <><span>{a.patientAge} yrs</span><span className="pmeta-sep">·</span></>}
                          {a.patientGender && <><span>{a.patientGender}</span><span className="pmeta-sep">·</span></>}
                          {a.patientPhone  && <span>📱 {a.patientPhone}</span>}
                        </div>
                      </div>
                      <div className={`appt-status-badge sb-${a.status.toLowerCase()}`}>
                        <span className="appt-dot" />{a.status}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="appt-body">
                      <div className="appt-chips">
                        <span className="appt-chip highlight">📅 {a.appointmentDate}</span>
                        <span className="appt-chip highlight">🕐 {a.appointmentTime}</span>
                      </div>

                      {/* Detailed info for upcoming */}
                      {a.status === "BOOKED" && (
                        <div className="detail-grid">
                          {a.reason && (
                            <div className="detail-item">
                              <div className="di-label">Reason</div>
                              <div className="di-value">{a.reason}</div>
                            </div>
                          )}
                          {a.symptoms && (
                            <div className="detail-item">
                              <div className="di-label">Symptoms</div>
                              <div className="di-value">{a.symptoms}</div>
                            </div>
                          )}
                          {a.notes && (
                            <div className="detail-item span-2">
                              <div className="di-label">Patient Notes</div>
                              <div className="di-value">{a.notes}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Compact info for completed/cancelled */}
                      {a.status !== "BOOKED" && a.reason && (
                        <div style={{
                          background: "var(--slate-50)", borderRadius: 11,
                          padding: "10px 12px", fontSize: 13,
                          fontWeight: 600, color: "var(--slate-500)", lineHeight: 1.5
                        }}>
                          <span style={{ fontWeight: 800, color: "var(--slate-700)" }}>Reason: </span>{a.reason}
                        </div>
                      )}
                    </div>

                    {/* Footer — action for upcoming only */}
                    {a.status === "BOOKED" && (
                      <div className="appt-footer">
                        <button className="btn-complete" onClick={() => setConfirmId(a.id)}>
                          ✓ Mark Completed
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      {confirmId && (
        <div className="overlay" onClick={() => setConfirmId(null)}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">✅</div>
            <div className="confirm-title">Complete Appointment?</div>
            <div className="confirm-sub">
              This will mark the appointment as completed and notify the patient. You can ask them to leave a review.
            </div>
            <div className="confirm-row">
              <button className="confirm-no"  onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="confirm-yes" onClick={completeAppointment}>Yes, Complete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"} {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

export default DoctorDashboardPage;