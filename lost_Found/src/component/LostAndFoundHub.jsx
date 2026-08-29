import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Smartphone,
  FileText,
  Backpack,
  PawPrint,
  Search,
  Plus,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Pin,
  Check,
  Loader2,
  Scissors,
} from "lucide-react";

const CATEGORIES = [
  { id: "phone", label: "Phone", icon: Smartphone },
  { id: "document", label: "Document", icon: FileText },
  { id: "bag", label: "Bag", icon: Backpack },
  { id: "pet", label: "Pet", icon: PawPrint },
];

const CATEGORY_MAP = CATEGORIES.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});

function hashRotation(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ((h % 620) / 100) - 3.1; // roughly -3.1deg to 3.1deg
}

function formatDate(d) {
  try {
    return new Date(d + "T00:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return d;
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function LostAndFoundHub() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("lfh_reports");
      if (raw) setReports(JSON.parse(raw));
    } catch (e) {
      // corrupt or missing data is fine on a fresh board
    } finally {
      setLoading(false);
    }
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const persist = useCallback(
    (list) => {
      try {
        window.localStorage.setItem("lfh_reports", JSON.stringify(list));
      } catch (e) {
        setLoadError(true);
        showToast("Could not save to the board — your browser storage may be full or disabled.");
      }
    },
    [showToast]
  );

  const addReport = (report) => {
    setSaving(true);
    const withMeta = {
      ...report,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    const next = [withMeta, ...reports];
    setReports(next);
    persist(next);
    setSaving(false);
    setShowForm(false);
    showToast("Notice pinned to the board.");
  };

  const resolveReport = (id) => {
    const next = reports.filter((r) => r.id !== id);
    setReports(next);
    persist(next);
    setSelected(null);
    showToast("Taken down — glad it's sorted.");
  };

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay = `${r.title} ${r.description} ${r.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [reports, statusFilter, categoryFilter, query]);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch (e) {
      showToast("Copy didn't work — you can select the text manually.");
    }
  };

  return (
    <div className="lfh-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .lfh-root {
          --board: #6b5138;
          --board-dark: #5a4330;
          --paper: #f4ecd8;
          --paper-alt: #eee2c4;
          --ink: #2b2114;
          --ink-soft: #6b5c47;
          --lost: #a6373a;
          --found: #2f6f5e;
          --gold: #c9a227;
          --font-display: 'Special Elite', 'Courier New', monospace;
          --font-body: 'Inter', system-ui, sans-serif;
          --font-mono: 'IBM Plex Mono', monospace;

          font-family: var(--font-body);
          color: var(--ink);
          background:
            radial-gradient(circle at 20% 20%, rgba(0,0,0,0.08) 0, transparent 45%),
            radial-gradient(circle at 80% 60%, rgba(0,0,0,0.08) 0, transparent 40%),
            radial-gradient(circle at 50% 90%, rgba(0,0,0,0.06) 0, transparent 40%),
            repeating-radial-gradient(circle at 10px 10px, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 1px, transparent 2px, transparent 14px),
            linear-gradient(160deg, var(--board), var(--board-dark));
          min-height: 100vh;
          padding: 0 0 64px;
          box-sizing: border-box;
        }
        .lfh-root *, .lfh-root *::before, .lfh-root *::after { box-sizing: border-box; }

        .lfh-header {
          padding: 40px 24px 20px;
          text-align: center;
          border-bottom: 4px solid rgba(0,0,0,0.25);
          margin-bottom: 8px;
        }
        .lfh-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 5vw, 46px);
          color: var(--paper);
          letter-spacing: 1px;
          margin: 0;
          text-shadow: 2px 2px 0 rgba(0,0,0,0.35);
        }
        .lfh-subtitle {
          font-family: var(--font-mono);
          color: rgba(244,236,216,0.75);
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 10px 0 0;
        }
        .lfh-post-btn {
          margin-top: 22px;
          font-family: var(--font-display);
          font-size: 15px;
          letter-spacing: 0.5px;
          background: var(--gold);
          color: var(--ink);
          border: none;
          padding: 13px 26px;
          border-radius: 3px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 0 rgba(0,0,0,0.3), 0 6px 10px rgba(0,0,0,0.25);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .lfh-post-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 0 rgba(0,0,0,0.3), 0 10px 16px rgba(0,0,0,0.3); }
        .lfh-post-btn:active { transform: translateY(1px); box-shadow: 0 2px 0 rgba(0,0,0,0.3); }

        .lfh-controls {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px 24px 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          justify-content: center;
        }
        .lfh-tabs { display: flex; gap: 6px; }
        .lfh-tab {
          font-family: var(--font-mono);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: rgba(244,236,216,0.12);
          color: var(--paper);
          border: 1px solid rgba(244,236,216,0.35);
          padding: 8px 14px;
          border-radius: 3px;
          cursor: pointer;
        }
        .lfh-tab.active { background: var(--paper); color: var(--ink); font-weight: 600; border-color: var(--paper); }
        .lfh-tab.active.lost-active { background: var(--lost); color: var(--paper); border-color: var(--lost); }
        .lfh-tab.active.found-active { background: var(--found); color: var(--paper); border-color: var(--found); }

        .lfh-chips { display: flex; gap: 6px; flex-wrap: wrap; }
        .lfh-chip {
          font-family: var(--font-body);
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(244,236,216,0.12);
          color: var(--paper);
          border: 1px solid rgba(244,236,216,0.3);
          padding: 7px 12px;
          border-radius: 999px;
          cursor: pointer;
        }
        .lfh-chip.active { background: var(--paper); color: var(--ink); border-color: var(--paper); }

        .lfh-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(244,236,216,0.12);
          border: 1px solid rgba(244,236,216,0.3);
          border-radius: 3px;
          padding: 8px 12px;
          min-width: 200px;
          flex: 1 1 220px;
          max-width: 320px;
        }
        .lfh-search input {
          background: none;
          border: none;
          outline: none;
          color: var(--paper);
          font-family: var(--font-body);
          font-size: 14px;
          width: 100%;
        }
        .lfh-search input::placeholder { color: rgba(244,236,216,0.55); }
        .lfh-search svg { color: rgba(244,236,216,0.6); flex-shrink: 0; }

        .lfh-board {
          max-width: 1100px;
          margin: 16px auto 0;
          padding: 28px 32px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 34px 24px;
        }

        .lfh-empty {
          text-align: center;
          color: rgba(244,236,216,0.75);
          font-family: var(--font-mono);
          padding: 60px 20px;
          grid-column: 1 / -1;
        }

        .lfh-card {
          position: relative;
          background: var(--paper);
          padding: 26px 18px 18px;
          box-shadow: 3px 8px 16px rgba(0,0,0,0.35);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          font-family: var(--font-body);
        }
        .lfh-card::before {
          content: '';
          position: absolute;
          top: -9px;
          left: 0;
          right: 0;
          height: 11px;
          background-image:
            linear-gradient(135deg, var(--paper) 25%, transparent 25.5%),
            linear-gradient(225deg, var(--paper) 25%, transparent 25.5%);
          background-size: 14px 14px;
          background-position: 0 0;
        }
        .lfh-card:hover {
          transform: rotate(0deg) translateY(-4px) scale(1.02) !important;
          box-shadow: 4px 14px 24px rgba(0,0,0,0.4);
        }
        .lfh-pin {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #e2564f, #8f231f 75%);
          box-shadow: 0 3px 4px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .lfh-pin svg { width: 12px; height: 12px; color: rgba(255,255,255,0.85); }

        .lfh-stamp {
          display: inline-block;
          font-family: var(--font-display);
          font-size: 12px;
          letter-spacing: 2px;
          padding: 3px 10px;
          border: 2px solid;
          border-radius: 2px;
          transform: rotate(-6deg);
          margin-bottom: 10px;
          opacity: 0.88;
        }
        .lfh-stamp.lost { color: var(--lost); border-color: var(--lost); }
        .lfh-stamp.found { color: var(--found); border-color: var(--found); }

        .lfh-card-cat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--ink-soft);
          margin-bottom: 8px;
        }
        .lfh-card-title {
          font-family: var(--font-display);
          font-size: 17px;
          line-height: 1.35;
          margin: 0 0 8px;
        }
        .lfh-card-desc {
          font-size: 13px;
          color: var(--ink-soft);
          line-height: 1.5;
          margin: 0 0 12px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .lfh-card-meta {
          font-size: 12px;
          color: var(--ink-soft);
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-top: 1px dashed rgba(43,33,20,0.3);
          padding-top: 10px;
        }
        .lfh-card-meta span { display: flex; align-items: center; gap: 6px; }
        .lfh-card-meta svg { width: 13px; height: 13px; flex-shrink: 0; }

        /* Toast */
        .lfh-toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--ink);
          color: var(--paper);
          font-family: var(--font-mono);
          font-size: 13px;
          padding: 12px 20px;
          border-radius: 4px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.4);
          z-index: 100;
        }

        /* Modal */
        .lfh-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20,15,8,0.72);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 16px;
          overflow-y: auto;
          z-index: 50;
        }
        .lfh-modal {
          background: var(--paper);
          max-width: 520px;
          width: 100%;
          padding: 32px 28px 28px;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          font-family: var(--font-body);
        }
        .lfh-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--ink-soft);
          padding: 4px;
        }
        .lfh-modal-close:hover { color: var(--ink); }

        .lfh-modal h2 {
          font-family: var(--font-display);
          font-size: 22px;
          margin: 4px 0 14px;
          padding-right: 24px;
        }
        .lfh-modal-desc {
          font-size: 14px;
          line-height: 1.6;
          color: var(--ink);
          margin-bottom: 18px;
          white-space: pre-wrap;
        }
        .lfh-modal-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 13px;
          color: var(--ink-soft);
          border-top: 1px dashed rgba(43,33,20,0.3);
          border-bottom: 1px dashed rgba(43,33,20,0.3);
          padding: 14px 0;
          margin-bottom: 18px;
        }
        .lfh-modal-meta span { display: flex; align-items: center; gap: 8px; }

        .lfh-tearoff-label {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--ink-soft);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lfh-tearoff {
          display: flex;
          border: 1px dashed rgba(43,33,20,0.45);
          border-radius: 3px;
          overflow: hidden;
        }
        .lfh-tearoff-tab {
          flex: 1;
          padding: 10px 4px;
          text-align: center;
          border-left: 1px dashed rgba(43,33,20,0.45);
          cursor: pointer;
          background: var(--paper-alt);
          font-family: var(--font-mono);
          font-size: 11px;
          writing-mode: vertical-rl;
          letter-spacing: 1px;
          color: var(--ink);
          transition: background 0.15s ease;
        }
        .lfh-tearoff-tab:first-child { border-left: none; }
        .lfh-tearoff-tab:hover { background: var(--gold); }

        .lfh-contact-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        .lfh-contact-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-body);
          font-size: 13px;
          background: var(--paper-alt);
          border: 1px solid rgba(43,33,20,0.2);
          padding: 9px 12px;
          border-radius: 3px;
          cursor: pointer;
          color: var(--ink);
          justify-content: space-between;
        }
        .lfh-contact-btn:hover { background: var(--gold); }
        .lfh-contact-btn .lfh-copied { font-size: 11px; color: var(--found); font-family: var(--font-mono); }

        .lfh-resolve-btn {
          width: 100%;
          font-family: var(--font-display);
          font-size: 14px;
          letter-spacing: 0.5px;
          background: var(--found);
          color: var(--paper);
          border: none;
          padding: 12px;
          border-radius: 3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .lfh-resolve-btn:hover { filter: brightness(1.1); }

        /* Form */
        .lfh-form-group { margin-bottom: 16px; }
        .lfh-form-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--ink-soft);
          margin-bottom: 6px;
        }
        .lfh-input, .lfh-textarea {
          width: 100%;
          font-family: var(--font-body);
          font-size: 14px;
          padding: 10px 12px;
          border: 1px solid rgba(43,33,20,0.3);
          border-radius: 3px;
          background: var(--paper-alt);
          color: var(--ink);
          outline: none;
        }
        .lfh-input:focus, .lfh-textarea:focus { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(201,162,39,0.3); }
        .lfh-textarea { resize: vertical; min-height: 80px; font-family: var(--font-body); }

        .lfh-status-toggle { display: flex; gap: 10px; }
        .lfh-status-btn {
          flex: 1;
          font-family: var(--font-display);
          font-size: 14px;
          letter-spacing: 1px;
          padding: 12px;
          border-radius: 3px;
          cursor: pointer;
          border: 2px solid;
          background: transparent;
        }
        .lfh-status-btn.lost { border-color: var(--lost); color: var(--lost); }
        .lfh-status-btn.lost.selected { background: var(--lost); color: var(--paper); }
        .lfh-status-btn.found { border-color: var(--found); color: var(--found); }
        .lfh-status-btn.found.selected { background: var(--found); color: var(--paper); }

        .lfh-cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .lfh-cat-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 10px 4px;
          border: 1px solid rgba(43,33,20,0.3);
          border-radius: 3px;
          background: var(--paper-alt);
          cursor: pointer;
          font-size: 11px;
          font-family: var(--font-mono);
          color: var(--ink-soft);
        }
        .lfh-cat-btn.selected { background: var(--gold); border-color: var(--gold); color: var(--ink); font-weight: 600; }
        .lfh-cat-btn svg { width: 18px; height: 18px; }

        .lfh-form-row { display: flex; gap: 12px; }
        .lfh-form-row > div { flex: 1; }

        .lfh-submit-btn {
          width: 100%;
          font-family: var(--font-display);
          font-size: 15px;
          background: var(--ink);
          color: var(--paper);
          border: none;
          padding: 13px;
          border-radius: 3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 6px;
        }
        .lfh-submit-btn:hover { filter: brightness(1.2); }
        .lfh-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .lfh-form-error {
          font-size: 12px;
          color: var(--lost);
          font-family: var(--font-mono);
          margin-top: -8px;
          margin-bottom: 14px;
        }

        .lfh-spin { animation: lfh-spin 1s linear infinite; }
        @keyframes lfh-spin { to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .lfh-post-btn, .lfh-card, .lfh-spin { transition: none !important; animation: none !important; }
        }
        @media (max-width: 480px) {
          .lfh-board { padding: 20px 16px; gap: 28px 16px; }
          .lfh-controls { padding: 16px; }
        }
      `}</style>

      <header className="lfh-header">
        <h1 className="lfh-title">LOST &amp; FOUND HUB</h1>
        <p className="lfh-subtitle">Your noticeboard — pin it, find it</p>
        <button className="lfh-post-btn" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Post a Notice
        </button>
      </header>

      <div className="lfh-controls">
        <div className="lfh-tabs">
          {[
            { id: "all", label: "All" },
            { id: "lost", label: "Lost", cls: "lost-active" },
            { id: "found", label: "Found", cls: "found-active" },
          ].map((t) => (
            <button
              key={t.id}
              className={`lfh-tab ${statusFilter === t.id ? `active ${t.cls || ""}` : ""}`}
              onClick={() => setStatusFilter(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="lfh-chips">
          <button
            className={`lfh-chip ${categoryFilter === "all" ? "active" : ""}`}
            onClick={() => setCategoryFilter("all")}
          >
            All items
          </button>
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                className={`lfh-chip ${categoryFilter === c.id ? "active" : ""}`}
                onClick={() => setCategoryFilter(c.id)}
              >
                <Icon size={14} /> {c.label}
              </button>
            );
          })}
        </div>
        <div className="lfh-search">
          <Search size={15} />
          <input
            placeholder="Search notices…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="lfh-board">
        {loading ? (
          <div className="lfh-empty">
            <Loader2 className="lfh-spin" size={22} style={{ marginBottom: 10 }} />
            <div>Reading the board…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="lfh-empty">
            {reports.length === 0
              ? "The board is empty. Be the first to pin a notice."
              : "No notices match your filters."}
          </div>
        ) : (
          filtered.map((r) => {
            const cat = CATEGORY_MAP[r.category] || CATEGORIES[0];
            const Icon = cat.icon;
            const rot = hashRotation(r.id);
            return (
              <div
                key={r.id}
                className="lfh-card"
                style={{ transform: `rotate(${rot}deg)` }}
                onClick={() => setSelected(r)}
              >
                <div className="lfh-pin">
                  <Pin size={12} />
                </div>
                <span className={`lfh-stamp ${r.status}`}>
                  {r.status === "lost" ? "LOST" : "FOUND"}
                </span>
                <div className="lfh-card-cat">
                  <Icon size={13} /> {cat.label}
                </div>
                <h3 className="lfh-card-title">{r.title}</h3>
                <p className="lfh-card-desc">{r.description}</p>
                <div className="lfh-card-meta">
                  <span>
                    <MapPin size={13} /> {r.location}
                  </span>
                  <span>
                    <Calendar size={13} /> {formatDate(r.date)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selected && (
        <DetailModal
          report={selected}
          onClose={() => setSelected(null)}
          onResolve={() => resolveReport(selected.id)}
          onCopy={copyToClipboard}
          copiedField={copiedField}
        />
      )}

      {showForm && (
        <FormModal
          onClose={() => setShowForm(false)}
          onSubmit={addReport}
          saving={saving}
        />
      )}

      {toast && <div className="lfh-toast">{toast}</div>}
    </div>
  );
}

function DetailModal({ report, onClose, onResolve, onCopy, copiedField }) {
  const cat = CATEGORY_MAP[report.category] || CATEGORIES[0];
  const Icon = cat.icon;
  const phoneDigits = (report.contactPhone || "").replace(/\s+/g, "");
  const tabCount = 6;

  return (
    <div className="lfh-overlay" onClick={onClose}>
      <div className="lfh-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lfh-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <span className={`lfh-stamp ${report.status}`}>
          {report.status === "lost" ? "LOST" : "FOUND"}
        </span>
        <div className="lfh-card-cat">
          <Icon size={13} /> {cat.label}
        </div>
        <h2>{report.title}</h2>
        <p className="lfh-modal-desc">{report.description}</p>
        <div className="lfh-modal-meta">
          <span>
            <MapPin size={14} /> {report.location}
          </span>
          <span>
            <Calendar size={14} /> {formatDate(report.date)}
          </span>
        </div>

        <div className="lfh-contact-row">
          {report.contactPhone && (
            <button
              className="lfh-contact-btn"
              onClick={() => onCopy(report.contactPhone, "phone")}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={14} /> {report.contactPhone}
              </span>
              <span className="lfh-copied">{copiedField === "phone" ? "Copied" : "Tap to copy"}</span>
            </button>
          )}
          {report.contactEmail && (
            <button
              className="lfh-contact-btn"
              onClick={() => onCopy(report.contactEmail, "email")}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mail size={14} /> {report.contactEmail}
              </span>
              <span className="lfh-copied">{copiedField === "email" ? "Copied" : "Tap to copy"}</span>
            </button>
          )}
        </div>

        {phoneDigits && (
          <div style={{ marginBottom: 20 }}>
            <div className="lfh-tearoff-label">
              <Scissors size={13} /> Tear off a number
            </div>
            <div className="lfh-tearoff">
              {Array.from({ length: tabCount }).map((_, i) => (
                <div
                  key={i}
                  className="lfh-tearoff-tab"
                  onClick={() => onCopy(report.contactPhone, "phone")}
                  title="Copy phone number"
                >
                  {report.contactPhone}
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="lfh-resolve-btn" onClick={onResolve}>
          <Check size={16} /> Mark as resolved &amp; take down
        </button>
      </div>
    </div>
  );
}

function FormModal({ onClose, onSubmit, saving }) {
  const [status, setStatus] = useState("lost");
  const [category, setCategory] = useState("phone");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(todayStr());
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim() || !date) {
      setError("Fill in the title, description, location, and date.");
      return;
    }
    if (!contactPhone.trim() && !contactEmail.trim()) {
      setError("Add a phone number or email so people can reach you.");
      return;
    }
    setError("");
    onSubmit({
      status,
      category,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      date,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
    });
  };

  return (
    <div className="lfh-overlay" onClick={onClose}>
      <div className="lfh-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lfh-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <h2>Pin a New Notice</h2>

        <form onSubmit={handleSubmit}>
          <div className="lfh-form-group">
            <label className="lfh-form-label">Is it lost or found?</label>
            <div className="lfh-status-toggle">
              <button
                type="button"
                className={`lfh-status-btn lost ${status === "lost" ? "selected" : ""}`}
                onClick={() => setStatus("lost")}
              >
                LOST
              </button>
              <button
                type="button"
                className={`lfh-status-btn found ${status === "found" ? "selected" : ""}`}
                onClick={() => setStatus("found")}
              >
                FOUND
              </button>
            </div>
          </div>

          <div className="lfh-form-group">
            <label className="lfh-form-label">Category</label>
            <div className="lfh-cat-grid">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    type="button"
                    key={c.id}
                    className={`lfh-cat-btn ${category === c.id ? "selected" : ""}`}
                    onClick={() => setCategory(c.id)}
                  >
                    <Icon size={18} /> {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lfh-form-group">
            <label className="lfh-form-label">Title</label>
            <input
              className="lfh-input"
              placeholder="e.g. Black leather wallet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="lfh-form-group">
            <label className="lfh-form-label">Description</label>
            <textarea
              className="lfh-textarea"
              placeholder="Distinguishing details — color, brand, markings, anything that helps identify it"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="lfh-form-row">
            <div className="lfh-form-group">
              <label className="lfh-form-label">Location</label>
              <input
                className="lfh-input"
                placeholder="e.g. Anna Nagar bus stop"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="lfh-form-group">
              <label className="lfh-form-label">Date</label>
              <input
                type="date"
                className="lfh-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="lfh-form-group">
            <label className="lfh-form-label">Your name (optional)</label>
            <input
              className="lfh-input"
              placeholder="e.g. Priya"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>

          <div className="lfh-form-row">
            <div className="lfh-form-group">
              <label className="lfh-form-label">Phone</label>
              <input
                className="lfh-input"
                placeholder="e.g. 98765 43210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
            <div className="lfh-form-group">
              <label className="lfh-form-label">Email</label>
              <input
                className="lfh-input"
                placeholder="you@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="lfh-form-error">{error}</div>}

          <button className="lfh-submit-btn" type="submit" disabled={saving}>
            {saving ? <Loader2 className="lfh-spin" size={16} /> : <Pin size={16} />}
            {saving ? "Pinning…" : "Pin to the board"}
          </button>
        </form>
      </div>
    </div>
  );
}
