package com.anapoorna.mapper;

import com.anapoorna.dto.pickup.PickupResponse;
import com.anapoorna.entity.PickupAssignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PickupMapper {

    private final DonationMapper donationMapper;
    private final UserMapper userMapper;

    @Autowired
    public PickupMapper(DonationMapper donationMapper, UserMapper userMapper) {
        this.donationMapper = donationMapper;
        this.userMapper = userMapper;
    }

    public PickupResponse toDTO(PickupAssignment assignment) {
        if (assignment == null) {
            return null;
        }
        return PickupResponse.builder()
                .id(assignment.getId())
                .donation(donationMapper.toDTO(assignment.getDonation()))
                .ngo(userMapper.toDTO(assignment.getNgo()))
                .volunteer(userMapper.toDTO(assignment.getVolunteer()))
                .status(assignment.getStatus())
                .assignedAt(assignment.getAssignedAt())
                .pickedUpAt(assignment.getPickedUpAt())
                .deliveredAt(assignment.getDeliveredAt())
                .remarks(assignment.getRemarks())
                .build();
    }
}
