package com.anapoorna.dto.pickup;

import com.anapoorna.dto.donation.DonationResponse;
import com.anapoorna.dto.user.UserDTO;
import com.anapoorna.entity.PickupStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PickupResponse {

    private Long id;
    private DonationResponse donation;
    private UserDTO ngo;
    private UserDTO volunteer;
    private PickupStatus status;
    private LocalDateTime assignedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private String remarks;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public DonationResponse getDonation() { return donation; }
    public void setDonation(DonationResponse donation) { this.donation = donation; }

    public UserDTO getNgo() { return ngo; }
    public void setNgo(UserDTO ngo) { this.ngo = ngo; }

    public UserDTO getVolunteer() { return volunteer; }
    public void setVolunteer(UserDTO volunteer) { this.volunteer = volunteer; }

    public PickupStatus getStatus() { return status; }
    public void setStatus(PickupStatus status) { this.status = status; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getPickedUpAt() { return pickedUpAt; }
    public void setPickedUpAt(LocalDateTime pickedUpAt) { this.pickedUpAt = pickedUpAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
