package com.anapoorna.service;

import com.anapoorna.dto.donation.CreateDonationRequest;
import com.anapoorna.dto.donation.DonationResponse;
import com.anapoorna.dto.donation.NearbyDonationDTO;

import java.util.List;

public interface DonationService {

    DonationResponse createDonation(CreateDonationRequest request, String donorEmail);

    List<DonationResponse> getAllDonations();

    List<DonationResponse> getMyDonations(String donorEmail);

    DonationResponse getDonationById(Long id);

    List<NearbyDonationDTO> findNearbyDonations(double latitude, double longitude, double radiusKm);

    DonationResponse cancelDonation(Long id, String userEmail);
}
