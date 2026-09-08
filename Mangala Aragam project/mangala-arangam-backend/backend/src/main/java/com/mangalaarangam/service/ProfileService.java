package com.mangalaarangam.service;

import com.mangalaarangam.dto.profile.ProfileResponse;
import com.mangalaarangam.dto.profile.ProfileUpdateRequest;
import com.mangalaarangam.entity.Role;
import com.mangalaarangam.entity.User;
import com.mangalaarangam.exception.BadRequestException;
import com.mangalaarangam.exception.ResourceNotFoundException;
import com.mangalaarangam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileResponse getProfile(Long userId) {
        User user = findUser(userId);
        return ProfileResponse.from(user);
    }

    @Transactional
    public ProfileResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = findUser(userId);

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setProfileImageUrl(request.getProfileImageUrl());

        if (user.getRole() == Role.ROLE_OWNER) {
            if (request.getBusinessName() == null || request.getBusinessName().isBlank()) {
                throw new BadRequestException("Business name is required for hall owner accounts.");
            }
            user.setBusinessName(request.getBusinessName());
        }

        boolean wantsPasswordChange = request.getNewPassword() != null && !request.getNewPassword().isBlank();
        if (wantsPasswordChange) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new BadRequestException("Current password is required to set a new password.");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("Current password is incorrect.");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        user = userRepository.save(user);
        return ProfileResponse.from(user);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }
}
