package com.anapoorna.service;

import com.anapoorna.dto.auth.AuthResponse;
import com.anapoorna.dto.auth.LoginRequest;
import com.anapoorna.dto.auth.RegisterRequest;
import com.anapoorna.entity.Role;
import com.anapoorna.entity.User;
import com.anapoorna.exception.BadRequestException;
import com.anapoorna.mapper.UserMapper;
import com.anapoorna.repository.UserRepository;
import com.anapoorna.security.JwtTokenProvider;
import com.anapoorna.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .name("John Donor")
                .email("john@donor.com")
                .password("password123")
                .role(Role.DONOR)
                .build();

        loginRequest = LoginRequest.builder()
                .email("john@donor.com")
                .password("password123")
                .build();

        user = User.builder()
                .id(1L)
                .name("John Donor")
                .email("john@donor.com")
                .password("encoded_password")
                .role(Role.DONOR)
                .build();
    }

    @Test
    void register_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userMapper.toEntity(any(RegisterRequest.class))).thenReturn(user);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(tokenProvider.generateTokenFromEmail(anyString())).thenReturn("jwt_mock_token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("jwt_mock_token", response.getToken());
        assertEquals("john@donor.com", response.getEmail());
        assertEquals(Role.DONOR, response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsBadRequestException() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("jwt_login_token");
        when(userRepository.findByEmail("john@donor.com")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("jwt_login_token", response.getToken());
        assertEquals("john@donor.com", response.getEmail());
    }
}
