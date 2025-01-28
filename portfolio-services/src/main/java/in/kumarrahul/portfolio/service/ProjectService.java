package in.kumarrahul.portfolio.service;

import java.util.List;

import org.springframework.stereotype.Service;

import in.kumarrahul.portfolio.entity.Project;
import in.kumarrahul.portfolio.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }
}
