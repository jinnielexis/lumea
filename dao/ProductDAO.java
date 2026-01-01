/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.lumea.dao;

/**
 *
 * @author hp
 */
import com.lumea.entity.Product;
import com.lumea.util.HibernateUtil;
import org.hibernate.Session;
import java.util.List;

public class ProductDAO {

    public List<Product> getAllProducts() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            // Using "JOIN FETCH" tells Hibernate to grab the category data immediately
            return session.createQuery("SELECT p FROM Product p JOIN FETCH p.category", Product.class).list();
        }
    }

    public Product getProductById(int productId) {
        // Use try-with-resources to ensure the session closes automatically
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            
            // session.get() is the most efficient way to find a single row by its Primary Key
            // We also use "JOIN FETCH" here to ensure the Category is loaded if you need it
            return session.createQuery(
                "SELECT p FROM Product p JOIN FETCH p.category WHERE p.pid = :id", Product.class)
                .setParameter("id", productId)
                .uniqueResult();
                
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
