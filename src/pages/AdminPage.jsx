import { useState } from "react";
// import { supabase } from '../lib/supabase'

// Placeholder reported content
const PLACEHOLDER_REPORTS = [
  {
    id: 1,
    type: "post",
    content_id: 42,
    reason: "Spam / misleading info",
    reporter: "user_A",
    created_at: "2024-03-12",
  },
  {
    id: 2,
    type: "comment",
    content_id: 77,
    reason: "Offensive language",
    reporter: "user_B",
    created_at: "2024-03-13",
  },
];

const TABS = ["Reports", "Guidebook"];

export default function AdminPage() {
  const [tab, setTab] = useState("Reports");
  const [reports, setReports] = useState(PLACEHOLDER_REPORTS);

  const handleDismiss = (id) => {
    // TODO: mark report as reviewed in Supabase
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRemove = (id) => {
    // TODO: delete the flagged post/comment from Supabase, then dismiss report
    alert("Remove action not yet implemented.");
    handleDismiss(id);
  };

  return (
    <div>
      <h1 className="page-title">Admin Panel</h1>
      <p className="page-subtitle">
        Moderate content and manage guidebook articles.
      </p>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {TABS.map((t) => (
          <button
            key={t}
            className={`btn btn-sm ${tab === t ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Reports tab */}
      {tab === "Reports" && (
        <div>
          {reports.length === 0 && (
            <div className="empty-state card">
              <p>No pending reports. 🎉</p>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {reports.map((r) => (
              <div
                key={r.id}
                className="card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <span className="badge badge-red" style={{ marginBottom: 6 }}>
                    {r.type} #{r.content_id}
                  </span>
                  <p style={{ fontWeight: 600 }}>{r.reason}</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--ink-faint)" }}>
                    Reported by {r.reporter} · {r.created_at}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDismiss(r.id)}
                  >
                    Dismiss
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ background: "var(--red)", color: "white" }}
                    onClick={() => handleRemove(r.id)}
                  >
                    Remove Content
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guidebook management tab */}
      {tab === "Guidebook" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 16,
            }}
          >
            <button
              className="btn btn-primary btn-sm"
              onClick={() => alert("Create article not yet implemented.")}
            >
              + New Article
            </button>
          </div>
          <div className="empty-state card">
            <p>Guidebook articles will be listed here for editing.</p>
            <p style={{ fontSize: "0.85rem" }}>
              Fetch from <code>guidebook_articles</code> table and render edit /
              delete controls.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
