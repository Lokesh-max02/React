package com.mangalaarangam.dto.complaint;

import com.mangalaarangam.entity.ComplaintType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintRequest {
    @NotNull
    private ComplaintType type;

    private Long hallId;
    private Long bookingId;

    @NotBlank
    private String description;
}
