// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Opcional, si interactuarás con Firestore directamente desde el frontend
import { getStorage } from 'firebase/storage'; // Opcional, para Firebase Storage

// Tus credenciales de configuración de Firebase
// ¡ATENCIÓN! Estas credenciales son de CLIENTE y son SEGURAS para exponer.
// Son diferentes a las claves de cuenta de servicio de tu backend.
// Las obtendrás de la Consola de Firebase -> Configuración del Proyecto -> Tus apps -> Web app
const firebaseConfig = {
  apiKey: "AIzaSyDC9S7j3Px3Wpao4Go_81EVD_Kr1_WT9yU",
  authDomain: "watana-app-c492d.firebaseapp.com",
  projectId: "watana-app-c492d",
  storageBucket: "watana-app-c492d.firebasestorage.app",
  messagingSenderId: "383960193352",
  appId: "1:383960193352:web:ef6f50dfeb8550dde67b7d",
  measurementId: "G-5R3WF93HJP"
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que usarás
export const auth = getAuth(app);
export const db = getFirestore(app); // Si usas Firestore en el frontend
export const storage = getStorage(app); // Si usas Storage en el frontend

// NOTA: Para un proyecto real, estas variables deben ser inyectadas de forma segura (ej. variables de entorno de React)
// Para crear un archivo .env.local en la raíz de tu proyecto React:
// REACT_APP_API_KEY="YOUR_API_KEY"
// REACT_APP_AUTH_DOMAIN="YOUR_PROJECT_ID.firebaseapp.com"
// ... y luego accederlas como process.env.REACT_APP_API_KEY
