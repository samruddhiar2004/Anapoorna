package com.anapoorna.service.impl;

import com.anapoorna.dto.routing.RouteOptimizationRequest;
import com.anapoorna.dto.routing.RouteOptimizationResponse;
import com.anapoorna.dto.routing.RouteWaypointDTO;
import com.anapoorna.entity.FoodDonation;
import com.anapoorna.exception.ResourceNotFoundException;
import com.anapoorna.mapper.DonationMapper;
import com.anapoorna.repository.FoodDonationRepository;
import com.anapoorna.service.RoutingService;
import com.anapoorna.util.LocationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoutingServiceImpl implements RoutingService {

    private final FoodDonationRepository donationRepository;
    private final DonationMapper donationMapper;

    @Autowired
    public RoutingServiceImpl(FoodDonationRepository donationRepository, DonationMapper donationMapper) {
        this.donationRepository = donationRepository;
        this.donationMapper = donationMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public RouteOptimizationResponse optimizeRoute(RouteOptimizationRequest request) {
        List<FoodDonation> unvisited = new ArrayList<>(donationRepository.findAllById(request.getDonationIds()));
        if (unvisited.isEmpty()) {
            throw new ResourceNotFoundException("No valid food donations found for the provided IDs");
        }

        double currentLat = request.getStartLatitude();
        double currentLon = request.getStartLongitude();
        double cumulativeDistance = 0.0;

        List<RouteWaypointDTO> waypoints = new ArrayList<>();
        int order = 1;

        while (!unvisited.isEmpty()) {
            FoodDonation nearest = null;
            double minDistance = Double.MAX_VALUE;

            for (FoodDonation donation : unvisited) {
                double dist = LocationUtil.calculateDistanceKm(currentLat, currentLon, donation.getPickupLatitude(), donation.getPickupLongitude());
                if (dist < minDistance) {
                    minDistance = dist;
                    nearest = donation;
                }
            }

            if (nearest != null) {
                unvisited.remove(nearest);
                double roundedDist = Math.round(minDistance * 100.0) / 100.0;
                cumulativeDistance += roundedDist;
                double roundedCumulative = Math.round(cumulativeDistance * 100.0) / 100.0;

                RouteWaypointDTO waypoint = RouteWaypointDTO.builder()
                        .sequenceOrder(order++)
                        .donation(donationMapper.toDTO(nearest))
                        .distanceFromPreviousKm(roundedDist)
                        .cumulativeDistanceKm(roundedCumulative)
                        .build();

                waypoints.add(waypoint);
                currentLat = nearest.getPickupLatitude();
                currentLon = nearest.getPickupLongitude();
            }
        }

        return RouteOptimizationResponse.builder()
                .startLatitude(request.getStartLatitude())
                .startLongitude(request.getStartLongitude())
                .totalDistanceKm(Math.round(cumulativeDistance * 100.0) / 100.0)
                .totalStops(waypoints.size())
                .waypoints(waypoints)
                .build();
    }
}
