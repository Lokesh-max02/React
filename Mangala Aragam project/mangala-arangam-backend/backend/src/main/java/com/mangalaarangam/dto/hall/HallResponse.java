package com.mangalaarangam.dto.hall;

import com.mangalaarangam.entity.ApprovalStatus;
import com.mangalaarangam.entity.WeddingHall;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Builder
public class HallResponse {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String ownerPhone;
    private String businessName;

    private String name;
    private String description;
    private String location;
    private String address;
    private String googleMapLink;
    private BigDecimal price;
    private Integer guestCapacity;
    private Integer numberOfRooms;
    private Integer parkingCapacity;
    private String mainImageUrl;
    private List<String> galleryImages;
    private Set<String> facilities;
    private ApprovalStatus approvalStatus;
    private boolean active;
    private Double averageRating;
    private Long reviewCount;

    public static HallResponse from(WeddingHall h) {
        return HallResponse.builder()
                .id(h.getId())
                .ownerId(h.getOwner().getId())
                .ownerName(h.getOwner().getFullName())
                .ownerPhone(h.getOwner().getPhone())
                .businessName(h.getOwner().getBusinessName())
                .name(h.getName())
                .description(h.getDescription())
                .location(h.getLocation())
                .address(h.getAddress())
                .googleMapLink(h.getGoogleMapLink())
                .price(h.getPrice())
                .guestCapacity(h.getGuestCapacity())
                .numberOfRooms(h.getNumberOfRooms())
                .parkingCapacity(h.getParkingCapacity())
                .mainImageUrl(h.getMainImageUrl())
                .galleryImages(new ArrayList<>(h.getGalleryImages()))
                .facilities(new HashSet<>(h.getFacilities()))
                .approvalStatus(h.getApprovalStatus())
                .active(h.isActive())
                .build();
    }
}