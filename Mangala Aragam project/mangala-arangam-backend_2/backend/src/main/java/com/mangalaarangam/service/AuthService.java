package com.mangalaarangam.service;

import com.mangalaarangam.dto.auth.AuthResponse;
import com.mangalaarangam.dto.auth.LoginRequest;
import com.mangalaarangam.dto.auth.RegisterRequest;
import com.mangalaarangam.entity.Role;
import com.mangalaarangam.entity.User;
import com.mangalaarangam.exception.BadRequestException;
import com.mangalaarangam.exception.ConflictException;
import com.mangalaarangam.repository.UserRepository;
import com.mangalaarangam.security.JwtService;
import com.mangalaarangam.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("An account with this email already exists.");
        }
        if (!otpService.isRecentlyVerified(request.getEmail())) {
            throw new BadRequestException("Please verify your email with the OTP sent to it before registering.");
        }
        if (request.getRole() == Role.ROLE_ADMIN) {
            throw new BadRequestException("Admin accounts cannot be self-registered.");
        }
        if (request.getRole() == Role.ROLE_OWNER &&
                (request.getBusinessName() == null || request.getBusinessName().isBlank())) {
            throw new BadRequestException("Business name is required for hall owner accounts.");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .address(request.getAddress())
                .businessName(request.getRole() == Role.ROLE_OWNER ? request.getBusinessName() : null)
                .role(request.getRole())
                .active(true)
                .build();

        user = userRepository.save(user);

        String token = jwtService.generateToken(new UserPrincipal(user), Map.of(
                "role", user.getRole().name(),
                "name", user.getFullName()
        ));

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        if (!user.isActive()) {
            throw new BadRequestException("This account has been deactivated. Please contact support.");
        }

        String token = jwtService.generateToken(new UserPrincipal(user), Map.of(
                "role", user.getRole().name(),
                "name", user.getFullName()
        ));

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
