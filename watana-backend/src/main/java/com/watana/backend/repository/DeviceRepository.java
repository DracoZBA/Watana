package com.watana.backend.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot; // Importar QuerySnapshot
import com.google.cloud.firestore.WriteResult;
import com.watana.backend.model.Device;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository // Marca esta clase como un componente de Spring para la capa de persistencia
public class DeviceRepository {

    private final Firestore firestore; // Inyecta la instancia de Firestore

    // Constructor para inyección de dependencia
    public DeviceRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    private static final String COLLECTION_NAME = "devices"; // Nombre de la colección en Firestore

    // Guarda un nuevo dispositivo en Firestore (o actualiza si el ID ya existe)
    public Device save(Device device) throws ExecutionException, InterruptedException {
        DocumentReference docRef;
        if (device.getId() == null || device.getId().isEmpty()) {
            // Si el ID es nulo o vacío, Firestore generará uno nuevo
            docRef = firestore.collection(COLLECTION_NAME).document();
            device.setId(docRef.getId()); // Asigna el ID generado al objeto Device
        } else {
            // Si el ID ya existe, actualiza el documento con ese ID
            docRef = firestore.collection(COLLECTION_NAME).document(device.getId());
        }
        ApiFuture<WriteResult> result = docRef.set(device); // Usa set() para crear o sobrescribir
        result.get(); // Espera a que la operación se complete
        return device; // Retorna el dispositivo con su ID (si fue generado)
    }

    // Encuentra un dispositivo por su ID
    public Optional<Device> findById(String id) throws ExecutionException, InterruptedException {
        DocumentReference documentReference = firestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get(); // Espera a que la operación se complete
        if (document.exists()) {
            // Mapea el DocumentSnapshot a un objeto Device
            return Optional.ofNullable(document.toObject(Device.class));
        } else {
            return Optional.empty(); // No se encontró el documento
        }
    }

    // Obtiene todos los dispositivos de la colección
    public List<Device> findAll() throws ExecutionException, InterruptedException {
    ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME).get(); // Solicita todos los documentos
    QuerySnapshot querySnapshot = future.get(); // Espera y obtiene el resultado de la consulta
    List<Device> devices = new ArrayList<>();
    for (DocumentSnapshot document : querySnapshot.getDocuments()) {
        Device device = document.toObject(Device.class);
        if (device != null) {
            device.setId(document.getId()); // Asegura que el ID del documento también se asigne al objeto
            devices.add(device);
        }
    }
    return devices;
}

    // Elimina un dispositivo por su ID
    public void deleteById(String id) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> result = firestore.collection(COLLECTION_NAME).document(id).delete();
        result.get(); // Espera a que la operación se complete
    }
}