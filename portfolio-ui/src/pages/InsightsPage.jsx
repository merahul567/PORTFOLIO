import React from "react";
import Seo from "../seo/Seo";
import { forthcomingInsights } from "../data/insightsPreview";

export default function InsightsPage() {
  return (
    <div className="page inner-page">
      <Seo
        title="Insights"
        description="Market, investing, and engineering explainers from Rahul Kumar. Useful writing, not keyword pages."
        path="/insights"
      />
      <div className="wrap">
        <p className="page-kicker">Writing</p>
        <h1 className="page-title">Insights</h1>
        <p className="page-lead">
          Short, factual explainers. Categories will include markets, investing, technology,
          AI, engineering, and guides. Nothing is published yet.
        </p>
        <div className="card-list">
          {forthcomingInsights.map((item) => (
            <article key={item.slug} className="catalog-item">
              <div className="tool-cat">{item.category}</div>
              <h2 style={{ marginTop: "0.35rem" }}>{item.title}</h2>
              <p>{item.description}</p>
              <p className="quiet-note" style={{ marginTop: "0.45rem" }}>
                Forthcoming
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
