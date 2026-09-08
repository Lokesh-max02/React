package com.mangalaarangam.service;

import com.mangalaarangam.entity.EmailOtp;
import com.mangalaarangam.exception.BadRequestException;
import com.mangalaarangam.exception.ConflictException;
import com.mangalaarangam.repository.EmailOtpRepository;
import com.mangalaarangam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final EmailOtpRepository emailOtpRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    @Value("${app.otp.expiry-minutes}")
    private int expiryMinutes;

    @Value("${app.otp.verification-validity-minutes}")
    private int verificationValidityMinutes;

    @Value("${app.otp.from-address}")
    private String fromAddress;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public void sendOtp(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists.");
        }

        String code = String.format("%06d", RANDOM.nextInt(1_000_000));

        EmailOtp otp = EmailOtp.builder()
                .email(email)
                .otpCode(code)
                .expiresAt(LocalDateTime.now().plusMinutes(expiryMinutes))
                .verified(false)
                .build();
        emailOtpRepository.save(otp);

        sendEmail(email, code);
    }

    private void sendEmail(String email, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(email);
            message.setSubject("Your Mangala Arangam verification code");
            message.setText(
                    "Your verification code is: " + code + "\n\n" +
                    "This code expires in " + expiryMinutes + " minutes. " +
                    "If you didn't request this, you can safely ignore this email."
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}", email, e);
            throw new BadRequestException(
                    "Could not send the verification email. Please check the address and try again."
            );
        }
    }

    @Transactional
    public void verifyOtp(String email, String submittedCode) {
        EmailOtp otp = emailOtpRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new BadRequestException("No verification code was sent to this email. Please request one first."));

        if (otp.isVerified()) {
            throw new BadRequestException("This email is already verified. You can continue registering.");
        }
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("This code has expired. Please request a new one.");
        }
        if (!otp.getOtpCode().equals(submittedCode)) {
            throw new BadRequestException("Incorrect verification code.");
        }

        otp.setVerified(true);
        otp.setVerifiedAt(LocalDateTime.now());
        emailOtpRepository.save(otp);
    }

    /**
     * Called by AuthService before creating an account, to enforce that the
     * email was actually OTP-verified recently (not just at some point ever).
     */
    @Transactional(readOnly = true)
    public boolean isRecentlyVerified(String email) {
        return emailOtpRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .filter(EmailOtp::isVerified)
                .filter(otp -> otp.getVerifiedAt() != null)
                .filter(otp -> otp.getVerifiedAt().isAfter(LocalDateTime.now().minusMinutes(verificationValidityMinutes)))
                .isPresent();
    }
}
