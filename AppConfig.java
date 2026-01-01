package com.lumea.config;

import jakarta.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;

@ApplicationPath("/api") // This is the crucial addition
public class AppConfig extends ResourceConfig {

    public AppConfig() {
        // This tells Jersey where to look for your @Path classes
        packages("com.lumea.controller");
    }
}