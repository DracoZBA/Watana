// src/pages/NotificationsPage.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// import useSse from '../hooks/useSse'; // Comentado temporalmente para usar datos de prototipo
import { useAuth } from '../context/AuthContext';

const NotificationsPage = () => {
    const { currentUser } = useAuth();
    // const [notifications, setNotifications] = useState([]); // Deshabilitado para prototipo
    
    // URL del endpoint SSE para notificaciones (se usará cuando se debuguee el SSE)
    // const sseUrl = 'http://localhost:8080/api/sse/notifications'; 
    // const { data: newNotification, error: sseError } = useSse(sseUrl, !!currentUser, 'notification');

    // Datos de notificaciones de prototipo (TEMPORAL)
    const [notifications, setNotifications] = useState([
        {
            id: 'proto-1',
            title: 'Alerta: Temperatura Elevada en Sensor #007',
            message: 'El sensor de temperatura en Arequipa ha reportado 32.5°C.',
            type: 'alert',
            deviceId: 'temp-sensor-007',
            timestamp: '2025-06-25T19:30:15'
        },
        {
            id: 'proto-2',
            title: 'Notificación: Dron 002 con Batería Baja',
            message: 'El dron de vigilancia "Águila" tiene un 15% de batería. Regresando a base.',
            type: 'info',
            deviceId: 'drone-002',
            timestamp: '2025-06-25T19:28:00'
        },
        {
            id: 'proto-3',
            title: 'Alerta: Humedad Crítica en Almacén',
            message: 'El sensor de humedad en el almacén #3 reporta 95%. Posible riesgo de moho.',
            type: 'alert',
            deviceId: 'hum-sensor-010',
            timestamp: '2025-06-25T19:25:40'
        },
        {
            id: 'proto-4',
            title: 'Notificación: Dispositivo Desconectado',
            message: 'El dispositivo de monitoreo "Estación Río" ha perdido la conexión. Investigando.',
            type: 'alert',
            deviceId: 'station-river-001',
            timestamp: '2025-06-25T19:20:05'
        },
        {
            id: 'proto-5',
            title: 'Actualización: Nuevo Firmware para Drones',
            message: 'Actualización de firmware v2.1 disponible para todos los drones modelo X.',
            type: 'info',
            deviceId: 'system',
            timestamp: '2025-06-25T19:15:30'
        }
    ]);
    
    // Este useEffect ya no depende de newNotification del SSE, solo de currentUser si es necesario
    useEffect(() => {
        // En un futuro, aquí podrías cargar notificaciones históricas desde una API REST
        // si el usuario está autenticado, y luego el SSE las actualizaría.
        // Por ahora, simplemente se cargan las notificaciones de prototipo.
        if (!currentUser) {
            setNotifications([]); // Limpiar notificaciones si no hay usuario logueado
        } else {
            // Podrías recargar las notificaciones de prototipo si el usuario se loguea
            // setNotifications([...initialPrototypeNotifications]);
        }
    }, [currentUser]);

    // Formatear la fecha para la visualización
    const formatTimestamp = (timestamp) => {
        try {
            return new Date(timestamp).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch (e) {
            return timestamp; // En caso de formato inválido, devuelve el original
        }
    };

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Notificaciones | Watana</title>
                <meta name="description" content="Recibe alertas y mensajes importantes." />
            </Helmet>
            <h1 className="mb-4">Notificaciones</h1>

            {/* SSE Error display (comentado temporalmente si no se usa SSE) */}
            {/* {sseError && (
                <div className="alert alert-danger" role="alert">
                    {sseError} (Asegúrate de que el backend emita notificaciones en {sseUrl})
                </div>
            )} */}

            {!currentUser && (
                <div className="alert alert-warning" role="alert">
                    Inicie sesión para ver las notificaciones.
                </div>
            )}

            {currentUser && notifications.length === 0 /* && !sseError */ && ( // Se quita !sseError temporalmente
                <div className="alert alert-info text-center">
                    No hay notificaciones recientes.
                </div>
            )}

            {currentUser && notifications.length > 0 && (
                <div className="list-group shadow-sm">
                    {notifications.map((notification, index) => (
                        <div key={notification.id || index} className={`list-group-item list-group-item-action ${notification.type === 'alert' ? 'list-group-item-danger' : 'list-group-item-info'}`}>
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{notification.title || 'Nueva Notificación'}</h5>
                                <small className="text-muted">{formatTimestamp(notification.timestamp)}</small>
                            </div>
                            <p className="mb-1">{notification.message || 'Contenido de la notificación.'}</p>
                            {notification.deviceId && <small className="text-muted">Dispositivo: {notification.deviceId}</small>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;