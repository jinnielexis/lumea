/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.lumea.entity;

import jakarta.persistence.*;

/**
 *
 * @author hp
 */
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int quantity;

    private double price;

    @ManyToOne
    @JoinColumn(name = "orders_oid")
    private Orders orders;

    @ManyToOne
    @JoinColumn(name = "product_pid")
    private Product product;

    // Default Constructor
    public OrderItem() {}

    // Getters and Setters
    public int getId() { 
        return id; 
    }
    public void setId(int id) { 
        this.id = id; 
    }

    public int getQuantity() { 
        return quantity; 
    }
    public void setQuantity(int quantity) { 
        this.quantity = quantity; 
    }

    public double getPrice() { 
        return price; 
    }
    public void setPrice(double price) { 
        this.price = price; 
    }

    public Orders getOrders() { 
        return orders; 
    }
    public void setOrders(Orders orders) { 
        this.orders = orders; 
    }

    public Product getProduct() { 
        return product; 
    }
    public void setProduct(Product product) { 
        this.product = product; 
    }
}

