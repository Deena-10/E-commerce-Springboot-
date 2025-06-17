package demo.webproject;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:3000", "http://localhost:3001") // ✅ Allowed frontends
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // ✅ All HTTP methods
                .allowedHeaders("*") // ✅ All headers
                .allowCredentials(true); // ✅ For JWT/session use
    }
}
