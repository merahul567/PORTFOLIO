import React, { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { SITE } from "../siteConfig";
import { useTheme } from "../theme/ThemeProvider";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/markets", label: "Markets" },
  { to: "/tools", label: "Tools" },
  { to: "/ai", label: "AI" },
  { to: "/insights", label: "Insights" },
  { to: "/about", label: "About" },
];

export default function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="wordmark" to="/">
          KumarRahul<span>.in</span>
        </Link>
        <nav className="nav-desktop" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="3.2" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="1.2">
                  <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M3.2 12.8l1.1-1.1M11.7 4.3l1.1-1.1" />
                </g>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M13.2 10.1A5.4 5.4 0 0 1 6 2.8a5.5 5.5 0 1 0 7.2 7.3Z"
                />
              </svg>
            )}
          </button>
          <button
            type="button"
            className="icon-btn nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "More"}
          </button>
        </div>
      </div>
      <nav
        id="mobile-nav"
        className="mobile-panel"
        aria-label={`${SITE.name} menu`}
        hidden={!open}
      >
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
