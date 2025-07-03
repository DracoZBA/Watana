// src/hooks/useSse.js
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; // Para obtener el token si es necesario

/**
 * Hook de React personalizado para Server-Sent Events (SSE).
 * Establece una conexión EventSource y gestiona los mensajes recibidos.
 *
 * @param {string} url La URL del endpoint SSE de tu backend.
 * @param {boolean} shouldConnect Booleano para controlar si la conexión debe estar activa (ej. si el usuario está logueado).
 * @param {string | null} eventType Opcional. El tipo de evento a escuchar (si tu backend emite diferentes tipos de eventos). Por defecto, 'message'.
 * @returns {object} Un objeto con los últimos datos recibidos y un error (si lo hay).
 */
const useSse = (url, shouldConnect, eventType = 'message') => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const eventSourceRef = useRef(null); // Usamos useRef para mantener la instancia de EventSource
    const { currentUser } = useAuth(); // Para obtener el token de autenticación (si tu SSE lo requiere)

    useEffect(() => {
        if (!shouldConnect || !url) {
            // Si no debemos conectar o la URL no está definida, cierra cualquier conexión existente.
            if (eventSourceRef.current) {
                console.log('Closing existing SSE connection (shouldConnect is false or URL is undefined).');
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            return;
        }

        // Before establishing a new connection, close the previous one if it exists.
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        let sseUrl = url;
        // If your SSE endpoint requires authentication, you would need to pass the token
        // This is usually done through a backend proxy or in the URL (e.g., sseUrl = `${url}?token=${idToken}`)
        // or as an HTTP header, though EventSource doesn't directly support custom headers.
        // For simplicity, we assume the SSE endpoint is accessible or authentication is handled otherwise.

        try {
            console.log(`Attempting to connect to SSE: ${sseUrl}`);
            const eventSource = new EventSource(sseUrl);

            eventSource.onopen = () => {
                console.log("SSE connection established.");
                setError(null);
            };

            // Listen for the specified event type or 'message' by default
            eventSource.addEventListener(eventType, (event) => {
                // IMPORTANT: Log the raw data before parsing
                console.log("Raw SSE event data received:", event.data);

                let rawData = event.data.trim();

                // Check if the data starts with "data: " and remove it if it does
                if (rawData.startsWith("data: ")) {
                    rawData = rawData.substring("data: ".length).trim();
                }
                console.log("Cleaned SSE event data:", rawData);

                try {
                    const parsedData = JSON.parse(rawData);
                    setData(parsedData);
                    // console.log(`SSE event '${eventType}' received:`, parsedData); // Uncomment for debugging
                } catch (parseError) {
                    console.error("Error parsing JSON from SSE event:", parseError, "Raw data:", event.data);
                    setError("Error processing SSE data.");
                }
            });

            eventSource.onerror = (err) => {
                console.error("Error in SSE connection:", err);
                eventSource.close();
                eventSourceRef.current = null;
                setError("SSE connection error. Try reloading.");
            };

            eventSourceRef.current = eventSource; // Store the reference

        } catch (err) {
            console.error("Failed to create EventSource:", err);
            setError("Could not start SSE connection.");
        }

        // Cleanup function: closes the SSE connection when the component unmounts or dependencies change.
        return () => {
            if (eventSourceRef.current) {
                console.log("Closing SSE connection during cleanup.");
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [url, shouldConnect, eventType, currentUser]); // currentUser as a dependency if token was part of the URL

    return { data, error };
};

export default useSse;