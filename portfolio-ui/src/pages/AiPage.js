import React from "react";
import Seo from "../seo/Seo";

export default function AiPage() {
  return (
    <div className="page inner-page">
      <Seo
        title="AI"
        description="Future AI tools on KumarRahul.in: market explanation, document analysis, and assistants. No paid AI APIs are connected yet."
        path="/ai"
      />
      <div className="wrap">
        <p className="page-kicker">Coming later</p>
        <h1 className="page-title">AI tools</h1>
        <p className="page-lead">
          Intelligent assistants will live here when they can be run at a cost that makes
          sense. Nothing on this page calls a paid model today.
        </p>
        <ul className="ai-list">
          <li>
            <strong>Market explanation</strong>
            Plain-language context around a move, an index, or a premium/discount figure.
          </li>
          <li>
            <strong>Document analysis</strong>
            Help reading filings, factsheets, and technical notes.
          </li>
          <li>
            <strong>Financial data explanation</strong>
            Walkthroughs of calculated outputs from the tools on this site.
          </li>
          <li>
            <strong>Personal productivity</strong>
            Small assistants for writing, structuring, and review — added only when the
            operating cost stays low.
          </li>
        </ul>
      </div>
    </div>
  );
}
