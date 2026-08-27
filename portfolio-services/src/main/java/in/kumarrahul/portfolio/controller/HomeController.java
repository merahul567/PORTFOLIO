package in.kumarrahul.portfolio.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HomeController {

    @GetMapping("/greeting")
    public Map<String, String> getGreeting() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "I am Rahul Kumar, a passionate Software Developer and Tech Enthusiast.");
        return response;
    }
}	
