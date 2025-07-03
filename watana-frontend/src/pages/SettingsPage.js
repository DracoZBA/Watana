// src/pages/SettingsPage.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { Cog6ToothIcon, BellAlertIcon, ShieldCheckIcon, UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; // Importa iconos de Heroicons

const SettingsPage = () => {
    const { currentUser } = useAuth();

    // Simulación de datos de configuración del usuario
    const [settings, setSettings] = useState({
        notifications: {
            emailAlerts: true,
            smsAlerts: false,
            pushNotifications: true,
            alertThreshold: 30 // Grados Celsius
        },
        privacy: {
            dataSharing: false,
            locationTracking: true
        },
        general: {
            theme: 'light', // 'light' o 'dark'
            language: 'es', // 'es' o 'en'
            timezone: 'America/Lima'
        },
        account: {
            displayName: currentUser ? currentUser.email.split('@')[0] : 'Usuario Watana'
        }
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Manejador de cambios para los campos simulados
    const handleChange = (e) => {
        const { name, value, type, checked, dataset } = e.target;
        const section = dataset.section; // Obtiene la sección a la que pertenece el ajuste

        setSettings(prevSettings => ({
            ...prevSettings,
            [section]: {
                ...prevSettings[section],
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    // Función para simular guardar cambios
    const handleSave = () => {
        setIsSaving(true);
        setSaveSuccess(false);
        // Aquí iría la lógica para enviar los datos reales al backend
        console.log("Simulando guardar configuración:", settings);

        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            // El mensaje de éxito desaparecerá después de 3 segundos
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1500); // Simula un retraso de guardado de 1.5 segundos
    };

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Configuración | Watana</title>
                <meta name="description" content="Ajusta las preferencias de tu cuenta y aplicación." />
            </Helmet>
            <h1 className="mb-4">Configuración</h1>

            {!currentUser && (
                <div className="alert alert-warning text-center" role="alert">
                    Por favor, inicie sesión para ver y ajustar su configuración.
                </div>
            )}

            {currentUser && (
                <div className="row">
                    {/* Sección de Notificaciones */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-header bg-primary text-white d-flex align-items-center">
                                <BellAlertIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                <h5 className="mb-0">Ajustes de Notificaciones</h5>
                            </div>
                            <div className="card-body">
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="emailAlertsSwitch"
                                        name="emailAlerts"
                                        data-section="notifications"
                                        checked={settings.notifications.emailAlerts}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="emailAlertsSwitch">
                                        Alertas por Correo Electrónico
                                    </label>
                                </div>
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="smsAlertsSwitch"
                                        name="smsAlerts"
                                        data-section="notifications"
                                        checked={settings.notifications.smsAlerts}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="smsAlertsSwitch">
                                        Alertas por SMS
                                    </label>
                                </div>
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="pushNotificationsSwitch"
                                        name="pushNotifications"
                                        data-section="notifications"
                                        checked={settings.notifications.pushNotifications}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="pushNotificationsSwitch">
                                        Notificaciones Push
                                    </label>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="alertThreshold" className="form-label">Umbral de Alerta de Temperatura (°C)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="alertThreshold"
                                        name="alertThreshold"
                                        data-section="notifications"
                                        value={settings.notifications.alertThreshold}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Privacidad */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-header bg-info text-white d-flex align-items-center">
                                <ShieldCheckIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                <h5 className="mb-0">Ajustes de Privacidad</h5>
                            </div>
                            <div className="card-body">
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="dataSharingSwitch"
                                        name="dataSharing"
                                        data-section="privacy"
                                        checked={settings.privacy.dataSharing}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="dataSharingSwitch">
                                        Compartir Datos Anónimos para Mejoras
                                    </label>
                                </div>
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="locationTrackingSwitch"
                                        name="locationTracking"
                                        data-section="privacy"
                                        checked={settings.privacy.locationTracking}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="locationTrackingSwitch">
                                        Habilitar Rastreo de Ubicación de Dispositivos
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección General */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-header bg-success text-white d-flex align-items-center">
                                <Cog6ToothIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                <h5 className="mb-0">Ajustes Generales</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="themeSelect" className="form-label">Tema de la Interfaz</label>
                                    <select
                                        className="form-select"
                                        id="themeSelect"
                                        name="theme"
                                        data-section="general"
                                        value={settings.general.theme}
                                        onChange={handleChange}
                                    >
                                        <option value="light">Claro</option>
                                        <option value="dark">Oscuro (Próximamente)</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="languageSelect" className="form-label">Idioma</label>
                                    <select
                                        className="form-select"
                                        id="languageSelect"
                                        name="language"
                                        data-section="general"
                                        value={settings.general.language}
                                        onChange={handleChange}
                                    >
                                        <option value="es">Español</option>
                                        <option value="en">English (Próximamente)</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="timezoneInput" className="form-label">Zona Horaria</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="timezoneInput"
                                        name="timezone"
                                        data-section="general"
                                        value={settings.general.timezone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Cuenta */}
                    <div className="col-md-6 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-header bg-danger text-white d-flex align-items-center">
                                <UserIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                <h5 className="mb-0">Ajustes de Cuenta</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="displayName" className="form-label">Nombre para Mostrar</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="displayName"
                                        name="displayName"
                                        data-section="account"
                                        value={settings.account.displayName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p className="text-muted small">
                                    Para cambiar el correo electrónico o la contraseña, por favor, visite la configuración de su cuenta de Firebase directamente.
                                </p>
                                <button className="btn btn-outline-danger btn-sm mt-2" disabled>
                                    Eliminar Cuenta (Deshabilitado en demo)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Botón Guardar y Mensajes */}
                    <div className="col-12 mb-4 text-center">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </button>
                        {saveSuccess && (
                            <div className="alert alert-success d-flex align-items-center mt-3 mx-auto" role="alert" style={{ maxWidth: '400px' }}>
                                <CheckCircleIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                <div>¡Cambios guardados exitosamente!</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;