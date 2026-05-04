package com.smartdevice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandlingException;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MqttService {
    private final MessageChannel mqttOutboundChannel;
    private final ObjectMapper objectMapper;

    public void sendMessage(String topic, Object payload) {
        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            Message<String> message = MessageBuilder
                    .withPayload(jsonPayload)
                    .setHeader(MqttHeaders.TOPIC, topic)
                    .build();
            mqttOutboundChannel.send(message);
            System.out.println("📤 Sent to MQTT: " + topic + " -> " + payload);
        } catch (MessageHandlingException e) {
            System.err.println("❌ Failed to send MQTT message: " + e.getMessage());
        }catch (JsonProcessingException e) {
            System.err.println("❌ Error converting object to JSON: " + e.getMessage());
        }
    }
}
