package com.watana.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.cloud.firestore.Firestore; // Importa Firestore de google.cloud
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Value;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

// Importa FirestoreClient para interactuar con Firestore desde Firebase Admin SDK
import com.google.firebase.cloud.FirestoreClient;

@Configuration // Indica que esta clase contiene definiciones de beans de Spring
public class FirebaseConfig {

    @Value("${firebase.project-id}")
    private String firebaseProjectId;

    @PostConstruct
    public void initializeFirebaseApp() {
        try {
            // Carga el archivo de clave de cuenta de servicio desde los recursos
            InputStream serviceAccount = new ClassPathResource("serviceAccountKey.json").getInputStream();

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setProjectId(firebaseProjectId)
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase Admin SDK inicializado exitosamente.");
            } else {
                System.out.println("Firebase Admin SDK ya está inicializado.");
            }

        } catch (IOException e) {
            System.err.println("Error al inicializar Firebase Admin SDK: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Bean para obtener la instancia de Firestore
    @Bean
    public Firestore getFirestore() {
        // Usa FirestoreClient para obtener la instancia de Firestore
        return FirestoreClient.getFirestore();
    }

    // Bean para obtener la instancia de FirebaseAuth
    @Bean
    public FirebaseAuth getFirebaseAuth() {
        return FirebaseAuth.getInstance(FirebaseApp.getInstance());
    }
}