package com.mangalaarangam.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
    name = "hall_availability",
    uniqueConstraints = @UniqueConstraint(name = "uq_hall_date", columnNames = {"hall_id", "date"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HallAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hall_id", nullable = false)
    private WeddingHall hall;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AvailabilityStatus status;

    // Set when status is BOOKING_PENDING / BOOKED, links back to the booking driving this date
    @Column(name = "booking_id")
    private Long bookingId;
}
