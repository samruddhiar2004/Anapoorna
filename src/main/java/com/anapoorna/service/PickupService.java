package com.anapoorna.service;

import com.anapoorna.dto.pickup.PickupAssignRequest;
import com.anapoorna.dto.pickup.PickupResponse;
import com.anapoorna.dto.pickup.PickupStatusUpdateRequest;

import java.util.List;

public interface PickupService {

    PickupResponse assignPickup(PickupAssignRequest request, String ngoEmail);

    PickupResponse updatePickupStatus(Long pickupId, PickupStatusUpdateRequest request, String userEmail);

    PickupResponse getPickupById(Long pickupId);

    List<PickupResponse> getMyPickups(String userEmail);
}
