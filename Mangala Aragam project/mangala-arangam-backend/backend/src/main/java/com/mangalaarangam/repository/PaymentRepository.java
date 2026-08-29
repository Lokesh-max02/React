package com.mangalaarangam.repository;

import com.mangalaarangam.entity.Booking;
import com.mangalaarangam.entity.Payment;
import com.mangalaarangam.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBooking(Booking booking);
    List<Payment> findByBooking_Customer(User customer);
    List<Payment> findByBooking_Hall_Owner(User owner);
}
