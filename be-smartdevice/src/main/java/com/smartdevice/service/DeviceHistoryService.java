package com.smartdevice.service;

import com.smartdevice.dto.DeviceHistoryDto;
import com.smartdevice.dto.ModelSearch;
import com.smartdevice.model.DeviceHistory;
import com.smartdevice.repository.DeviceHistoryRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DeviceHistoryService {
    private final DeviceHistoryRepo deviceHistoryRepo;
    private final MqttService mqttService;

    public Page<DeviceHistory> getAllDeviceHistory(ModelSearch modelSearch){

        Sort sort = modelSearch.getSortOrder().equalsIgnoreCase("asc")
                ? Sort.by(modelSearch.getSortBy()).ascending()
                : Sort.by(modelSearch.getSortBy()).descending();

        PageRequest pageable = PageRequest.of(modelSearch.getPageNumber() - 1, modelSearch.getPageSize(), sort);

        Page<DeviceHistory> deviceHistoryPage = deviceHistoryRepo.findAllDeviceHistory(modelSearch.getKeyword(), pageable);

        return deviceHistoryPage;
    }

    public List<DeviceHistory> getActionDevices(){

        return deviceHistoryRepo.findActionDevicesDistinct();
    }

    public DeviceHistory createDeviceHistory(DeviceHistoryDto deviceHistoryDto) {
        DeviceHistory deviceHistory = DeviceHistory.builder()
                .name(deviceHistoryDto.getName())
                .action(deviceHistoryDto.isAction())
                .time(LocalDateTime.now())
                .build();

        deviceHistoryRepo.save(deviceHistory);
        mqttService.sendMessage(String.format("device/%s", deviceHistory.getName()), deviceHistory.isAction());
        return  deviceHistory;
    }
}
