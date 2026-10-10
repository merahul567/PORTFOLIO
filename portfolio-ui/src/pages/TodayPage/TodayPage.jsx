import React from "react";
import Seo from "../../seo/Seo";
import DailyBriefing from "../../components/DailyBriefing/DailyBriefing";

export default function TodayPage() {
  return (
    <div className="page inner-page">
      <Seo
        title="What's Happening Today?"
        description="A concise daily briefing across India, markets, global, technology & AI, science & environment, and business — designed to be read in about 60 seconds."
        path="/today"
      />
      <div className="wrap">
        <p className="page-kicker">Daily briefing</p>
        <h1 className="page-title">What's Happening Today?</h1>
        <p className="page-lead">
          Concise updates across India, markets, global, technology & AI, science & environment,
          and business — designed to be understood in about 60 seconds.
        </p>
        <DailyBriefing compact={false} />
      </div>
    </div>
  );
}