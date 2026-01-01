/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.lumea.dao;

/**
 *
 * @author hp
 */

import com.lumea.entity.Orders;
import com.lumea.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class OrderDAO {

    public boolean saveOrder(Orders order) {
        Transaction transaction = null;
        // 1. Open a session to talk to MySQL
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            // 2. Start a Transaction (All or Nothing)
            transaction = session.beginTransaction();

            // 3. PERSIST: This saves the Order and ALL OrderItems inside it
            // because we used 'cascade = CascadeType.ALL' in the entity.
            session.persist(order);

            // 4. Commit to make it permanent
            transaction.commit();
            return true;
        } catch (Exception e) {
            // 5. If it fails, undo everything so we don't have "half" an order saved
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            return false;
        }
    }
}
