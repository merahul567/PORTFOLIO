import React, { useState, useEffect } from 'react';
import { axiosGet } from "../apiService.js"; 

function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axiosGet('projects')
      .then(response => setProjects(response));
  }, []);

  return (
    <div>
      <h1>My Projects</h1>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <p><strong>Tech Stack:</strong> {project.techStack}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectsPage;
