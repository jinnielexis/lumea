/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.lumea.entity;

import com.lumea.enums.OrderStatus;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

/**
 *
 * @author hp
 */
@Entity
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int oid;

    private double total;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt = new Date();

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ManyToOne
    @JoinColumn(name = "user_uid")
    private User user;

    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    // Default Constructor
    public Orders() {}

    // Getters and Setters
    public int getOid() { 
        return oid; 
    }
    public void setOid(int oid) { 
        this.oid = oid; 
    }

    public double getTotal() { 
        return total; 
    }
    public void setTotal(double total) { 
        this.total = total; 
    }

    public Date getCreatedAt() { 
        return createdAt; 
    }
    public void setCreatedAt(Date createdAt) { 
        this.createdAt = createdAt; 
    }

    public OrderStatus getStatus() { 
        return status; 
    }
    public void setStatus(OrderStatus status) { 
        this.status = status; 
    }

    public User getUser() { 
        return user; 
    }
    public void setUser(User user) { 
        this.user = user; 
    }

    public List<OrderItem> getOrderItems() { 
        return orderItems; 
    }
    public void setOrderItems(List<OrderItem> orderItems) { 
        this.orderItems = orderItems; 
    }
}