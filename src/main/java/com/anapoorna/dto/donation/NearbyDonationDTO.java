package com.anapoorna.dto.donation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NearbyDonationDTO {

    private DonationResponse donation;
    private Double distanceKm;

    public DonationResponse getDonation() { return donation; }
    public void setDonation(DonationResponse donation) { this.donation = donation; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
}
