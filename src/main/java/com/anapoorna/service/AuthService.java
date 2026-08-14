package com.anapoorna.service;

import com.anapoorna.dto.auth.AuthResponse;
import com.anapoorna.dto.auth.LoginRequest;
import com.anapoorna.dto.auth.RegisterRequest;
import com.anapoorna.dto.user.UserDTO;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserDTO getCurrentUser(String email);
}
