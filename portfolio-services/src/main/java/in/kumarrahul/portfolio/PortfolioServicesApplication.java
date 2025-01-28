package in.kumarrahul.portfolio;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import in.kumarrahul.portfolio.entity.Project;
import in.kumarrahul.portfolio.repository.ProjectRepository;

@SpringBootApplication
public class PortfolioServicesApplication implements CommandLineRunner{
	
	private final ProjectRepository projectRepository;
	
    public PortfolioServicesApplication(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

	public static void main(String[] args) {
		SpringApplication.run(PortfolioServicesApplication.class, args);
	}
	
    @Override
    public void run(String... args) throws Exception {
        projectRepository.save(new Project(1L, "Project 1", "Description for Project 1", "Java, Spring Boot"));
        projectRepository.save(new Project(2L, "Project 2", "Description for Project 2", "React, JavaScript"));
        projectRepository.save(new Project(3L, "Project 3", "Description for Project 3", "Node.js, Express"));
    }

}
