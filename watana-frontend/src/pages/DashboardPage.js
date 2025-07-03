// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import useSse from '../hooks/useSse'; // Importa tu hook SSE

const DashboardPage = () => {
    const { currentUser } = useAuth();
    const [chartOptions, setChartOptions] = useState({});
    const [historicalData, setHistoricalData] = useState([]); // Para datos históricos/iniciales
    const [loadingHistorical, setLoadingHistorical] = useState(true);
    const [historicalError, setHistoricalError] = useState(null);

    // Nuevos estados para el panel de información y alertas
    const [deviceSummary, setDeviceSummary] = useState({
        totalDevices: 15,
        activeDevices: 12,
        drones: 5,
        sensors: 10,
        averageTemperature: 'N/A' // Se actualizará con los datos SSE
    });
    const [recentAlerts, setRecentAlerts] = useState([]); // Para las alertas simuladas

    // Usa el hook useSse para la conexión en tiempo real
    // La URL de tu endpoint SSE en el backend de Spring Boot
    const sseUrl = 'http://localhost:8080/api/sse/realtime-data';
    const { data: realtimeData, error: sseError } = useSse(sseUrl, !!currentUser, 'message'); // 'message' es el tipo de evento por defecto

    // Configuración básica del gráfico de ECharts
    const getChartOption = (data) => {
        // Asegúrate de que los datos no estén vacíos antes de mapear
        if (!data || data.length === 0) {
            return {}; // Retorna un objeto vacío o una opción predeterminada
        }
        return {
            title: {
                text: 'Lecturas de Temperatura en Tiempo Real',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: data.map(item => item.time), // Eje X: Tiempo
                name: 'Tiempo'
            },
            yAxis: {
                type: 'value',
                name: 'Temperatura (°C)'
            },
            series: [{
                name: 'Temperatura',
                type: 'line',
                data: data.map(item => item.value), // Eje Y: Valor de temperatura
                smooth: true,
                markPoint: {
                    data: [
                        { type: 'max', name: 'Máx' },
                        { type: 'min', name: 'Mín' }
                    ]
                },
                markLine: {
                    data: [{ type: 'average', name: 'Promedio' }]
                }
            }],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            dataZoom: [ // Añadir zoom para ver datos históricos si hay muchos
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                },
                {
                    start: 0,
                    end: 100
                }
            ],
        };
    };

    // Efecto para cargar datos históricos (si fueran de otra API REST)
    // Por ahora, usamos una simulación de datos iniciales.
    useEffect(() => {
        const fetchHistoricalData = async () => {
            if (currentUser) {
                setLoadingHistorical(true);
                setHistoricalError(null);
                try {
                    // Simulación de una llamada a una API REST para datos históricos
                    // En una aplicación real, aquí llamarías a tu backend:
                    // const idToken = await currentUser.getIdToken();
                    // const response = await axios.get('http://localhost:8080/api/historical-data', {
                    //     headers: { Authorization: `Bearer ${idToken}` }
                    // });
                    // setHistoricalData(response.data);

                    const initialData = [
                        { time: '10:00:00', value: 22 },
                        { time: '10:00:05', value: 23 },
                        { time: '10:00:10', value: 22.5 },
                        { time: '10:00:15', value: 24 },
                        { time: '10:00:20', value: 23.8 }
                    ];
                    setHistoricalData(initialData);

                } catch (err) {
                    console.error("Error al cargar datos históricos:", err);
                    setHistoricalError("No se pudieron cargar los datos históricos.");
                } finally {
                    setLoadingHistorical(false);
                }
            } else {
                setHistoricalData([]);
                setLoadingHistorical(false);
                setHistoricalError("Inicie sesión para ver los datos del dashboard.");
            }
        };

        fetchHistoricalData();
    }, [currentUser]);

    // Efecto para actualizar el gráfico cuando llegan nuevos datos en tiempo real
    useEffect(() => {
        if (realtimeData) {
            setHistoricalData(prevData => {
                const updatedData = [...prevData, realtimeData];
                // Si quieres mantener un número limitado de puntos de datos para el gráfico en tiempo real:
                // const limitedData = updatedData.slice(-50); // Mantén las últimas 50 lecturas
                setChartOptions(getChartOption(updatedData));
                return updatedData; // Devuelve los datos actualizados para el estado
            });

            // Actualizar la temperatura promedio en el panel de información
            setDeviceSummary(prevSummary => ({
                ...prevSummary,
                averageTemperature: realtimeData.value.toFixed(1) // Muestra la última temperatura como promedio simulado
            }));

            // Simulación de alertas basadas en el valor de temperatura
            if (realtimeData.value > 27) { // Si la temperatura es alta
                const newAlert = {
                    id: Date.now(),
                    type: 'alert',
                    title: '¡Alerta de Temperatura Alta!',
                    message: `Dispositivo ${realtimeData.deviceId || 'N/A'} reporta ${realtimeData.value}°C.`,
                    timestamp: new Date().toLocaleTimeString()
                };
                setRecentAlerts(prevAlerts => [newAlert, ...prevAlerts].slice(0, 5)); // Mantén las últimas 5 alertas
            } else if (realtimeData.value < 21) { // Si la temperatura es baja
                const newAlert = {
                    id: Date.now(),
                    type: 'info',
                    title: 'Lectura de Temperatura Baja',
                    message: `Dispositivo ${realtimeData.deviceId || 'N/A'} reporta ${realtimeData.value}°C (baja).`,
                    timestamp: new Date().toLocaleTimeString()
                };
                setRecentAlerts(prevAlerts => [newAlert, ...prevAlerts].slice(0, 5));
            }
        }
    }, [realtimeData]); // Se dispara cada vez que `realtimeData` del hook SSE cambia

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Dashboard | Watana</title>
                <meta name="description" content="Tablero de control para monitorear drones y sensores en tiempo real." />
            </Helmet>
            <h1 className="mb-4">Dashboard de Monitoreo</h1>

            {historicalError && (
                <div className="alert alert-warning" role="alert">
                    {historicalError}
                </div>
            )}
            {sseError && (
                <div className="alert alert-danger" role="alert">
                    {sseError}
                </div>
            )}

            {loadingHistorical ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando datos históricos...</span>
                    </div>
                    <p className="text-secondary">Cargando datos históricos...</p>
                </div>
            ) : historicalData.length === 0 && !sseError ? (
                 <div className="alert alert-info text-center">
                     No hay datos disponibles para mostrar en el dashboard.
                 </div>
            ) : (
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Lecturas de Sensores en Tiempo Real</h5>
                    </div>
                    <div className="card-body">
                        {/* Renderiza el gráfico solo si chartOptions está configurado */}
                        {Object.keys(chartOptions).length > 0 ? (
                            <ReactECharts option={chartOptions} style={{ height: '400px' }} />
                        ) : (
                            <p className="text-center text-secondary">Esperando datos en tiempo real...</p>
                        )}
                    </div>
                </div>
            )}


            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">Panel de Información</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total de Dispositivos
                                    <span className="badge bg-primary rounded-pill">{deviceSummary.totalDevices}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Dispositivos Activos
                                    <span className="badge bg-success rounded-pill">{deviceSummary.activeDevices}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Drones
                                    <span className="badge bg-secondary rounded-pill">{deviceSummary.drones}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Sensores
                                    <span className="badge bg-secondary rounded-pill">{deviceSummary.sensors}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Temperatura Promedio (Última)
                                    <span className={`badge ${parseFloat(deviceSummary.averageTemperature) > 27 ? 'bg-danger' : 'bg-info'} rounded-pill`}>
                                        {deviceSummary.averageTemperature}°C
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Alertas Recientes</h5>
                        </div>
                        <div className="card-body">
                            {recentAlerts.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {recentAlerts.map(alert => (
                                        <li key={alert.id} className={`list-group-item ${alert.type === 'alert' ? 'list-group-item-danger' : 'list-group-item-info'}`}>
                                            <div className="d-flex w-100 justify-content-between">
                                                <h6 className="mb-1">{alert.title}</h6>
                                                <small className="text-muted">{alert.timestamp}</small>
                                            </div>
                                            <p className="mb-1">{alert.message}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-secondary">No hay alertas recientes.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
