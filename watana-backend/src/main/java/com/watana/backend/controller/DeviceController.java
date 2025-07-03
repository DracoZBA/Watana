package com.watana.backend.controller;

import com.watana.backend.model.Device;
import com.google.cloud.firestore.Firestore;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final Firestore firestore; // Inyecta la instancia de Firestore

    // Inyección de dependencia del bean de Firestore
    @Autowired
    public DeviceController(Firestore firestore) {
        this.firestore = firestore;
    }

    // Endpoint para crear un nuevo dispositivo en Firestore
    @PostMapping
    public ResponseEntity<Device> createDevice(@RequestBody Device device) {
        try {
            // Si el ID del dispositivo no viene, Firestore generará uno.
            // Para mantener la consistencia, si el ID ya existe, lo usamos.
            // Si quieres que siempre se genere un nuevo ID, ignora device.getId() aquí.
            DocumentReference docRef;
            if (device.getId() != null && !device.getId().isEmpty()) {
                docRef = firestore.collection("devices").document(device.getId());
            } else {
                docRef = firestore.collection("devices").document();
                device.setId(docRef.getId()); // Asigna el ID generado por Firestore al objeto Device
            }

            ApiFuture<WriteResult> result = docRef.set(device); // Guarda el objeto Device en Firestore
            result.get(); // Espera a que la operación se complete

            System.out.println("Dispositivo creado/actualizado con ID: " + device.getId());
            return new ResponseEntity<>(device, HttpStatus.CREATED); // Devuelve el dispositivo creado con un código 201
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error al crear dispositivo: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para obtener todos los dispositivos de Firestore
    @GetMapping
    public ResponseEntity<List<Device>> getAllDevices() {
        List<Device> devices = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = firestore.collection("devices").get(); // Obtiene todos los documentos de la colección "devices"
        try {
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            for (QueryDocumentSnapshot document : documents) {
                // Convierte cada documento de Firestore a un objeto Device
                devices.add(document.toObject(Device.class));
            }
            return ResponseEntity.ok(devices); // Devuelve la lista de dispositivos con un código 200 OK
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error al obtener dispositivos: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para obtener un dispositivo por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable String id) {
        DocumentReference docRef = firestore.collection("devices").document(id);
        ApiFuture<com.google.cloud.firestore.DocumentSnapshot> future = docRef.get();
        try {
            com.google.cloud.firestore.DocumentSnapshot document = future.get();
            if (document.exists()) {
                return ResponseEntity.ok(document.toObject(Device.class)); // Devuelve el dispositivo encontrado
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Devuelve un código 404 si no se encuentra
            }
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error al obtener dispositivo por ID: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para actualizar un dispositivo existente
    @PutMapping("/{id}")
    public ResponseEntity<Device> updateDevice(@PathVariable String id, @RequestBody Device device) {
        DocumentReference docRef = firestore.collection("devices").document(id);
        ApiFuture<WriteResult> result = docRef.set(device); // 'set' con el objeto completo sobrescribirá el documento
        try {
            result.get();
            System.out.println("Dispositivo actualizado con ID: " + id);
            return ResponseEntity.ok(device); // Devuelve el dispositivo actualizado
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error al actualizar dispositivo: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para eliminar un dispositivo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable String id) {
        DocumentReference docRef = firestore.collection("devices").document(id);
        ApiFuture<WriteResult> result = docRef.delete(); // Elimina el documento
        try {
            result.get();
            System.out.println("Dispositivo eliminado con ID: " + id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Devuelve un código 204 (sin contenido)
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error al eliminar dispositivo: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}