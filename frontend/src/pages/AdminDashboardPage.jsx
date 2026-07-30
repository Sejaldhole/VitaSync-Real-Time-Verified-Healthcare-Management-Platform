import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

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
    --green-50: #F0FDF4;
    --green-400: #4ADE80;
    --green-500: #22C55E;
    --green-600: #16A34A;
    --red-50: #FEF2F2;
    --red-400: #F87171;
    --red-500: #EF4444;
    --red-600: #DC2626;
    --amber-50: #FFFBEB;
    --amber-400: #FBBF24;
    --amber-500: #F59E0B;
    --amber-600: #D97706;
    --slate-50: #F8FAFC;
    --slate-100: #F1F5F9;
    --slate-200: #E2E8F0;
    --slate-300: #CBD5E1;
    --slate-400: #94A3B8;
    --slate-500: #64748B;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1E293B;
  }

  .admin-page {
    min-height: 100vh;
    background: #F0F6FF;
    font-family: 'Nunito', sans-serif;
  }

  /* ── MAIN CONTENT ── */
  .admin-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 32px 60px;
  }

  /* Page header */
  .page-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; flex-wrap: wrap;
    gap: 16px; margin-bottom: 32px;
    animation: fadeInUp 0.4s ease both;
  }
  .page-title-wrap {}
  .page-eyebrow {
    font-size: 11px; font-weight: 800;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--blue-600); margin-bottom: 6px;
    display: flex; align-items: center; gap: 6px;
  }
  .page-title {
    font-family: 'Lora', serif;
    font-size: 28px; font-weight: 700;
    color: var(--slate-800); line-height: 1.2;
  }
  .page-sub { font-size: 14px; font-weight: 600; color: var(--slate-400); margin-top: 4px; }

  .refresh-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 12px;
    border: 2px solid var(--slate-200); background: #fff;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 800; color: var(--slate-600);
    cursor: pointer; transition: all 0.2s;
    align-self: flex-end;
  }
  .refresh-btn:hover { border-color: var(--blue-400); color: var(--blue-600); background: var(--blue-50); }
  .refresh-btn.spinning .refresh-icon { animation: spin 0.8s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg);} }
  .refresh-icon { font-size: 15px; display: inline-block; }

  /* ── STATS CARDS ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px; margin-bottom: 32px;
    animation: fadeInUp 0.4s ease 0.05s both;
  }

  .stat-card {
    background: #fff; border-radius: 20px;
    padding: 22px 24px;
    border: 2px solid transparent;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    display: flex; flex-direction: column; gap: 12px;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    cursor: default;
  }
  .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }

  .stat-card.total   { border-color: var(--blue-100);  }
  .stat-card.pending { border-color: #FDE68A;           }
  .stat-card.approved{ border-color: #BBF7D0;           }
  .stat-card.rejected{ border-color: #FECACA;           }

  .stat-icon-wrap {
    width: 44px; height: 44px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
  }
  .ic-total    { background: var(--blue-50);   }
  .ic-pending  { background: var(--amber-50);  }
  .ic-approved { background: var(--green-50);  }
  .ic-rejected { background: var(--red-50);    }

  .stat-body {}
  .stat-num {
    font-size: 36px; font-weight: 900; line-height: 1;
    margin-bottom: 4px;
  }
  .num-total    { color: var(--blue-600);  }
  .num-pending  { color: var(--amber-600); }
  .num-approved { color: var(--green-600); }
  .num-rejected { color: var(--red-600);   }

  .stat-label { font-size: 13px; font-weight: 700; color: var(--slate-500); }

  /* ── FILTER BAR ── */
  .filter-bar {
    display: flex; align-items: center; gap: 10px;
    flex-wrap: wrap; margin-bottom: 24px;
    animation: fadeInUp 0.4s ease 0.1s both;
  }
  .filter-label { font-size: 13px; font-weight: 800; color: var(--slate-500); margin-right: 4px; }

  .filter-btn {
    padding: 7px 16px; border-radius: 100px;
    border: 2px solid var(--slate-200); background: #fff;
    font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 800; color: var(--slate-500);
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 6px;
  }
  .filter-btn:hover { border-color: var(--blue-300); color: var(--blue-600); }
  .filter-btn.active-all      { background: var(--blue-600);  border-color: var(--blue-600);  color: #fff; }
  .filter-btn.active-pending  { background: var(--amber-500); border-color: var(--amber-500); color: #fff; }
  .filter-btn.active-approved { background: var(--green-500); border-color: var(--green-500); color: #fff; }
  .filter-btn.active-rejected { background: var(--red-500);   border-color: var(--red-500);   color: #fff; }

  .filter-count {
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(255,255,255,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 900;
  }
  .filter-btn:not([class*="active"]) .filter-count {
    background: var(--slate-100); color: var(--slate-500);
  }

  /* Search */
  .search-wrap {
    margin-left: auto; position: relative;
  }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 14px; }
  .search-input {
    padding: 8px 14px 8px 36px;
    border: 2px solid var(--slate-200); border-radius: 12px; outline: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 600; color: var(--slate-800);
    background: #fff; width: 220px; transition: all 0.2s;
  }
  .search-input::placeholder { color: var(--slate-400); }
  .search-input:focus { border-color: var(--blue-400); box-shadow: 0 0 0 4px rgba(96,165,250,0.1); width: 260px; }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center; padding: 80px 24px;
    background: #fff; border-radius: 24px;
    border: 2px dashed var(--slate-200);
    animation: fadeInUp 0.4s ease both;
  }
  .empty-icon { font-size: 48px; margin-bottom: 16px; }
  .empty-title { font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: var(--slate-700); margin-bottom: 8px; }
  .empty-sub { font-size: 14px; font-weight: 600; color: var(--slate-400); }

  /* ── REQUEST CARDS ── */
  .cards-grid {
    display: flex; flex-direction: column; gap: 16px;
  }

  .request-card {
    background: #fff; border-radius: 20px;
    border: 2px solid var(--slate-200);
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    overflow: hidden;
    transition: box-shadow 0.25s;
    animation: fadeInUp 0.4s ease both;
  }
  .request-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.09); }
  .request-card.status-approved { border-left: 4px solid var(--green-400); }
  .request-card.status-rejected { border-left: 4px solid var(--red-400);   }
  .request-card.status-pending  { border-left: 4px solid var(--amber-400); }

  /* Card header */
  .card-header {
    display: flex; align-items: center; gap: 16px;
    padding: 20px 24px 0;
  }
  .doctor-avatar {
    width: 54px; height: 54px; border-radius: 16px;
    object-fit: cover; flex-shrink: 0;
    border: 2px solid var(--slate-200);
  }
  .doctor-avatar-placeholder {
    width: 54px; height: 54px; border-radius: 16px;
    background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; color: #fff; font-weight: 900; flex-shrink: 0;
  }
  .card-title-area { flex: 1; min-width: 0; }
  .doctor-name {
    font-family: 'Lora', serif;
    font-size: 18px; font-weight: 700; color: var(--slate-800);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .doctor-spec {
    font-size: 13px; font-weight: 700; color: var(--blue-600); margin-top: 2px;
  }

  /* Status badge */
  .status-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 100px;
    font-size: 11px; font-weight: 900;
    letter-spacing: 0.06em; text-transform: uppercase;
    flex-shrink: 0;
  }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; }
  .badge-pending  { background: var(--amber-50); color: var(--amber-600); }
  .badge-pending .status-dot  { background: var(--amber-500); animation: pulse 2s infinite; }
  .badge-approved { background: var(--green-50); color: var(--green-600); }
  .badge-approved .status-dot { background: var(--green-500); }
  .badge-rejected { background: var(--red-50);   color: var(--red-600);   }
  .badge-rejected .status-dot { background: var(--red-500);   }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

  /* Card body */
  .card-body { padding: 16px 24px; }

  .info-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 10px; margin-bottom: 12px;
  }
  .info-item {
    background: var(--slate-50); border-radius: 12px;
    padding: 10px 12px;
  }
  .info-item-label { font-size: 10px; font-weight: 800; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
  .info-item-value { font-size: 13px; font-weight: 700; color: var(--slate-700); }

  /* Tags row */
  .tags-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--blue-50); color: var(--blue-700);
    border-radius: 8px; padding: 4px 10px;
    font-size: 12px; font-weight: 700;
  }
  .tag.green { background: var(--green-50); color: var(--green-600); }
  .tag.amber { background: var(--amber-50); color: var(--amber-600); }

  /* About */
  .about-text {
    font-size: 13px; font-weight: 600; color: var(--slate-500);
    line-height: 1.6; padding: 12px 14px;
    background: var(--slate-50); border-radius: 12px;
    margin-bottom: 16px;
  }

  /* Divider */
  .card-divider { height: 1px; background: var(--slate-100); margin: 0 24px; }

  /* Card footer */
  .card-footer {
    display: flex; align-items: center;
    justify-content: space-between; gap: 12px;
    padding: 16px 24px;
  }
  .card-footer-meta {
    font-size: 12px; font-weight: 700; color: var(--slate-400);
    display: flex; align-items: center; gap: 6px;
  }

  .action-row { display: flex; gap: 10px; }

  .btn-approve {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 12px; border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 800; color: #fff;
    background: linear-gradient(135deg, var(--green-500), var(--green-400));
    box-shadow: 0 6px 18px rgba(34,197,94,0.3);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .btn-approve:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(34,197,94,0.4); }
  .btn-approve:active { transform: scale(0.97); }

  .btn-reject {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 12px;
    border: 2px solid #FECACA; background: var(--red-50);
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 800; color: var(--red-600);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .btn-reject:hover { background: var(--red-500); color: #fff; border-color: var(--red-500); transform: translateY(-2px); }
  .btn-reject:active { transform: scale(0.97); }

  /* Loading skeleton */
  .skeleton-wrap { display: flex; flex-direction: column; gap: 16px; }
  .skeleton-card {
    background: #fff; border-radius: 20px;
    border: 2px solid var(--slate-200);
    padding: 24px; overflow: hidden;
  }
  .skeleton-line {
    height: 14px; border-radius: 8px;
    background: linear-gradient(90deg, var(--slate-100) 25%, var(--slate-200) 50%, var(--slate-100) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    margin-bottom: 12px;
  }
  @keyframes shimmer { to{background-position: -200% 0;} }

  /* Confirm overlay */
  .confirm-overlay {
    position: fixed; inset: 0;
    background: rgba(15,23,42,0.5);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 24px;
    animation: fadeIn 0.2s ease both;
  }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
  .confirm-box {
    background: #fff; border-radius: 24px;
    padding: 32px; max-width: 380px; width: 100%;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18);
    animation: scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.9);} to{opacity:1;transform:scale(1);} }
  .confirm-icon { font-size: 36px; margin-bottom: 16px; }
  .confirm-title { font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: var(--slate-800); margin-bottom: 8px; }
  .confirm-sub { font-size: 14px; font-weight: 600; color: var(--slate-500); line-height: 1.6; margin-bottom: 24px; }
  .confirm-actions { display: flex; gap: 10px; }
  .confirm-cancel {
    flex: 1; padding: 12px; border-radius: 12px;
    border: 2px solid var(--slate-200); background: #fff;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    color: var(--slate-600); cursor: pointer; transition: all 0.2s;
  }
  .confirm-cancel:hover { background: var(--slate-100); }
  .confirm-ok {
    flex: 1; padding: 12px; border-radius: 12px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    color: #fff; cursor: pointer; transition: all 0.2s;
  }
  .confirm-ok.approve { background: var(--green-500); }
  .confirm-ok.approve:hover { background: var(--green-600); }
  .confirm-ok.reject  { background: var(--red-500); }
  .confirm-ok.reject:hover  { background: var(--red-600); }

  /* Toast notification */
  .toast-container {
    position: fixed; bottom: 28px; right: 28px;
    display: flex; flex-direction: column; gap: 10px;
    z-index: 200;
  }
  .toast {
    display: flex; align-items: center; gap: 10px;
    padding: 14px 18px; border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    font-size: 14px; font-weight: 800;
    animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    min-width: 260px;
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  .toast.success { background: var(--green-500); color: #fff; }
  .toast.error   { background: var(--red-500);   color: #fff; }

  @keyframes fadeInUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 900px) {
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .info-grid  { grid-template-columns: repeat(2,1fr); }
    .admin-main { padding: 20px 16px 48px; }
  }
  @media (max-width: 600px) {
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .info-grid  { grid-template-columns: 1fr; }
    .search-wrap { width: 100%; margin-left: 0; }
    .search-input { width: 100%; }
    .search-input:focus { width: 100%; }
    .card-header { flex-wrap: wrap; }
  }
`;

function AdminDashboardPage() {
  const [requests, setRequests]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter]       = useState("ALL");
  const [search, setSearch]       = useState("");
  const [confirm, setConfirm]     = useState(null); // { id, type, name }
  const [toasts, setToasts]       = useState([]);

  useEffect(() => { getRequests(); }, []);

  const getRequests = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await api.get("/admin/doctor-requests");
      setRequests(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const handleConfirm = async () => {
    if (!confirm) return;
    const { id, type, name } = confirm;
    setConfirm(null);
    try {
      await api.post(`/admin/${type}/${id}`);
      addToast(
        type === "approve" ? `Dr. ${name} approved ✅` : `Dr. ${name} rejected`,
        type === "approve" ? "success" : "error"
      );
      getRequests();
    } catch (error) {
      console.log(error);
      addToast("Action failed. Please try again.", "error");
    }
  };

  const totalRequests    = requests.length;
  const pendingRequests  = requests.filter((r) => r.status === "PENDING").length;
  const approvedDoctors  = requests.filter((r) => r.status === "APPROVED").length;
  const rejectedDoctors  = requests.filter((r) => r.status === "REJECTED").length;

  const filtered = requests.filter((r) => {
    const matchFilter = filter === "ALL" || r.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.specialization?.toLowerCase().includes(q) ||
      r.hospitalName?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <style>{styles}</style>
      <div className="admin-page">
        <Navbar title="VitaSync Admin" dashboardPath="/admin-dashboard" />

        <div className="admin-main">

          {/* Page Header */}
          <div className="page-header">
            <div className="page-title-wrap">
              <div className="page-eyebrow">🛡️ Admin Panel</div>
              <h1 className="page-title">Doctor Requests</h1>
              <p className="page-sub">Review and manage incoming doctor registration requests</p>
            </div>
            <button
              className={`refresh-btn ${refreshing ? "spinning" : ""}`}
              onClick={() => getRequests(true)}
            >
              <span className="refresh-icon">↻</span>
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {[
              { key: "total",    icon: "📋", label: "Total Requests", num: totalRequests,   numCls: "num-total",    icCls: "ic-total",    cardCls: "total"    },
              { key: "pending",  icon: "⏳", label: "Pending Review", num: pendingRequests, numCls: "num-pending",  icCls: "ic-pending",  cardCls: "pending"  },
              { key: "approved", icon: "✅", label: "Approved",       num: approvedDoctors, numCls: "num-approved", icCls: "ic-approved", cardCls: "approved" },
              { key: "rejected", icon: "❌", label: "Rejected",       num: rejectedDoctors, numCls: "num-rejected", icCls: "ic-rejected", cardCls: "rejected" },
            ].map((s) => (
              <div className={`stat-card ${s.cardCls}`} key={s.key}>
                <div className={`stat-icon-wrap ${s.icCls}`}>{s.icon}</div>
                <div className="stat-body">
                  <div className={`stat-num ${s.numCls}`}>{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="filter-bar">
            <span className="filter-label">Filter:</span>
            {[
              { key: "ALL",      label: "All",      count: totalRequests,    cls: "all"      },
              { key: "PENDING",  label: "Pending",  count: pendingRequests,  cls: "pending"  },
              { key: "APPROVED", label: "Approved", count: approvedDoctors,  cls: "approved" },
              { key: "REJECTED", label: "Rejected", count: rejectedDoctors,  cls: "rejected" },
            ].map((f) => (
              <button
                key={f.key}
                className={`filter-btn ${filter === f.key ? `active-${f.cls}` : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className="filter-count">{f.count}</span>
              </button>
            ))}

            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search by name, email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="skeleton-wrap">
              {[1, 2, 3].map((i) => (
                <div className="skeleton-card" key={i}>
                  <div className="skeleton-line" style={{ width: "40%", height: "20px" }} />
                  <div className="skeleton-line" style={{ width: "60%" }} />
                  <div className="skeleton-line" style={{ width: "80%" }} />
                  <div className="skeleton-line" style={{ width: "50%" }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{search || filter !== "ALL" ? "🔍" : "📭"}</div>
              <div className="empty-title">{search || filter !== "ALL" ? "No results found" : "No doctor requests yet"}</div>
              <div className="empty-sub">{search || filter !== "ALL" ? "Try adjusting your search or filter" : "New requests will appear here once doctors apply"}</div>
            </div>
          ) : (
            <div className="cards-grid">
              {filtered.map((r, idx) => (
                <div
                  className={`request-card status-${r.status?.toLowerCase()}`}
                  key={r.id}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Card Header */}
                  <div className="card-header">
                    {r.profileImageUrl ? (
                      <img className="doctor-avatar" src={r.profileImageUrl} alt={r.name} onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <div className="doctor-avatar-placeholder">{getInitials(r.name)}</div>
                    )}
                    <div className="card-title-area">
                      <div className="doctor-name">{r.name}</div>
                      <div className="doctor-spec">{r.specialization}</div>
                    </div>
                    <div className={`status-badge badge-${r.status?.toLowerCase()}`}>
                      <span className="status-dot" />
                      {r.status}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-item-label">Email</div>
                        <div className="info-item-value">{r.email}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-item-label">Phone</div>
                        <div className="info-item-value">{r.phone}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-item-label">Experience</div>
                        <div className="info-item-value">{r.experience} years</div>
                      </div>
                      <div className="info-item">
                        <div className="info-item-label">Hospital</div>
                        <div className="info-item-value">{r.hospitalName}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-item-label">License No.</div>
                        <div className="info-item-value">{r.licenseNumber}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-item-label">Timings</div>
                        <div className="info-item-value">{r.startTime} – {r.endTime}</div>
                      </div>
                    </div>

                    <div className="tags-row">
                      <span className="tag">🎓 {r.degree}</span>
                      <span className="tag green">💰 ₹{r.consultationFees} / visit</span>
                      {r.slotDuration && <span className="tag amber">⏱ {r.slotDuration} min slots</span>}
                    </div>

                    {r.about && (
                      <div className="about-text">
                        "{r.about}"
                      </div>
                    )}
                  </div>

                  <div className="card-divider" />

                  {/* Card Footer */}
                  <div className="card-footer">
                    <div className="card-footer-meta">
                      📍 {r.hospitalAddress || "Address not provided"}
                    </div>
                    {r.status === "PENDING" && (
                      <div className="action-row">
                        <button
                          className="btn-reject"
                          onClick={() => setConfirm({ id: r.id, type: "reject", name: r.name })}
                        >
                          ✕ Reject
                        </button>
                        <button
                          className="btn-approve"
                          onClick={() => setConfirm({ id: r.id, type: "approve", name: r.name })}
                        >
                          ✓ Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      {confirm && (
        <div className="confirm-overlay" onClick={() => setConfirm(null)}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">{confirm.type === "approve" ? "✅" : "⚠️"}</div>
            <div className="confirm-title">
              {confirm.type === "approve" ? "Approve Doctor?" : "Reject Request?"}
            </div>
            <div className="confirm-sub">
              {confirm.type === "approve"
                ? `Dr. ${confirm.name} will be granted access to the VitaSync platform and can start accepting patients.`
                : `Dr. ${confirm.name}'s request will be rejected. This action can be reviewed later.`}
            </div>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setConfirm(null)}>Cancel</button>
              <button
                className={`confirm-ok ${confirm.type}`}
                onClick={handleConfirm}
              >
                {confirm.type === "approve" ? "Yes, Approve" : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === "success" ? "✅" : "❌"} {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

export default AdminDashboardPage;