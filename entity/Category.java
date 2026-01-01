/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.lumea.entity;

import jakarta.persistence.*;
import java.util.List;

/**
 *
 * @author hp
 */
@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cid;

    @Column(length = 45)
    private String name;

    @OneToMany(mappedBy = "category")
    private List<Product> products;
}

