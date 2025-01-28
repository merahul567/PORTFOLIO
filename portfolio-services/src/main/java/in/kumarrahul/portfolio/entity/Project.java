package in.kumarrahul.portfolio.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Project {

    @Id
    private Long id;
    private String name;
    private String description;
    private String techStack;

//    public Project(String name, String description, String techStack) {
//        this.name = name;
//        this.description = description;
//        this.techStack = techStack;
//    }
    
}