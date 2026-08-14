package com.anapoorna.dto.routing;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteOptimizationRequest {

    @NotNull(message = "Start latitude is required")
    private Double startLatitude;

    @NotNull(message = "Start longitude is required")
    private Double startLongitude;

    @NotEmpty(message = "Donation IDs list cannot be empty")
    private List<Long> donationIds;

    public Double getStartLatitude() { return startLatitude; }
    public void setStartLatitude(Double startLatitude) { this.startLatitude = startLatitude; }

    public Double getStartLongitude() { return startLongitude; }
    public void setStartLongitude(Double startLongitude) { this.startLongitude = startLongitude; }

    public List<Long> getDonationIds() { return donationIds; }
    public void setDonationIds(List<Long> donationIds) { this.donationIds = donationIds; }
}
