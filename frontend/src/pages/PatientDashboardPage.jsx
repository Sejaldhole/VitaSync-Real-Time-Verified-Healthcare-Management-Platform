import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    max-width: 1280px; margin: 0 auto;
    padding: 28px 28px 60px;
  }

  /* ── LEFT SIDEBAR ── */
  .sidebar {
    flex: 0 0 300px; display: flex;
    flex-direction: column; gap: 16px;
    position: sticky; top: 24px; align-self: flex-start;
  }

  /* Profile card */
  .profile-card {
    background: #fff; border-radius: 24px;
    border: 2px solid var(--slate-200);
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  .profile-banner {
    height: 72px;
    background: linear-gradient(135deg, #1a56db, #1e3a8a);
    position: relative;
  }
  .profile-banner::after {
    content:''; position:absolute; inset:0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .profile-avatar-wrap {
    position: absolute; bottom: -32px; left: 50%;
    transform: translateX(-50%);
  }
  .profile-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    border: 3px solid #fff;
    background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: 900; color: #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    font-family: 'Nunito', sans-serif;
  }
  .profile-info {
    padding: 44px 20px 20px;
    text-align: center;
  }
  .profile-name {
    font-family: 'Lora', serif;
    font-size: 18px; font-weight: 700;
    color: var(--slate-800); margin-bottom: 4px;
  }
  .profile-email { font-size: 12px; font-weight: 600; color: var(--slate-400); margin-bottom: 16px; }

  .profile-tags { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 16px; }
  .ptag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 8px;
    font-size: 11px; font-weight: 800;
  }
  .ptag-blood  { background:#FEF2F2; color:var(--red-600);    }
  .ptag-gender { background:var(--blue-50); color:var(--blue-600); }
  .ptag-age    { background:var(--purple-50); color:var(--purple-600); }

  .edit-profile-btn {
    width: 100%; padding: 10px; border-radius: 12px;
    border: 2px solid var(--blue-100); background: var(--blue-50);
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 800; color: var(--blue-600);
    cursor: pointer; transition: all 0.2s;
  }
  .edit-profile-btn:hover { background: var(--blue-100); border-color: var(--blue-400); }

  /* Profile details list */
  .profile-details { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 10px; }
  .pd-item { display: flex; align-items: flex-start; gap: 10px; }
  .pd-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: var(--slate-100);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }
  .pd-label { font-size: 10px; font-weight: 800; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.06em; }
  .pd-value { font-size: 13px; font-weight: 700; color: var(--slate-700); }

  /* Quick stats */
  .quick-stats {
    background: #fff; border-radius: 20px;
    border: 2px solid var(--slate-200);
    padding: 18px 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  }
  .qs-title { font-size: 12px; font-weight: 800; color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px; }
  .qs-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
  .qs-item {
    background: var(--slate-50); border-radius: 12px;
    padding: 10px 8px; text-align: center;
  }
  .qs-num { font-size: 22px; font-weight: 900; line-height: 1; }
  .qs-num-blue   { color: var(--blue-600);  }
  .qs-num-green  { color: var(--green-600); }
  .qs-num-red    { color: var(--red-500);   }
  .qs-label { font-size: 10px; font-weight: 800; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 4px; }

  /* Book btn */
  .book-btn {
    width: 100%; padding: 14px; border-radius: 16px; border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 800; color: #fff;
    background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
    box-shadow: 0 8px 24px rgba(37,99,235,0.3);
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .book-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(37,99,235,0.4); }

  /* ── MAIN CONTENT ── */
  .main-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 20px; }

  /* Page header */
  .main-header { animation: fadeInUp 0.4s ease both; }
  .main-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--blue-600); margin-bottom: 4px; }
  .main-title { font-family: 'Lora', serif; font-size: 26px; font-weight: 700; color: var(--slate-800); }
  .main-sub { font-size: 14px; font-weight: 600; color: var(--slate-400); margin-top: 4px; }

  /* Tabs */
  .tabs-row {
    display: flex; gap: 4px;
    background: var(--slate-100); border-radius: 14px;
    padding: 4px; animation: fadeInUp 0.4s ease 0.05s both;
  }
  .tab-btn {
    flex: 1; padding: 9px 12px; border-radius: 10px; border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 800; color: var(--slate-500);
    background: transparent; cursor: pointer;
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .tab-btn:hover { color: var(--slate-700); }
  .tab-btn.active {
    background: #fff; color: var(--blue-600);
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .tab-badge {
    min-width: 18px; height: 18px; border-radius: 9px;
    background: var(--blue-100); color: var(--blue-700);
    font-size: 10px; font-weight: 900;
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0 5px;
  }
  .tab-btn.active .tab-badge { background: var(--blue-600); color: #fff; }
  .tab-btn:not(.active) .tab-badge.amber { background: var(--amber-100,#FEF3C7); color: var(--amber-700,#B45309); }
  .tab-btn:not(.active) .tab-badge.green { background: #D1FAE5; color: var(--green-700,#15803D); }
  .tab-btn:not(.active) .tab-badge.red   { background: #FEE2E2; color: var(--red-700,#B91C1C); }

  /* Empty state */
  .empty-state {
    text-align: center; padding: 60px 24px;
    background: #fff; border-radius: 20px;
    border: 2px dashed var(--slate-200);
    animation: fadeInUp 0.4s ease both;
  }
  .empty-icon { font-size: 42px; margin-bottom: 12px; }
  .empty-title { font-family: 'Lora', serif; font-size: 18px; font-weight: 700; color: var(--slate-700); margin-bottom: 6px; }
  .empty-sub { font-size: 13px; font-weight: 600; color: var(--slate-400); }

  /* Appointment cards */
  .appt-list { display: flex; flex-direction: column; gap: 14px; }

  .appt-card {
    background: #fff; border-radius: 20px;
    border: 2px solid var(--slate-200);
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    transition: box-shadow 0.2s;
    animation: fadeInUp 0.4s ease both;
  }
  .appt-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.09); }
  .appt-card.booked    { border-left: 4px solid var(--blue-400);  }
  .appt-card.completed { border-left: 4px solid var(--green-400); }
  .appt-card.cancelled { border-left: 4px solid var(--red-300, #FCA5A5); opacity: 0.75; }

  .appt-header {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 20px 0;
  }
  .doc-avatar-sm {
    width: 46px; height: 46px; border-radius: 14px;
    background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: #fff; font-weight: 900; flex-shrink: 0;
    font-family: 'Nunito', sans-serif;
  }
  .appt-doc-name {
    font-family: 'Lora', serif;
    font-size: 16px; font-weight: 700; color: var(--slate-800);
  }
  .appt-doc-spec { font-size: 12px; font-weight: 700; color: var(--blue-600); margin-top: 2px; }

  .appt-status-badge {
    margin-left: auto; flex-shrink: 0;
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 100px;
    font-size: 10px; font-weight: 900;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .appt-dot { width: 5px; height: 5px; border-radius: 50%; }
  .badge-booked    { background: var(--blue-50);  color: var(--blue-700);  }
  .badge-booked .appt-dot    { background: var(--blue-500); animation: pulse 2s infinite; }
  .badge-completed { background: var(--green-50); color: var(--green-700, #15803D); }
  .badge-completed .appt-dot { background: var(--green-500); }
  .badge-cancelled { background: var(--red-50);   color: var(--red-700, #B91C1C); }
  .badge-cancelled .appt-dot { background: var(--red-400); }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

  .appt-body { padding: 14px 20px; }
  .appt-info-row {
    display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;
  }
  .appt-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 9px;
    font-size: 12px; font-weight: 700;
    background: var(--slate-100); color: var(--slate-700);
  }

  .appt-reason {
    font-size: 13px; font-weight: 600; color: var(--slate-500);
    background: var(--slate-50); border-radius: 10px;
    padding: 10px 12px; line-height: 1.5;
  }
  .appt-reason span { font-weight: 800; color: var(--slate-700); }

  .appt-footer {
    display: flex; align-items: center; justify-content: flex-end;
    padding: 12px 20px 16px; gap: 10px;
  }

  .btn-cancel {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 18px; border-radius: 11px;
    border: 2px solid #FECACA; background: var(--red-50);
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 800; color: var(--red-600);
    cursor: pointer; transition: all 0.2s;
  }
  .btn-cancel:hover { background: var(--red-500); color: #fff; border-color: var(--red-500); }

  /* Review section */
  .review-section {
    margin-top: 12px; padding: 16px;
    background: var(--slate-50); border-radius: 14px;
    border: 1.5px solid var(--slate-200);
  }
  .review-title { font-size: 12px; font-weight: 800; color: var(--slate-600); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }

  .star-row { display: flex; gap: 6px; margin-bottom: 12px; }
  .star-btn {
    background: none; border: none; cursor: pointer;
    font-size: 22px; padding: 2px;
    transition: transform 0.15s;
    line-height: 1; color: var(--slate-300);
  }
  .star-btn.lit { color: var(--amber-400); }
  .star-btn:hover { transform: scale(1.2); }

  .review-textarea {
    width: 100%; padding: 10px 12px;
    border: 2px solid var(--slate-200); border-radius: 11px; outline: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 600; color: var(--slate-800);
    background: #fff; resize: vertical; min-height: 80px;
    transition: border-color 0.2s;
    margin-bottom: 10px;
  }
  .review-textarea::placeholder { color: var(--slate-400); }
  .review-textarea:focus { border-color: var(--blue-400); box-shadow: 0 0 0 4px rgba(96,165,250,0.1); }

  .btn-review {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 18px; border-radius: 11px; border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 800; color: #fff;
    background: linear-gradient(135deg, var(--amber-500), var(--amber-400));
    box-shadow: 0 4px 14px rgba(245,158,11,0.3);
    cursor: pointer; transition: all 0.2s;
  }
  .btn-review:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(245,158,11,0.4); }
  .btn-review:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .review-submitted {
    display: flex; align-items: center; gap: 8px;
    background: var(--green-50); border: 1.5px solid #BBF7D0;
    border-radius: 11px; padding: 10px 14px;
    font-size: 13px; font-weight: 700; color: var(--green-600);
  }

  /* ── EDIT PROFILE MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(15,23,42,0.5);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 24px;
    animation: fadeIn 0.2s ease both;
  }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }

  .modal-box {
    background: #fff; border-radius: 24px;
    padding: 32px; max-width: 500px; width: 100%;
    max-height: 90vh; overflow-y: auto;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18);
    animation: scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.92);} to{opacity:1;transform:scale(1);} }

  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }
  .modal-title { font-family: 'Lora', serif; font-size: 22px; font-weight: 700; color: var(--slate-800); }
  .modal-close {
    width: 34px; height: 34px; border-radius: 10px;
    border: 2px solid var(--slate-200); background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; cursor: pointer; color: var(--slate-500);
    transition: all 0.2s;
  }
  .modal-close:hover { background: var(--slate-100); }

  .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
  .modal-field { display: flex; flex-direction: column; gap: 5px; }
  .modal-field.full { grid-column: span 2; }
  .modal-label { font-size: 12px; font-weight: 800; color: var(--slate-700); }
  .modal-input, .modal-select, .modal-textarea {
    width: 100%; padding: 11px 14px;
    border: 2px solid var(--slate-200); border-radius: 11px; outline: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 600; color: var(--slate-800);
    background: #fff; transition: all 0.2s;
  }
  .modal-input::placeholder, .modal-textarea::placeholder { color: var(--slate-400); }
  .modal-input:focus, .modal-select:focus, .modal-textarea:focus {
    border-color: var(--blue-400);
    box-shadow: 0 0 0 4px rgba(96,165,250,0.1);
  }
  .modal-textarea { resize: vertical; min-height: 80px; }

  .modal-footer { display: flex; gap: 10px; justify-content: flex-end; }
  .modal-cancel {
    padding: 11px 22px; border-radius: 12px;
    border: 2px solid var(--slate-200); background: #fff;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    color: var(--slate-600); cursor: pointer; transition: all 0.2s;
  }
  .modal-cancel:hover { background: var(--slate-100); }
  .modal-save {
    padding: 11px 24px; border-radius: 12px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
    box-shadow: 0 6px 20px rgba(37,99,235,0.3);
    cursor: pointer; display: flex; align-items: center; gap: 7px;
    transition: all 0.2s;
  }
  .modal-save:hover { box-shadow: 0 10px 28px rgba(37,99,235,0.4); }

  /* Confirm dialog */
  .confirm-overlay {
    position: fixed; inset: 0;
    background: rgba(15,23,42,0.5);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 24px;
    animation: fadeIn 0.2s ease both;
  }
  .confirm-box {
    background: #fff; border-radius: 24px; padding: 32px;
    max-width: 360px; width: 100%;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18);
    animation: scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .confirm-icon { font-size: 34px; margin-bottom: 14px; }
  .confirm-title { font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: var(--slate-800); margin-bottom: 8px; }
  .confirm-sub { font-size: 13px; font-weight: 600; color: var(--slate-500); line-height: 1.6; margin-bottom: 22px; }
  .confirm-actions { display: flex; gap: 10px; }
  .confirm-no  {
    flex: 1; padding: 11px; border-radius: 12px;
    border: 2px solid var(--slate-200); background: #fff;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    color: var(--slate-600); cursor: pointer; transition: all 0.2s;
  }
  .confirm-no:hover { background: var(--slate-100); }
  .confirm-yes {
    flex: 1; padding: 11px; border-radius: 12px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    color: #fff; background: var(--red-500); cursor: pointer; transition: all 0.2s;
  }
  .confirm-yes:hover { background: var(--red-600); }

  /* Toast */
  .toast-container {
    position: fixed; bottom: 28px; right: 28px;
    display: flex; flex-direction: column; gap: 10px; z-index: 300;
  }
  .toast {
    display: flex; align-items: center; gap: 10px;
    padding: 13px 18px; border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 800; min-width: 250px;
    animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  .toast.success { background: var(--green-500); color: #fff; }
  .toast.error   { background: var(--red-500);   color: #fff; }
  .toast.info    { background: var(--blue-600);  color: #fff; }

  /* Loading skeleton */
  .skeleton-line {
    height: 14px; border-radius: 8px;
    background: linear-gradient(90deg, var(--slate-100) 25%, var(--slate-200) 50%, var(--slate-100) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    margin-bottom: 10px;
  }
  @keyframes shimmer { to{background-position:-200% 0;} }

  @keyframes fadeInUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 1024px) {
    .dash-body { flex-direction: column; padding: 16px 16px 48px; }
    .sidebar { position: static; flex: none; }
    .modal-grid { grid-template-columns: 1fr; }
    .modal-field.full { grid-column: span 1; }
  }
  @media (max-width: 600px) {
    .tabs-row { flex-wrap: wrap; }
    .appt-header { flex-wrap: wrap; }
    .appt-status-badge { margin-left: 0; }
  }
`;

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function PatientDashboardPage() {
  const navigate = useNavigate();

  const [user, setUser]                   = useState(null);
  const [appointments, setAppointments]   = useState([]);
  const [doctors, setDoctors]             = useState([]);
  const [editing, setEditing]             = useState(false);
  const [editUser, setEditUser]           = useState(null);
  const [tab, setTab]                     = useState("upcoming");
  const [ratings, setRatings]             = useState({});
  const [hoverRating, setHoverRating]     = useState({});
  const [reviewTexts, setReviewTexts]     = useState({});
  const [submitted, setSubmitted]         = useState({});
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [toasts, setToasts]               = useState([]);
  const [saving, setSaving]               = useState(false);

  useEffect(() => { getProfile(); getAppointments(); getDoctors(); }, []);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const getProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      setEditUser(res.data);
    } catch (e) { console.log(e); }
  };

  const getAppointments = async () => {
    try {
      const res = await api.get("/appointments/history");
      setAppointments(res.data);
    } catch (e) { console.log(e); }
  };

  const getDoctors = async () => {
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data);
    } catch (e) { console.log(e); }
  };

  const cancelAppointment = async () => {
    if (!cancelConfirm) return;
    try {
      await api.delete(`/appointments/${cancelConfirm}`);
      addToast("Appointment cancelled", "info");
      getAppointments();
    } catch (e) { addToast("Failed to cancel appointment", "error"); console.log(e); }
    finally { setCancelConfirm(null); }
  };

  const updateProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put("/auth/update", editUser);
      setUser(res.data);
      setEditing(false);
      addToast("Profile updated successfully ✅");
    } catch (e) { addToast("Failed to update profile", "error"); console.log(e); }
    finally { setSaving(false); }
  };

  const handleDateChange = (val) => {
    const today = new Date();
    const birth = new Date(val);
    let age = today.getFullYear() - birth.getFullYear();
    const md = today.getMonth() - birth.getMonth();
    if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) age--;
    setEditUser((p) => ({ ...p, birthDate: val, age }));
  };

  const submitReview = async (doctorId) => {
    if (!ratings[doctorId]) { addToast("Please select a star rating first", "error"); return; }
    try {
      const res = await api.post("/reviews", { doctorId, rating: ratings[doctorId], reviewText: reviewTexts[doctorId] });
      setSubmitted((p) => ({ ...p, [doctorId]: true }));
      addToast(res.data || "Review submitted! Thank you 🌟");
    } catch (e) { addToast("Failed to submit review", "error"); console.log(e); }
  };

  const doctorFor = (id) => doctors.find((d) => d.id === id);

  if (!user) return (
    <>
      <style>{styles}</style>
      <div className="dash-page">
        <Navbar title="VitaSync" dashboardPath="/dashboard" />
        <div className="dash-body">
          <div style={{ flex: 1, padding: "40px 0" }}>
            {[1,2,3].map(i => <div key={i} className="skeleton-line" style={{ width: `${60+i*10}%`, marginBottom: 16, height: 20 }} />)}
          </div>
        </div>
      </div>
    </>
  );

  const upcoming   = appointments.filter((a) => a.status === "BOOKED");
  const completed  = appointments.filter((a) => a.status === "COMPLETED");
  const cancelled  = appointments.filter((a) => a.status === "CANCELLED");

  const tabList = [
    { key: "upcoming",  label: "Upcoming",  count: upcoming.length,  badgeCls: "amber" },
    { key: "completed", label: "Completed", count: completed.length, badgeCls: "green" },
    { key: "cancelled", label: "Cancelled", count: cancelled.length, badgeCls: "red"   },
  ];

  const visibleAppointments = tab === "upcoming" ? upcoming : tab === "completed" ? completed : cancelled;

  return (
    <>
      <style>{styles}</style>
      <div className="dash-page">
        <Navbar title="VitaSync" dashboardPath="/dashboard" />

        <div className="dash-body">

          {/* ── SIDEBAR ── */}
          <div className="sidebar">

            {/* Profile card */}
            <div className="profile-card">
              <div className="profile-banner">
                <div className="profile-avatar-wrap">
                  <div className="profile-avatar">{getInitials(user.name)}</div>
                </div>
              </div>
              <div className="profile-info">
                <div className="profile-name">{user.name}</div>
                <div className="profile-email">{user.email}</div>
                <div className="profile-tags">
                  {user.bloodGroup && <span className="ptag ptag-blood">🩸 {user.bloodGroup}</span>}
                  {user.gender     && <span className="ptag ptag-gender">👤 {user.gender}</span>}
                  {user.age        && <span className="ptag ptag-age">🎂 {user.age} yrs</span>}
                </div>
                <button className="edit-profile-btn" onClick={() => { setEditUser({...user}); setEditing(true); }}>
                  ✏️ Edit Profile
                </button>
              </div>
              <div className="profile-details">
                {[
                  { icon: "📱", label: "Phone",      value: user.phone      || "Not set" },
                  { icon: "📅", label: "Birth Date",  value: user.birthDate  || "Not set" },
                  { icon: "📍", label: "Address",     value: user.address    || "Not set" },
                ].map((d, i) => (
                  <div className="pd-item" key={i}>
                    <div className="pd-icon">{d.icon}</div>
                    <div>
                      <div className="pd-label">{d.label}</div>
                      <div className="pd-value">{d.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="quick-stats">
              <div className="qs-title">My Appointments</div>
              <div className="qs-grid">
                <div className="qs-item">
                  <div className={`qs-num qs-num-blue`}>{upcoming.length}</div>
                  <div className="qs-label">Upcoming</div>
                </div>
                <div className="qs-item">
                  <div className={`qs-num qs-num-green`}>{completed.length}</div>
                  <div className="qs-label">Done</div>
                </div>
                <div className="qs-item">
                  <div className={`qs-num qs-num-red`}>{cancelled.length}</div>
                  <div className="qs-label">Cancelled</div>
                </div>
              </div>
            </div>

            {/* Book button */}
            <button className="book-btn" onClick={() => navigate("/categories")}>
              ➕ Book New Appointment
            </button>
          </div>

          {/* ── MAIN ── */}
          <div className="main-content">
            <div className="main-header">
              <div className="main-eyebrow">👋 Welcome back</div>
              <h1 className="main-title">My Dashboard</h1>
              <p className="main-sub">Manage your appointments and health records</p>
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
                  <span className={`tab-badge ${tab !== t.key ? t.badgeCls : ""}`}>{t.count}</span>
                </button>
              ))}
            </div>

            {/* Appointment list */}
            {visibleAppointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">{tab === "upcoming" ? "📅" : tab === "completed" ? "✅" : "❌"}</div>
                <div className="empty-title">No {tab} appointments</div>
                <div className="empty-sub">
                  {tab === "upcoming" ? "Book an appointment with a specialist to get started" : `Your ${tab} appointments will appear here`}
                </div>
              </div>
            ) : (
              <div className="appt-list">
                {visibleAppointments.map((a, idx) => {
                  const doc = doctorFor(a.doctorId);
                  return (
                    <div
                      className={`appt-card ${a.status.toLowerCase()}`}
                      key={a.id}
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    >
                      <div className="appt-header">
                        <div className="doc-avatar-sm">{doc ? getInitials(doc.name) : "?"}</div>
                        <div>
                          <div className="appt-doc-name">{doc?.name || "Doctor"}</div>
                          <div className="appt-doc-spec">{doc?.specialization || ""}</div>
                        </div>
                        <div className={`appt-status-badge badge-${a.status.toLowerCase()}`}>
                          <span className="appt-dot" />{a.status}
                        </div>
                      </div>

                      <div className="appt-body">
                        <div className="appt-info-row">
                          <span className="appt-chip">📅 {a.appointmentDate}</span>
                          <span className="appt-chip">🕐 {a.appointmentTime}</span>
                          {doc?.consultationFees && <span className="appt-chip">💰 ₹{doc.consultationFees}</span>}
                        </div>
                        {a.reason && (
                          <div className="appt-reason">
                            <span>Reason: </span>{a.reason}
                          </div>
                        )}

                        {/* Review section for completed */}
                        {a.status === "COMPLETED" && (
                          <div className="review-section" style={{ marginTop: 14 }}>
                            <div className="review-title">⭐ Rate your experience</div>
                            {submitted[a.doctorId] ? (
                              <div className="review-submitted">✅ Review submitted — thank you!</div>
                            ) : (
                              <>
                                <div className="star-row">
                                  {[1,2,3,4,5].map((s) => (
                                    <button
                                      key={s}
                                      className={`star-btn ${s <= (hoverRating[a.doctorId] || ratings[a.doctorId] || 0) ? "lit" : ""}`}
                                      onClick={() => setRatings((p) => ({ ...p, [a.doctorId]: s }))}
                                      onMouseEnter={() => setHoverRating((p) => ({ ...p, [a.doctorId]: s }))}
                                      onMouseLeave={() => setHoverRating((p) => ({ ...p, [a.doctorId]: 0 }))}
                                    >★</button>
                                  ))}
                                </div>
                                <textarea
                                  className="review-textarea"
                                  placeholder="Share your experience with this doctor…"
                                  value={reviewTexts[a.doctorId] || ""}
                                  onChange={(e) => setReviewTexts((p) => ({ ...p, [a.doctorId]: e.target.value }))}
                                />
                                <button
                                  className="btn-review"
                                  onClick={() => submitReview(a.doctorId)}
                                  disabled={!ratings[a.doctorId]}
                                >
                                  Submit Review
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {a.status === "BOOKED" && (
                        <div className="appt-footer">
                          <button className="btn-cancel" onClick={() => setCancelConfirm(a.id)}>
                            ✕ Cancel Appointment
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && editUser && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit Profile</div>
              <button className="modal-close" onClick={() => setEditing(false)}>✕</button>
            </div>
            <div className="modal-grid">
              <div className="modal-field full">
                <label className="modal-label">Full Name</label>
                <input className="modal-input" type="text" placeholder="Your name"
                  value={editUser.name || ""}
                  onChange={(e) => setEditUser((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Date of Birth</label>
                <input className="modal-input" type="date"
                  value={editUser.birthDate || ""}
                  onChange={(e) => handleDateChange(e.target.value)} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Gender</label>
                <select className="modal-select"
                  value={editUser.gender || ""}
                  onChange={(e) => setEditUser((p) => ({ ...p, gender: e.target.value }))}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="modal-field">
                <label className="modal-label">Phone Number</label>
                <input className="modal-input" type="text" placeholder="+91 99999 99999"
                  value={editUser.phone || ""}
                  onChange={(e) => setEditUser((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Blood Group</label>
                <select className="modal-select"
                  value={editUser.bloodGroup || ""}
                  onChange={(e) => setEditUser((p) => ({ ...p, bloodGroup: e.target.value }))}>
                  <option value="">Select blood group</option>
                  {["A+","A−","B+","B−","AB+","AB−","O+","O−"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div className="modal-field full">
                <label className="modal-label">Address</label>
                <textarea className="modal-textarea" placeholder="Your address"
                  value={editUser.address || ""}
                  onChange={(e) => setEditUser((p) => ({ ...p, address: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setEditing(false)}>Cancel</button>
              <button className="modal-save" onClick={updateProfile} disabled={saving}>
                {saving ? "Saving…" : "💾 Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirm Dialog */}
      {cancelConfirm && (
        <div className="confirm-overlay" onClick={() => setCancelConfirm(null)}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <div className="confirm-title">Cancel Appointment?</div>
            <div className="confirm-sub">This will cancel your booked appointment. This action cannot be undone.</div>
            <div className="confirm-actions">
              <button className="confirm-no"  onClick={() => setCancelConfirm(null)}>Keep It</button>
              <button className="confirm-yes" onClick={cancelAppointment}>Yes, Cancel</button>
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

export default PatientDashboardPage;