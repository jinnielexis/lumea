/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.lumea.controller;

/**
 *
 * @author hp
 */

import com.lumea.dao.UserDAO;
import com.lumea.entity.Status;
import com.lumea.entity.User;
import com.lumea.enums.UserRole;
import com.lumea.util.HibernateUtil;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.hibernate.Session;

@Path("/dbtest")
public class DbTestController {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response testInsert() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            UserDAO dao = new UserDAO();
            User user = new User();
            user.setName("Test User");
            user.setEmail("test" + System.currentTimeMillis() + "@lumea.com");
            user.setPassword("1234");
            user.setRole(UserRole.admin); // Assuming CUSTOMER exists in your UserRole enum

            // Fetch the Status object with ID 1 from DB first
            Status status = session.get(Status.class, 1);
            user.setStatus(status);

            dao.save(user);
            return Response.ok("Success! Check MySQL.").build();
        } catch (Exception e) {
            return Response.status(500).entity("Error: " + e.getMessage()).build();
        }
    }
}
