import React from "react";
import { Link } from "react-router-dom";
import Seo from "../seo/Seo";
import { toolsCatalog } from "../data/toolsCatalog";

export default function ToolsPage() {
  return (
    <div className="page inner-page">
      <Seo
        title="Tools"
        description="Financial and market tools on KumarRahul.in: ETF scanner, calculators, and comparison utilities."
        path="/tools"
      />
      <div className="wrap">
        <p className="page-kicker">Product</p>
        <h1 className="page-title">Tools</h1>
        <p className="page-lead">
          Practical utilities first. AI-assisted products later, without pretending they
          already exist.
        </p>
        <div className="card-list">
          {toolsCatalog.map((tool) => (
            <Link key={tool.slug} className="catalog-item" to={tool.route} style={{ textDecoration: "none" }}>
              <div className="tool-cat">{tool.category}</div>
              <h2 style={{ marginTop: "0.35rem" }}>{tool.name}</h2>
              <p>{tool.description}</p>
              <p className="quiet-note" style={{ marginTop: "0.45rem" }}>
                {statusLabel(tool.status)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function statusLabel(status) {
  if (status === "in-development") return "In development";
  if (status === "planned") return "Planned";
  return status;
}
