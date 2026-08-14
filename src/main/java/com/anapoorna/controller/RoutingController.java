package com.anapoorna.controller;

import com.anapoorna.dto.routing.RouteOptimizationRequest;
import com.anapoorna.dto.routing.RouteOptimizationResponse;
import com.anapoorna.service.RoutingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routing")
public class RoutingController {

    private final RoutingService routingService;

    @Autowired
    public RoutingController(RoutingService routingService) {
        this.routingService = routingService;
    }

    @PostMapping("/optimize")
    public ResponseEntity<RouteOptimizationResponse> optimizeRoute(@Valid @RequestBody RouteOptimizationRequest request) {
        RouteOptimizationResponse response = routingService.optimizeRoute(request);
        return ResponseEntity.ok(response);
    }
}
