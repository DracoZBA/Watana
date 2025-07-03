// src/pages/ProfilePage.js
import React, { useState } from 'react'; // Importa useState para la simulación de edición
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { UserCircleIcon, IdentificationIcon, PhoneIcon, MapPinIcon, ClockIcon, PencilSquareIcon, EnvelopeIcon } from '@heroicons/react/24/outline'; // Importa iconos de Heroicons

const ProfilePage = () => {
    const { currentUser } = useAuth();

    // Simulación de datos del perfil para el prototipo
    const [profileData, setProfileData] = useState({
        fullName: "Marcelo Salas",
        email: currentUser ? currentUser.email : "marcelo.salas@example.com",
        phone: "+51 987 654 321",
        address: "Av. La Cultura 123, Arequipa, Perú",
        lastLogin: new Date().toLocaleString(),
        memberSince: "2024-01-15", // Fecha de registro simulada
        profilePicture: "https://placehold.co/150x150/007bff/ffffff?text=Avatar" // Placeholder de imagen
    });

    const [isEditing, setIsEditing] = useState(false); // Estado para simular el modo edición

    // Manejador de cambios para los campos simulados (solo visual)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Función para simular guardar cambios (solo visual)
    const handleSave = () => {
        setIsEditing(false);
        // Aquí iría la lógica para enviar los datos reales al backend
        console.log("Simulando guardar cambios:", profileData);
    };

    // Datos de actividad reciente simulados
    const recentActivity = [
        { id: 1, type: "Inicio de sesión", description: "Inició sesión desde Arequipa.", timestamp: "Hace 1 hora" },
        { id: 2, type: "Dispositivo Actualizado", description: "Actualizó 'Sensor de Temperatura 001'.", timestamp: "Hace 3 horas" },
        { id: 3, type: "Informe Generado", description: "Generó el 'Informe de Calidad de Aire'.", timestamp: "Ayer" },
        { id: 4, type: "Dispositivo Añadido", description: "Añadió un nuevo dron 'Dron Explorador X'.", timestamp: "Hace 2 días" },
    ];

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Perfil de Usuario | Watana</title>
                <meta name="description" content="Consulta y edita tu perfil de usuario." />
            </Helmet>
            <h1 className="mb-4">Perfil de Usuario</h1>

            {!currentUser && (
                <div className="alert alert-warning text-center" role="alert">
                    Por favor, inicie sesión para ver su perfil.
                </div>
            )}

            {currentUser && (
                <div className="row">
                    {/* Columna Izquierda: Información de Contacto y Foto */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body text-center">
                                <img
                                    src={profileData.profilePicture}
                                    alt="Avatar de Usuario"
                                    className="rounded-circle mb-3"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                                <h4 className="card-title">{profileData.fullName}</h4>
                                <p className="card-subtitle text-muted mb-3">{profileData.email}</p>
                                <hr />
                                <ul className="list-group list-group-flush text-start">
                                    <li className="list-group-item d-flex align-items-center">
                                        <EnvelopeIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                        <span>{profileData.email}</span>
                                    </li>
                                    <li className="list-group-item d-flex align-items-center">
                                        <PhoneIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                        <span>{profileData.phone}</span>
                                    </li>
                                    <li className="list-group-item d-flex align-items-center">
                                        <MapPinIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                        <span>{profileData.address}</span>
                                    </li>
                                    <li className="list-group-item d-flex align-items-center">
                                        <IdentificationIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                        <span>UID: {currentUser.uid}</span>
                                    </li>
                                    <li className="list-group-item d-flex align-items-center">
                                        <ClockIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                        <span>Último inicio de sesión: {profileData.lastLogin}</span>
                                    </li>
                                    <li className="list-group-item d-flex align-items-center">
                                        <ClockIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                        <span>Miembro desde: {profileData.memberSince}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Información Personal y Actividad Reciente */}
                    <div className="col-md-8 mb-4">
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Información Personal</h5>
                                {isEditing ? (
                                    <button className="btn btn-sm btn-success" onClick={handleSave}>
                                        <i className="bi bi-check-lg me-1"></i> Guardar
                                    </button>
                                ) : (
                                    <button className="btn btn-sm btn-light" onClick={() => setIsEditing(true)}>
                                        <PencilSquareIcon className="me-1" style={{ width: '1rem', height: '1rem' }} />
                                        Editar
                                    </button>
                                )}
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="fullName" className="form-label">Nombre Completo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="fullName"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={profileData.email}
                                            readOnly // El email de Firebase no se edita directamente aquí
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Teléfono</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Dirección</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    {/* Aquí podrías añadir más campos de información personal */}
                                </form>
                            </div>
                        </div>

                        <div className="card shadow-sm">
                            <div className="card-header bg-info text-white">
                                <h5 className="mb-0">Actividad Reciente</h5>
                            </div>
                            <div className="card-body">
                                {recentActivity.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {recentActivity.map(activity => (
                                            <li key={activity.id} className="list-group-item">
                                                <div className="d-flex w-100 justify-content-between">
                                                    <h6 className="mb-1">{activity.type}</h6>
                                                    <small className="text-muted">{activity.timestamp}</small>
                                                </div>
                                                <p className="mb-1">{activity.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-secondary">No hay actividad reciente.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
