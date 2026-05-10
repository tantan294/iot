// ─── Date formatting ────────────────────────────────────────────────────────
export const formatDate = (timeArray: any): string => {
  if (Array.isArray(timeArray)) {
    const [year, month, day, hour, minute, second] = timeArray;
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${day} ${monthNames[month - 1]} ${year}, ${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}:${String(second).padStart(2,"0")}`;
  }
  if (typeof timeArray === "string") {
    const date = new Date(timeArray);
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}, ${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}:${String(date.getSeconds()).padStart(2,"0")}`;
  }
  return "...";
};

// ─── Device name display ────────────────────────────────────────────────────
export const translateDeviceName = (deviceName: string): string => {
  const map: Record<string, string> = {
    fan:          "Fan",
    dehumidifier: "Dehumidifier",
    bulb:         "Bulb",
  };
  return map[deviceName] ?? deviceName;
};

// ─── Parse ISO to array ─────────────────────────────────────────────────────
export const parseISOToArray = (isoString: string): number[] => {
  const date = new Date(isoString);
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds() * 1e6,
  ];
};

// ─── Severity calculation ───────────────────────────────────────────────────
export type SeverityLevel = "Normal" | "Warning" | "Critical" | "Low";

export const getSeverity = (type: string, value: number): SeverityLevel => {
  switch (type) {
    case "temperature":
      if (value >= 35) return "Critical";
      if (value >= 30) return "Warning";
      if (value >= 10) return "Normal";
      return "Low";
    case "humidity":
      if (value >= 90) return "Critical";
      if (value >= 80) return "Warning";
      if (value >= 30) return "Normal";
      return "Low";
    case "lightLevel":
      if (value > 3000) return "Critical";
      if (value > 1000) return "Warning";
      if (value >= 100)  return "Normal";
      return "Low";
    case "windSpeed":
      if (value > 70) return "Critical";
      if (value > 50) return "Warning";
      if (value > 10) return "Normal";
      return "Low";
    default:
      return "Normal";
  }
};

export const getSeverityClass = (level: SeverityLevel): string => {
  switch (level) {
    case "Critical": return "badge-severity badge-critical";
    case "Warning":  return "badge-severity badge-warning";
    case "Low":      return "badge-severity badge-low";
    default:         return "badge-severity badge-normal";
  }
};

// ─── Flatten sensor record → multiple table rows ────────────────────────────
export interface FlatSensorRow {
  key:        string;
  deviceName: string;
  value:      string;
  timestamp:  any;
  severity:   SeverityLevel;
}

export const flattenSensorRecord = (record: any): FlatSensorRow[] => {
  const timestamp = record.time;
  const id        = record.id;
  return [
    {
      key:        `${id}-temp`,
      deviceName: "DHT11-Temp",
      value:      `${record.temperature}°C`,
      timestamp,
      severity:   getSeverity("temperature", record.temperature),
    },
    {
      key:        `${id}-humid`,
      deviceName: "DHT11-Humid",
      value:      `${record.humidity}%`,
      timestamp,
      severity:   getSeverity("humidity", record.humidity),
    },
    {
      key:        `${id}-light`,
      deviceName: "LM393-Light",
      value:      `${record.lightLevel} lux`,
      timestamp,
      severity:   getSeverity("lightLevel", record.lightLevel),
    },
  ];
};
