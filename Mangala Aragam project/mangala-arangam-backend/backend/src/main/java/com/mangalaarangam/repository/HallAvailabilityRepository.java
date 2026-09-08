package com.mangalaarangam.repository;

import com.mangalaarangam.entity.HallAvailability;
import com.mangalaarangam.entity.WeddingHall;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HallAvailabilityRepository extends JpaRepository<HallAvailability, Long> {
    List<HallAvailability> findByHallAndDateBetween(WeddingHall hall, LocalDate start, LocalDate end);
    Optional<HallAvailability> findByHallAndDate(WeddingHall hall, LocalDate date);
    List<HallAvailability> findByHall(WeddingHall hall);
}
