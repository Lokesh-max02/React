package com.mangalaarangam.service;

import com.mangalaarangam.dto.hall.HallRequest;
import com.mangalaarangam.dto.hall.HallResponse;
import com.mangalaarangam.entity.*;
import com.mangalaarangam.exception.ForbiddenException;
import com.mangalaarangam.exception.ResourceNotFoundException;
import com.mangalaarangam.repository.ReviewRepository;
import com.mangalaarangam.repository.WeddingHallRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HallService {

    private final WeddingHallRepository hallRepository;
    private final ReviewRepository reviewRepository;
    private final AvailabilityService availabilityService;

    /**
     * Public search endpoint. Only APPROVED, active halls are returned.
     * If a date is supplied, halls that are BOOKED/UNAVAILABLE/MAINTENANCE on
     * that date are excluded so the list only shows halls truly available for it.
     */
    @Transactional(readOnly = true)
    public List<HallResponse> search(String location, BigDecimal minPrice, BigDecimal maxPrice,
                                      Integer minCapacity, Double minRating, List<String> facilities,
                                      LocalDate date) {

        Specification<WeddingHall> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("approvalStatus"), ApprovalStatus.APPROVED));
            predicates.add(cb.isTrue(root.get("active")));

            if (location != null && !location.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }
            if (minPrice != null) predicates.add(cb.ge(root.get("price"), minPrice));
            if (maxPrice != null) predicates.add(cb.le(root.get("price"), maxPrice));
            if (minCapacity != null) predicates.add(cb.ge(root.get("guestCapacity"), minCapacity));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<WeddingHall> halls = hallRepository.findAll(spec);

        return halls.stream()
                .filter(h -> facilities == null || facilities.isEmpty() || h.getFacilities().containsAll(facilities))
                .filter(h -> date == null || availabilityService.getEffectiveStatus(h, date) == AvailabilityStatus.AVAILABLE)
                .map(this::toResponseWithRating)
                .filter(r -> minRating == null || (r.getAverageRating() != null && r.getAverageRating() >= minRating))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HallResponse getById(Long id) {
        WeddingHall hall = hallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."));
        return toResponseWithRating(hall);
    }

    @Transactional
    public HallResponse create(User owner, HallRequest request) {
        WeddingHall hall = WeddingHall.builder()
                .owner(owner)
                .name(request.getName())
                .description(request.getDescription())
                .location(request.getLocation())
                .address(request.getAddress())
                .googleMapLink(request.getGoogleMapLink())
                .price(request.getPrice())
                .guestCapacity(request.getGuestCapacity())
                .numberOfRooms(request.getNumberOfRooms())
                .parkingCapacity(request.getParkingCapacity())
                .mainImageUrl(request.getMainImageUrl())
                .galleryImages(request.getGalleryImages() != null ? request.getGalleryImages() : new ArrayList<>())
                .facilities(request.getFacilities() != null ? new java.util.HashSet<>(request.getFacilities()) : new java.util.HashSet<>())
                .approvalStatus(ApprovalStatus.PENDING) // must be approved by admin before going live
                .active(true)
                .build();

        return toResponseWithRating(hallRepository.save(hall));
    }

    @Transactional
    public HallResponse update(Long id, User requester, HallRequest request) {
        WeddingHall hall = hallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."));

        assertOwnerOrAdmin(hall, requester);

        hall.setName(request.getName());
        hall.setDescription(request.getDescription());
        hall.setLocation(request.getLocation());
        hall.setAddress(request.getAddress());
        hall.setGoogleMapLink(request.getGoogleMapLink());
        hall.setPrice(request.getPrice());
        hall.setGuestCapacity(request.getGuestCapacity());
        hall.setNumberOfRooms(request.getNumberOfRooms());
        hall.setParkingCapacity(request.getParkingCapacity());
        if (request.getMainImageUrl() != null) hall.setMainImageUrl(request.getMainImageUrl());
        if (request.getGalleryImages() != null) hall.setGalleryImages(request.getGalleryImages());
        if (request.getFacilities() != null) hall.setFacilities(new java.util.HashSet<>(request.getFacilities()));

        return toResponseWithRating(hallRepository.save(hall));
    }

    @Transactional
    public void delete(Long id, User requester) {
        WeddingHall hall = hallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."));
        assertOwnerOrAdmin(hall, requester);
        hallRepository.delete(hall);
    }

    @Transactional(readOnly = true)
    public List<HallResponse> getHallsForOwner(User owner) {
        return hallRepository.findByOwner(owner).stream()
                .map(this::toResponseWithRating)
                .collect(Collectors.toList());
    }

    private void assertOwnerOrAdmin(WeddingHall hall, User requester) {
        boolean isOwner = hall.getOwner().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == Role.ROLE_ADMIN;
        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("You do not have permission to modify this wedding hall.");
        }
    }

    private HallResponse toResponseWithRating(WeddingHall hall) {
        HallResponse response = HallResponse.from(hall);
        Double avg = reviewRepository.averageRatingForHall(hall);
        response.setAverageRating(avg);
        response.setReviewCount((long) reviewRepository.findByHallOrderByCreatedAtDesc(hall).size());
        return response;
    }
}
