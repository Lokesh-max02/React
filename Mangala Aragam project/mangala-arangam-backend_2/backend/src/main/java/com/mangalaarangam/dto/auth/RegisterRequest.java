package com.mangalaarangam.dto.auth;

import com.mangalaarangam.entity.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String fullName;

    @NotBlank @Email
    private String email;

    @NotBlank
    private String phone;

    @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String address;

    // Required only when role = ROLE_OWNER
    private String businessName;

    @NotNull
    private Role role; // ROLE_CUSTOMER or ROLE_OWNER (ROLE_ADMIN cannot self-register)
}
