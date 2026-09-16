package com.mangalaarangam.controller;

import com.mangalaarangam.dto.otp.ForgotPasswordRequest;
import com.mangalaarangam.dto.otp.OtpMessageResponse;
import com.mangalaarangam.dto.otp.ResetPasswordRequest;
import com.mangalaarangam.dto.otp.SendOtpRequest;
import com.mangalaarangam.dto.otp.VerifyOtpRequest;
import com.mangalaarangam.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<OtpMessageResponse> send(@Valid @RequestBody SendOtpRequest request) {
        otpService.sendOtp(request.getEmail());
        return ResponseEntity.ok(new OtpMessageResponse("Verification code sent to " + request.getEmail() + ".", false));
    }

    @PostMapping("/verify")
    public ResponseEntity<OtpMessageResponse> verify(@Valid @RequestBody VerifyOtpRequest request) {
        otpService.verifyOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok(new OtpMessageResponse("Email verified successfully.", true));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<OtpMessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        otpService.sendPasswordResetOtp(request.getEmail());
        return ResponseEntity.ok(new OtpMessageResponse("Password reset code sent to " + request.getEmail() + ".", false));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<OtpMessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        otpService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok(new OtpMessageResponse("Password reset successfully. You can now log in.", true));
    }
}
