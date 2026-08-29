package com.mangalaarangam.controller;

import com.mangalaarangam.dto.hall.HallResponse;
import com.mangalaarangam.security.UserPrincipal;
import com.mangalaarangam.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping
    public ResponseEntity<Void> add(@AuthenticationPrincipal UserPrincipal principal,
                                     @RequestBody Map<String, Long> body) {
        wishlistService.add(principal.getUser(), body.get("hallId"));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<HallResponse>> get(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(wishlistService.getForCustomer(principal.getUser()));
    }

    @DeleteMapping("/{hallId}")
    public ResponseEntity<Void> remove(@PathVariable Long hallId, @AuthenticationPrincipal UserPrincipal principal) {
        wishlistService.removeByHall(principal.getUser(), hallId);
        return ResponseEntity.noContent().build();
    }
}
