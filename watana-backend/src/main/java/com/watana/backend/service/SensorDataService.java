package com.watana.backend.service;

import com.watana.backend.model.SensorData;
import com.watana.backend.repository.SensorDataRepository;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service // Marca esta clase como un componente Spring para la capa de servicio
public class SensorDataService {

    private final SensorDataRepository sensorDataRepository; // Inyecta el repositorio

    // Constructor para inyección de dependencia
    public SensorDataService(SensorDataRepository sensorDataRepository) {
        this.sensorDataRepository = sensorDataRepository;
    }

    // Guarda los datos del sensor en Firestore
    public SensorData saveSensorData(SensorData sensorData) throws ExecutionException, InterruptedException {
        return sensorDataRepository.save(sensorData);
    }

    // Aquí puedes añadir más métodos de lógica de negocio relacionados con los datos de los sensores si es necesario,
    // como métodos para obtener los últimos N datos, filtrar por tipo de sensor, etc.
}
