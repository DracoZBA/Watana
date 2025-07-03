// src/pages/MapPage.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Importa los estilos CSS de Leaflet
import L from 'leaflet'; // Importa la librería Leaflet para iconos personalizados
import axios from 'axios'; // Para obtener datos de dispositivos del backend
import { useAuth } from '../context/AuthContext'; // Para obtener el token de autenticación

// Corrección de los iconos de Leaflet (problema común con Webpack/bundlers)
// Asegura que los iconos de marcador predeterminados de Leaflet se carguen correctamente
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Coordenadas iniciales para centrar el mapa en la zona solicitada
const INITIAL_MAP_POSITION = [-16.469521, -71.308998]; // Cerca de Arequipa, zona específica

// ID de un dispositivo de prueba que buscaremos en el backend.
// Asegúrate de crear un dispositivo con este ID (o nombre similar si no fijas el ID)
// en la sección de dispositivos para que aparezca en el mapa.
const SIMULATED_DEVICE_NAME_FOR_MAP = "Drone Agricola 1"; // Puedes cambiarlo al nombre de tu dispositivo
const SIMULATED_DEVICE_ID_FOR_MAP = "zuhzKTH9ZHeSwiXaRFzU"; // O un ID específico si lo generas así

// Múltiples rutas simuladas para drones, movidas y nuevas, cerca de (-16.469521, -71.308998)
const SIMULATED_DRONE_PATHS = [
    {
        id: 'ruta-drone-001',
        deviceId: SIMULATED_DEVICE_ID_FOR_MAP, // Asociado al dispositivo de prueba
        name: 'Ruta de Monitoreo Agrícola',
        path: [
            [-16.4680, -71.3095], // Inicio cerca del punto
            [-16.4700, -71.3070],
            [-16.4715, -71.3090],
            [-16.4690, -71.3110],
            [-16.4680, -71.3095] // Cierre de ciclo
        ],
        color: '#FF0000' // Rojo
    },
    {
        id: 'ruta-drone-002',
        deviceId: 'otro-drone-id-002', // Otra ruta para un segundo drone
        name: 'Ruta de Inspección de Infraestructura',
        path: [
            [-16.4675, -71.3075],
            [-16.4685, -71.3060],
            [-16.4700, -71.3050],
            [-16.4690, -71.3075] // Ruta en forma de 'L' o curva
        ],
        color: '#00AA00' // Verde oscuro
    },
    {
        id: 'ruta-drone-003',
        deviceId: 'drone-forestal-003', // Nueva ruta para un tercer drone
        name: 'Ruta de Vigilancia Forestal',
        path: [
            [-16.4710, -71.3100],
            [-16.4725, -71.3120],
            [-16.4730, -71.3105],
            [-16.4715, -71.3090],
            [-16.4710, -71.3100] // Ruta en espiral o cuadrada
        ],
        color: '#0000FF' // Azul
    },
    {
        id: 'ruta-drone-004',
        deviceId: 'drone-logistico-004', // Nueva ruta para un cuarto drone
        name: 'Ruta de Entrega Logística',
        path: [
            [-16.4650, -71.3080],
            [-16.4660, -71.3050],
            [-16.4640, -71.3040],
            [-16.4630, -71.3065],
            [-16.4650, -71.3080] // Ruta irregular
        ],
        color: '#FFFF00' // Amarillo
    },
    {
        id: 'ruta-drone-005',
        deviceId: 'drone-meteorologico-005', // Nueva ruta para un quinto drone
        name: 'Ruta de Monitoreo Meteorológico',
        path: [
            [-16.4705, -71.3040],
            [-16.4685, -71.3030],
            [-16.4670, -71.3055],
            [-16.4690, -71.3065],
            [-16.4705, -71.3040] // Ruta en forma de 'Z' o zig-zag
        ],
        color: '#8A2BE2' // Azul violeta
    },
    {
        id: 'ruta-drone-006',
        deviceId: 'drone-seguridad-006', // Nueva ruta para un sexto drone
        name: 'Ruta de Patrullaje de Seguridad',
        path: [
            [-16.4690, -71.3130],
            [-16.4705, -71.3145],
            [-16.4720, -71.3130],
            [-16.4705, -71.3115],
            [-16.4690, -71.3130] // Ruta en forma de diamante o cuadrada
        ],
        color: '#FFA500' // Naranja
    }
];

