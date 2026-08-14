package com.anapoorna.controller;

import com.anapoorna.dto.user.UserDTO;
import com.anapoorna.entity.User;
import com.anapoorna.exception.ResourceNotFoundException;
import com.anapoorna.mapper.UserMapper;
import com.anapoorna.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    public UserController(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));
        return ResponseEntity.ok(userMapper.toDTO(user));
    }

    @PutMapping("/location")
    public ResponseEntity<UserDTO> updateLocation(@RequestParam double latitude,
                                                  @RequestParam double longitude,
                                                  Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        user.setLatitude(latitude);
        user.setLongitude(longitude);
        User updated = userRepository.save(user);

        return ResponseEntity.ok(userMapper.toDTO(updated));
    }
}
