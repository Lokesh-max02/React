package com.mangalaarangam.repository;

import com.mangalaarangam.entity.ApprovalStatus;
import com.mangalaarangam.entity.User;
import com.mangalaarangam.entity.WeddingHall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface WeddingHallRepository extends JpaRepository<WeddingHall, Long>, JpaSpecificationExecutor<WeddingHall> {
    List<WeddingHall> findByOwner(User owner);
    List<WeddingHall> findByApprovalStatus(ApprovalStatus status);
    long countByApprovalStatus(ApprovalStatus status);
    long countByOwner(User owner);
}
