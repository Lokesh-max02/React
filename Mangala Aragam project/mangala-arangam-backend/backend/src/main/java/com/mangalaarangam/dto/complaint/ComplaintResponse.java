package com.mangalaarangam.dto.complaint;

import com.mangalaarangam.entity.Complaint;
import com.mangalaarangam.entity.ComplaintStatus;
import com.mangalaarangam.entity.ComplaintType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ComplaintResponse {
    private Long id;
    private String customerName;
    private String hallName;
    private Long bookingId;
    private ComplaintType type;
    private String description;
    private ComplaintStatus status;
    private String resolutionNotes;
    private LocalDateTime createdAt;

    public static ComplaintResponse from(Complaint c) {
        return ComplaintResponse.builder()
                .id(c.getId())
                .customerName(c.getCustomer().getFullName())
                .hallName(c.getHall() != null ? c.getHall().getName() : null)
                .bookingId(c.getBooking() != null ? c.getBooking().getId() : null)
                .type(c.getType())
                .description(c.getDescription())
                .status(c.getStatus())
                .resolutionNotes(c.getResolutionNotes())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
