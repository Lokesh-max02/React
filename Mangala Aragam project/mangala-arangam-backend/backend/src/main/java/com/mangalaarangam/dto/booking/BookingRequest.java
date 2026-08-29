package com.mangalaarangam.dto.booking;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {

    @NotNull
    private Long hallId;

    @NotNull @Future(message = "Event date must be in the future")
    private LocalDate eventDate;

    @NotBlank
    private String eventType;

    @NotNull @Min(1)
    private Integer guests;

    @NotBlank
    private String contactName;

    @NotBlank
    private String contactPhone;

    @NotBlank @Email
    private String contactEmail;

    private String additionalRequirements;
}
