// src/pages/DeviceFormPage.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams y useNavigate
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Para obtener el token de autenticación

const DeviceFormPage = () => {
    const { id } = useParams(); // Obtiene el ID del dispositivo de la URL (si estamos editando)
    const navigate = useNavigate(); // Hook para la navegación
    const { currentUser } = useAuth(); // Obtiene el usuario actual para el token

    const [device, setDevice] = useState({
        id: '',
        name: '',
        type: '',
        location: '',
        active: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({}); // Nuevo estado para errores de validación

    const isEditMode = !!id; // Verdadero si hay un ID en la URL (modo edición)

    // Carga los datos del dispositivo si estamos en modo edición
    useEffect(() => {
        const fetchDevice = async () => {
            if (isEditMode && currentUser) {
                setLoading(true);
                setError(null);
                try {
                    const idToken = await currentUser.getIdToken();
                    const response = await axios.get(`http://localhost:8080/api/devices/${id}`, {
                        headers: {
                            Authorization: `Bearer ${idToken}`
                        }
                    });
                    setDevice(response.data);
                } catch (err) {
                    console.error('Error al cargar el dispositivo:', err);
                    setError('No se pudo cargar el dispositivo. Verifique el ID o la conexión.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchDevice();
    }, [id, isEditMode, currentUser]);

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDevice(prevDevice => ({
            ...prevDevice,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Limpia el error de validación cuando el usuario comienza a escribir
        if (validationErrors[name]) {
            setValidationErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    // Función de validación del lado del cliente
    const validateForm = () => {
        const errors = {};
        if (!device.name.trim()) {
            errors.name = 'El nombre del dispositivo es requerido.';
        }
        if (!device.type) {
            errors.type = 'Debe seleccionar un tipo de dispositivo.';
        }
        if (!device.location.trim()) {
            errors.location = 'La ubicación es requerida.';
        }
        // Puedes añadir más reglas de validación aquí, ej. longitud mínima, formato específico

        setValidationErrors(errors);
        return Object.keys(errors).length === 0; // Retorna true si no hay errores
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Primero, valida el formulario en el cliente
        const isValid = validateForm();
        if (!isValid) {
            setSuccessMessage(null); // Limpiar mensaje de éxito si hay errores de validación
            return; // Detiene el envío si la validación falla
        }

        if (!currentUser) {
            setError('Debe iniciar sesión para realizar esta operación.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const idToken = await currentUser.getIdToken();
            let response;
            if (isEditMode) {
                // Actualizar dispositivo existente (PUT)
                response = await axios.put(`http://localhost:8080/api/devices/${id}`, device, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                setSuccessMessage('Dispositivo actualizado exitosamente.');
            } else {
                // Crear nuevo dispositivo (POST)
                // Asegúrate de no enviar el ID si estás creando uno nuevo para que Firestore lo genere
                const { id: _, ...deviceToCreate } = device; // Extrae 'id' y el resto
                response = await axios.post('http://localhost:8080/api/devices', deviceToCreate, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                setSuccessMessage('Dispositivo creado exitosamente.');
                setDevice(response.data); // Actualiza el estado con el ID generado por el backend
            }
            console.log('Operación exitosa:', response.data);
            // Opcional: Redirigir después de la creación/edición
            // navigate('/devices');

        } catch (err) {
            console.error('Error al guardar el dispositivo:', err.response ? err.response.data : err.message);
            setError(`Error al guardar dispositivo: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <Helmet>
                <title>{isEditMode ? 'Editar Dispositivo' : 'Nuevo Dispositivo'} | Watana</title>
                <meta name="description" content={`Formulario para ${isEditMode ? 'editar' : 'añadir'} un dispositivo.`} />
            </Helmet>
            <h1 className="mb-4">{isEditMode ? 'Editar Dispositivo' : 'Nuevo Dispositivo'}</h1>

            {loading && <div className="alert alert-info">Cargando...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {!currentUser && (
                <div className="alert alert-warning" role="alert">
                    Por favor, inicie sesión para {isEditMode ? 'editar' : 'crear'} dispositivos.
                </div>
            )}

            {currentUser && (
                <div className="card shadow-sm p-4">
                    <form onSubmit={handleSubmit}>
                        {isEditMode && (
                            <div className="mb-3">
                                <label htmlFor="id" className="form-label fw-bold">ID del Dispositivo</label>
                                <input
                                    type="text"
                                    id="id"
                                    name="id"
                                    className="form-control"
                                    value={device.id}
                                    disabled // El ID no se debe poder editar directamente
                                />
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-bold">Nombre del Dispositivo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                                value={device.name}
                                onChange={handleChange}
                                required
                            />
                            {validationErrors.name && (
                                <div className="invalid-feedback">{validationErrors.name}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="type" className="form-label fw-bold">Tipo</label>
                            <select
                                id="type"
                                name="type"
                                className={`form-select ${validationErrors.type ? 'is-invalid' : ''}`}
                                value={device.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un tipo</option>
                                <option value="drone">Drone</option>
                                <option value="sensor_temperatura">Sensor de Temperatura</option>
                                <option value="sensor_humedad">Sensor de Humedad</option>
                                <option value="otro">Otro</option>
                            </select>
                            {validationErrors.type && (
                                <div className="invalid-feedback">{validationErrors.type}</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="location" className="form-label fw-bold">Ubicación</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                className={`form-control ${validationErrors.location ? 'is-invalid' : ''}`}
                                value={device.location}
                                onChange={handleChange}
                                required
                            />
                            {validationErrors.location && (
                                <div className="invalid-feedback">{validationErrors.location}</div>
                            )}
                        </div>
                        <div className="form-check mb-3">
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                className="form-check-input"
                                checked={device.active}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="active">
                                Activo
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : (isEditMode ? 'Actualizar Dispositivo' : 'Añadir Dispositivo')}
                        </button>
                        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/devices')}>
                            Cancelar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DeviceFormPage;