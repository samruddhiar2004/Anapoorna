package com.anapoorna.service.impl;

import com.anapoorna.dto.donation.CreateDonationRequest;
import com.anapoorna.dto.donation.DonationResponse;
import com.anapoorna.dto.donation.NearbyDonationDTO;
import com.anapoorna.entity.DonationStatus;
import com.anapoorna.entity.FoodDonation;
import com.anapoorna.entity.Role;
import com.anapoorna.entity.User;
import com.anapoorna.exception.BadRequestException;
import com.anapoorna.exception.ResourceNotFoundException;
import com.anapoorna.mapper.DonationMapper;
import com.anapoorna.repository.FoodDonationRepository;
import com.anapoorna.repository.UserRepository;
import com.anapoorna.service.DonationService;
import com.anapoorna.util.LocationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationServiceImpl implements DonationService {

    private final FoodDonationRepository donationRepository;
    private final UserRepository userRepository;
    private final DonationMapper donationMapper;

    @Autowired
    public DonationServiceImpl(FoodDonationRepository donationRepository,
                               UserRepository userRepository,
                               DonationMapper donationMapper) {
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
        this.donationMapper = donationMapper;
    }

    @Override
    @Transactional
    public DonationResponse createDonation(CreateDonationRequest request, String donorEmail) {
        User donor = userRepository.findByEmail(donorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email: " + donorEmail));

        FoodDonation donation = donationMapper.toEntity(request);
        donation.setDonor(donor);

        FoodDonation saved = donationRepository.save(donation);
        return donationMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonationResponse> getAllDonations() {
        return donationRepository.findAll().stream()
                .map(donationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonationResponse> getMyDonations(String donorEmail) {
        User donor = userRepository.findByEmail(donorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + donorEmail));

        return donationRepository.findByDonorOrderByCreatedAtDesc(donor).stream()
                .map(donationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DonationResponse getDonationById(Long id) {
        FoodDonation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food donation not found with ID: " + id));
        return donationMapper.toDTO(donation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NearbyDonationDTO> findNearbyDonations(double latitude, double longitude, double radiusKm) {
        LocalDateTime now = LocalDateTime.now();
        List<FoodDonation> activeDonations = donationRepository.findActiveDonations(DonationStatus.AVAILABLE, now);

        return activeDonations.stream()
                .filter(d -> LocationUtil.isWithinRadius(latitude, longitude, d.getPickupLatitude(), d.getPickupLongitude(), radiusKm))
                .map(d -> {
                    double distance = LocationUtil.calculateDistanceKm(latitude, longitude, d.getPickupLatitude(), d.getPickupLongitude());
                    return NearbyDonationDTO.builder()
                            .donation(donationMapper.toDTO(d))
                            .distanceKm(Math.round(distance * 100.0) / 100.0)
                            .build();
                })
                .sorted(Comparator.comparingDouble(NearbyDonationDTO::getDistanceKm))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DonationResponse cancelDonation(Long id, String userEmail) {
        FoodDonation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food donation not found with ID: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        if (!donation.getDonor().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new BadRequestException("You are not authorized to cancel this donation");
        }

        if (donation.getStatus() == DonationStatus.DELIVERED || donation.getStatus() == DonationStatus.CANCELLED) {
            throw new BadRequestException("Cannot cancel a donation that is already " + donation.getStatus());
        }

        donation.setStatus(DonationStatus.CANCELLED);
        FoodDonation updated = donationRepository.save(donation);
        return donationMapper.toDTO(updated);
    }
}
