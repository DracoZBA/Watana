package com.watana.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import jakarta.validation.constraints.NotBlank; // Importa para validar que no esté vacío y no sea solo espacios
import jakarta.validation.constraints.Size;    // Importa para validar el tamaño de las cadenas
import jakarta.validation.constraints.NotNull; // Importa para validar que no sea nulo
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getters, setters, toString, equals, hashCode
@NoArgsConstructor // Genera un constructor sin argumentos
@AllArgsConstructor // Genera un constructor con todos los argumentos
public class Device {
    @DocumentId // Indica que este campo será el ID del documento en Firestore
    private String id;

    @NotBlank(message = "El nombre del dispositivo no puede estar vacío.") // El nombre es obligatorio
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres.") // Longitud del nombre
    private String name;

    @NotBlank(message = "El tipo de dispositivo es requerido.") // El tipo es obligatorio
    @Size(min = 2, max = 50, message = "El tipo debe tener entre 2 y 50 caracteres.")
    private String type; // e.g., "drone", "sensor_temperatura", "sensor_humedad"

    @NotBlank(message = "La ubicación del dispositivo no puede estar vacía.") // La ubicación es obligatoria
    @Size(min = 3, max = 100, message = "La ubicación debe tener entre 3 y 100 caracteres.")
    private String location;

    @NotNull(message = "El estado 'activo' del dispositivo es requerido.") // 'active' no puede ser nulo
    private boolean active;

    // Puedes añadir más campos según tus necesidades (ej., batteryLevel, lastSeen, etc.)
    // Y añadirles anotaciones de validación si es necesario.
}
