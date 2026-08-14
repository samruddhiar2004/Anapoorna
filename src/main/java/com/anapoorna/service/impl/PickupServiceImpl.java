package com.anapoorna.service.impl;

import com.anapoorna.dto.pickup.PickupAssignRequest;
import com.anapoorna.dto.pickup.PickupResponse;
import com.anapoorna.dto.pickup.PickupStatusUpdateRequest;
import com.anapoorna.entity.*;
import com.anapoorna.exception.BadRequestException;
import com.anapoorna.exception.ResourceNotFoundException;
import com.anapoorna.mapper.PickupMapper;
import com.anapoorna.repository.FoodDonationRepository;
import com.anapoorna.repository.PickupAssignmentRepository;
import com.anapoorna.repository.UserRepository;
import com.anapoorna.service.PickupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PickupServiceImpl implements PickupService {

    private final PickupAssignmentRepository pickupRepository;
    private final FoodDonationRepository donationRepository;
    private final UserRepository userRepository;
    private final PickupMapper pickupMapper;

    @Autowired
    public PickupServiceImpl(PickupAssignmentRepository pickupRepository,
                             FoodDonationRepository donationRepository,
                             UserRepository userRepository,
                             PickupMapper pickupMapper) {
        this.pickupRepository = pickupRepository;
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
        this.pickupMapper = pickupMapper;
    }

    @Override
    @Transactional
    public PickupResponse assignPickup(PickupAssignRequest request, String ngoEmail) {
        User ngo = userRepository.findByEmail(ngoEmail)
                .orElseThrow(() -> new ResourceNotFoundException("NGO user not found: " + ngoEmail));

        FoodDonation donation = donationRepository.findById(request.getDonationId())
                .orElseThrow(() -> new ResourceNotFoundException("Food donation not found with ID: " + request.getDonationId()));

        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new BadRequestException("Donation is not available for pickup (Current status: " + donation.getStatus() + ")");
        }

        User volunteer = null;
        if (request.getVolunteerId() != null) {
            volunteer = userRepository.findById(request.getVolunteerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found with ID: " + request.getVolunteerId()));
        }

        donation.setStatus(DonationStatus.ASSIGNED);
        donationRepository.save(donation);

        PickupAssignment assignment = PickupAssignment.builder()
                .donation(donation)
                .ngo(ngo)
                .volunteer(volunteer)
                .status(PickupStatus.ASSIGNED)
                .remarks(request.getRemarks())
                .build();

        PickupAssignment saved = pickupRepository.save(assignment);
        return pickupMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public PickupResponse updatePickupStatus(Long pickupId, PickupStatusUpdateRequest request, String userEmail) {
        PickupAssignment pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup assignment not found with ID: " + pickupId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        pickup.setStatus(request.getStatus());
        if (request.getRemarks() != null) {
            pickup.setRemarks(request.getRemarks());
        }

        FoodDonation donation = pickup.getDonation();

        if (request.getStatus() == PickupStatus.IN_TRANSIT) {
            pickup.setPickedUpAt(LocalDateTime.now());
            donation.setStatus(DonationStatus.PICKED_UP);
        } else if (request.getStatus() == PickupStatus.COMPLETED) {
            pickup.setDeliveredAt(LocalDateTime.now());
            donation.setStatus(DonationStatus.DELIVERED);
        } else if (request.getStatus() == PickupStatus.FAILED) {
            donation.setStatus(DonationStatus.AVAILABLE); // Re-open for pickup
        }

        donationRepository.save(donation);
        PickupAssignment updated = pickupRepository.save(pickup);

        return pickupMapper.toDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public PickupResponse getPickupById(Long pickupId) {
        PickupAssignment pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup assignment not found with ID: " + pickupId));
        return pickupMapper.toDTO(pickup);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PickupResponse> getMyPickups(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        List<PickupAssignment> list;
        if (user.getRole() == Role.VOLUNTEER) {
            list = pickupRepository.findByVolunteerOrderByAssignedAtDesc(user);
        } else {
            list = pickupRepository.findByNgoOrderByAssignedAtDesc(user);
        }

        return list.stream()
                .map(pickupMapper::toDTO)
                .collect(Collectors.toList());
    }
}
