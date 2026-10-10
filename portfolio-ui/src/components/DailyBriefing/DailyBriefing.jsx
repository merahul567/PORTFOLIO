import React, { useEffect, useState } from "react";
import { getBriefingGrouped, fetchLiveBriefing } from "../../data/briefingContent";
import "./DailyBriefing.css";

export default function DailyBriefing({ compact = false }) {
  const [briefing, setBriefing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBriefing() {
      try {
        setLoading(true);
        setError(null);
        await fetchLiveBriefing();
        setBriefing(getBriefingGrouped());
      } catch (err) {
        console.error("Failed to load daily briefing:", err);
        setError("Unable to load briefing at this time");
        setBriefing(getBriefingGrouped());
      } finally {
        setLoading(false);
      }
    }

    loadBriefing();
  }, []);

  if (loading) return <div className="briefing-shell briefing-loading">Loading today's briefing...</div>;
  if (error && briefing.length === 0) return <div className="briefing-shell briefing-error">{error}</div>;

  return (
    <div className={`briefing-shell ${compact ? "briefing-compact" : "briefing-full"}`}>
      <div className="briefing-intro">
        <p className="briefing-subtitle">Important updates for today</p>
        <p className="briefing-description">A concise daily briefing designed to be read in ~60 seconds.</p>
      </div>
      <div className="briefing-grid">
        {briefing.map((categoryGroup) => (
          <div key={categoryGroup.id} className="briefing-category-section">
            <div className="category-header">
              {categoryGroup.id === "india" ? (
                <svg className="category-emoji india-flag" viewBox="0 0 24 16" role="img" aria-label="India flag">
                  <rect width="24" height="5.33" fill="#FF9933" />
                  <rect y="5.33" width="24" height="5.34" fill="#FFFFFF" />
                  <rect y="10.67" width="24" height="5.33" fill="#138808" />
                  <circle cx="12" cy="8" r="2.05" fill="none" stroke="#000080" strokeWidth="0.65" />
                  <circle cx="12" cy="8" r="0.35" fill="#000080" />
                </svg>
              ) : (
                <span className="category-emoji" aria-hidden="true">{categoryGroup.emoji}</span>
              )}
              <h3 className="category-name">{categoryGroup.name}</h3>
            </div>
            <div className="briefing-item-list">
              {categoryGroup.items.map((item) => (
                <div key={item.id} className="briefing-item">
                  <h4 className="item-headline">{item.headline}</h4>
                  <p className="item-summary">{item.summary}</p>
                  {item.source && <p className="item-source">via {item.source}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="briefing-footer">
        <p className="briefing-note">
          <strong>Data integration in progress:</strong> Briefing content will connect to live
          news sources and AI summarization when the backend service is available.
        </p>
      </div>
    </div>
  );
}