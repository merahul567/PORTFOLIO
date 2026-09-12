import React from "react";
import { Link } from "react-router-dom";
import { SITE } from "../siteConfig";
import "./SiteFooter.css";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-branding">
            <div className="footer-brand">{SITE.name}</div>
            <p className="footer-tagline">{SITE.tagline}</p>
          </div>

          <div className="footer-links">
            <Link to="/today">Today</Link>
            <Link to="/markets">Markets</Link>
          </div>

          <div className="footer-links">
            <Link to="/tools">Tools</Link>
            <Link to="/ai">AI</Link>
          </div>

          <div className="footer-links">
            <Link to="/insights">Insights</Link>
            <Link to="/about">About</Link>
          </div>

          <div className="footer-links">
            <Link to="/tools/etf-premium">ETF Scanner</Link>
            <Link to="/about#contact">Contact</Link>
          </div>
        </div>

        <p className="footer-note">
          Market data and tools are informational only. Nothing here is investment advice.
          <span className="footer-copy"> © {new Date().getFullYear()} Rahul Kumar.</span>
        </p>
      </div>
    </footer>
  );
}
