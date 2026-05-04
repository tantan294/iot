package com.smartdevice.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_data")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class SensorData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private int temperature;

    @Column
    private int humidity;

    @Column(name = "light_level")
    private int lightLevel;


    // Serialize thành ISO string: "2025-02-15T12:19:06"
    // Thay vì array [2025, 2, 15, 12, 19, 6, ...]
    // Phải khớp với application.properties: spring.jackson.serialization.write-dates-as-timestamps=false
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column
    private LocalDateTime time;
}
