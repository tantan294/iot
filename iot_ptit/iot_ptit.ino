/**
 * IoT Smart Weather — ESP32 Firmware
 * 
 * Hardware:
 *   - DHT11       → Pin 13  (Temperature & Humidity)
 *   - LM393 Light → Pin 34  (Light level via photoresistor)
 *   - Fan relay   → Pin 25
 *   - Bulb relay  → Pin 26
 *   - Dehumidifier→ Pin 27
 *   - Buzzer/LED  → Pin 32  (Wind speed warning)
 * 
 * MQTT Topics:
 *   Publish:   sensor/data           → sensor readings (JSON)
 *              device/status/<name>  → device state feedback
 *   Subscribe: device/fan            → control fan (true/false)
 *              device/bulb           → control bulb (true/false)
 *              device/dehumidifier   → control dehumidifier (true/false)
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <math.h>

// ── Pin Definitions ────────────────────────────────────────────────────────
#define DHTPIN           19
#define DHTTYPE          DHT11
#define LDR_PIN          34
#define LED_TEMP         17 // Tương ứng với Fan / Quạt (Nhiệt độ)
#define LED_HUM          5  // Tương ứng với Dehumidifier / Máy hút ẩm
#define LED_LIGHT        18 // Tương ứng với Bulb / Đèn

// ── WiFi Config ────────────────────────────────────────────────────────────
const char* ssid     = "TanIphone";
const char* password = "11111111";

// ── MQTT Config ────────────────────────────────────────────────────────────
const char* mqtt_server = "172.20.10.5";
const int   mqtt_port   = 1883;

// ── MQTT Topics ────────────────────────────────────────────────────────────
const char* TOPIC_SENSOR      = "sensor/data";
const char* TOPIC_FAN         = "device/fan";
const char* TOPIC_BULB        = "device/bulb";
const char* TOPIC_DEHUMIDIFIER= "device/dehumidifier";

// ── Timing (non-blocking) ──────────────────────────────────────────────────
const unsigned long PUBLISH_INTERVAL = 2000;   // gửi sensor data mỗi 2 giây

unsigned long lastPublishTime = 0;

// ── Global Objects ─────────────────────────────────────────────────────────
WiFiClient   espClient;
PubSubClient client(espClient);
DHT          dht(DHTPIN, DHTTYPE);

// ─────────────────────────────────────────────────────────────────────────────
// WiFi Setup
// ─────────────────────────────────────────────────────────────────────────────
void setup_wifi() {
  Serial.println();
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

// ─────────────────────────────────────────────────────────────────────────────
// MQTT Callback — nhận lệnh điều khiển từ backend
// ─────────────────────────────────────────────────────────────────────────────
void callback(char* topic, byte* payload, unsigned int length) {
  // Parse payload thành String
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("MQTT IN [");
  Serial.print(topic);
  Serial.print("]: ");
  Serial.println(message);

  // message = "true" hoặc "false"
  bool state = (message == "true");
  String deviceName = "";

  if (strcmp(topic, TOPIC_FAN) == 0) {
    digitalWrite(LED_TEMP, state ? HIGH : LOW);
    deviceName = "fan";
  }
  else if (strcmp(topic, TOPIC_BULB) == 0) {
    digitalWrite(LED_LIGHT, state ? HIGH : LOW);
    deviceName = "bulb";
  }
  else if (strcmp(topic, TOPIC_DEHUMIDIFIER) == 0) {
    digitalWrite(LED_HUM, state ? HIGH : LOW);
    deviceName = "dehumidifier";
  }
  else {
    Serial.println("Unknown topic, ignoring.");
    return;
  }

  // Phản hồi trạng thái về backend — khớp với MqttConfig.java handler()
  // Format: {"device":"fan","status":true}
  String statusTopic = "device/status/" + deviceName;
  String statusJson  = "{\"device\":\"" + deviceName + "\",\"status\":" + (state ? "true" : "false") + "}";

  client.publish(statusTopic.c_str(), statusJson.c_str());
  Serial.print("MQTT OUT [");
  Serial.print(statusTopic);
  Serial.print("]: ");
  Serial.println(statusJson);
}

// ─────────────────────────────────────────────────────────────────────────────
// MQTT Reconnect
// ─────────────────────────────────────────────────────────────────────────────
void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT broker...");
    String clientId = "ESP32-" + String(random(0xffff), HEX);

    if (client.connect(clientId.c_str())) {
      Serial.println(" connected!");
      // Subscribe các topic điều khiển thiết bị
      client.subscribe(TOPIC_FAN);
      client.subscribe(TOPIC_BULB);
      client.subscribe(TOPIC_DEHUMIDIFIER);
      Serial.println("Subscribed: device/fan, device/bulb, device/dehumidifier");
    } else {
      Serial.print(" failed, rc=");
      Serial.print(client.state());
      Serial.println(". Retry in 5s...");
      delay(5000);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Build valid JSON payload cho sensor/data
// Backend (SensorDataService.java) parse: temperature, humidity, light_level
// ─────────────────────────────────────────────────────────────────────────────
String buildSensorPayload(int temperature, int humidity, int lightLevel) {
  // QUAN TRỌNG: không có trailing comma trước "}" — JSON hợp lệ
  String json = "{";
  json += "\"temperature\":" + String(temperature) + ",";
  json += "\"humidity\":"    + String(humidity)    + ",";
  json += "\"lightLevel\":"  + String(lightLevel);
  json += "}";
  return json;
}

// ─────────────────────────────────────────────────────────────────────────────
// Setup
// ─────────────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(LED_TEMP,         OUTPUT);
  pinMode(LED_LIGHT,        OUTPUT);
  pinMode(LED_HUM,          OUTPUT);

  // Trạng thái ban đầu: tất cả tắt
  digitalWrite(LED_TEMP,         LOW);
  digitalWrite(LED_LIGHT,        LOW);
  digitalWrite(LED_HUM,          LOW);

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  Serial.println("Setup complete. Starting loop...");
}

// ─────────────────────────────────────────────────────────────────────────────
// Loop — NON-BLOCKING bằng millis()
// Không dùng delay() trong loop chính để MQTT callback luôn được xử lý kịp thời
// ─────────────────────────────────────────────────────────────────────────────
void loop() {
  // Đảm bảo kết nối MQTT
  if (!client.connected()) {
    reconnect();
  }
  client.loop();  // Xử lý incoming MQTT messages

  unsigned long now = millis();

  // ── Đọc & publish sensor data mỗi PUBLISH_INTERVAL ms ──────────────────
  if (now - lastPublishTime >= PUBLISH_INTERVAL) {
    lastPublishTime = now;

    int humidity    = round(dht.readHumidity());
    int temperature = round(dht.readTemperature());
    
    // Đảo ngược giá trị LDR: Mạch ESP32 ADC đọc từ 0-4095. 
    // Nếu che (tối) mà giá trị tăng, ta lấy 4095 trừ đi giá trị đọc được để nó giảm.
    int rawLight    = analogRead(LDR_PIN);
    int lightLevel  = (int)ceil((4095 - rawLight) / 4.0) + 1;
    
    // Kiểm tra NaN (DHT11 đôi khi đọc lỗi)
    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("DHT11 read error! Skipping publish.");
      return;
    }

    String payload = buildSensorPayload(temperature, humidity, lightLevel);
    bool published = client.publish(TOPIC_SENSOR, payload.c_str());

    Serial.print("MQTT OUT [sensor/data]: ");
    Serial.print(payload);
    Serial.println(published ? " ✓" : " ✗ FAILED");
  }
}