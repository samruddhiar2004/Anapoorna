package com.anapoorna.repository;

import com.anapoorna.entity.FoodDonation;
import com.anapoorna.entity.PickupAssignment;
import com.anapoorna.entity.PickupStatus;
import com.anapoorna.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupAssignmentRepository extends JpaRepository<PickupAssignment, Long> {

    Optional<PickupAssignment> findByDonation(FoodDonation donation);

    List<PickupAssignment> findByNgoOrderByAssignedAtDesc(User ngo);

    List<PickupAssignment> findByVolunteerOrderByAssignedAtDesc(User volunteer);

    List<PickupAssignment> findByStatus(PickupStatus status);
}
