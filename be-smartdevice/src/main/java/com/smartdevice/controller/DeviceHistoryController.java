package com.smartdevice.controller;

import com.smartdevice.dto.BasePageResponse;
import com.smartdevice.dto.DeviceHistoryDto;
import com.smartdevice.dto.ModelSearch;
import com.smartdevice.model.DeviceHistory;
import com.smartdevice.service.DeviceHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/device-history")
@Tag(name = "Device History Controller", description = "Quản lý lịch sử hoạt động thiết bị")
public class DeviceHistoryController {
    private final DeviceHistoryService deviceHistoryService;

    @Operation(summary = "Lấy danh sách lịch sử hoạt động thiết bị theo schema ModelSearch",
        description = "API này trả về danh sách lịch sử thiết bị với schema DeviceHistory"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Danh sách lịch sử hoạt động của thiết bị",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "Thành công",
                                    value = """
                                            {
                                                    "httpCode": 200,
                                                    "message": "Danh sách lịch sử hoạt động của thiết bị",
                                                    "data": [
                                                        {
                                                            "id": 152,
                                                            "name": "fan",
                                                            "action": true,
                                                            "time": [
                                                                2025,
                                                                2,
                                                                15,
                                                                12,
                                                                19,
                                                                6,
                                                                798454000
                                                            ]
                                                        },
                                                        {
                                                            "id": 153,
                                                            "name": "bulb",
                                                            "action": true,
                                                            "time": [
                                                                2025,
                                                                2,
                                                                15,
                                                                12,
                                                                28,
                                                                41,
                                                                998743000
                                                            ]
                                                        }
                                                    ],
                                                    "totalPages": 36,
                                                    "totalItems": 72
                                                }
                                        """
                            )))
    })
    @GetMapping
    public ResponseEntity<?> getAllDeviceHistory(@ParameterObject @ModelAttribute ModelSearch modelSearch){

        Page<DeviceHistory> deviceHistoryPage =  deviceHistoryService.getAllDeviceHistory(modelSearch);
        BasePageResponse response = BasePageResponse.builder()
                .httpCode(200)
                .message("Danh sách lịch sử hoạt động của thiết bị")
                .data(deviceHistoryPage.getContent())
                .totalPages(deviceHistoryPage.getTotalPages())
                .totalItems(deviceHistoryPage.getTotalElements())
                .build();
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Lấy danh sách lịch sử hoạt động gần nhất từng thiết bị",
            description = "API này trả về danh sách lịch sử thiết bị với schema DeviceHistory"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lịch sử hoạt động gần nhất từng thiết bị",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "Thành công",
                                    value = """ 
                                            {     "httpCode": 200,
                                                  "message": "Danh sách hoạt động của từng thiết bị",
                                                  "data": [
                                                    {
                                                      "id": 662,
                                                      "name": "bulb",
                                                      "action": false,
                                                      "time": [
                                                        2025,
                                                        2,
                                                        22,
                                                        17,
                                                        52,
                                                        25,
                                                        127436000
                                                      ]
                                                    },
                                                    {
                                                      "id": 663,
                                                      "name": "dehumidifier",
                                                      "action": false,
                                                      "time": [
                                                        2025,
                                                        2,
                                                        22,
                                                        17,
                                                        52,
                                                        25,
                                                        862887000
                                                      ]
                                                    },
                                                    {
                                                      "id": 661,
                                                      "name": "fan",
                                                      "action": false,
                                                      "time": [
                                                        2025,
                                                        2,
                                                        22,
                                                        17,
                                                        52,
                                                        24,
                                                        250274000
                                                      ]
                                                    }
                                                  ],
                                                  "totalPages": 0,
                                                  "totalItems": 0
                                                  }
                                        """
                            )))
    })
    @GetMapping("/distinct-devices")
    public ResponseEntity<?> getActionDevices(){
        List<DeviceHistory> deviceHistoryList = deviceHistoryService.getActionDevices();
        BasePageResponse response = BasePageResponse.builder()
                .httpCode(200)
                .message("Danh sách hoạt động của từng thiết bị")
                .data(deviceHistoryList)
                .build();
        return ResponseEntity.ok().body(response);
    }

    @Operation(summary = "Tạo bản ghi lịch sử hoạt động thiết bị theo schema DeviceHistory",
            description = "API trả về kết quả tạo")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Thêm lịch sử hoạt động thành công",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "Thành công",
                                    value = """ 
                                            {
                                             "httpCode": 201,
                                             "message": "Thêm thiết bị thành công!",
                                             "data": {
                                               "id": 702,
                                               "name": "fan",
                                               "action": true,
                                               "time": [
                                                 2025,
                                                 3,
                                                 12,
                                                 16,
                                                 20,
                                                 6,
                                                 581203700
                                               ]
                                             },
                                             "totalPages": 0,
                                             "totalItems": 0
                                           }
                                        """
                            ))),
            @ApiResponse(responseCode = "400", description = "Thêm lịch sử hoạt động thất bại",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "Thất bại",
                                    value = """ 
                                            {
                                              "timestamp": 1741771324338,
                                              "status": 400,
                                              "error": "Bad Request",
                                              "path": "/device-history"
                                            }
                                        """
                            )))
    })
    @PostMapping
    public ResponseEntity<?> createDeviceHistory(
            @ParameterObject DeviceHistoryDto deviceHistoryDto){
        DeviceHistory deviceHistory = deviceHistoryService.createDeviceHistory(deviceHistoryDto);

        BasePageResponse response = BasePageResponse.builder()
                .httpCode(201)
                .message("Thêm thiết bị thành công!")
                .data(deviceHistory)
                .build();
        return ResponseEntity.ok()
                .body(response);
    }
}
