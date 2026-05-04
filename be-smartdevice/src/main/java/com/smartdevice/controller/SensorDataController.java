package com.smartdevice.controller;

import com.smartdevice.dto.BasePageResponse;
import com.smartdevice.dto.ModelSearch;
import com.smartdevice.model.SensorData;
import com.smartdevice.service.SensorDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sensor-data")
@Tag(name = "Sensor Data Controller", description = "Quản lý dữ liệu thiết bị cảm biến")
public class SensorDataController {
    private final SensorDataService sensorDataService;

    @Operation(summary = "Lấy danh sách dữ liệu thiết bị cảm biến theo schema ModelSearch",
            description = "API này trả về danh sách dữ liệu thiết bị cảm biến với schema SensorData"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Danh sách dữ liệu thiết bị cảm biến",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "Thành công",
                                    value = """
                                            {
                                                    "httpCode": 200,
                                                    "message": "Danh sách dữ liệu cảm biến",
                                                    "data": [
                                                        {
                                                            "id": 1,
                                                            "temperature": 24,
                                                            "humidity": 90,
                                                            "lightLevel": 100,
                                                            "time": [
                                                                2025,
                                                                2,
                                                                13,
                                                                22,
                                                                0,
                                                                40,
                                                                327365000
                                                            ]
                                                        },
                                                        {
                                                            "id": 2,
                                                            "temperature": 26,
                                                            "humidity": 70,
                                                            "lightLevel": 140,
                                                            "time": [
                                                                2025,
                                                                2,
                                                                13,
                                                                22,
                                                                1,
                                                                0,
                                                                583330000
                                                            ]
                                                        }
                                                    ],
                                                    "totalPages": 464,
                                                    "totalItems": 927
                                                }
                                        """
                            )))
    })
    @GetMapping
    public ResponseEntity<?> getAllSensorData(@ParameterObject @ModelAttribute ModelSearch modelSearch){

        Page<SensorData> sensorDataPage =  sensorDataService.getAllSensorData(modelSearch);
        BasePageResponse response = BasePageResponse.builder()
                .httpCode(200)
                .message("Danh sách dữ liệu cảm biến")
                .data(sensorDataPage.getContent())
                .totalPages(sensorDataPage.getTotalPages())
                .totalItems(sensorDataPage.getTotalElements())
                .build();
        return ResponseEntity.ok().body(response);
    }
}
