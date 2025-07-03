// src/pages/DevicesPage.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom'; // Importa Link y useNavigate
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Para obtener el token de autenticación

const DevicesPage = () => {
    const { currentUser } = useAuth();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null); // Mensaje para eliminación
    const navigate = useNavigate();

    // Función para obtener dispositivos del backend
    const fetchDevices = async () => {
        if (!currentUser) {
            setError("Debe iniciar sesión para ver los dispositivos.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setDeleteMessage(null); // Limpiar mensaje de eliminación
        try {
            const idToken = await currentUser.getIdToken(); // Obtiene el token de autenticación de Firebase
            const response = await axios.get('http://localhost:8080/api/devices', {
                headers: {
                    Authorization: `Bearer ${idToken}` // Envía el token en el encabezado de autorización
                }
            });
            setDevices(response.data);
        } catch (err) {
            console.error('Error al obtener dispositivos:', err.response ? err.response.data : err.message);
            setError(`Error al cargar dispositivos: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Carga los dispositivos cuando el componente se monta o el usuario cambia
    useEffect(() => {
        fetchDevices();
    }, [currentUser]); // Dependencia del currentUser para recargar si el usuario cambia

    // Función para manejar la eliminación de un dispositivo
    const handleDelete = async (deviceId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este dispositivo?")) {
            return; // El usuario canceló la eliminación
        }

        if (!currentUser) {
            setError("Debe iniciar sesión para eliminar dispositivos.");
            return;
        }

        setLoading(true);
        setError(null);
        setDeleteMessage(null);
        try {
            const idToken = await currentUser.getIdToken();
            await axios.delete(`http://localhost:8080/api/devices/${deviceId}`, {
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            });
            setDeleteMessage("Dispositivo eliminado exitosamente.");
            fetchDevices(); // Vuelve a cargar la lista de dispositivos después de eliminar
        } catch (err) {
            console.error('Error al eliminar dispositivo:', err.response ? err.response.data : err.message);
            setError(`Error al eliminar dispositivo: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Gestión de Dispositivos | Watana</title>
                <meta name="description" content="Gestiona y administra tus drones y sensores." />
            </Helmet>
            <h1 className="mb-4">Gestión de Dispositivos</h1>

            {error && <div className="alert alert-danger">{error}</div>}
            {deleteMessage && <div className="alert alert-success">{deleteMessage}</div>}

            {!currentUser && (
                <div className="alert alert-warning" role="alert">
                    Por favor, inicie sesión para ver y gestionar dispositivos.
                </div>
            )}

            {currentUser && (
                <>
                    <div className="mb-3 text-end">
                        <Link to="/devices/new" className="btn btn-success d-flex align-items-center ms-auto" style={{ width: 'fit-content' }}>
                            <i className="bi bi-plus-circle me-2"></i> {/* Icono de Bootstrap, si está disponible */}
                            Añadir Nuevo Dispositivo
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando dispositivos...</span>
                            </div>
                            <p>Cargando dispositivos...</p>
                        </div>
                    ) : devices.length === 0 ? (
                        <div className="alert alert-info text-center">
                            No hay dispositivos registrados. ¡Añada uno!
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover shadow-sm">
                                <thead className="bg-primary text-white">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th>Ubicación</th>
                                        <th>Estado</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {devices.map(device => (
                                        <tr key={device.id}>
                                            <td>{device.id}</td>
                                            <td>{device.name}</td>
                                            <td>{device.type}</td>
                                            <td>{device.location}</td>
                                            <td>
                                                <span className={`badge bg-${device.active ? 'success' : 'danger'}`}>
                                                    {device.active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <Link to={`/devices/edit/${device.id}`} className="btn btn-sm btn-info me-2">
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(device.id)}
                                                    className="btn btn-sm btn-danger"
                                                    disabled={loading}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DevicesPage;
