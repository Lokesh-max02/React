package com.mangalaarangam.repository;

import com.mangalaarangam.entity.Booking;
import com.mangalaarangam.entity.BookingStatus;
import com.mangalaarangam.entity.User;
import com.mangalaarangam.entity.WeddingHall;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Booking> findByHallOwnerOrderByCreatedAtDesc(User owner);
    List<Booking> findByHallOwnerAndStatusOrderByCreatedAtDesc(User owner, BookingStatus status);
    List<Booking> findByHall(WeddingHall hall);
    long countByHallOwnerAndStatus(User owner, BookingStatus status);
    long countByStatus(BookingStatus status);

    @org.springframework.data.jpa.repository.Query(
        "select coalesce(sum(b.totalAmount), 0) from Booking b where b.hall.owner = :owner and b.status in ('CONFIRMED','COMPLETED')"
    )
    java.math.BigDecimal sumConfirmedRevenueForOwner(@org.springframework.data.repository.query.Param("owner") User owner);
}
