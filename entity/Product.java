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
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pid;

    @Column(length = 50)
    private String pname;

    @Column(length = 150)
    private String description;

    private double price;

    @Column(length = 150)
    private String image;

    // --- NEW FIELDS REQUIRED BY FRONTEND ---
    @Column(length = 50)
    private String badge; // To store "Featured", "New", or "Best Seller"

    private double rating; // To store the star rating (e.g., 4.5)

    @ManyToOne
    @JoinColumn(name = "category_cid")
    private Category category;

    // --- IMPORTANT: ADD GETTERS AND SETTERS ---
    // Right-click in NetBeans -> Insert Code -> Getter and Setter -> Select All
    public int getPid() { 
        return pid; 
    }
    public void setPid(int pid) { 
        this.pid = pid; 
    }
    public String getPname() { 
        return pname; 
    }
    public void setPname(String pname) { 
        this.pname = pname; 
    }
    public String getDescription() { 
        return description; 
    }
    public void setDescription(String description) { 
        this.description = description; 
    }
    public double getPrice() { 
        return price; 
    }
    public void setPrice(double price) { 
        this.price = price; 
    }
    public String getImage() { 
        return image; 
    }
    public void setImage(String image) { 
        this.image = image; 
    }
    public String getBadge() { 
        return badge; 
    }
    public void setBadge(String badge) { 
        this.badge = badge; 
    }
    public double getRating() { 
        return rating; 
    }
    public void setRating(double rating) { 
        this.rating = rating; 
    }
    public Category getCategory() { 
        return category; 
    }
    public void setCategory(Category category) { 
        this.category = category; 
    }
}

