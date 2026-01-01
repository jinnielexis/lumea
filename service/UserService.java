/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.lumea.service;

/**
 *
 * @author hp
 */

import com.lumea.dao.UserDAO;
import com.lumea.entity.Status; // Import Status
import com.lumea.entity.User;
import com.lumea.enums.UserRole;
import com.lumea.util.HibernateUtil;
import org.hibernate.Session;

public class UserService {

    private final UserDAO userDAO = new UserDAO();

    public void createAdminUser() {
        User user = new User();
        user.setName("Admin");
        user.setEmail("admin@lumea.com");
        user.setPassword("admin123");
        user.setRole(UserRole.admin);

        // IMPORTANT: We must fetch a Status entity from the DB to set it
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            Status activeStatus = session.get(Status.class, 1); // Assuming ID 1 is 'Active'
            user.setStatus(activeStatus);
        }

        userDAO.save(user); // The error should disappear now!
    }

    public void register(User user) {
        // Set default role and status for new customers
        user.setRole(UserRole.user);
        userDAO.save(user);
    }
}
