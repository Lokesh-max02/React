package com.mangalaarangam.controller;

import com.mangalaarangam.dto.payment.PaymentRequest;
import com.mangalaarangam.dto.payment.PaymentResponse;
import com.mangalaarangam.entity.Role;
import com.mangalaarangam.security.UserPrincipal;
import com.mangalaarangam.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> pay(@AuthenticationPrincipal UserPrincipal principal,
                                                @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.pay(principal.getUser(), request));
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> get(@AuthenticationPrincipal UserPrincipal principal) {
        var user = principal.getUser();
        List<PaymentResponse> result = user.getRole() == Role.ROLE_OWNER
                ? paymentService.getForOwner(user)
                : paymentService.getForCustomer(user);
        return ResponseEntity.ok(result);
    }
}
