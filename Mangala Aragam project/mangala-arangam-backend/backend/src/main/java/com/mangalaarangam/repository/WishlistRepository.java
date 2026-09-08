package com.mangalaarangam.repository;

import com.mangalaarangam.entity.User;
import com.mangalaarangam.entity.WeddingHall;
import com.mangalaarangam.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByCustomer(User customer);
    Optional<Wishlist> findByCustomerAndHall(User customer, WeddingHall hall);
    boolean existsByCustomerAndHall(User customer, WeddingHall hall);
}
