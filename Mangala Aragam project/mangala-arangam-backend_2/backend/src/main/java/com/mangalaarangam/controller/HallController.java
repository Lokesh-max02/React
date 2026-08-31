package com.mangalaarangam.controller;

import com.mangalaarangam.dto.hall.HallRequest;
import com.mangalaarangam.dto.hall.HallResponse;
import com.mangalaarangam.entity.User;
import com.mangalaarangam.security.UserPrincipal;
import com.mangalaarangam.service.HallService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/halls")
@RequiredArgsConstructor
public class HallController {

    private final HallService hallService;

    @GetMapping
    public ResponseEntity<List<HallResponse>> search(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) List<String> facilities,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(hallService.search(location, minPrice, maxPrice, minCapacity, minRating, facilities, date));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HallResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(hallService.getById(id));
    }

    @PostMapping
    public ResponseEntity<HallResponse> create(@AuthenticationPrincipal UserPrincipal principal,
                                                @Valid @RequestBody HallRequest request) {
        User owner = principal.getUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(hallService.create(owner, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HallResponse> update(@PathVariable Long id,
                                                @AuthenticationPrincipal UserPrincipal principal,
                                                @Valid @RequestBody HallRequest request) {
        return ResponseEntity.ok(hallService.update(id, principal.getUser(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        hallService.delete(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }
}
