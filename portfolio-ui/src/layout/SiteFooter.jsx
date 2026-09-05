import React from "react";
import { Link } from "react-router-dom";
import { SITE } from "../siteConfig";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">{SITE.name}</div>
            <p>{SITE.tagline}</p>
            <p style={{ marginTop: "0.4rem" }}>{SITE.supportLine}</p>
          </div>
          <div className="footer-links">
            <Link to="/markets">Markets</Link>
            <Link to="/tools">Tools</Link>
            <Link to="/insights">Insights</Link>
          </div>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/about#contact">Contact</Link>
            <Link to="/ai">AI</Link>
          </div>
        </div>
        <p className="footer-note">
          Market figures and tool outputs are for informational purposes only. Nothing on this
          site is investment advice, a solicitation, or a recommendation to buy or sell any
          security. © {new Date().getFullYear()} Rahul Kumar.
        </p>
      </div>
    </footer>
  );
}
