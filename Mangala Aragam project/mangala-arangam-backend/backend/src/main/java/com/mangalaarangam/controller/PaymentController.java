package com.mangalaarangam.controller;

import com.mangalaarangam.dto.payment.*;
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

    // Legacy simulated payment path - kept for backward compatibility.
    @PostMapping
    public ResponseEntity<PaymentResponse> pay(@AuthenticationPrincipal UserPrincipal principal,
                                                @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.pay(principal.getUser(), request));
    }

    // Step 9a: customer starts a real Razorpay checkout for a confirmed booking.
    @PostMapping("/razorpay/create-order")
    public ResponseEntity<RazorpayOrderResponse> createOrder(@AuthenticationPrincipal UserPrincipal principal,
                                                              @Valid @RequestBody CreateRazorpayOrderRequest request) {
        return ResponseEntity.ok(paymentService.createRazorpayOrder(principal.getUser(), request.getBookingId()));
    }

    // Step 9b: frontend calls this right after Razorpay Checkout succeeds client-side.
    @PostMapping("/razorpay/verify")
    public ResponseEntity<RazorpayVerifyResponse> verify(@AuthenticationPrincipal UserPrincipal principal,
                                                          @Valid @RequestBody RazorpayVerifyRequest request) {
        return ResponseEntity.ok(paymentService.verifyRazorpayPayment(principal.getUser(), request));
    }

    // Step 9c: hall owner enters the code the customer showed them.
    @PostMapping("/{paymentId}/confirm-otp")
    public ResponseEntity<PaymentResponse> confirmOtp(@AuthenticationPrincipal UserPrincipal principal,
                                                       @PathVariable Long paymentId,
                                                       @Valid @RequestBody OtpConfirmRequest request) {
        return ResponseEntity.ok(paymentService.confirmPaymentOtp(principal.getUser(), paymentId, request));
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
