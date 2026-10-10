import React from "react";
import { Link } from "react-router-dom";
import Seo from "../../seo/Seo";

export default function NotFoundPage() {
  return (
    <div className="page">
      <Seo title="Page not found" description="This page does not exist on KumarRahul.in." path="/404" />
      <div className="wrap">
        <p className="page-kicker">404</p>
        <h1 className="page-title">This page is not here.</h1>
        <p className="page-lead">
          The address may have changed. Start from the <Link to="/">home page</Link> or <Link to="/tools">tools</Link>.
        </p>
      </div>
    </div>
  );
}