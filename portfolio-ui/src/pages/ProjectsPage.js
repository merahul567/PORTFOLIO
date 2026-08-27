import React, { useEffect, useState } from "react";
import Seo from "../seo/Seo";
import { axiosGet } from "../apiService";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    axiosGet("projects")
      .then((data) => {
        if (cancelled) return;
        setProjects(Array.isArray(data) ? data : []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page inner-page">
      <Seo
        title="Projects"
        description="Selected software and product experiments by Rahul Kumar, including Java, Spring Boot, and React work."
        path="/projects"
      />
      <div className="wrap">
        <p className="page-kicker">Work</p>
        <h1 className="page-title">Projects</h1>
        <p className="page-lead">
          Real write-ups will include the problem, the approach, the stack, and links. Until
          those exist, this list is whatever the service currently returns.
        </p>
        {status === "loading" && <p className="quiet-note">Loading projects…</p>}
        {status === "error" && (
          <p className="quiet-note">Projects could not be loaded. Try again in a moment.</p>
        )}
        {status === "ready" && projects.length === 0 && (
          <p className="quiet-note">No projects are listed yet.</p>
        )}
        {status === "ready" && projects.length > 0 && (
          <ul className="card-list" style={{ listStyle: "none", padding: 0 }}>
            {projects.map((project) => (
              <li key={project.id} className="project-item">
                <h2>{project.name}</h2>
                <p>{project.description}</p>
                {project.techStack && (
                  <p>
                    <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Stack. </strong>
                    {project.techStack}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
