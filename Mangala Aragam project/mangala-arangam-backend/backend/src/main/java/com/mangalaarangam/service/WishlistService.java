package com.mangalaarangam.service;

import com.mangalaarangam.dto.hall.HallResponse;
import com.mangalaarangam.entity.User;
import com.mangalaarangam.entity.WeddingHall;
import com.mangalaarangam.entity.Wishlist;
import com.mangalaarangam.exception.BadRequestException;
import com.mangalaarangam.exception.ResourceNotFoundException;
import com.mangalaarangam.repository.WeddingHallRepository;
import com.mangalaarangam.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WeddingHallRepository hallRepository;

    @Transactional
    public void add(User customer, Long hallId) {
        WeddingHall hall = hallRepository.findById(hallId)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."));

        if (wishlistRepository.existsByCustomerAndHall(customer, hall)) {
            throw new BadRequestException("This hall is already in your wishlist.");
        }

        wishlistRepository.save(Wishlist.builder().customer(customer).hall(hall).build());
    }

    @Transactional(readOnly = true)
    public List<HallResponse> getForCustomer(User customer) {
        return wishlistRepository.findByCustomer(customer).stream()
                .map(w -> HallResponse.from(w.getHall()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeByHall(User customer, Long hallId) {
        WeddingHall hall = hallRepository.findById(hallId)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding hall not found."));
        Wishlist item = wishlistRepository.findByCustomerAndHall(customer, hall)
                .orElseThrow(() -> new ResourceNotFoundException("This hall is not in your wishlist."));
        wishlistRepository.delete(item);
    }
}
