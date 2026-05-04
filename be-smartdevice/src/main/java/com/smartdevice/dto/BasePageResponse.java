package com.smartdevice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class BasePageResponse {
    private int httpCode;
    private String message;
    private Object data;
    private int totalPages;
    private long totalItems;
}
