package com.watana.backend.model;

import com.google.cloud.firestore.annotation.DocumentId; // Para el ID generado por Firestore
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data // Genera getters, setters, toString, equals, hashCode automáticamente (Lombok)
@NoArgsConstructor // Genera un constructor sin argumentos (Lombok)
@AllArgsConstructor // Genera un constructor con todos los argumentos (Lombok)
public class SensorData {
    @DocumentId // Indica que este campo será el ID del documento en Firestore
    private String id;
    private String deviceId;        // ID del dispositivo/sensor que envía los datos (ej: "sensor-temp-001", "drone-alpha-001")
    private String type;            // Tipo de lectura (ej: "temperature", "humidity", "battery_percent", "drone_status")
    private double value;           // Valor de la lectura del sensor (ej: 25.8, 65.2)
    private String unit;            // Unidad del valor (ej: "C", "%", "battery_percent", "m/s", "m")
    private String location;        // Ubicación de la lectura (ej: "Arequipa", "Cusco")
    private LocalDateTime timestamp; // Marca de tiempo de la lectura (se usará LocalDateTime)

    // Constructor para cuando se recibe un mensaje MQTT simple sin ID (Firestore lo generará)
    // Útil si la entrada JSON de MQTT no incluye un ID y quieres crear un objeto SensorData
    public SensorData(String deviceId, String type, double value, String unit, String location, LocalDateTime timestamp) {
        this.deviceId = deviceId;
        this.type = type;
        this.value = value;
        this.unit = unit;
        this.location = location;
        this.timestamp = timestamp;
    }
}