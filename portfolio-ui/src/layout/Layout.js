import React from "react";
import { Outlet } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

export default function Layout() {
  return (
    <div className="app-shell">
      <a className="sr-only" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main className="site-main" id="main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
