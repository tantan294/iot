package com.smartdevice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ModelSearch {
    private String keyword;
    private String type;

    @Schema(example = "id")
    private String sortBy;

    @Schema(example = "asc")
    private String sortOrder;

    @Schema(example = "10")
    private int pageSize;

    @Schema(example = "1")
    private int pageNumber;
}
