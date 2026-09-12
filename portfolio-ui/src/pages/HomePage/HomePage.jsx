import React from "react";
import { Link } from "react-router-dom";
import Seo from "../../seo/Seo";
import { SITE } from "../../siteConfig";
import { featuredTools } from "../../data/toolsCatalog";
import { forthcomingInsights } from "../../data/insightsPreview";
import MarketSnapshot from "../../components/MarketSnapshot/MarketSnapshot";
import "./HomePage.css";

export default function HomePage() {
  return (
    <>
      <Seo
        title={`${SITE.name} — ${SITE.tagline}`}
        description={SITE.tagline}
        path="/"
      />
      <section className="hero">
        <div className="wrap">
          <p className="hero-kicker">Technology platform</p>
          <p className="hero-tagline">{SITE.tagline}</p>
          <p className="hero-support">{SITE.supportLine}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/tools">
              Explore Tools
            </Link>
            <Link className="btn btn-ghost" to="/today">
              What's Happening Today?
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="credibility" aria-label="About the builder">
          <div className="cred-cell">
            <div className="cred-label">Builder</div>
            <p>Rahul Kumar, software engineer. Java, Spring Boot, and React.</p>
          </div>
          <div className="cred-cell">
            <div className="cred-label">Experience</div>
            <p>Eight years building production software. Independent product experiments here.</p>
          </div>
          <div className="cred-cell">
            <div className="cred-label">Intent</div>
            <p>Useful tools and clear market data — not a hiring landing page.</p>
          </div>
        </section>

        <section className="home-section" aria-labelledby="snapshot-heading">
          <div className="section-head">
            <h2 id="snapshot-heading">MARKET SNAPSHOT</h2>
          </div>
          <MarketSnapshot />
          <p className="quiet-note" style={{ marginTop: "0.85rem" }}>
            Live quotes only after a market-data source is connected on the server, with timestamp and attribution.
          </p>
        </section>

        <section className="home-section" aria-labelledby="tools-heading">
          <div className="section-head">
            <h2 id="tools-heading">Featured tools</h2>
            <Link to="/tools">All tools</Link>
          </div>
          <div className="tool-rows">
            {featuredTools.map((tool) => (
              <Link
                key={tool.slug}
                className={`tool-row ${tool.status === "in-development" ? "tool-row-in-development" : ""} ${tool.status === "planned" ? "tool-row-planned" : ""}`}
                to={tool.route}
              >
                <div className="tool-cat">{tool.category}</div>
                <div>
                  <div className="tool-name">{tool.name}</div>
                  <p className="tool-copy">{tool.description}</p>
                </div>
                <span className={`status-pill ${tool.status === "in-development" ? "status-in-development" : ""} ${tool.status === "planned" ? "status-planned" : ""}`}>{statusLabel(tool.status)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section" aria-labelledby="insights-heading">
          <div className="section-head">
            <h2 id="insights-heading">Latest insights</h2>
            <Link to="/insights">Insights</Link>
          </div>
          <div className="insight-list">
            {forthcomingInsights.map((item) => (
              <Link key={item.slug} className="insight-item" to="/insights">
                <div className="tool-cat">{item.category}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
          <p className="quiet-note" style={{ marginTop: "0.85rem" }}>
            Articles are not published yet. These are the first explainers in progress.
          </p>
        </section>


      </div>
    </>
  );
}

function statusLabel(status) {
  if (status === "in-development") return "In development";
  if (status === "planned") return "Planned";
  return status;
}