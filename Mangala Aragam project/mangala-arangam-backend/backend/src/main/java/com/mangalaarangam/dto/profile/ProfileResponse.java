package com.mangalaarangam.dto.profile;

import com.mangalaarangam.entity.Role;
import com.mangalaarangam.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String businessName;
    private String profileImageUrl;
    private Role role;

    public static ProfileResponse from(User u) {
        return ProfileResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .address(u.getAddress())
                .businessName(u.getBusinessName())
                .profileImageUrl(u.getProfileImageUrl())
                .role(u.getRole())
                .build();
    }
}
