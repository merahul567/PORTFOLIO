package in.kumarrahul.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import in.kumarrahul.portfolio.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
	
}