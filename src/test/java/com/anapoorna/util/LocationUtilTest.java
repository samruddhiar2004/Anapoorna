package com.anapoorna.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LocationUtilTest {

    @Test
    void calculateDistanceKm_SameLocation_ReturnsZero() {
        double distance = LocationUtil.calculateDistanceKm(19.0760, 72.8777, 19.0760, 72.8777);
        assertEquals(0.0, distance, 0.001);
    }

    @Test
    void calculateDistanceKm_KnownDistance_ReturnsAccurateKm() {
        // Mumbai (19.0760, 72.8777) to Pune (18.5204, 73.8567) is approx 120-130 km
        double distance = LocationUtil.calculateDistanceKm(19.0760, 72.8777, 18.5204, 73.8567);
        assertTrue(distance > 110.0 && distance < 140.0, "Distance should be approx 120-130 km");
    }

    @Test
    void isWithinRadius_ReturnsTrueWhenWithinRadius() {
        // 19.0760, 72.8777 and 19.0800, 72.8800 are within 1 km
        boolean within = LocationUtil.isWithinRadius(19.0760, 72.8777, 19.0800, 72.8800, 5.0);
        assertTrue(within);
    }

    @Test
    void isWithinRadius_ReturnsFalseWhenOutsideRadius() {
        // Mumbai to Pune is ~120km, check within 10km radius -> should be false
        boolean within = LocationUtil.isWithinRadius(19.0760, 72.8777, 18.5204, 73.8567, 10.0);
        assertFalse(within);
    }
}
