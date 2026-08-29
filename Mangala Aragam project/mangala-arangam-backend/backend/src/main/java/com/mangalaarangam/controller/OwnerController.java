package com.mangalaarangam.controller;

import com.mangalaarangam.dto.hall.HallResponse;
import com.mangalaarangam.security.UserPrincipal;
import com.mangalaarangam.service.HallService;
import com.mangalaarangam.service.OwnerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final HallService hallService;
    private final OwnerDashboardService ownerDashboardService;

    @GetMapping("/halls")
    public ResponseEntity<List<HallResponse>> myHalls(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(hallService.getHallsForOwner(principal.getUser()));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<OwnerDashboardService.OwnerStats> dashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ownerDashboardService.getStats(principal.getUser()));
    }
}
