// src/pages/ReportsPage.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext'; // Para la lógica de autenticación

const ReportsPage = () => {
    const { currentUser } = useAuth();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generateMockReport = () => {
            // Simula un pequeño retraso para la "generación" del informe
            setTimeout(() => {
                const mockReportData = {
                    title: "Informe de Análisis de Datos de Sensores (Últimas 24h)",
                    summary: "Este informe presenta un resumen de las lecturas de temperatura y humedad de los sensores conectados durante las últimas 24 horas. Se han identificado tendencias generales y posibles anomalías para su revisión.",
                    keyMetrics: [
                        { name: "Temperatura Promedio", value: "24.3°C", icon: "bi-thermometer-half", color: "text-info" },
                        { name: "Temperatura Máxima", value: "28.1°C", icon: "bi-thermometer-high", color: "text-danger" },
                        { name: "Temperatura Mínima", value: "20.5°C", icon: "bi-thermometer-low", color: "text-primary" },
                        { name: "Humedad Promedio", value: "68%", icon: "bi-cloud-haze2-fill", color: "text-secondary" },
                        { name: "Dispositivos Activos", value: "12/15", icon: "bi-activity", color: "text-success" }
                    ],
                    observations: [
                        "La temperatura se mantuvo en un rango estable durante la mayor parte del día, con un pico registrado a las 14:30. Este pico no superó los umbrales críticos.",
                        "Se observó un ligero descenso en la humedad durante la madrugada, volviendo a los niveles normales hacia el mediodía.",
                        "No se detectaron anomalías significativas en el comportamiento de los sensores."
                    ],
                    recommendations: [
                        "Continuar monitoreando las fluctuaciones de temperatura y humedad, especialmente en periodos de cambios climáticos extremos.",
                        "Considerar la recalibración semestral de los sensores para asegurar la precisión de las lecturas."
                    ],
                    generatedAt: new Date().toLocaleString()
                };
                setReport(mockReportData);
                setLoading(false);
            }, 1000); // 1 segundo de simulación de carga
        };

        if (currentUser) {
            setLoading(true);
            generateMockReport();
        } else {
            setReport(null);
            setLoading(false);
        }
    }, [currentUser]);

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Informes y Análisis | Watana</title>
                <meta name="description" content="Genera y visualiza informes detallados." />
            </Helmet>
            <h1 className="mb-4">Informes y Análisis</h1>

            {!currentUser && (
                <div className="alert alert-warning text-center" role="alert">
                    Por favor, inicie sesión para ver los informes.
                </div>
            )}

            {currentUser && loading && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Generando informe...</span>
                    </div>
                    <p className="text-secondary">Generando informe de análisis...</p>
                </div>
            )}

            {currentUser && report && (
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">{report.title}</h5>
                    </div>
                    <div className="card-body">
                        <p className="card-text">{report.summary}</p>
                        <hr />

                        <h6 className="card-subtitle mb-3 text-muted">Métricas Clave:</h6>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mb-4">
                            {report.keyMetrics.map((metric, index) => (
                                <div key={index} className="col">
                                    <div className="p-3 border bg-light rounded d-flex align-items-center">
                                        <i className={`bi ${metric.icon} fs-4 me-3 ${metric.color}`}></i>
                                        <div>
                                            <small className="text-muted d-block">{metric.name}</small>
                                            <h5 className="mb-0">{metric.value}</h5>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h6 className="card-subtitle mb-2 text-muted">Observaciones:</h6>
                        <ul className="list-group list-group-flush mb-4">
                            {report.observations.map((obs, index) => (
                                <li key={index} className="list-group-item">{obs}</li>
                            ))}
                        </ul>

                        <h6 className="card-subtitle mb-2 text-muted">Recomendaciones:</h6>
                        <ul className="list-group list-group-flush mb-4">
                            {report.recommendations.map((rec, index) => (
                                <li key={index} className="list-group-item">{rec}</li>
                            ))}
                        </ul>

                        <p className="text-end text-muted fst-italic mt-3">Generado el: {report.generatedAt}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;