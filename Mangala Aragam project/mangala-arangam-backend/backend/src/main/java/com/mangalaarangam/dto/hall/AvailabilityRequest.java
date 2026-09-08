package com.mangalaarangam.dto.hall;

import com.mangalaarangam.entity.AvailabilityStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AvailabilityRequest {
    @NotNull
    private LocalDate date;

    @NotNull
    private AvailabilityStatus status;
}
