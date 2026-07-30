import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lora:ital,wght@0,600;0,700;1,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; width: 100%; }

  :root {
    --blue-50:#EFF6FF; --blue-100:#DBEAFE; --blue-400:#60A5FA;
    --blue-500:#3B82F6; --blue-600:#2563EB; --blue-700:#1D4ED8;
    --teal-400:#2DD4BF; --teal-500:#14B8A6;
    --green-50:#F0FDF4; --green-400:#4ADE80; --green-500:#22C55E;
    --slate-50:#F8FAFC; --slate-100:#F1F5F9; --slate-200:#E2E8F0;
    --slate-300:#CBD5E1; --slate-400:#94A3B8; --slate-500:#64748B;
    --slate-600:#475569; --slate-700:#334155; --slate-800:#1E293B;
  }

  .cat-page { min-height: 100vh; background: #F0F6FF; font-family: 'Nunito', sans-serif; }

  /* ── HERO ── */
  .hero {
    background: linear-gradient(145deg, #1a56db 0%, #1e3a8a 60%, #0f2460 100%);
    position: relative; overflow: hidden;
    padding: 48px 0 64px;
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
  .b1 { width:300px; height:300px; background:rgba(96,165,250,0.2); top:10px; right:80px; animation:bf 8s ease-in-out infinite alternate; }
  .b2 { width:180px; height:180px; background:rgba(45,212,191,0.18); bottom:20px; right:300px; animation:bf 11s ease-in-out infinite alternate-reverse; }
  @keyframes bf { from{transform:translate(0,0) scale(1);} to{transform:translate(18px,-22px) scale(1.08);} }

  .hero-inner {
    position:relative; z-index:2;
    max-width:1100px; margin:0 auto; padding:0 32px;
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

  .hero-badge {
    display:inline-flex; align-items:center; gap:7px;
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
    font-weight:700; color:#fff; line-height:1.1; margin-bottom:10px;
  }
  .hero-title em { font-style:italic; color:var(--teal-400); }
  .hero-sub {
    font-size:15px; font-weight:600;
    color:rgba(255,255,255,0.6); max-width:480px; line-height:1.7;
    margin-bottom:28px;
  }

  /* Search bar */
  .search-wrap { position:relative; max-width:440px; }
  .search-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); font-size:16px; pointer-events:none; }
  .search-input {
    width:100%; padding:13px 18px 13px 46px;
    border:2px solid rgba(255,255,255,0.2);
    border-radius:16px; outline:none;
    font-family:'Nunito',sans-serif;
    font-size:14px; font-weight:600;
    color:#fff; background:rgba(255,255,255,0.1);
    transition:all 0.2s;
  }
  .search-input::placeholder { color:rgba(255,255,255,0.45); }
  .search-input:focus { border-color:rgba(255,255,255,0.45); background:rgba(255,255,255,0.15); box-shadow:0 0 0 4px rgba(255,255,255,0.08); }

  /* ── BODY ── */
  .page-body {
    max-width:1100px; margin:0 auto;
    padding:32px 32px 64px;
  }

  /* Toolbar */
  .toolbar {
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:12px; margin-bottom:24px;
    animation:fadeInUp 0.4s ease both;
  }
  .result-label { font-size:14px; font-weight:800; color:var(--slate-600); }
  .result-label span { color:var(--blue-600); }

  /* Categories grid */
  .cat-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));
    gap:16px;
  }

  /* Category card */
  .cat-card {
    background:#fff; border-radius:22px;
    border:2px solid var(--slate-200);
    box-shadow:0 2px 12px rgba(0,0,0,0.05);
    padding:24px 22px;
    cursor:pointer;
    transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    display:flex; flex-direction:column; gap:14px;
    position:relative; overflow:hidden;
    animation:fadeInUp 0.4s ease both;
  }
  .cat-card::after {
    content:'';
    position:absolute; inset:0;
    background:linear-gradient(135deg, rgba(37,99,235,0.04), transparent);
    opacity:0; transition:opacity 0.3s;
  }
  .cat-card:hover {
    transform:translateY(-6px) scale(1.01);
    box-shadow:0 16px 48px rgba(37,99,235,0.14);
    border-color:var(--blue-200, #BFDBFE);
  }
  .cat-card:hover::after { opacity:1; }
  .cat-card:active { transform:scale(0.98); }

  /* Icon area */
  .cat-icon-wrap {
    width:56px; height:56px; border-radius:18px;
    display:flex; align-items:center; justify-content:center;
    font-size:26px; flex-shrink:0;
    transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .cat-card:hover .cat-icon-wrap { transform:scale(1.1) rotate(-4deg); }

  /* Arrow indicator */
  .cat-arrow {
    position:absolute; top:20px; right:20px;
    width:28px; height:28px; border-radius:9px;
    background:var(--slate-100); color:var(--slate-400);
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:900;
    transition:all 0.25s;
  }
  .cat-card:hover .cat-arrow { background:var(--blue-600); color:#fff; transform:translateX(2px); }

  .cat-name {
    font-family:'Lora',serif;
    font-size:16px; font-weight:700; color:var(--slate-800);
    line-height:1.2;
  }
  .cat-desc {
    font-size:12px; font-weight:600; color:var(--slate-400);
    line-height:1.5; margin-top:-6px;
  }
  .cat-footer {
    display:flex; align-items:center; justify-content:space-between;
    margin-top:4px;
  }
  .cat-tag {
    display:inline-flex; align-items:center; gap:4px;
    background:var(--blue-50); color:var(--blue-700);
    border-radius:8px; padding:4px 10px;
    font-size:11px; font-weight:800;
  }
  .cat-dots {
    display:flex; gap:4px;
  }
  .cat-dot {
    width:6px; height:6px; border-radius:50%;
    background:var(--slate-200);
    transition:background 0.3s;
  }
  .cat-card:hover .cat-dot { background:var(--blue-400); }
  .cat-card:hover .cat-dot:nth-child(2) { background:var(--blue-300,#93C5FD); transition-delay:0.05s; }
  .cat-card:hover .cat-dot:nth-child(3) { background:var(--blue-200,#BFDBFE); transition-delay:0.1s; }

  /* Empty state */
  .empty-state {
    grid-column:1/-1; text-align:center;
    padding:72px 24px; background:#fff;
    border-radius:24px; border:2px dashed var(--slate-200);
    animation:fadeInUp 0.4s ease both;
  }
  .empty-icon  { font-size:48px; margin-bottom:14px; }
  .empty-title { font-family:'Lora',serif; font-size:20px; font-weight:700; color:var(--slate-700); margin-bottom:8px; }
  .empty-sub   { font-size:14px; font-weight:600; color:var(--slate-400); }

  /* Skeleton */
  .skel-card {
    background:#fff; border-radius:22px;
    border:2px solid var(--slate-200); padding:24px;
  }
  .skel {
    border-radius:9px; margin-bottom:10px;
    background:linear-gradient(90deg,var(--slate-100) 25%,var(--slate-200) 50%,var(--slate-100) 75%);
    background-size:200% 100%; animation:shimmer 1.5s infinite;
  }
  @keyframes shimmer { to{background-position:-200% 0;} }

  @keyframes fadeInUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width:768px) {
    .page-body { padding:20px 16px 48px; }
    .hero-inner { padding:0 20px; }
    .cat-grid { grid-template-columns:repeat(auto-fill, minmax(160px,1fr)); gap:12px; }
    .cat-card { padding:18px 16px; }
  }
`;

// Specialty → icon + color + description mapping
const SPECIALTY_META = {
  "General Physician":      { icon:"🩺", bg:"#EFF6FF", desc:"Primary care & common illnesses"         },
  "Cardiologist":           { icon:"❤️", bg:"#FEF2F2", desc:"Heart & cardiovascular conditions"        },
  "Dermatologist":          { icon:"🧴", bg:"#FFF7ED", desc:"Skin, hair & nail disorders"              },
  "Neurologist":            { icon:"🧠", bg:"#F5F3FF", desc:"Brain, spine & nerve conditions"          },
  "Orthopedic Surgeon":     { icon:"🦴", bg:"#F0FDF4", desc:"Bones, joints & musculoskeletal"          },
  "Pediatrician":           { icon:"👶", bg:"#FFFBEB", desc:"Child health from birth to teens"         },
  "Psychiatrist":           { icon:"🧘", bg:"#F5F3FF", desc:"Mental health & emotional wellbeing"      },
  "Gynecologist":           { icon:"🌸", bg:"#FDF2F8", desc:"Women's reproductive health"              },
  "Oncologist":             { icon:"🔬", bg:"#F0FDF4", desc:"Cancer diagnosis & treatment"             },
  "Radiologist":            { icon:"📡", bg:"#EFF6FF", desc:"Medical imaging & diagnostics"            },
  "ENT Specialist":         { icon:"👂", bg:"#FFFBEB", desc:"Ear, nose & throat conditions"            },
  "Ophthalmologist":        { icon:"👁️", bg:"#F0FDFA", desc:"Eye care & vision disorders"              },
  "Urologist":              { icon:"💊", bg:"#EFF6FF", desc:"Urinary tract & kidney care"              },
  "Endocrinologist":        { icon:"⚗️", bg:"#FFF7ED", desc:"Hormonal & metabolic disorders"           },
  "Gastroenterologist":     { icon:"🫁", bg:"#F0FDF4", desc:"Digestive system & gut health"            },
  "Other":                  { icon:"⚕️", bg:"#F8FAFC", desc:"Other medical specialties"                },
};

function getMeta(category) {
  return SPECIALTY_META[category] || { icon:"🩺", bg:"#EFF6FF", desc:"Medical specialist" };
}

function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");

  useEffect(() => { getCategories(); }, []);

  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/doctors/categories");
      setCategories(res.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const filtered = categories.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="cat-page">

        {/* ── HERO ── */}
        <div className="hero">
          <div className="blob b1" /><div className="blob b2" />
          <div className="hero-inner">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

            <div className="hero-badge">
              <span className="badge-dot" />
              {loading ? "Loading specialties…" : `${categories.length} specialties available`}
            </div>

            <h1 className="hero-title">
              Find Your <em>Specialist</em>
            </h1>
            <p className="hero-sub">
              Choose a medical specialty to browse verified doctors and book your appointment instantly.
            </p>

            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search specialty…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="page-body">

          <div className="toolbar">
            <div className="result-label">
              {loading ? "Loading…" : (
                <>Showing <span>{filtered.length}</span> specialt{filtered.length !== 1 ? "ies" : "y"}</>
              )}
            </div>
          </div>

          <div className="cat-grid">
            {loading ? (
              [1,2,3,4,5,6,7,8].map((i) => (
                <div className="skel-card" key={i}>
                  <div className="skel" style={{ width:56, height:56, borderRadius:18, marginBottom:16 }} />
                  <div className="skel" style={{ height:18, width:"70%" }} />
                  <div className="skel" style={{ height:13, width:"90%" }} />
                  <div className="skel" style={{ height:13, width:"50%" }} />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No specialties found</div>
                <div className="empty-sub">Try a different search term</div>
              </div>
            ) : (
              filtered.map((category, idx) => {
                const meta = getMeta(category);
                return (
                  <div
                    className="cat-card"
                    key={category}
                    onClick={() => navigate(`/home?category=${category}`)}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="cat-icon-wrap" style={{ background: meta.bg }}>
                      {meta.icon}
                    </div>

                    <div className="cat-arrow">→</div>

                    <div>
                      <div className="cat-name">{category}</div>
                      <div className="cat-desc">{meta.desc}</div>
                    </div>

                    <div className="cat-footer">
                      <span className="cat-tag">🩺 View Doctors</span>
                      <div className="cat-dots">
                        <div className="cat-dot" />
                        <div className="cat-dot" />
                        <div className="cat-dot" />
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

export default CategoriesPage;