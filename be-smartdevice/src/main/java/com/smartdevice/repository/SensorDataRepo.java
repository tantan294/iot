package com.smartdevice.repository;

import com.smartdevice.model.SensorData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SensorDataRepo extends JpaRepository<SensorData, Long> {

    /**
     * Tìm kiếm sensor data theo keyword và type.
     * type = 'all'        → tìm trên tất cả cột (id, temperature, humidity, light_level, wind_speed, time)
     * type = 'id'         → chỉ tìm theo id
     * type = 'temperature'→ chỉ tìm theo nhiệt độ
     * type = 'humidity'   → chỉ tìm theo độ ẩm
     * type = 'light'      → chỉ tìm theo mức ánh sáng
     * type = 'wind_speed' → chỉ tìm theo tốc độ gió (thêm mới để khớp với frontend "LM35")
     * type = 'time'       → chỉ tìm theo thời gian
     */
    @Query(nativeQuery = true, value =
            "SELECT * FROM sensor_data " +
            "WHERE (:keyword IS NULL OR :keyword = '' OR " +
            "    (:type = 'all' AND (" +
            "        CAST(id AS CHAR) LIKE CONCAT('%', :keyword, '%') OR " +
            "        CONCAT(temperature, '°C') LIKE CONCAT('%', :keyword, '%') OR " +
            "        CONCAT(humidity, '%') LIKE CONCAT('%', :keyword, '%') OR " +
            "        CONCAT(light_level, ' lux') LIKE CONCAT('%', :keyword, '%') OR " +
            "        CONCAT(wind_speed, ' m/s') LIKE CONCAT('%', :keyword, '%') OR " +
            "        DATE_FORMAT(time, '%d %b %Y, %H:%i:%s') LIKE CONCAT('%', :keyword, '%') OR " +
            "        CONCAT(temperature, '°C ', humidity, '% ', light_level, ' lux') LIKE CONCAT('%', :keyword, '%')" +
            "    )) OR " +
            "    (:type = 'id'          AND CAST(id AS CHAR) LIKE CONCAT('%', :keyword, '%')) OR " +
            "    (:type = 'temperature' AND CONCAT(temperature, '°C') LIKE CONCAT('%', :keyword, '%')) OR " +
            "    (:type = 'humidity'    AND CONCAT(humidity, '%') LIKE CONCAT('%', :keyword, '%')) OR " +
            "    (:type = 'light'       AND CONCAT(light_level, ' lux') LIKE CONCAT('%', :keyword, '%')) OR " +
            "    (:type = 'wind_speed'  AND CONCAT(wind_speed, ' m/s') LIKE CONCAT('%', :keyword, '%')) OR " +
            "    (:type = 'time'        AND DATE_FORMAT(time, '%d %b %Y, %H:%i:%s') LIKE CONCAT('%', :keyword, '%'))" +
            ")",
            countQuery =
            "SELECT COUNT(*) FROM sensor_data " +
            "WHERE (:keyword IS NULL OR :keyword = '' OR " +
            "    (:type = 'all' AND (" +
            "        CAST(id AS CHAR) LIKE CONCAT('%', :keyword, '%') OR " +
            "        CONCAT(temperature, '°C') LIKE CONCAT('%', :keyword, '%') OR " +
            "        CONCAT(humidity, '%') LIKE CONCAT('%', :keyword, '%') OR " +
            "        CONCAT(light_level, ' lux') LIKE CONCAT('%', :keyword, '%') OR " +
            "        CONCAT(wind_speed, ' m/s') LIKE CONCAT('%', :keyword, '%') OR " +
            "        DATE_FORMAT(time, '%d %b %Y, %H:%i:%s') LIKE CONCAT('%', :keyword, '%') OR " +
            "        CONCAT(temperature, '°C ', humidity, '% ', light_level, ' lux') LIKE CONCAT('%', :keyword, '%')" +
            "    )) OR " +
            "    (:type = 'id'          AND CAST(id AS CHAR) LIKE CONCAT('%', :keyword, '%')) OR " +
            "    (:type = 'temperature' AND CONCAT(temperature, '°C') LIKE CONCAT('%', :keyword, '%')) OR " +
            "    (:type = 'humidity'    AND CONCAT(humidity, '%') LIKE CONCAT('%', :keyword, '%')) OR " +
            "    (:type = 'light'       AND CONCAT(light_level, ' lux') LIKE CONCAT('%', :keyword, '%')) OR " +
            "    (:type = 'wind_speed'  AND CONCAT(wind_speed, ' m/s') LIKE CONCAT('%', :keyword, '%')) OR " +
            "    (:type = 'time'        AND DATE_FORMAT(time, '%d %b %Y, %H:%i:%s') LIKE CONCAT('%', :keyword, '%'))" +
            ")")
    Page<SensorData> findAllSensorData(@Param("type")    String type,
                                       @Param("keyword") String keyword,
                                       Pageable pageable);
}
