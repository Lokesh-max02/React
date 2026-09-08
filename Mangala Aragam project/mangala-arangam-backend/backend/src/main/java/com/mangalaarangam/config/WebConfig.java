package com.mangalaarangam.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.uploads.directory}")
    private String uploadsDirectory;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Resolve to an absolute path so it works regardless of the JVM's working directory.
        String absolutePath = new File(uploadsDirectory).getAbsolutePath();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + absolutePath + File.separator);
    }
}
