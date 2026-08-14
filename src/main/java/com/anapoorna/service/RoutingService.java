package com.anapoorna.service;

import com.anapoorna.dto.routing.RouteOptimizationRequest;
import com.anapoorna.dto.routing.RouteOptimizationResponse;

public interface RoutingService {

    RouteOptimizationResponse optimizeRoute(RouteOptimizationRequest request);
}
