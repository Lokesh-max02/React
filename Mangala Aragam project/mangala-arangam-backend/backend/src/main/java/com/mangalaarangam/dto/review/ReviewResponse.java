package com.mangalaarangam.dto.review;

import com.mangalaarangam.entity.Review;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Long hallId;
    private String hallName;
    private String customerName;
    private Integer rating;
    private String text;
    private LocalDateTime createdAt;

    public static ReviewResponse from(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .hallId(r.getHall().getId())
                .hallName(r.getHall().getName())
                .customerName(r.getCustomer().getFullName())
                .rating(r.getRating())
                .text(r.getText())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
