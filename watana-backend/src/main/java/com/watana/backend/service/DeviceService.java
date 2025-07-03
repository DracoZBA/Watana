package com.watana.backend.service;

import com.watana.backend.model.Device;
import com.watana.backend.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service // Marca esta clase como un componente de Spring para la capa de servicio
public class DeviceService {

    private final DeviceRepository deviceRepository; // Inyecta el repositorio

    // Constructor para inyección de dependencia
    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    // Guarda o actualiza un dispositivo
    public Device saveDevice(Device device) throws ExecutionException, InterruptedException {
        return deviceRepository.save(device);
    }

    // Obtiene un dispositivo por ID
    public Optional<Device> getDeviceById(String id) throws ExecutionException, InterruptedException {
        return deviceRepository.findById(id);
    }

    // Obtiene todos los dispositivos
    public List<Device> getAllDevices() throws ExecutionException, InterruptedException {
        return deviceRepository.findAll();
    }

    // Elimina un dispositivo por ID
    public void deleteDevice(String id) throws ExecutionException, InterruptedException {
        deviceRepository.deleteById(id);
    }
}