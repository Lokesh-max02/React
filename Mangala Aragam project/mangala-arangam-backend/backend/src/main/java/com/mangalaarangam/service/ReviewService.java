package com.mangalaarangam.service;

import com.mangalaarangam.dto.review.ReviewRequest;
import com.mangalaarangam.dto.review.ReviewResponse;
import com.mangalaarangam.entity.Booking;
import com.mangalaarangam.entity.BookingStatus;
import com.mangalaarangam.entity.Review;
import com.mangalaarangam.entity.User;
import com.mangalaarangam.entity.WeddingHall;
import com.mangalaarangam.exception.BadRequestException;
import com.mangalaarangam.exception.ForbiddenException;
import com.mangalaarangam.exception.ResourceNotFoundException;
import com.mangalaarangam.repository.BookingRepository;
import com.mangalaarangam.repository.ReviewRepository;
import com.mangalaarangam.repository.WeddingHallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final WeddingHallRepository hallRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    @Transactional
    public ReviewResponse create(User customer, ReviewRequest request) {
        WeddingHall hall = hallRepository.findById(request.getHallId())
                .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."));

        if (request.getBookingId() != null) {
            Booking booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));

            if (!booking.getCustomer().getId().equals(customer.getId())) {
                throw new ForbiddenException("This booking does not belong to you.");
            }
            if (booking.getStatus() != BookingStatus.COMPLETED) {
                throw new BadRequestException("You can only review a hall after your booking is completed.");
            }
            if (reviewRepository.existsByBooking_Id(booking.getId())) {
                throw new BadRequestException("You have already reviewed this booking.");
            }
        }

        Review review = Review.builder()
                .hall(hall)
                .customer(customer)
                .booking(request.getBookingId() != null
                        ? bookingRepository.findById(request.getBookingId()).orElse(null)
                        : null)
                .rating(request.getRating())
                .text(request.getText())
                .build();

        review = reviewRepository.save(review);

        notificationService.notify(hall.getOwner(),
                customer.getFullName() + " left a " + request.getRating() + "-star review for " + hall.getName() + ".");

        return ReviewResponse.from(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getForHall(Long hallId) {
        WeddingHall hall = hallRepository.findById(hallId)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."));
        return reviewRepository.findByHallOrderByCreatedAtDesc(hall).stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getForOwner(User owner) {
        return reviewRepository.findByHallOwnerOrderByCreatedAtDesc(owner).stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }
}
