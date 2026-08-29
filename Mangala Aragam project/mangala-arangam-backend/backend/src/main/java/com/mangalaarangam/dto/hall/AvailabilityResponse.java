package com.mangalaarangam.dto.hall;

import com.mangalaarangam.entity.AvailabilityStatus;
import com.mangalaarangam.entity.HallAvailability;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class AvailabilityResponse {
    private LocalDate date;
    private AvailabilityStatus status;
    private Long bookingId;

    public static AvailabilityResponse from(HallAvailability a) {
        return AvailabilityResponse.builder()
                .date(a.getDate())
                .status(a.getStatus())
                .bookingId(a.getBookingId())
                .build();
    }
}
