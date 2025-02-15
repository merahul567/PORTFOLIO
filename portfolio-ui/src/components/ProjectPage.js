import React, { useState, useEffect } from 'react';
import { axiosGet } from "../apiService.js"; 
import "./ProjectPage.css";

function ProjectPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axiosGet('projects')
      .then(response => setProjects(response));
  }, []);

  return (
    <div className="page-container">
      <h1>My Projects</h1>
      <ul className="project-list">
        {projects.map(project => (
          <li key={project.id}> 
            <h2>🔹{project.name}</h2>
            <p>{project.description}</p>
            <p><strong>Tech Stack:</strong> {project.techStack}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectPage;
