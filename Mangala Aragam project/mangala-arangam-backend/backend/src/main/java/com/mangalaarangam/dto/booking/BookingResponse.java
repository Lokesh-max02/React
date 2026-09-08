package com.mangalaarangam.dto.booking;

import com.mangalaarangam.entity.Booking;
import com.mangalaarangam.entity.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private Long hallId;
    private String hallName;
    private String hallLocation;
    private String ownerName;
    private String ownerPhone;
    private Long customerId;
    private String customerName;
    private LocalDate eventDate;
    private String eventType;
    private Integer guests;
    private String contactName;
    private String contactPhone;
    private String contactEmail;
    private String additionalRequirements;
    private BigDecimal hallPrice;
    private BigDecimal additionalCharges;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private String paymentStatus; // convenience field, populated by service
    private LocalDateTime createdAt;

    public static BookingResponse from(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .hallId(b.getHall().getId())
                .hallName(b.getHall().getName())
                .hallLocation(b.getHall().getLocation())
                .ownerName(b.getHall().getOwner().getFullName())
                .ownerPhone(b.getHall().getOwner().getPhone())
                .customerId(b.getCustomer().getId())
                .customerName(b.getCustomer().getFullName())
                .eventDate(b.getEventDate())
                .eventType(b.getEventType())
                .guests(b.getGuests())
                .contactName(b.getContactName())
                .contactPhone(b.getContactPhone())
                .contactEmail(b.getContactEmail())
                .additionalRequirements(b.getAdditionalRequirements())
                .hallPrice(b.getHallPrice())
                .additionalCharges(b.getAdditionalCharges())
                .totalAmount(b.getTotalAmount())
                .status(b.getStatus())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
