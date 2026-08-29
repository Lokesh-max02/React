package com.mangalaarangam.repository;

import com.mangalaarangam.entity.Complaint;
import com.mangalaarangam.entity.ComplaintStatus;
import com.mangalaarangam.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    long countByStatus(ComplaintStatus status);
}
