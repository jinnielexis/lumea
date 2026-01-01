package com.lumea.resource;

//import jakarta.ws.rs.GET;
//import jakarta.ws.rs.Path;
//import jakarta.ws.rs.core.Response;
//
///**
// *
// * @author 
// */
//@Path("jakartaee10")
//public class JakartaEE10Resource {
//    
//    @GET
//    public Response ping(){
//        return Response
//                .ok("ping Jakarta EE")
//                .build();
//    }
//}


import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("test")
public class JakartaEE10Resource {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String test() {
        return "REST is working!";
    }
}
