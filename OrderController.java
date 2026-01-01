/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.lumea.controller;

/**
 *
 * @author hp
 */

import com.lumea.dao.OrderDAO;
import com.lumea.dao.ProductDAO;
import com.lumea.entity.Orders;
import com.lumea.entity.OrderItem;
import com.lumea.entity.Product;
import com.lumea.entity.User;
import com.lumea.enums.OrderStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Path("/order")
public class OrderController {

    private final OrderDAO orderDAO = new OrderDAO();

    @POST
    @Path("/checkout")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkout(@Context HttpServletRequest request) {
        
        // 1. Get the Session
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                           .entity("{\"message\": \"Please login to checkout\"}").build();
        }

        // 2. Get User and Cart from Session
        User user = (User) session.getAttribute("user");
        
        // Let's assume the cart is stored in the session as a List of OrderItem
        List<OrderItem> cartItems = (List<OrderItem>) session.getAttribute("cart");

        if (cartItems == null || cartItems.isEmpty()) {
            return Response.status(400).entity("{\"message\": \"Cart is empty\"}").build();
        }

        try {
            // 3. Create the Main Order Entity
            Orders order = new Orders();
            order.setUser(user);
            order.setStatus(OrderStatus.success);
            
            double total = 0;
            for (OrderItem item : cartItems) {
                total += (item.getPrice() * item.getQuantity());
                item.setOrders(order); // Link item to this order
            }
            order.setTotal(total);
            
            // 4. Save using DAO
            boolean success = orderDAO.saveOrder(order);

            if (success) {
                session.removeAttribute("cart"); // Clear cart after success
                return Response.ok("{\"success\": true, \"message\": \"Order placed!\"}").build();
            } else {
                return Response.serverError().entity("{\"message\": \"Database error\"}").build();
            }

        } catch (Exception e) {
            return Response.serverError().entity("{\"message\": \"Server error\"}").build();
        }
    }
    
    private final ProductDAO productDAO = new ProductDAO();

    @POST
    @Path("/add-to-cart")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addToCart(@Context HttpServletRequest request, Map<String, Object> itemData) {
        // 1. Get or Create Session
        HttpSession session = request.getSession(true);
        
        // 2. Get product ID from the frontend request
        int productId = Integer.parseInt(itemData.get("productId").toString());
        int quantity = Integer.parseInt(itemData.get("quantity").toString());

        // 3. SECURE STEP: Fetch the real Product from the Database
        Product dbProduct = productDAO.getProductById(productId);
        
        if (dbProduct == null) {
            return Response.status(Response.Status.NOT_FOUND)
                           .entity("{\"message\": \"Product not found in database\"}").build();
        }

        // 4. Initialize or get the cart
        List<OrderItem> cart = (List<OrderItem>) session.getAttribute("cart");
        if (cart == null) {
            cart = new ArrayList<>();
        }

        // 5. Create OrderItem using official DB data (Price comes from DB, not JS)
        OrderItem item = new OrderItem();
        item.setProduct(dbProduct);
        item.setQuantity(quantity);
        item.setPrice(dbProduct.getPrice()); // Secure: uses DB price
        
        cart.add(item);
        session.setAttribute("cart", cart);

        return Response.ok("{\"message\": \"Product added to session cart securely\"}").build();
    }

    @GET
    @Path("/view-cart")
    @Produces(MediaType.APPLICATION_JSON)
    public Response viewCart(@Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("cart") == null) {
            return Response.ok(new ArrayList<>()).build();
        }
        return Response.ok(session.getAttribute("cart")).build();
    }
}
