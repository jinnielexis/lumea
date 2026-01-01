/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.lumea.dao;

import com.lumea.entity.User;
import com.lumea.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class UserDAO {

    public void save(User user) {
        Transaction transaction = null;
        // Open a session and use try-with-resources to ensure it closes
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            // Start the transaction
            transaction = session.beginTransaction();

            // In Hibernate 6, 'persist' is the standard for saving new records
            session.persist(user);

            // Commit to database
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            throw e; // Rethrow so the Controller knows it failed
        }
    }

    public User getUserByEmailAndPassword(String email, String password) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.createQuery("FROM User WHERE email = :email AND password = :password", User.class)
                    .setParameter("email", email)
                    .setParameter("password", password)
                    .uniqueResult();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean registerUser(User user) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();

            // FIX: Re-attach the Status from the database so Hibernate doesn't think it's new
            if (user.getStatus() != null) {
                com.lumea.entity.Status existingStatus = session.get(com.lumea.entity.Status.class, user.getStatus().getSid());
                user.setStatus(existingStatus);
            }

            session.persist(user);
            transaction.commit();
            return true;
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            return false;
        }
    }
}
