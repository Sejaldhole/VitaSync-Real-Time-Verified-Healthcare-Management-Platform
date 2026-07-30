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
    --amber-50:#FFFBEB; --amber-400:#FBBF24; --amber-500:#F59E0B; --amber-600:#D97706;
    --red-50:#FEF2F2; --red-400:#F87171; --red-500:#EF4444;
    --slate-50:#F8FAFC; --slate-100:#F1F5F9; --slate-200:#E2E8F0;
    --slate-300:#CBD5E1; --slate-400:#94A3B8; --slate-500:#64748B;
    --slate-600:#475569; --slate-700:#334155; --slate-800:#1E293B;
  }

  .profile-page { min-height: 100vh; background: #F0F6FF; font-family: 'Nunito', sans-serif; }

  /* ── HERO SECTION ── */
  .hero {
    background: linear-gradient(145deg, #1a56db 0%, #1e3a8a 60%, #0f2460 100%);
    position: relative; overflow: hidden; padding: 48px 0 80px;
  }
  .hero::before {
    content:''; position:absolute;
    width:500px; height:500px; border-radius:50%;
    border:60px solid rgba(255,255,255,0.05);
    top:-160px; right:-100px;
  }
  .hero::after {
    content:''; position:absolute;
    width:300px; height:300px; border-radius:50%;
    border:40px solid rgba(255,255,255,0.05);
    bottom:-80px; left:-60px;
  }
  .blob { position:absolute; border-radius:50%; filter:blur(70px); pointer-events:none; }
  .b1 { width:300px; height:300px; background:rgba(96,165,250,0.2); top:20px; right:100px; animation:bf 8s ease-in-out infinite alternate; }
  .b2 { width:180px; height:180px; background:rgba(45,212,191,0.18); bottom:40px; right:300px; animation:bf 11s ease-in-out infinite alternate-reverse; }
  @keyframes bf { from{transform:translate(0,0) scale(1);} to{transform:translate(20px,-24px) scale(1.08);} }

  .hero-inner {
    position:relative; z-index:2;
    max-width:1100px; margin:0 auto; padding:0 32px;
    display:flex; align-items:center; gap:36px;
  }

  /* Back button */
  .back-btn {
    position:absolute; top:0; left:32px;
    background:rgba(255,255,255,0.1);
    border:1.5px solid rgba(255,255,255,0.2);
    border-radius:12px; padding:8px 16px;
    font-family:'Nunito',sans-serif;
    font-size:13px; font-weight:800; color:rgba(255,255,255,0.85);
    cursor:pointer; display:flex; align-items:center; gap:6px;
    transition:all 0.2s;
  }
  .back-btn:hover { background:rgba(255,255,255,0.18); }

  /* Doctor photo */
  .doctor-photo-wrap {
    flex-shrink:0; margin-top:28px;
  }
  .doctor-photo {
    width:140px; height:140px; border-radius:28px;
    object-fit:cover;
    border:4px solid rgba(255,255,255,0.25);
    box-shadow:0 16px 48px rgba(0,0,0,0.3);
  }
  .doctor-photo-placeholder {
    width:140px; height:140px; border-radius:28px;
    background:linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05));
    border:4px solid rgba(255,255,255,0.2);
    display:flex; align-items:center; justify-content:center;
    font-size:52px; font-weight:900; color:rgba(255,255,255,0.9);
    font-family:'Nunito',sans-serif;
    box-shadow:0 16px 48px rgba(0,0,0,0.2);
    letter-spacing:-1px;
  }

  /* Hero info */
  .hero-info { flex:1; margin-top:36px; }
  .hero-badge {
    display:inline-flex; align-items:center; gap:7px;
    background:rgba(255,255,255,0.12);
    border:1px solid rgba(255,255,255,0.2);
    border-radius:100px; padding:5px 14px;
    font-size:11px; font-weight:800;
    letter-spacing:0.1em; text-transform:uppercase;
    color:rgba(255,255,255,0.85); margin-bottom:14px;
  }
  .badge-dot {
    width:7px; height:7px; border-radius:50%;
    background:var(--green-400);
    box-shadow:0 0 8px var(--green-400);
    animation:pulse 2s ease infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

  .hero-name {
    font-family:'Lora',serif;
    font-size:clamp(26px,3vw,40px);
    font-weight:700; color:#fff; line-height:1.1;
    margin-bottom:8px;
  }
  .hero-spec {
    font-size:16px; font-weight:700;
    color:var(--teal-400); margin-bottom:16px;
  }

  .hero-tags { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:24px; }
  .hero-tag {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(255,255,255,0.1);
    border:1px solid rgba(255,255,255,0.15);
    border-radius:10px; padding:6px 14px;
    font-size:13px; font-weight:700; color:rgba(255,255,255,0.85);
  }

  .rating-row { display:flex; align-items:center; gap:10px; }
  .star-display { display:flex; gap:2px; }
  .star-icon { font-size:18px; }
  .rating-num { font-size:18px; font-weight:900; color:#fff; }
  .rating-count { font-size:13px; font-weight:600; color:rgba(255,255,255,0.5); }

  /* ── BODY ── */
  .page-body {
    max-width:1100px; margin:0 auto; padding:0 32px 64px;
    display:grid; grid-template-columns:1fr 340px; gap:24px;
    position:relative; top:-40px;
  }

  /* ── LEFT COLUMN ── */
  .left-col { display:flex; flex-direction:column; gap:20px; }

  .card {
    background:#fff; border-radius:20px;
    border:2px solid var(--slate-200);
    box-shadow:0 2px 12px rgba(0,0,0,0.05);
    overflow:hidden;
    animation:fadeInUp 0.4s ease both;
  }

  .card-header {
    display:flex; align-items:center; gap:12px;
    padding:18px 22px 0;
  }
  .card-header-icon {
    width:36px; height:36px; border-radius:10px;
    display:flex; align-items:center; justify-content:center; font-size:17px;
  }
  .ic-blue   { background:var(--blue-50);  }
  .ic-amber  { background:var(--amber-50); }
  .ic-green  { background:var(--green-50); }
  .ic-teal   { background:#F0FDFA; }

  .card-title {
    font-family:'Lora',serif;
    font-size:17px; font-weight:700; color:var(--slate-800);
  }

  /* About section */
  .about-text {
    padding:14px 22px 20px;
    font-size:14px; font-weight:600;
    color:var(--slate-600); line-height:1.75;
  }

  /* Info grid */
  .info-grid {
    display:grid; grid-template-columns:1fr 1fr;
    gap:12px; padding:14px 22px 20px;
  }
  .info-item {
    background:var(--slate-50); border-radius:14px;
    padding:14px 16px;
    display:flex; align-items:center; gap:12px;
  }
  .ii-icon {
    width:38px; height:38px; border-radius:11px;
    display:flex; align-items:center; justify-content:center;
    font-size:17px; flex-shrink:0;
  }
  .ii-label { font-size:10px; font-weight:800; color:var(--slate-400); text-transform:uppercase; letter-spacing:0.06em; }
  .ii-value { font-size:14px; font-weight:800; color:var(--slate-800); margin-top:2px; }

  /* Reviews */
  .reviews-list { padding:14px 22px 20px; display:flex; flex-direction:column; gap:14px; }

  .review-card {
    background:var(--slate-50); border-radius:16px;
    padding:16px 18px; border:1.5px solid var(--slate-200);
    transition:box-shadow 0.2s;
  }
  .review-card:hover { box-shadow:0 4px 16px rgba(0,0,0,0.07); }

  .review-header { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
  .reviewer-avatar {
    width:38px; height:38px; border-radius:12px;
    background:linear-gradient(135deg,var(--blue-500),var(--blue-700));
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:900; color:#fff; flex-shrink:0;
    font-family:'Nunito',sans-serif;
  }
  .reviewer-name { font-size:14px; font-weight:800; color:var(--slate-800); }
  .review-date   { font-size:11px; font-weight:600; color:var(--slate-400); margin-top:2px; }

  .review-stars { display:flex; gap:2px; margin-left:auto; flex-shrink:0; }
  .rs { font-size:14px; }
  .rs.lit { color:var(--amber-400); }
  .rs.dim { color:var(--slate-200); }

  .review-text {
    font-size:13px; font-weight:600;
    color:var(--slate-600); line-height:1.65;
  }

  /* Empty reviews */
  .no-reviews {
    padding:40px 22px; text-align:center;
  }
  .no-reviews-icon { font-size:36px; margin-bottom:10px; }
  .no-reviews-text { font-size:14px; font-weight:700; color:var(--slate-400); }

  /* ── RIGHT COLUMN ── */
  .right-col { display:flex; flex-direction:column; gap:16px; }

  /* Book card */
  .book-card {
    background:#fff; border-radius:20px;
    border:2px solid var(--slate-200);
    box-shadow:0 2px 12px rgba(0,0,0,0.05);
    padding:24px; animation:fadeInUp 0.4s ease 0.1s both;
  }
  .book-card-title {
    font-family:'Lora',serif;
    font-size:18px; font-weight:700; color:var(--slate-800);
    margin-bottom:6px;
  }
  .book-card-sub { font-size:13px; font-weight:600; color:var(--slate-400); margin-bottom:20px; }

  .fee-display {
    background:linear-gradient(135deg,var(--blue-50),#F0FDFA);
    border:1.5px solid var(--blue-100);
    border-radius:16px; padding:16px 18px;
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:16px;
  }
  .fee-label { font-size:12px; font-weight:800; color:var(--slate-500); text-transform:uppercase; letter-spacing:0.07em; }
  .fee-value { font-size:24px; font-weight:900; color:var(--blue-700); }
  .fee-per   { font-size:12px; font-weight:600; color:var(--slate-400); }

  .schedule-row {
    display:flex; flex-direction:column; gap:10px; margin-bottom:20px;
  }
  .schedule-item {
    display:flex; align-items:center; gap:10px;
    background:var(--slate-50); border-radius:12px; padding:12px 14px;
  }
  .si-icon {
    width:34px; height:34px; border-radius:9px;
    display:flex; align-items:center; justify-content:center; font-size:15px;
    flex-shrink:0;
  }
  .si-label { font-size:11px; font-weight:800; color:var(--slate-400); text-transform:uppercase; letter-spacing:0.06em; }
  .si-value { font-size:13px; font-weight:800; color:var(--slate-700); }

  .book-btn {
    width:100%; padding:15px; border-radius:14px; border:none;
    font-family:'Nunito',sans-serif;
    font-size:15px; font-weight:900; color:#fff;
    background:linear-gradient(135deg,var(--blue-500),var(--blue-700));
    box-shadow:0 8px 24px rgba(37,99,235,0.3);
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
    transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .book-btn:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(37,99,235,0.4); }
  .book-btn:active { transform:scale(0.98); }

  /* Stats card */
  .stats-mini {
    background:#fff; border-radius:20px;
    border:2px solid var(--slate-200);
    box-shadow:0 2px 12px rgba(0,0,0,0.05);
    padding:20px;
    animation:fadeInUp 0.4s ease 0.15s both;
  }
  .sm-title { font-size:11px; font-weight:800; color:var(--slate-500); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:14px; }
  .sm-grid  { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .sm-item  { background:var(--slate-50); border-radius:12px; padding:12px; text-align:center; }
  .sm-num   { font-size:22px; font-weight:900; line-height:1; color:var(--blue-700); }
  .sm-label { font-size:10px; font-weight:800; color:var(--slate-400); text-transform:uppercase; letter-spacing:0.04em; margin-top:4px; }

  /* Hospital card */
  .hospital-card {
    background:#fff; border-radius:20px;
    border:2px solid var(--slate-200);
    box-shadow:0 2px 12px rgba(0,0,0,0.05);
    padding:20px;
    animation:fadeInUp 0.4s ease 0.2s both;
  }
  .hc-title { font-size:12px; font-weight:800; color:var(--slate-500); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:14px; }
  .hc-name  { font-size:15px; font-weight:800; color:var(--slate-800); margin-bottom:6px; }
  .hc-addr  { font-size:12px; font-weight:600; color:var(--slate-500); line-height:1.6; display:flex; gap:6px; }

  /* Loading skeleton */
  .skeleton-page { min-height:100vh; background:#F0F6FF; }
  .skeleton-hero { height:260px; background:linear-gradient(145deg,#1a56db,#0f2460); }
  .skeleton-body { max-width:1100px; margin:0 auto; padding:24px 32px; }
  .skeleton-line {
    height:16px; border-radius:8px; margin-bottom:12px;
    background:linear-gradient(90deg,var(--slate-100) 25%,var(--slate-200) 50%,var(--slate-100) 75%);
    background-size:200% 100%;
    animation:shimmer 1.5s infinite;
  }
  @keyframes shimmer { to{background-position:-200% 0;} }

  @keyframes fadeInUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width:900px) {
    .page-body { grid-template-columns:1fr; top:0; padding-top:24px; }
    .hero-inner { flex-direction:column; align-items:flex-start; gap:20px; }
    .info-grid  { grid-template-columns:1fr; }
    .sm-grid    { grid-template-columns:repeat(4,1fr); }
  }
  @media (max-width:600px) {
    .page-body { padding:16px 16px 48px; }
    .hero-inner { padding:0 20px; }
    .hero-tags  { gap:7px; }
    .sm-grid    { grid-template-columns:1fr 1fr; }
  }
`;

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function StarRow({ rating, size = 16 }) {
  return (
    <div className="star-display">
      {[1,2,3,4,5].map((s) => (
        <span key={s} className={`rs ${s <= Math.round(rating) ? "lit" : "dim"}`} style={{ fontSize: size }}>★</span>
      ))}
    </div>
  );
}

function DoctorProfilePage() {
  const { doctorId } = useParams();
  const navigate     = useNavigate();
  const [doctor,  setDoctor]  = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => { getDoctor(); getReviews(); }, []);

  const getDoctor = async () => {
    try {
      const res = await api.get("/doctors");
      setDoctor(res.data.find((d) => d.id === doctorId) || null);
    } catch (e) { console.log(e); }
  };

  const getReviews = async () => {
    try {
      const res = await api.get(`/reviews/${doctorId}`);
      setReviews(res.data);
    } catch (e) { console.log(e); }
  };

  if (!doctor) return (
    <>
      <style>{styles}</style>
      <div className="skeleton-page">
        <div className="skeleton-hero" />
        <div className="skeleton-body">
          {[80, 60, 90, 50, 70].map((w, i) => (
            <div key={i} className="skeleton-line" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </>
  );

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const slotCount = (() => {
    if (!doctor.startTime || !doctor.endTime || !doctor.slotDuration) return null;
    const [sh, sm] = doctor.startTime.split(":").map(Number);
    const [eh, em] = doctor.endTime.split(":").map(Number);
    const total = (eh * 60 + em) - (sh * 60 + sm);
    return total > 0 ? Math.floor(total / Number(doctor.slotDuration)) : null;
  })();

  return (
    <>
      <style>{styles}</style>
      <div className="profile-page">

        {/* ── HERO ── */}
        <div className="hero">
          <div className="blob b1" /><div className="blob b2" />

          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 2 }}>
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          </div>

          <div className="hero-inner">
            {/* Doctor photo */}
            <div className="doctor-photo-wrap">
              {doctor.profileImageUrl ? (
                <img
                  className="doctor-photo"
                  src={doctor.profileImageUrl}
                  alt={doctor.name}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="doctor-photo-placeholder"
                style={{ display: doctor.profileImageUrl ? "none" : "flex" }}
              >
                {getInitials(doctor.name)}
              </div>
            </div>

            {/* Hero info */}
            <div className="hero-info">
              <div className="hero-badge">
                <span className="badge-dot" />
                Available Today
              </div>

              <h1 className="hero-name">{doctor.name}</h1>
              <div className="hero-spec">{doctor.specialization}</div>

              <div className="hero-tags">
                <span className="hero-tag">🎓 {doctor.degree}</span>
                <span className="hero-tag">⏳ {doctor.experience} yrs exp</span>

              </div>

              {avgRating && (
                <div className="rating-row">
                  <StarRow rating={avgRating} size={20} />
                  <span className="rating-num">{avgRating}</span>
                  <span className="rating-count">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="page-body">

          {/* LEFT COLUMN */}
          <div className="left-col">

            {/* About */}
            {doctor.about && (
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon ic-blue">💬</div>
                  <div className="card-title">About</div>
                </div>
                <div className="about-text">{doctor.about}</div>
              </div>
            )}

            {/* Details */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-icon ic-teal">📋</div>
                <div className="card-title">Professional Details</div>
              </div>
              <div className="info-grid">
                {[
                  { icon: "✉️", bg: "ic-blue",  label: "Email",        value: doctor.email           },
                  { icon: "📱", bg: "ic-green", label: "Phone",        value: doctor.phone           },
                  { icon: "🏥", bg: "ic-amber", label: "Hospital",     value: doctor.hospitalName    },
                  { icon: "📍", bg: "ic-teal",  label: "Address",      value: doctor.hospitalAddress },
                  { icon: "🌅", bg: "ic-blue",  label: "Start Time",   value: doctor.startTime       },
                  { icon: "🌇", bg: "ic-amber", label: "End Time",     value: doctor.endTime         },
                  { icon: "⏱️", bg: "ic-green", label: "Slot Duration",value: doctor.slotDuration ? `${doctor.slotDuration} min` : null },
                  { icon: "💰", bg: "ic-teal",  label: "Consult Fee",  value: doctor.fees ? `₹${doctor.fees}` : null },
                ].filter((i) => i.value).map((item, idx) => (
                  <div className="info-item" key={idx}>
                    <div className={`ii-icon ${item.bg}`}>{item.icon}</div>
                    <div>
                      <div className="ii-label">{item.label}</div>
                      <div className="ii-value">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="card">
              <div className="card-header" style={{ paddingBottom: 16 }}>
                <div className="card-header-icon ic-amber">⭐</div>
                <div className="card-title">
                  Patient Reviews
                  {reviews.length > 0 && (
                    <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 700, color: "var(--slate-400)" }}>
                      ({reviews.length})
                    </span>
                  )}
                </div>
                {avgRating && (
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                    <StarRow rating={avgRating} size={14} />
                    <span style={{ fontSize: 14, fontWeight: 900, color: "var(--amber-600)" }}>{avgRating}</span>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="no-reviews">
                  <div className="no-reviews-icon">💬</div>
                  <div className="no-reviews-text">No reviews yet — be the first to share your experience!</div>
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map((review, idx) => (
                    <div className="review-card" key={review.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className="review-header">
                        <div className="reviewer-avatar">{getInitials(review.patientName)}</div>
                        <div>
                          <div className="reviewer-name">{review.patientName}</div>
                          <div className="review-date">
                            {review.reviewDate
                              ? new Date(review.reviewDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                              : ""}
                          </div>
                        </div>
                        <div className="review-stars">
                          {[1,2,3,4,5].map((s) => (
                            <span key={s} className={`rs ${s <= review.rating ? "lit" : "dim"}`}>★</span>
                          ))}
                        </div>
                      </div>
                      {review.reviewText && (
                        <div className="review-text">"{review.reviewText}"</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-col">

            {/* Book card */}
            <div className="book-card">
              <div className="book-card-title">Book a Consultation</div>
              <div className="book-card-sub">Select a convenient slot and confirm</div>

              <div className="fee-display">
                <div>
                  <div className="fee-label">Consultation Fee</div>
                  <div className="fee-value">₹{doctor.fees || "—"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="fee-per">per visit</div>
                  {slotCount && <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green-600)", marginTop: 4 }}>~{slotCount} slots/day</div>}
                </div>
              </div>

              <div className="schedule-row">
                <div className="schedule-item">
                  <div className="si-icon ic-blue">🌅</div>
                  <div>
                    <div className="si-label">Opens at</div>
                    <div className="si-value">{doctor.startTime}</div>
                  </div>
                </div>
                <div className="schedule-item">
                  <div className="si-icon ic-amber">🌇</div>
                  <div>
                    <div className="si-label">Closes at</div>
                    <div className="si-value">{doctor.endTime}</div>
                  </div>
                </div>
                {doctor.slotDuration && (
                  <div className="schedule-item">
                    <div className="si-icon ic-green">⏱️</div>
                    <div>
                      <div className="si-label">Per appointment</div>
                      <div className="si-value">{doctor.slotDuration} minutes</div>
                    </div>
                  </div>
                )}
              </div>

              <button className="book-btn" onClick={() => navigate(`/book/${doctor.id}`)}>
                📅 Book Appointment
              </button>
            </div>

            {/* Stats mini */}
            <div className="stats-mini">
              <div className="sm-title">Quick Stats</div>
              <div className="sm-grid">
                <div className="sm-item">
                  <div className="sm-num">{doctor.experience}</div>
                  <div className="sm-label">Years Exp.</div>
                </div>
                <div className="sm-item">
                  <div className="sm-num">{reviews.length}</div>
                  <div className="sm-label">Reviews</div>
                </div>
                <div className="sm-item">
                  <div className="sm-num">{avgRating || "—"}</div>
                  <div className="sm-label">Avg Rating</div>
                </div>
                <div className="sm-item">
                  <div className="sm-num">{slotCount || "—"}</div>
                  <div className="sm-label">Daily Slots</div>
                </div>
              </div>
            </div>

            {/* Hospital card */}
            {(doctor.hospitalName || doctor.hospitalAddress) && (
              <div className="hospital-card">
                <div className="hc-title">🏥 Practice Location</div>
                {doctor.hospitalName    && <div className="hc-name">{doctor.hospitalName}</div>}
                {doctor.hospitalAddress && <div className="hc-addr"><span>📍</span> {doctor.hospitalAddress}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorProfilePage;