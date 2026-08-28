package in.kumarrahul.portfolio.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
            "/markets",
            "/tools",
            "/tools/**",
            "/ai",
            "/insights",
            "/insights/**",
            "/about",
            "/blog",
            "/contact"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
