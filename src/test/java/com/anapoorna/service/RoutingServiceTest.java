package com.anapoorna.service;

import com.anapoorna.dto.donation.DonationResponse;
import com.anapoorna.dto.routing.RouteOptimizationRequest;
import com.anapoorna.dto.routing.RouteOptimizationResponse;
import com.anapoorna.entity.FoodDonation;
import com.anapoorna.entity.FoodType;
import com.anapoorna.mapper.DonationMapper;
import com.anapoorna.repository.FoodDonationRepository;
import com.anapoorna.service.impl.RoutingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoutingServiceTest {

    @Mock
    private FoodDonationRepository donationRepository;

    @Mock
    private DonationMapper donationMapper;

    @InjectMocks
    private RoutingServiceImpl routingService;

    private FoodDonation donation1;
    private FoodDonation donation2;

    @BeforeEach
    void setUp() {
        donation1 = FoodDonation.builder()
                .id(1L)
                .title("Cooked Meals")
                .foodType(FoodType.COOKED_MEAL)
                .pickupLatitude(19.0800)
                .pickupLongitude(72.8800)
                .build();

        donation2 = FoodDonation.builder()
                .id(2L)
                .title("Bakery Items")
                .foodType(FoodType.BAKERY)
                .pickupLatitude(19.2000)
                .pickupLongitude(72.9500)
                .build();
    }

    @Test
    void optimizeRoute_ReturnsGreedyShortestSequence() {
        when(donationRepository.findAllById(List.of(1L, 2L))).thenReturn(List.of(donation1, donation2));
        when(donationMapper.toDTO(donation1)).thenReturn(DonationResponse.builder().id(1L).title("Cooked Meals").build());
        when(donationMapper.toDTO(donation2)).thenReturn(DonationResponse.builder().id(2L).title("Bakery Items").build());

        RouteOptimizationRequest request = RouteOptimizationRequest.builder()
                .startLatitude(19.0760)
                .startLongitude(72.8777)
                .donationIds(List.of(1L, 2L))
                .build();

        RouteOptimizationResponse response = routingService.optimizeRoute(request);

        assertNotNull(response);
        assertEquals(2, response.getTotalStops());
        assertTrue(response.getTotalDistanceKm() > 0);
        assertEquals(1, response.getWaypoints().get(0).getSequenceOrder());
        assertEquals(1L, response.getWaypoints().get(0).getDonation().getId());
    }
}
