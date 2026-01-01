/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.lumea.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "status")
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sid;

    @Column(length = 45)
    private String status;

    // This allows you to see all users belonging to this status
    @OneToMany(mappedBy = "status")
    private List<User> users;

    public Status() {
    }

    // --- GETTERS AND SETTERS (Fixes the red errors in UserDAO) ---
    public int getSid() {
        return sid;
    }

    public void setSid(int sid) {
        this.sid = sid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
