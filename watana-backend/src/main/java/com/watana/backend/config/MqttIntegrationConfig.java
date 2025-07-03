package com.watana.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule; // Para soportar LocalDateTime
import com.watana.backend.model.SensorData;
import com.watana.backend.service.SensorDataService;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter; // ¡CORREGIDO AQUÍ!
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.handler.annotation.Payload; // Para extraer el payload del mensaje
import java.io.IOException; // Necesario para el ObjectMapper
import java.time.LocalDateTime;
import java.util.concurrent.ExecutionException;

@Configuration // Indica que esta clase contiene definiciones de beans de Spring
public class MqttIntegrationConfig {

    // Inyecta las propiedades de configuración de MQTT desde application.properties
    @Value("${mqtt.broker.url}")
    private String brokerUrl;
    @Value("${mqtt.client.id}")
    private String clientId;
    @Value("${mqtt.topic.inbound}")
    private String inboundTopic;
    @Value("${mqtt.username:}") // Valor por defecto vacío si no está definida
    private String mqttUsername;
    @Value("${mqtt.password:}") // Valor por defecto vacío si no está definida
    private String mqttPassword;

    private final SensorDataService sensorDataService;
    private final ObjectMapper objectMapper; // Para (des)serializar JSON

    // Constructor para inyección de dependencia
    public MqttIntegrationConfig(SensorDataService sensorDataService) {
        this.sensorDataService = sensorDataService;
        this.objectMapper = new ObjectMapper();
        // Registra el módulo para LocalDateTime (java.time)
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    // Configuración de fábrica del cliente MQTT Paho
    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[] { brokerUrl });
        options.setCleanSession(true); // Una sesión limpia no persiste mensajes entre desconexiones
        options.setAutomaticReconnect(true); // Intenta reconectar automáticamente
        if (!mqttUsername.isEmpty()) {
            options.setUserName(mqttUsername);
        }
        if (!mqttPassword.isEmpty()) {
            options.setPassword(mqttPassword.toCharArray());
        }
        factory.setConnectionOptions(options);
        return factory;
    }

    // Define el canal de entrada para los mensajes MQTT
    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    // Adaptador de entrada MQTT: configura cómo se reciben los mensajes del broker
    @Bean
    public MqttPahoMessageDrivenChannelAdapter inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(clientId, mqttClientFactory(), inboundTopic);
        adapter.setCompletionTimeout(5000); // Tiempo de espera para operaciones
        adapter.setConverter(new DefaultPahoMessageConverter()); // Convertidor de mensajes MQTT
        adapter.setQos(1); // Calidad de servicio (QoS) 1: al menos una vez
        adapter.setOutputChannel(mqttInputChannel()); // Envía los mensajes al canal definido
        return adapter;
    }

    // Receptor de mensajes: este método se activará cuando llegue un mensaje al mqttInputChannel
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMqttMessage(@Payload String payload) {
        System.out.println("MQTT Message Received: " + payload);
        try {
            // Convierte el payload JSON en un objeto SensorData
            SensorData sensorData = objectMapper.readValue(payload, SensorData.class);
            // Si el timestamp no viene en el payload, asigna el tiempo actual
            if (sensorData.getTimestamp() == null) {
                sensorData.setTimestamp(LocalDateTime.now());
            }

            // Guarda los datos del sensor en Firestore a través del servicio
            SensorData savedSensorData = sensorDataService.saveSensorData(sensorData);
            System.out.println("SensorData saved to Firestore: " + savedSensorData.getId());

            // Aquí podrías añadir lógica para enviar estos datos al frontend vía SSE
            // (esto ya lo tenemos con SseController, que simula datos, pero podrías
            // adaptarlo para usar datos reales de aquí).
        } catch (IOException e) {
            System.err.println("Error parsing MQTT payload to SensorData: " + e.getMessage());
            e.printStackTrace();
        } catch (ExecutionException | InterruptedException e) {
            System.err.println("Error saving SensorData to Firestore: " + e.getMessage());
            Thread.currentThread().interrupt(); // Restaura el estado interrumpido
            e.printStackTrace();
        }
    }
}