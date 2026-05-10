import React, { useEffect, useState } from "react";
import tempIcon from "../../asset/image/temp-icon.png";
import sunIcon from "../../asset/image/sun-icon.png";
import hudIcon from "../../asset/image/hud-icon.png";
import fanImg from "../../asset/image/fan.png";
import bulbImg from "../../asset/image/light.png";
import hudImg from "../../asset/image/hud.png";
import { LineChart } from "../comp/LineChart";
import { SensorData } from "../model/SensorData";
import { SensorDataService } from "../service/SensorDataService";
import { useAppDispatch } from "../store/hooks";
import { showOrHideSpinner } from "../reducer/SpinnerSlice";
import { DeviceHistoryService } from "../service/DeviceHistoryService";
import { DeviceHistory } from "../model/DeviceHistory";
import { WebSocketService } from "../service/WebSocketService";

// ─── Toggle Switch component ─────────────────────────────────────────────────
const ToggleSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="toggle-switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="toggle-slider" />
  </label>
);

// ─── Device card config ───────────────────────────────────────────────────────
const deviceCardClass: Record<string, string> = {
  fan:          "device-card device-card-temp",
  bulb:         "device-card device-card-light",
  dehumidifier: "device-card device-card-humid",
};

const deviceLabel: Record<string, string> = {
  fan:          "Quạt (Fan)",
  bulb:         "Đèn (Bulb)",
  dehumidifier: "Máy hút ẩm",
};

const deviceIcons: Record<string, string> = {
  fan:          fanImg,
  bulb:         bulbImg,
  dehumidifier: hudImg,
};

// ─── DashBoard ────────────────────────────────────────────────────────────────
export const DashBoard = () => {
  const dispatch = useAppDispatch();

  const [data, setData] = useState<SensorData[]>([]);
  const [sensorDataPresent, setSensorDataPresent] = useState({
    temperature: 0,
    humidity: 0,
    lightLevel: 0,
  });

  const [devices, setDevices] = useState({
    fan: false,
    dehumidifier: false,
    bulb: false,
  });

  // Fetch device statuses
  useEffect(() => {
    dispatch(showOrHideSpinner(true));
    DeviceHistoryService.getInstance()
      .getActionDevices()
      .then((response) => {
        setDevices((prev) => {
          const updated = { ...prev };
          response.data.data.forEach((device: DeviceHistory) => {
            if (device.name in updated) {
              updated[device.name as keyof typeof devices] = device.action;
            }
          });
          return updated;
        });
      })
      .catch(() => { /* backend not available */ })
      .finally(() => dispatch(showOrHideSpinner(false)));
  }, []);

  // Fetch recent sensor data
  useEffect(() => {
    dispatch(showOrHideSpinner(true));
    SensorDataService.getInstance()
      .getSensorData({
        keyword: "",
        sortBy: "id",
        sortOrder: "desc",
        pageSize: 50,
        pageNumber: 1,
        type: "all",
      })
      .then((response) => {
        if (response.data.httpCode === 200) {
          const reversed = [...response.data.data].reverse();
          setData(reversed);
          setSensorDataPresent(reversed[reversed.length - 1] ?? sensorDataPresent);
        }
      })
      .catch(() => { /* backend not available */ })
      .finally(() => dispatch(showOrHideSpinner(false)));
  }, []);

  // Real-time sensor data via WebSocket
  useEffect(() => {
    WebSocketService.getInstance().subscribe(
      "/topic/sensor-data",
      (payload: any) => {
        const dataSensor: SensorData = JSON.parse(payload);
        setSensorDataPresent(dataSensor);
        setData((prev) => {
          const updated = [...prev, dataSensor];
          return updated.length > 50 ? updated.slice(updated.length - 50) : updated;
        });
      }
    );
  }, []);

  // Toggle device on/off
  const handleDeviceToggle = (device: keyof typeof devices) => {
    const newState = !devices[device];
    dispatch(showOrHideSpinner(true));
    DeviceHistoryService.getInstance().createDeviceHistory({
      name: device,
      action: newState,
    });
    WebSocketService.getInstance().subscribe(
      "/topic/device-status",
      (payload: any) => {
        const parsed = JSON.parse(payload);
        setDevices((prev) => ({ ...prev, [parsed.device]: parsed.status }));
        dispatch(showOrHideSpinner(false));
      }
    );
  };



  return (
    <div>
      {/* ── Sensor Cards ── */}
      <div className="sensor-cards">
        <div className="sensor-card sensor-card-temp">
          <div className="sensor-card-icon">
            <img src={tempIcon} alt="Temperature" />
          </div>
          <div className="sensor-card-content">
            <div className="sensor-card-label">Nhiệt độ</div>
            <div className="sensor-card-value">{sensorDataPresent.temperature}°C</div>
          </div>
        </div>

        <div className="sensor-card sensor-card-humid">
          <div className="sensor-card-icon">
            <img src={hudIcon} alt="Humidity" />
          </div>
          <div className="sensor-card-content">
            <div className="sensor-card-label">Độ ẩm</div>
            <div className="sensor-card-value">{sensorDataPresent.humidity}%</div>
          </div>
        </div>

        <div className="sensor-card sensor-card-light">
          <div className="sensor-card-icon">
            <img src={sunIcon} alt="Light" />
          </div>
          <div className="sensor-card-content">
            <div className="sensor-card-label">Ánh sáng</div>
            <div className="sensor-card-value">{sensorDataPresent.lightLevel} lux</div>
          </div>
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="charts-wrapper">
        <div className="chart-area">
          <h2>Nhiệt độ (°C)</h2>
          <div className="chart-container">
            <LineChart sensorData={data} dataKey="temperature" label="Nhiệt độ" borderColor="#EF4444" backgroundColor="rgba(239, 68, 68, 0.15)" />
          </div>
        </div>

        <div className="chart-area">
          <h2>Độ ẩm (%)</h2>
          <div className="chart-container">
            <LineChart sensorData={data} dataKey="humidity" label="Độ ẩm" borderColor="#06B6D4" backgroundColor="rgba(6, 182, 212, 0.15)" />
          </div>
        </div>

        <div className="chart-area">
          <h2>Ánh sáng (lux)</h2>
          <div className="chart-container">
            <LineChart sensorData={data} dataKey="lightLevel" label="Ánh sáng" borderColor="#F59E0B" backgroundColor="rgba(245, 158, 11, 0.15)" />
          </div>
        </div>
      </div>

      {/* ── Device Toggles ── */}
      <div className="device-cards">
        {(["fan", "bulb", "dehumidifier"] as const).map((device) => (
          <div key={device} className={`${deviceCardClass[device]} ${device} ${devices[device] ? "on" : ""}`}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div className="device-card-icon">
                <img src={deviceIcons[device]} alt={device} />
              </div>
              <span className="device-card-name">{deviceLabel[device]}</span>
            </div>
            <ToggleSwitch
              checked={devices[device]}
              onChange={() => handleDeviceToggle(device)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
