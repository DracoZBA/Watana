package com.watana.backend.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.watana.backend.model.SensorData; // Asegúrate de que SensorData.java exista
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository // Marca esta clase como un componente de Spring para la capa de persistencia
public class SensorDataRepository {

    private final Firestore firestore; // Inyecta la instancia de Firestore

    // Constructor para inyección de dependencia
    public SensorDataRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    private static final String COLLECTION_NAME = "sensor_data"; // Nombre de la colección en Firestore para los datos de sensores

    /**
     * Guarda una nueva entrada de datos de sensor en Firestore.
     * Firestore generará automáticamente un ID para el documento.
     *
     * @param sensorData El objeto SensorData a guardar.
     * @return El objeto SensorData guardado, incluyendo el ID generado por Firestore.
     * @throws ExecutionException Si la operación asíncrona falla.
     * @throws InterruptedException Si el hilo actual es interrumpido mientras espera.
     */
    public SensorData save(SensorData sensorData) throws ExecutionException, InterruptedException {
        // Firestore generará automáticamente un ID único para los nuevos documentos.
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document();
        sensorData.setId(docRef.getId()); // Asigna el ID generado al objeto SensorData

        // Utiliza set() para crear el documento con los datos proporcionados.
        ApiFuture<WriteResult> result = docRef.set(sensorData);
        result.get(); // Espera de forma síncrona a que la operación se complete.
        return sensorData; // Retorna el objeto SensorData con su nuevo ID.
    }

    // Aquí podrías añadir otros métodos para consultar datos de sensores si tu aplicación los necesita,
    // como findById, findAll, findByDeviceId, o consultas por rango de tiempo.
    // Sin embargo, para la ingesta de datos en tiempo real, el método 'save' es el principal.
}
