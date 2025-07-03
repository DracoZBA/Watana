package com.watana.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux; // Required for Spring WebFlux (Reactive Web)
import java.time.Duration;
import java.time.LocalTime;
import java.util.Random;

@RestController // Marks this class as a Spring REST Controller
@RequestMapping("/api/sse") // Base path for all endpoints in this controller
public class SseController {

    private final Random random = new Random(); // For simulating random values

    // Endpoint for real-time sensor data using Server-Sent Events (SSE)
    // Produces MediaType.TEXT_EVENT_STREAM_VALUE to indicate SSE
    @GetMapping(path = "/realtime-data", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> sendRealtimeData() {
        return Flux.interval(Duration.ofSeconds(2)) // Emit an event every 2 seconds
                .map(sequence -> {
                    // Simulate a temperature reading between 20.0 and 28.0 degrees Celsius
                    double temperature = 20.0 + (random.nextDouble() * 8.0);
                    // Get current time formatted as HH:mm:ss
                    String timestamp = LocalTime.now().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm:ss"));

                    // Format the event data as a JSON string.
                    // SSE requires "data: " prefix and two newlines at the end "\n\n".
                    String jsonData = String.format("{\"time\":\"%s\",\"value\":%.1f, \"deviceId\":\"temp-sensor-%03d\"}",
                                                    timestamp, temperature, random.nextInt(100)); // Added deviceId
                    return "data: " + jsonData + "\n\n";
                });
    }

    // NEW Endpoint for real-time notifications using Server-Sent Events (SSE)
    @GetMapping(path = "/notifications", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> sendRealtimeNotifications() {
        return Flux.interval(Duration.ofSeconds(5)) // Emit a notification every 5 seconds
                .map(sequence -> {
                    String deviceId = "device-" + String.format("%03d", random.nextInt(100)); // Simulate device ID
                    String timestamp = LocalTime.now().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm:ss"));

                    String title;
                    String message;
                    String type; // "alert" or "info"

                    // Simulate different types of notifications
                    int notificationType = random.nextInt(3); // 0, 1, or 2
                    if (notificationType == 0) {
                        title = "Alerta de Dispositivo Offline";
                        message = String.format("El dispositivo %s ha perdido la conexión.", deviceId);
                        type = "alert";
                    } else if (notificationType == 1) {
                        title = "Nivel de Batería Bajo";
                        message = String.format("El dron %s tiene la batería por debajo del 20%%.", deviceId);
                        type = "alert";
                    } else {
                        title = "Actualización de Estado de Sensor";
                        message = String.format("El sensor %s ha enviado una nueva lectura de datos.", deviceId);
                        type = "info";
                    }

                    // Format the event data as an SSE message with an explicit 'event' type.
                    // It requires "event: <type>\n", then "data: <JSON>\n\n".
                    String jsonData = String.format("{\"title\":\"%s\",\"message\":\"%s\",\"type\":\"%s\",\"deviceId\":\"%s\",\"timestamp\":\"%s\"}",
                                                    title, message, type, deviceId, timestamp);
                    // LÍNEA CRÍTICA: Añade el tipo de evento explícito
                    return "event: notification\ndata: " + jsonData + "\n\n";
                });
    }
}