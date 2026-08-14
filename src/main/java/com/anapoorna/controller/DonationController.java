package com.anapoorna.controller;

import com.anapoorna.dto.donation.CreateDonationRequest;
import com.anapoorna.dto.donation.DonationResponse;
import com.anapoorna.dto.donation.NearbyDonationDTO;
import com.anapoorna.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    @Autowired
    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('DONOR') or hasRole('ADMIN')")
    public ResponseEntity<DonationResponse> createDonation(@Valid @RequestBody CreateDonationRequest request,
                                                           Authentication authentication) {
        DonationResponse response = donationService.createDonation(request, authentication.getName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DonationResponse>> getAllDonations() {
        return ResponseEntity.ok(donationService.getAllDonations());
    }

    @GetMapping("/my")
    public ResponseEntity<List<DonationResponse>> getMyDonations(Authentication authentication) {
        return ResponseEntity.ok(donationService.getMyDonations(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationResponse> getDonationById(@PathVariable Long id) {
        return ResponseEntity.ok(donationService.getDonationById(id));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<NearbyDonationDTO>> findNearbyDonations(@RequestParam double latitude,
                                                                       @RequestParam double longitude,
                                                                       @RequestParam(defaultValue = "10.0") double radiusKm) {
        List<NearbyDonationDTO> nearby = donationService.findNearbyDonations(latitude, longitude, radiusKm);
        return ResponseEntity.ok(nearby);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<DonationResponse> cancelDonation(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(donationService.cancelDonation(id, authentication.getName()));
    }
}
