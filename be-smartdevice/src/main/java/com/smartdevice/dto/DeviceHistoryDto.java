package com.smartdevice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeviceHistoryDto {

    @Schema(example = "fan", description = "Tên thiết bị: fan | bulb | dehumidifier")
    private String name;

    // Bỏ @NotBlank vì không áp dụng được cho kiểu boolean primitive
    @Schema(example = "true", description = "Trạng thái: true = bật, false = tắt")
    private boolean action;
}
