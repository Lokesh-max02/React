package com.mangalaarangam.repository;

import com.mangalaarangam.entity.Review;
import com.mangalaarangam.entity.User;
import com.mangalaarangam.entity.WeddingHall;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByHallOrderByCreatedAtDesc(WeddingHall hall);
    List<Review> findByHallOwnerOrderByCreatedAtDesc(User owner);
    boolean existsByBooking_Id(Long bookingId);

    @org.springframework.data.jpa.repository.Query("select avg(r.rating) from Review r where r.hall = :hall")
    Double averageRatingForHall(@org.springframework.data.repository.query.Param("hall") WeddingHall hall);
}
