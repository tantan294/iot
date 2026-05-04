package com.smartdevice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Client subscribe prefix: /topic/sensor-data, /topic/device-status
        config.enableSimpleBroker("/topic");
        // Client send prefix (nếu dùng @MessageMapping)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                // Dùng allowedOriginPatterns thay vì allowedOrigins
                // để tránh lỗi khi deploy hoặc đổi port
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
