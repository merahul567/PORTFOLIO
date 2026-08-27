import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../seo/Seo";
import { SITE } from "../siteConfig";

const STACK = ["Java", "Spring Boot", "React", "JavaScript", "HTML/CSS"];

export default function AboutPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === "#contact") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  return (
    <div className="page inner-page">
      <Seo
        title="About"
        description="Rahul Kumar is a software engineer building KumarRahul.in — useful tools, market intelligence, and independent product experiments."
        path="/about"
      />
      <div className="wrap">
        <p className="page-kicker">About</p>
        <h1 className="page-title">Rahul Kumar</h1>
        <p className="page-lead">
          Software engineer, technology builder, and independent product experimenter.
        </p>
        <p className="page-lead">
          I have six years of experience in software development, with day-to-day work in
          Java and React. KumarRahul.in is where I put practical tools and market context on
          the public internet.
        </p>
        <div className="stack-list" aria-label="Technology">
          {STACK.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <section className="contact-block" id="contact">
          <h2 style={{ fontSize: "1.2rem" }}>Contact</h2>
          <p style={{ marginTop: "0.55rem", color: "var(--muted)" }}>
            Email:{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <p style={{ marginTop: "0.35rem", color: "var(--muted)" }}>
            LinkedIn:{" "}
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
              rahul-kumar-45693413a
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
