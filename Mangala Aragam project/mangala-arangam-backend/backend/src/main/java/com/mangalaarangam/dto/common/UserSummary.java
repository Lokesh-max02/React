package com.mangalaarangam.dto.common;

import com.mangalaarangam.entity.Role;
import com.mangalaarangam.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSummary {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String businessName;
    private Role role;
    private boolean active;

    public static UserSummary from(User u) {
        return UserSummary.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .address(u.getAddress())
                .businessName(u.getBusinessName())
                .role(u.getRole())
                .active(u.isActive())
                .build();
    }
}
