/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.lumea.controller;

import com.lumea.dao.ProductDAO;
import com.lumea.entity.Product;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

/**
 *
 * @author hp
 */
@Path("/products")
public class ProductController {
    private final ProductDAO productDAO = new ProductDAO();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getProducts() {
        return productDAO.getAllProducts();
    }
}
