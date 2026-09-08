package com.mangalaarangam.service;

import com.mangalaarangam.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Map;

@Slf4j
@Service
public class RazorpayService {

    private static final String ORDERS_URL = "https://api.razorpay.com/v1/orders";
    private static final String HMAC_ALGORITHM = "HmacSHA256";

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getKeyId() {
        return keyId;
    }

    /**
     * Creates a Razorpay order for the given rupee amount and returns the
     * Razorpay order id. Amount is converted to paise (Razorpay's smallest unit).
     */
    public String createOrder(BigDecimal amountInRupees, String receipt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Basic " + basicAuth());

        long amountInPaise = amountInRupees.multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, Object> body = new HashMap<>();
        body.put("amount", amountInPaise);
        body.put("currency", "INR");
        body.put("receipt", receipt);

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(ORDERS_URL, entity, Map.class);
            if (response == null || response.get("id") == null) {
                throw new BadRequestException("Razorpay did not return an order id.");
            }
            return (String) response.get("id");
        } catch (Exception e) {
            log.error("Failed to create Razorpay order", e);
            throw new BadRequestException("Could not initiate payment. Please try again shortly.");
        }
    }

    public long amountToPaise(BigDecimal amountInRupees) {
        return amountInRupees.multiply(BigDecimal.valueOf(100)).longValue();
    }

    /**
     * Verifies Razorpay's HMAC-SHA256 signature: HMAC(order_id + "|" + payment_id, key_secret)
     * must equal the signature Razorpay sent back after a successful checkout.
     */
    public boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String expectedSignature = HexFormat.of().formatHex(hash);
            return expectedSignature.equals(signature);
        } catch (Exception e) {
            log.error("Failed to verify Razorpay signature", e);
            return false;
        }
    }

    private String basicAuth() {
        String credentials = keyId + ":" + keySecret;
        return Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }
}
