package com.anapoorna.dto.routing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteOptimizationResponse {

    private Double startLatitude;
    private Double startLongitude;
    private Double totalDistanceKm;
    private Integer totalStops;
    private List<RouteWaypointDTO> waypoints;

    public Double getStartLatitude() { return startLatitude; }
    public void setStartLatitude(Double startLatitude) { this.startLatitude = startLatitude; }

    public Double getStartLongitude() { return startLongitude; }
    public void setStartLongitude(Double startLongitude) { this.startLongitude = startLongitude; }

    public Double getTotalDistanceKm() { return totalDistanceKm; }
    public void setTotalDistanceKm(Double totalDistanceKm) { this.totalDistanceKm = totalDistanceKm; }

    public Integer getTotalStops() { return totalStops; }
    public void setTotalStops(Integer totalStops) { this.totalStops = totalStops; }

    public List<RouteWaypointDTO> getWaypoints() { return waypoints; }
    public void setWaypoints(List<RouteWaypointDTO> waypoints) { this.waypoints = waypoints; }
}
