package com.smartdevice.repository;

import com.smartdevice.model.DeviceHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeviceHistoryRepo extends JpaRepository<DeviceHistory, Long> {

    @Query(nativeQuery = true, value = "SELECT * FROM device_history " +
            "WHERE :keyword IS NULL " +
            "OR id LIKE CONCAT('%', :keyword, '%') " +
            "OR name LIKE CONCAT('%', :keyword, '%') " +
            "OR action LIKE CONCAT('%', :keyword, '%') " +
            "OR time LIKE CONCAT('%', :keyword, '%')",
            countQuery = "SELECT COUNT(*) FROM device_history " +
                    "WHERE :keyword IS NULL " +
                    "OR id LIKE CONCAT('%', :keyword, '%') " +
                    "OR name LIKE CONCAT('%', :keyword, '%') " +
                    "OR action LIKE CONCAT('%', :keyword, '%') " +
                    "OR time LIKE CONCAT('%', :keyword, '%')")
    Page<DeviceHistory> findAllDeviceHistory(@Param("keyword") String keyword, Pageable pageable);

    @Query(nativeQuery = true, value = """
            SELECT d1.*
                FROM device_history d1
                INNER JOIN (
                    SELECT name, MAX(time) AS latest_time
                    FROM device_history
                    GROUP BY name
                ) d2 ON d1.name = d2.name AND d1.time = d2.latest_time
            """)
    List<DeviceHistory> findActionDevicesDistinct();
}
