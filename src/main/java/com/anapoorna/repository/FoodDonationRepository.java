package com.anapoorna.repository;

import com.anapoorna.entity.DonationStatus;
import com.anapoorna.entity.FoodDonation;
import com.anapoorna.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FoodDonationRepository extends JpaRepository<FoodDonation, Long> {

    List<FoodDonation> findByDonorOrderByCreatedAtDesc(User donor);

    List<FoodDonation> findByStatusOrderByCreatedAtDesc(DonationStatus status);

    List<FoodDonation> findByStatusAndExpiryTimeAfter(DonationStatus status, LocalDateTime now);

    @Query("SELECT f FROM FoodDonation f WHERE f.status = :status AND f.expiryTime > :now")
    List<FoodDonation> findActiveDonations(DonationStatus status, LocalDateTime now);
}
