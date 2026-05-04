package com.smartdevice.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "device_history")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class DeviceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên thiết bị: fan | bulb | dehumidifier
    @Column
    private String name;

    // true = bật, false = tắt
    @Column
    private boolean action;

    // Thời điểm thực hiện hành động
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column
    private LocalDateTime time;
}
