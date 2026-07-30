import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    --slate-50:#F8FAFC; --slate-100:#F1F5F9; --slate-200:#E2E8F0;
    --slate-300:#CBD5E1; --slate-400:#94A3B8; --slate-500:#64748B;
    --slate-600:#475569; --slate-700:#334155; --slate-800:#1E293B;
  }

  .home-page { min-height: 100vh; background: #F0F6FF; font-family: 'Nunito', sans-serif; }

  /* ── HERO BANNER ── */
  .hero {
    background: linear-gradient(145deg, #1a56db 0%, #1e3a8a 60%, #0f2460 100%);
    position: relative; overflow: hidden;
    padding: 44px 0 56px;
  }
  .hero::before {
    content:''; position:absolute; width:500px; height:500px; border-radius:50%;
    border:60px solid rgba(255,255,255,0.05); top:-160px; right:-100px;
  }
  .hero::after {
    content:''; position:absolute; width:280px; height:280px; border-radius:50%;
    border:40px solid rgba(255,255,255,0.05); bottom:-80px; left:-60px;
  }
  .blob { position:absolute; border-radius:50%; filter:blur(70px); pointer-events:none; }
  .b1 { width:280px; height:280px; background:rgba(96,165,250,0.2); top:10px; right:80px; animation:bf 8s ease-in-out infinite alternate; }
  .b2 { width:160px; height:160px; background:rgba(45,212,191,0.18); bottom:20px; right:280px; animation:bf 11s ease-in-out infinite alternate-reverse; }
  @keyframes bf { from{transform:translate(0,0) scale(1);} to{transform:translate(18px,-22px) scale(1.08);} }

  .hero-inner {
    position:relative; z-index:2;
    max-width:1200px; margin:0 auto; padding:0 32px;
  }

  .back-btn {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(255,255,255,0.1);
    border:1.5px solid rgba(255,255,255,0.2);
    border-radius:12px; padding:8px 16px;
    font-family:'Nunito',sans-serif;
    font-size:13px; font-weight:800; color:rgba(255,255,255,0.85);
    cursor:pointer; transition:all 0.2s; margin-bottom:28px;
    text-decoration:none;
  }
  .back-btn:hover { background:rgba(255,255,255,0.18); }

  .hero-eyebrow {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(255,255,255,0.12);
    border:1px solid rgba(255,255,255,0.2);
    border-radius:100px; padding:5px 14px;
    font-size:11px; font-weight:800;
    letter-spacing:0.1em; text-transform:uppercase;
    color:rgba(255,255,255,0.85); margin-bottom:16px;
  }
  .badge-dot {
    width:7px; height:7px; border-radius:50%;
    background:#4ADE80; box-shadow:0 0 8px #4ADE80;
    animation:pulse 2s ease infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

  .hero-title {
    font-family:'Lora',serif;
    font-size:clamp(28px,3.5vw,44px);
    font-weight:700; color:#fff; line-height:1.1;
    margin-bottom:10px;
  }
  .hero-title em { font-style:italic; color:var(--teal-400); }
  .hero-sub {
    font-size:15px; font-weight:600;
    color:rgba(255,255,255,0.6); max-width:520px; line-height:1.7;
    margin-bottom:28px;
  }

  /* Search bar in hero */
  .hero-search-wrap { position:relative; max-width:480px; }
  .hero-search-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); font-size:17px; pointer-events:none; }
  .hero-search {
    width:100%; padding:14px 18px 14px 48px;
    border:2px solid rgba(255,255,255,0.2);
    border-radius:16px; outline:none;
    font-family:'Nunito',sans-serif;
    font-size:14px; font-weight:600;
    color:#fff; background:rgba(255,255,255,0.1);
    transition:all 0.2s;
  }
  .hero-search::placeholder { color:rgba(255,255,255,0.45); }
  .hero-search:focus { border-color:rgba(255,255,255,0.45); background:rgba(255,255,255,0.15); box-shadow:0 0 0 4px rgba(255,255,255,0.08); }

  /* ── MAIN BODY ── */
  .page-body { max-width:1200px; margin:0 auto; padding:28px 32px 64px; }

  /* Toolbar */
  .toolbar {
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:12px; margin-bottom:24px;
    animation:fadeInUp 0.4s ease both;
  }
  .result-label { font-size:14px; font-weight:800; color:var(--slate-600); }
  .result-label span { color:var(--blue-600); }

  .sort-select {
    padding:9px 14px; border-radius:12px;
    border:2px solid var(--slate-200); background:#fff; outline:none;
    font-family:'Nunito',sans-serif;
    font-size:13px; font-weight:700; color:var(--slate-700);
    cursor:pointer; transition:border-color 0.2s;
  }
  .sort-select:focus { border-color:var(--blue-400); }

  /* Filter chips */
  .filter-chips {
    display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;
    animation:fadeInUp 0.4s ease 0.05s both;
  }
  .chip {
    padding:7px 16px; border-radius:100px;
    border:2px solid var(--slate-200); background:#fff;
    font-family:'Nunito',sans-serif;
    font-size:12px; font-weight:800; color:var(--slate-500);
    cursor:pointer; transition:all 0.2s;
    display:flex; align-items:center; gap:6px;
  }
  .chip:hover { border-color:var(--blue-300,#93C5FD); color:var(--blue-600); }
  .chip.active { background:var(--blue-600); border-color:var(--blue-600); color:#fff; }

  /* Doctors grid */
  .doctors-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
    gap:20px;
  }

  /* Doctor card */
  .doc-card {
    background:#fff; border-radius:22px;
    border:2px solid var(--slate-200);
    box-shadow:0 2px 12px rgba(0,0,0,0.05);
    overflow:hidden;
    transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    animation:fadeInUp 0.4s ease both;
    display:flex; flex-direction:column;
  }
  .doc-card:hover {
    transform:translateY(-6px);
    box-shadow:0 16px 48px rgba(0,0,0,0.12);
    border-color:var(--blue-200,#BFDBFE);
  }

  /* Card image area */
  .doc-card-img {
    height:140px; position:relative; overflow:hidden;
    background:linear-gradient(135deg,#1a56db,#1e3a8a);
    flex-shrink:0;
  }
  .doc-img {
    width:100%; height:100%; object-fit:cover;
    transition:transform 0.4s ease;
  }
  .doc-card:hover .doc-img { transform:scale(1.05); }
  .doc-img-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to top,rgba(15,23,42,0.5),transparent);
  }
  .doc-img-placeholder {
    width:100%; height:100%;
    display:flex; align-items:center; justify-content:center;
    font-size:52px; font-weight:900; color:rgba(255,255,255,0.85);
    font-family:'Nunito',sans-serif;
    background:linear-gradient(135deg,#1a56db 0%,#0f2460 100%);
  }

  /* Availability pill on image */
  .avail-pill {
    position:absolute; top:12px; right:12px;
    background:rgba(255,255,255,0.15);
    backdrop-filter:blur(6px);
    border:1px solid rgba(255,255,255,0.25);
    border-radius:100px; padding:4px 11px;
    font-size:11px; font-weight:800; color:#fff;
    display:flex; align-items:center; gap:5px;
  }
  .avail-dot { width:6px; height:6px; border-radius:50%; background:#4ADE80; box-shadow:0 0 6px #4ADE80; animation:pulse 2s infinite; }

  /* Card body */
  .doc-card-body { padding:18px 20px; flex:1; display:flex; flex-direction:column; }

  .doc-name {
    font-family:'Lora',serif;
    font-size:18px; font-weight:700; color:var(--slate-800);
    margin-bottom:4px; line-height:1.2;
  }
  .doc-spec { font-size:13px; font-weight:700; color:var(--blue-600); margin-bottom:12px; }

  /* Rating row */
  .doc-rating { display:flex; align-items:center; gap:6px; margin-bottom:12px; }
  .stars { display:flex; gap:1px; }
  .st { font-size:13px; }
  .st.lit { color:var(--amber-400); }
  .st.dim { color:var(--slate-200); }
  .rating-val { font-size:13px; font-weight:800; color:var(--slate-700); }
  .rating-ct  { font-size:12px; font-weight:600; color:var(--slate-400); }

  /* Info chips row */
  .doc-chips { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px; }
  .doc-chip {
    display:inline-flex; align-items:center; gap:4px;
    padding:4px 10px; border-radius:8px;
    font-size:11px; font-weight:800;
    background:var(--slate-100); color:var(--slate-600);
  }

  /* Fee + action row */
  .doc-footer {
    display:flex; align-items:center; justify-content:space-between;
    margin-top:auto; padding-top:14px;
    border-top:1.5px solid var(--slate-100);
  }
  .doc-fee { }
  .fee-label { font-size:10px; font-weight:800; color:var(--slate-400); text-transform:uppercase; letter-spacing:0.06em; }
  .fee-val   { font-size:18px; font-weight:900; color:var(--slate-800); line-height:1; }
  .fee-per   { font-size:10px; font-weight:600; color:var(--slate-400); }

  .view-btn {
    padding:9px 18px; border-radius:11px; border:none;
    font-family:'Nunito',sans-serif;
    font-size:13px; font-weight:800; color:#fff;
    background:linear-gradient(135deg,var(--blue-500),var(--blue-700));
    box-shadow:0 6px 18px rgba(37,99,235,0.25);
    cursor:pointer;
    transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    display:flex; align-items:center; gap:6px;
  }
  .view-btn:hover { transform:translateY(-2px); box-shadow:0 10px 24px rgba(37,99,235,0.35); }
  .view-btn:active { transform:scale(0.97); }

  /* Empty state */
  .empty-state {
    grid-column:1/-1; text-align:center;
    padding:80px 24px; background:#fff;
    border-radius:24px; border:2px dashed var(--slate-200);
    animation:fadeInUp 0.4s ease both;
  }
  .empty-icon  { font-size:48px; margin-bottom:16px; }
  .empty-title { font-family:'Lora',serif; font-size:20px; font-weight:700; color:var(--slate-700); margin-bottom:8px; }
  .empty-sub   { font-size:14px; font-weight:600; color:var(--slate-400); }

  /* Skeleton */
  .skeleton-card {
    background:#fff; border-radius:22px;
    border:2px solid var(--slate-200); overflow:hidden;
  }
  .skeleton-img { height:140px; background:var(--slate-200); }
  .skeleton-body { padding:18px 20px; }
  .skel {
    border-radius:8px; margin-bottom:10px;
    background:linear-gradient(90deg,var(--slate-100) 25%,var(--slate-200) 50%,var(--slate-100) 75%);
    background-size:200% 100%; animation:shimmer 1.5s infinite;
  }
  @keyframes shimmer { to{background-position:-200% 0;} }

  @keyframes fadeInUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width:768px) {
    .page-body { padding:20px 16px 48px; }
    .hero-inner { padding:0 20px; }
    .doctors-grid { grid-template-columns:1fr; }
  }
  @media (max-width:500px) {
    .toolbar { flex-direction:column; align-items:flex-start; }
  }
`;

const EXP_FILTERS = [
  { label: "All Experience", val: "" },
  { label: "0–5 yrs",        val: "0-5" },
  { label: "5–10 yrs",       val: "5-10" },
  { label: "10+ yrs",        val: "10+" },
];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function StarRow({ rating }) {
  const r = Math.round(Number(rating) || 0);
  return (
    <div className="stars">
      {[1,2,3,4,5].map((s) => (
        <span key={s} className={`st ${s <= r ? "lit" : "dim"}`}>★</span>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-body">
        <div className="skel" style={{ height: 20, width: "60%" }} />
        <div className="skel" style={{ height: 14, width: "40%" }} />
        <div className="skel" style={{ height: 14, width: "80%" }} />
        <div className="skel" style={{ height: 14, width: "50%" }} />
      </div>
    </div>
  );
}

function HomePage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const category  = new URLSearchParams(location.search).get("category");

  const [doctors,   setDoctors]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [expFilter, setExpFilter] = useState("");
  const [sortBy,    setSortBy]    = useState("default");

  useEffect(() => { getDoctors(); }, []);

  const getDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/doctors?specialization=${category}`);
      setDoctors(res.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  // Filter + sort
  const filtered = doctors
    .filter((d) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        d.name?.toLowerCase().includes(q) ||
        d.hospitalName?.toLowerCase().includes(q) ||
        d.degree?.toLowerCase().includes(q);

      const exp = Number(d.experience) || 0;
      const matchExp =
        expFilter === ""      ? true :
        expFilter === "0-5"   ? exp <= 5 :
        expFilter === "5-10"  ? exp > 5 && exp <= 10 :
        expFilter === "10+"   ? exp > 10 : true;

      return matchSearch && matchExp;
    })
    .sort((a, b) => {
      if (sortBy === "fee-asc")  return (a.consultationFees || 0) - (b.consultationFees || 0);
      if (sortBy === "fee-desc") return (b.consultationFees || 0) - (a.consultationFees || 0);
      if (sortBy === "exp")      return (b.experience || 0) - (a.experience || 0);
      return 0;
    });

  return (
    <>
      <style>{styles}</style>
      <div className="home-page">

        {/* ── HERO ── */}
        <div className="hero">
          <div className="blob b1" /><div className="blob b2" />
          <div className="hero-inner">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

            <div className="hero-eyebrow">
              <span className="badge-dot" />
              {doctors.length > 0 ? `${doctors.length} doctors available` : "Finding doctors…"}
            </div>

            <h1 className="hero-title">
              {category ? <><em>{category}</em> Specialists</> : "All Doctors"}
            </h1>
            <p className="hero-sub">
              Verified, experienced doctors ready to help. Browse profiles, check availability and book instantly.
            </p>

            <div className="hero-search-wrap">
              <span className="hero-search-icon">🔍</span>
              <input
                className="hero-search"
                type="text"
                placeholder="Search by name, hospital, degree…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="page-body">

          {/* Filter chips */}
          <div className="filter-chips">
            {EXP_FILTERS.map((f) => (
              <button
                key={f.val}
                className={`chip ${expFilter === f.val ? "active" : ""}`}
                onClick={() => setExpFilter(f.val)}
              >
                {f.val === ""    ? "🩺" :
                 f.val === "0-5" ? "🌱" :
                 f.val === "5-10"? "⚕️" : "🏆"} {f.label}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="toolbar">
            <div className="result-label">
              Showing <span>{loading ? "…" : filtered.length}</span> doctor{filtered.length !== 1 ? "s" : ""}
              {category ? <> in <span>{category}</span></> : ""}
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Default</option>
              <option value="fee-asc">Fee: Low to High</option>
              <option value="fee-desc">Fee: High to Low</option>
              <option value="exp">Most Experienced</option>
            </select>
          </div>

          {/* Grid */}
          <div className="doctors-grid">
            {loading ? (
              [1,2,3,4,5,6].map((i) => <SkeletonCard key={i} />)
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">{search ? "🔍" : "👨‍⚕️"}</div>
                <div className="empty-title">{search ? "No doctors found" : `No ${category || ""} doctors yet`}</div>
                <div className="empty-sub">{search ? "Try different keywords or clear the search" : "Check back soon or browse other specialties"}</div>
              </div>
            ) : (
              filtered.map((doctor, idx) => {
                const avgRating = null; // could be passed if reviews are fetched per doctor
                return (
                  <div
                    className="doc-card"
                    key={doctor.id}
                    style={{ animationDelay: `${idx * 0.06}s` }}
                  >
                    {/* Image area */}
                    <div className="doc-card-img">
                      {doctor.profileImageUrl ? (
                        <>
                          <img
                            className="doc-img"
                            src={doctor.profileImageUrl}
                            alt={doctor.name}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "none";
                              e.target.parentElement.querySelector(".doc-img-placeholder").style.display = "flex";
                            }}
                          />
                          <div className="doc-img-overlay" />
                          <div className="doc-img-placeholder" style={{ display: "none" }}>
                            {getInitials(doctor.name)}
                          </div>
                        </>
                      ) : (
                        <div className="doc-img-placeholder">{getInitials(doctor.name)}</div>
                      )}
                      <div className="avail-pill">
                        <span className="avail-dot" /> Available
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="doc-card-body">
                      <div className="doc-name">{doctor.name}</div>
                      <div className="doc-spec">{doctor.specialization}</div>

                      {/* Stars placeholder — could be real if you fetch per-doctor avg */}
                      <div className="doc-rating">
                        <StarRow rating={4} />
                        <span className="rating-val">4.0</span>
                        <span className="rating-ct">· {doctor.experience} yrs exp</span>
                      </div>

                      <div className="doc-chips">
                        <span className="doc-chip">🎓 {doctor.degree}</span>
                        {doctor.hospitalName && <span className="doc-chip">🏥 {doctor.hospitalName}</span>}
                        {doctor.slotDuration && <span className="doc-chip">⏱ {doctor.slotDuration} min slots</span>}
                      </div>

                      <div className="doc-footer">
                        <div className="doc-fee">
                          <div className="fee-label">Consult fee</div>
                          <div className="fee-val">₹{doctor.consultationFees || "—"}</div>
                          <div className="fee-per">per visit</div>
                        </div>
                        <button
                          className="view-btn"
                          onClick={() => navigate(`/doctor/${doctor.id}`)}
                        >
                          View Profile →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;