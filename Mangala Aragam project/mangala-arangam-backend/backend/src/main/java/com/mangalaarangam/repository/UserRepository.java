package com.mangalaarangam.repository;

import com.mangalaarangam.entity.Role;
import com.mangalaarangam.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    java.util.List<User> findByRole(Role role);
    long countByRole(Role role);
}
