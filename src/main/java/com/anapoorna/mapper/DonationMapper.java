package com.anapoorna.mapper;

import com.anapoorna.dto.donation.CreateDonationRequest;
import com.anapoorna.dto.donation.DonationResponse;
import com.anapoorna.entity.DonationStatus;
import com.anapoorna.entity.FoodDonation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DonationMapper {

    private final UserMapper userMapper;

    @Autowired
    public DonationMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public FoodDonation toEntity(CreateDonationRequest request) {
        if (request == null) {
            return null;
        }
        return FoodDonation.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .foodType(request.getFoodType())
                .quantityKg(request.getQuantityKg())
                .servings(request.getServings())
                .expiryTime(request.getExpiryTime())
                .pickupAddress(request.getPickupAddress())
                .pickupLatitude(request.getPickupLatitude())
                .pickupLongitude(request.getPickupLongitude())
                .status(DonationStatus.AVAILABLE)
                .build();
    }

    public DonationResponse toDTO(FoodDonation donation) {
        if (donation == null) {
            return null;
        }
        return DonationResponse.builder()
                .id(donation.getId())
                .donor(userMapper.toDTO(donation.getDonor()))
                .title(donation.getTitle())
                .description(donation.getDescription())
                .foodType(donation.getFoodType())
                .quantityKg(donation.getQuantityKg())
                .servings(donation.getServings())
                .expiryTime(donation.getExpiryTime())
                .pickupAddress(donation.getPickupAddress())
                .pickupLatitude(donation.getPickupLatitude())
                .pickupLongitude(donation.getPickupLongitude())
                .status(donation.getStatus())
                .createdAt(donation.getCreatedAt())
                .build();
    }
}
