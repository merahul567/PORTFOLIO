import React from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "../../seo/Seo";
import { getToolBySlug } from "../../data/toolsCatalog";

export default function ToolDetailPage() {
  const { slug } = useParams();
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <div className="page">
        <Seo title="Tool not found" description="That tool is not in the KumarRahul.in catalogue." path={`/tools/${slug || ""}`} />
        <div className="wrap">
          <h1 className="page-title">Tool not found</h1>
          <p className="page-lead">
            That utility is not in the catalogue. <Link to="/tools">Back to tools</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page inner-page">
      <Seo title={tool.name} description={tool.description} path={tool.route} />
      <div className="wrap">
        <p className="page-kicker">{tool.category}</p>
        <h1 className="page-title">{tool.name}</h1>
        <p className="page-lead">{tool.description}</p>
        <p className="quiet-note" style={{ marginTop: "1.2rem" }}>
          This tool is {tool.status === "planned" ? "planned" : "in development"}. The
          interface and calculations will ship here without investment advice, buy/sell
          language, or fabricated market data.
        </p>
        <p style={{ marginTop: "1.4rem" }}>
          <Link to="/tools">All tools</Link>
        </p>
      </div>
    </div>
  );
}