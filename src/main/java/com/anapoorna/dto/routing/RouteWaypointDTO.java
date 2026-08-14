package com.anapoorna.dto.routing;

import com.anapoorna.dto.donation.DonationResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteWaypointDTO {

    private Integer sequenceOrder;
    private DonationResponse donation;
    private Double distanceFromPreviousKm;
    private Double cumulativeDistanceKm;

    public Integer getSequenceOrder() { return sequenceOrder; }
    public void setSequenceOrder(Integer sequenceOrder) { this.sequenceOrder = sequenceOrder; }

    public DonationResponse getDonation() { return donation; }
    public void setDonation(DonationResponse donation) { this.donation = donation; }

    public Double getDistanceFromPreviousKm() { return distanceFromPreviousKm; }
    public void setDistanceFromPreviousKm(Double distanceFromPreviousKm) { this.distanceFromPreviousKm = distanceFromPreviousKm; }

    public Double getCumulativeDistanceKm() { return cumulativeDistanceKm; }
    public void setCumulativeDistanceKm(Double cumulativeDistanceKm) { this.cumulativeDistanceKm = cumulativeDistanceKm; }
}
