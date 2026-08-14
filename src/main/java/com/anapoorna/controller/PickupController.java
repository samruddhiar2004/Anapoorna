package com.anapoorna.controller;

import com.anapoorna.dto.pickup.PickupAssignRequest;
import com.anapoorna.dto.pickup.PickupResponse;
import com.anapoorna.dto.pickup.PickupStatusUpdateRequest;
import com.anapoorna.service.PickupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickups")
public class PickupController {

    private final PickupService pickupService;

    @Autowired
    public PickupController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<PickupResponse> assignPickup(@Valid @RequestBody PickupAssignRequest request,
                                                       Authentication authentication) {
        PickupResponse response = pickupService.assignPickup(request, authentication.getName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PickupResponse> updateStatus(@PathVariable Long id,
                                                        @Valid @RequestBody PickupStatusUpdateRequest request,
                                                        Authentication authentication) {
        PickupResponse response = pickupService.updatePickupStatus(id, request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PickupResponse> getPickupById(@PathVariable Long id) {
        return ResponseEntity.ok(pickupService.getPickupById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<PickupResponse>> getMyPickups(Authentication authentication) {
        return ResponseEntity.ok(pickupService.getMyPickups(authentication.getName()));
    }
}
