package com.mangalaarangam.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "wedding_halls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeddingHall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(length = 500)
    private String address;

    private String googleMapLink;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer guestCapacity;

    private Integer numberOfRooms;

    private Integer parkingCapacity;

    private String mainImageUrl;

    @ElementCollection
    @CollectionTable(name = "hall_images", joinColumns = @JoinColumn(name = "hall_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> galleryImages = new java.util.ArrayList<>();

    // Facilities: AC, Dining Hall, Stage, Parking, Generator, Rooms, Decoration, Catering, WiFi
    @ElementCollection
    @CollectionTable(name = "hall_facilities", joinColumns = @JoinColumn(name = "hall_id"))
    @Column(name = "facility")
    @Builder.Default
    private Set<String> facilities = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
