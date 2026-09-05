import React, { useState, useEffect } from "react";
import { getBriefingGrouped, fetchLiveBriefing } from "../data/briefingContent";
import "./DailyBriefing.css";

export default function DailyBriefing({ compact = false }) {
  const [briefing, setBriefing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBriefing = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch live briefing when service is integrated
        await fetchLiveBriefing();
        const grouped = getBriefingGrouped();
        setBriefing(grouped);
      } catch (err) {
        console.error("Failed to load daily briefing:", err);
        setError("Unable to load briefing at this time");
        // Fallback to grouped briefing data
        setBriefing(getBriefingGrouped());
      } finally {
        setLoading(false);
      }
    };

    loadBriefing();
  }, []);

  if (loading) {
    return <div className="briefing-shell briefing-loading">Loading today's briefing...</div>;
  }

  if (error && briefing.length === 0) {
    return <div className="briefing-shell briefing-error">{error}</div>;
  }

  return (
    <div className={`briefing-shell ${compact ? "briefing-compact" : "briefing-full"}`}>
      <div className="briefing-intro">
        <p className="briefing-subtitle">Five important things happening today</p>
        <p className="briefing-description">
          A concise daily briefing designed to be read in ~60 seconds.
        </p>
      </div>

      <div className="briefing-grid">
        {briefing.map((categoryGroup) => (
          <div key={categoryGroup.id} className="briefing-category-section">
            <div className="category-header">
              <span className="category-emoji">{categoryGroup.emoji}</span>
              <h3 className="category-name">{categoryGroup.name}</h3>
            </div>

            <div className="briefing-item-list">
              {categoryGroup.items.map((item) => (
                <div key={item.id} className="briefing-item">
                  <h4 className="item-headline">{item.headline}</h4>
                  <p className="item-summary">{item.summary}</p>
                  {item.source && (
                    <p className="item-source">via {item.source}</p>
                  )}
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
