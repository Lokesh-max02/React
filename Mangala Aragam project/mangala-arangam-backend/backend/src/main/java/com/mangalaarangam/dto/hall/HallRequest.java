package com.mangalaarangam.dto.hall;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
public class HallRequest {

    @NotBlank
    private String name;

    private String description;

    @NotBlank
    private String location;

    private String address;

    private String googleMapLink;

    @NotNull @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    @NotNull @Min(1)
    private Integer guestCapacity;

    private Integer numberOfRooms;

    private Integer parkingCapacity;

    private String mainImageUrl;

    private List<String> galleryImages;

    private Set<String> facilities;
}
