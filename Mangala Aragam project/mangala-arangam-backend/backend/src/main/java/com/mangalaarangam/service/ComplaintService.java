package com.mangalaarangam.service;

import com.mangalaarangam.dto.complaint.ComplaintRequest;
import com.mangalaarangam.dto.complaint.ComplaintResponse;
import com.mangalaarangam.entity.*;
import com.mangalaarangam.exception.ResourceNotFoundException;
import com.mangalaarangam.repository.BookingRepository;
import com.mangalaarangam.repository.ComplaintRepository;
import com.mangalaarangam.repository.WeddingHallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final WeddingHallRepository hallRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    @Transactional
    public ComplaintResponse create(User customer, ComplaintRequest request) {
        WeddingHall hall = request.getHallId() != null
                ? hallRepository.findById(request.getHallId())
                    .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."))
                : null;

        Booking booking = request.getBookingId() != null
                ? bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found."))
                : null;

        Complaint complaint = Complaint.builder()
                .customer(customer)
                .hall(hall)
                .booking(booking)
                .type(request.getType())
                .description(request.getDescription())
                .status(ComplaintStatus.OPEN)
                .build();

        complaint = complaintRepository.save(complaint);

        notificationService.notifyAdmins("New complaint filed by " + customer.getFullName() + ": " + request.getType());

        return ComplaintResponse.from(complaint);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getForCustomer(User customer) {
        return complaintRepository.findByCustomerOrderByCreatedAtDesc(customer).stream()
                .map(ComplaintResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAll() {
        return complaintRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ComplaintResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse updateStatus(Long id, ComplaintStatus status, String resolutionNotes) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found."));
        complaint.setStatus(status);
        if (resolutionNotes != null) complaint.setResolutionNotes(resolutionNotes);
        complaint = complaintRepository.save(complaint);

        notificationService.notify(complaint.getCustomer(),
                "Your complaint status was updated to " + status + ".");

        return ComplaintResponse.from(complaint);
    }
}
