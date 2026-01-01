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
import com.lumea.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;

@Path("/auth")
public class AuthController {

    private final UserDAO userDAO = new UserDAO();

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(User loginRequest, @Context HttpServletRequest request) {

        User user = userDAO.getUserByEmailAndPassword(loginRequest.getEmail(), loginRequest.getPassword());

        if (user != null) {
            // --- SESSION START ---
            HttpSession session = request.getSession(true);
            session.setAttribute("user", user); // Store the whole user object in server memory
            // ---------------------

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("success", true);
            responseData.put("userName", user.getName());
            responseData.put("role", user.getRole().toString()); // Admin or Customer

            return Response.ok(responseData).build();
        } else {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"success\": false, \"message\": \"Invalid credentials\"}")
                    .build();
        }
    }

    @POST
    @Path("/signup")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response signUp(User newUser) {
        try {
            // 1. Validate Email
            if (!newUser.getEmail().matches(com.lumea.validation.Validator.EMAIL_VALIDATION)) {
                return Response.status(400).entity("{\"success\": false, \"message\": \"Invalid Email Format\"}").build();
            }

            // 2. Validate Password (8-20 chars, symbols, numbers, upper/lower)
            if (!newUser.getPassword().matches(com.lumea.validation.Validator.PASSWORD_VALIDATION)) {
                return Response.status(400).entity("{\"success\": false, \"message\": \"Password too weak (Must be 8-20 chars with symbols)\"}").build();
            }

            // 3. Set Defaults
            newUser.setRole(com.lumea.enums.UserRole.user);
            com.lumea.entity.Status activeStatus = new com.lumea.entity.Status();
            activeStatus.setSid(1);
            newUser.setStatus(activeStatus);

            // 4. Save
            boolean success = userDAO.registerUser(newUser);

            if (success) {
                return Response.ok("{\"success\": true}").build();
            } else {
                return Response.status(409).entity("{\"success\": false, \"message\": \"Email already exists\"}").build();
            }
        } catch (Exception e) {
            return Response.serverError().entity("{\"success\": false, \"message\": \"Server Error\"}").build();
        }
    }

}