// Múltiples marcadores simulados para sensores, movidos cerca de (-16.469521, -71.308998)
const SIMULATED_SENSORS_MARKERS = [
    { id: 'sensor-temp-001', deviceId: 'sensor-prueba-temp', position: [-16.4690, -71.3080], name: 'Sensor Temp. Estación Principal', type: 'Temperatura', description: 'Sensor de temperatura ambiente en estación de monitoreo principal.' },
    { id: 'sensor-hum-002', deviceId: 'sensor-prueba-hum', position: [-16.4698, -71.3070], name: 'Sensor Hum. Depósito', type: 'Humedad', description: 'Sensor de humedad en depósito de almacenamiento.' },
    { id: 'sensor-gas-003', deviceId: 'sensor-gas-a1', position: [-16.4705, -71.3090], name: 'Sensor Gas Área Producción', type: 'Gas', description: 'Detector de gas en área de producción agrícola.' },
    { id: 'camara-004', deviceId: 'camara-area-1', position: [-16.4685, -71.3100], name: 'Cámara HD Entrada', type: 'Cámara', description: 'Cámara de vigilancia de alta definición en entrada principal.' },
    { id: 'sensor-presion-005', deviceId: 'sensor-pres-b2', position: [-16.4670, -71.3090], name: 'Sensor Presión Riego', type: 'Presión', description: 'Sensor de presión en sistema de riego automatizado.' },
    { id: 'sensor-luz-006', deviceId: 'sensor-luz-c3', position: [-16.4710, -71.3075], name: 'Sensor Luminosidad', type: 'Luz', description: 'Sensor para medir la intensidad de luz solar.' }
];


const MapPage = () => {
    const { currentUser } = useAuth();
    const [devices, setDevices] = useState([]); // Estado para almacenar los dispositivos del backend
    const [loadingDevices, setLoadingDevices] = useState(true);
    const [errorDevices, setErrorDevices] = useState(null);

    // Estado para el dispositivo de prueba si se encuentra
    const [mainTestDevice, setMainTestDevice] = useState(null);

    // Función para obtener dispositivos del backend
    const fetchDevices = async () => {
        if (!currentUser) {
            setErrorDevices("Debe iniciar sesión para ver los dispositivos.");
            setLoadingDevices(false);
            return;
        }

        setLoadingDevices(true);
        setErrorDevices(null);
        try {
            const idToken = await currentUser.getIdToken();
            const response = await axios.get('http://localhost:8080/api/devices', {
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            });
            setDevices(response.data);

            // Intentar encontrar el dispositivo de prueba por ID o por nombre
            const foundDeviceById = response.data.find(d => d.id === SIMULATED_DEVICE_ID_FOR_MAP);
            const foundDeviceByName = response.data.find(d => d.name === SIMULATED_DEVICE_NAME_FOR_MAP);

            if (foundDeviceById) {
                setMainTestDevice(foundDeviceById);
            } else if (foundDeviceByName) {
                setMainTestDevice(foundDeviceByName);
                // Opcional: Actualizar el ID en el estado si lo encontramos por nombre
                // setMainTestDevice({ ...foundDeviceByName, id: SIMULATED_DEVICE_ID_FOR_MAP });
            } else {
                console.warn(`Dispositivo de mapa principal (ID: ${SIMULATED_DEVICE_ID_FOR_MAP} o Nombre: ${SIMULATED_DEVICE_NAME_FOR_MAP}) no encontrado en el backend.`);
                setMainTestDevice(null);
            }

        } catch (err) {
            console.error('Error al obtener dispositivos para el mapa:', err.response ? err.response.data : err.message);
            setErrorDevices(`Error al cargar dispositivos para el mapa: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoadingDevices(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, [currentUser]); // Dependencia del currentUser para recargar si el usuario cambia

    // Funciones de validación (mantenerlas para asegurar la calidad de los datos simulados)
    const isValidPath = (path) => path.every(coord => Array.isArray(coord) && coord.length === 2 && !isNaN(coord[0]) && !isNaN(coord[1]));
    const isValidMarker = (marker) => Array.isArray(marker.position) && marker.position.length === 2 && !isNaN(marker.position[0]) && !isNaN(marker.position[1]);


    return (
        <div className="container mt-4">
            <Helmet>
                <title>Mapa Interactivo | Watana</title>
                <meta name="description" content="Visualiza la ubicación de drones y sensores en un mapa." />
            </Helmet>
            <h1 className="mb-4">Mapa Interactivo</h1>

            {errorDevices && <div className="alert alert-danger">{errorDevices}</div>}
            {loadingDevices && (
                <div className="text-center mb-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando dispositivos...</span>
                    </div>
                    <p>Cargando dispositivos para el mapa...</p>
                </div>
            )}

            {!currentUser ? (
                <div className="alert alert-warning" role="alert">
                    Inicie sesión para ver el mapa de activos.
                </div>
            ) : (
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Visualización de Activos en el Mapa</h5>
                    </div>
                    <div className="card-body p-0" style={{ height: '600px', width: '100%' }}>
                        <MapContainer
                            center={INITIAL_MAP_POSITION}
                            zoom={15} // Aumentado el zoom para la nueva área localizada
                            scrollWheelZoom={true}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Mostrar el dispositivo de prueba principal como un marcador */}
                            {mainTestDevice && isValidMarker({ position: INITIAL_MAP_POSITION }) && ( // Usamos INITIAL_MAP_POSITION como marcador base para el dispositivo principal
                                <Marker position={INITIAL_MAP_POSITION}>
                                    <Popup>
                                        <strong>{mainTestDevice.name}</strong><br />
                                        ID: {mainTestDevice.id}<br />
                                        Tipo: {mainTestDevice.type}<br />
                                        Ubicación: {mainTestDevice.location}<br />
                                        Estado: {mainTestDevice.active ? 'Activo' : 'Inactivo'}
                                    </Popup>
                                </Marker>
                            )}

                            {/* Rutas simuladas asociadas a los dispositivos */}
                            {SIMULATED_DRONE_PATHS.map(dronePath =>
                                isValidPath(dronePath.path) ? (
                                    <Polyline
                                        key={dronePath.id}
                                        positions={dronePath.path}
                                        color={dronePath.color}
                                        weight={5}
                                    >
                                        <Popup>
                                            <strong>{dronePath.name}</strong><br />
                                            Asociado a: {dronePath.deviceId}
                                        </Popup>
                                    </Polyline>
                                ) : null
                            )}

                            {/* Otros marcadores de sensores */}
                            {SIMULATED_SENSORS_MARKERS.map(marker =>
                                isValidMarker(marker) ? (
                                    <Marker key={marker.id} position={marker.position}>
                                        <Popup>
                                            <strong>{marker.name}</strong><br />
                                            Tipo: {marker.type}<br />
                                            Descripción: {marker.description}<br />
                                            {marker.deviceId && (
                                                <span>Asociado a: {marker.deviceId}</span>
                                            )}
                                        </Popup>
                                    </Marker>
                                ) : null
                            )}

                            {/* Mensaje de advertencia si el dispositivo principal no fue encontrado */}
                            {!mainTestDevice && !loadingDevices && (
                                <div className="position-absolute top-50 start-50 translate-middle alert alert-warning" style={{ zIndex: 1000 }}>
                                    <p className="mb-0">Dispositivo de mapa principal '{SIMULATED_DEVICE_NAME_FOR_MAP}' (ID: '{SIMULATED_DEVICE_ID_FOR_MAP}') no encontrado en la lista de dispositivos.</p>
                                    <small>Por favor, cree uno en la sección de Dispositivos para ver las rutas y marcadores asociados.</small>
                                </div>
                            )}

                        </MapContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapPage;