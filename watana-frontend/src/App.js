// src/App.js
import React, { Suspense, lazy, useState, useEffect } from 'react'; // Importa Suspense, lazy, useState y useEffect
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomeIcon, DeviceTabletIcon, DocumentTextIcon, ChartPieIcon, MapIcon, EnvelopeIcon, Cog6ToothIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import './index.css'; // Mantenemos el index.css para estilos generales y personalización de colores
import { useAuth } from './context/AuthContext';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { HelmetProvider } from 'react-helmet-async'; // Importa HelmetProvider

// Importa tu logo JPG. Ajusta la ruta si tu carpeta 'resources' está en otra ubicación relativa a App.js
import watanaLogo from './resources/img/Logo_Watana.jpg';
import Dashboard1 from './resources/img/Dashboard1.webp';
import Dashboard2 from './resources/img/Dashboard2.jpg';
import Dashboard3 from './resources/img/Dashboard3.jpg';
import Dispositivo1 from './resources/img/Dispositivos1.jpg';
import Dispositivo2 from './resources/img/Dispositivos2.jpg';
import Dispositivo3 from './resources/img/Dispositivos3.jpg';
import Informe1 from './resources/img/Informes1.jpg';
import Informe2 from './resources/img/Informes2.jpg';
import Informe3 from './resources/img/Informes3.webp';
import Mapa1 from './resources/img/Mapas1.jpg';
import Mapa2 from './resources/img/Mapas2.jpg';
import Mapa3 from './resources/img/Mapas3.jpg';

// Componentes de Autenticación
const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/Signup'));

// Nuevos Componentes (cargados de forma perezosa)
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DevicesPage = lazy(() => import('./pages/DevicesPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DeviceFormPage = lazy(() => import('./pages/DeviceFormPage')); // Para añadir/editar dispositivos

// Componente para las tarjetas de características con slider de imágenes y efecto fade
// Ahora solo mostrará la imagen con el texto superpuesto
const FeatureCard = ({ images, link, imageText, index }) => { // Añadido 'index' como prop
    const [currentBgImage, setCurrentBgImage] = useState(images[0] || '');
    const [nextBgImage, setNextBgImage] = useState(images.length > 1 ? images[1] : images[0] || '');
    const [isFading, setIsFading] = useState(false); // Estado para controlar la transición de opacidad

    useEffect(() => {
        if (!images || images.length <= 1) {
            setCurrentBgImage(images[0] || '');
            setNextBgImage(images[0] || '');
            setIsFading(false);
            return;
        }

        let currentIndex = 0;
        const totalImages = images.length;

        const intervalId = setInterval(() => {
            const newNextIndex = (currentIndex + 1) % totalImages;
            setNextBgImage(images[newNextIndex]);
            setIsFading(true);

            const transitionTimeout = setTimeout(() => {
                setCurrentBgImage(images[newNextIndex]);
                setIsFading(false);
                currentIndex = newNextIndex;
            }, 1000); // DEBE COINCIDIR CON LA DURACIÓN DE LA TRANSICIÓN CSS

            return () => clearTimeout(transitionTimeout);
        }, 5000); // Duración total del ciclo (ej. 4s de visualización + 1s de fade = 5s)

        return () => clearInterval(intervalId);
    }, [images]);

    // Determina si el texto debe estar alineado a la izquierda (índices pares) o a la derecha (índices impares)
    const isLeftAligned = index % 2 === 0;

    return (
        <Link to={link} className="card h-100 text-decoration-none watana-feature-card w-100">
            {/* La tarjeta ahora es completamente la imagen con el texto */}
            <div className="watana-card-background d-flex align-items-center justify-content-center text-center">
                {/* Capa de imagen actual (se desvanece) */}
                <div
                    className="image-overlay-layer"
                    style={{
                        backgroundImage: `url(${currentBgImage})`,
                        opacity: isFading ? 0 : 1,
                        zIndex: isFading ? 1 : 2
                    }}
                ></div>
                {/* Capa de imagen siguiente (aparece) */}
                <div
                    className="image-overlay-layer"
                    style={{
                        backgroundImage: `url(${nextBgImage})`,
                        opacity: isFading ? 1 : 0,
                        zIndex: isFading ? 2 : 1
                    }}
                ></div>
                {/* Texto descriptivo sobre la imagen */}
                {imageText && (
                    // Ajuste: Añadir estilo en línea para asegurar z-index, opacidad, color,
                    // ancho limitado y alineación justificada.
                    <div
                        className={`position-absolute top-0 h-100 d-flex flex-column justify-content-center px-4`}
                        style={{
                            zIndex: 3,
                            opacity: 1,
                            color: 'white',
                            maxWidth: '33.33%', // Limita el ancho a un tercio de la imagen
                            left: isLeftAligned ? '5%' : 'auto', // Alineación a la izquierda o auto
                            right: isLeftAligned ? 'auto' : '5%', // Auto o alineación a la derecha
                            textAlign: isLeftAligned ? 'left' : 'right' // Justificación hacia el lado respectivo
                        }}
                    >
                        <p className="lead fw-bold text-shadow-lg" style={{
                            fontSize: '3rem', // Aumentado el tamaño de fuente
                            lineHeight: '1.2',
                            // No se necesita textAlign aquí, ya lo aplicamos al div contenedor
                        }}>{imageText}</p>
                    </div>
                )}
            </div>
        </Link>
    );
};


// Datos para las tarjetas de características en la HomePage
const featureCards = [
    {
        imageText: "Visualiza tus datos en tiempo real con nuestro Dashboard Interactivo. Gráficos claros para decisiones rápidas.",
        images: [
            Dashboard1, // Usando la imagen importada
            Dashboard2, // Usando la imagen importada
            Dashboard3  // Usando la imagen importada
        ],
        link: "/dashboard",
    },
    {
        imageText: "Control total de tus drones y sensores. Gestiona configuraciones y monitorea su rendimiento fácilmente.",
        images: [
            Dispositivo1,
            Dispositivo2,
            Dispositivo3
        ],
        link: "/devices",
    },
    {
        imageText: "Accede a informes detallados y análisis avanzados. Entiende mejor tus operaciones con datos históricos.",
        images: [
            Informe1,
            Informe2,
            Informe3
        ],
        link: "/reports",
    },
    {
        imageText: "Localiza tus activos en un mapa interactivo. Sigue rutas de vuelo y zonas de interés en tiempo real.",
        images: [
            Mapa1,
            Mapa2,
            Mapa3
        ],
        link: "/map",
    },
];

// Componente HomePage
const HomePage = () => (
    <div className="flex-grow-1">
        {/* Sección Principal Hero */}
        <div className="d-flex flex-column align-items-center justify-content-center text-white py-5 px-4 text-center"
            style={{
                background: 'linear-gradient(to right, var(--watana-primary-light), var(--watana-primary-dark))', // Degradado de verde planta
                minHeight: '70vh', // Ocupa al menos el 70% de la altura de la vista
                position: 'relative',
                overflow: 'hidden'
            }}>
            {/* Imagen de fondo principal (con un degradado sutil para que el texto sea legible) */}
            <div className="position-absolute w-100 h-100" style={{
                backgroundImage: 'url("https://blog.viajesmachupicchu.travel/wp-content/uploads/2024/12/bosques-de-quenuas-portada.png")', // Reemplaza con URL de imagen real de fondo de hero
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.2, // Ajusta la opacidad para que el texto sea visible
                zIndex: 0
            }}></div>
            <div style={{ zIndex: 1 }}>
                {/* Usamos la imagen importada directamente, sin el contenedor blanco adicional */}
                <img
                    src={watanaLogo} // Usa la variable importada (src/resources/img/Logo_Watana.jpg)
                    alt="Watana Logo"
                    className="mx-auto" // Añadimos esta clase para centrar horizontalmente el logo
                    style={{ height: '6rem', width: '6rem', display: 'block', borderRadius: '50%', marginBottom: '1.5rem', border: '2px solid rgba(255,255,255,0.7)', boxShadow: '0 .5rem 1rem rgba(0,0,0,.15)' }}
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/CCCCCC/000000?text=Logo+Error"; }} // Fallback en caso de error
                />
                <h1 className="display-2 fw-bold text-center mb-1 text-shadow-lg">
                    Watana
                </h1>
                <p className="lead text-center mb-5" style={{ maxWidth: '800px', textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}>
                    Monitoreo inteligente para un mundo conectado. Transforma la gestión de tus drones y sensores IoT. Obtén datos en tiempo real, análisis avanzados por IA y una visión completa de tus activos para decisiones más inteligentes y operaciones optimizadas.
                </p>
                <div className="mt-4 d-flex flex-column flex-md-row justify-content-center align-items-center">
                    <Link to="/devices" className="btn btn-light btn-lg me-md-3 mb-3 mb-md-0 shadow-lg watana-button-primary">
                        <DeviceTabletIcon className="me-2" style={{ height: '1.5rem', width: '1.5rem' }} />
                        Explorar Dispositivos
                    </Link>
                    <Link to="/dashboard" className="btn btn-outline-light btn-lg shadow-lg watana-button-secondary">
                        <ChartPieIcon className="me-2" style={{ height: '1.5rem', width: '1.5rem' }} />
                        Ver Dashboard
                    </Link>
                </div>
            </div>
        </div>

        {/* Sección de Características/Destacados */}
        {/* El título se mantiene dentro de un contenedor para una mejor alineación */}
        <div className="container py-5">
            <h2 className="text-center mb-5 display-4 fw-bold text-watana-primary">Explora Nuestras Funcionalidades</h2>
        </div>
        {/* Las FeatureCards ahora ocupan el ancho completo sin un contenedor limitante */}
        <div className="bg-watana-light"> {/* Sin clase 'container' aquí */}
            <div className="row g-0 mx-0"> {/* Usamos row g-0 mx-0 para ocupar todo el ancho sin márgenes de fila */}
                {featureCards.map((card, index) => (
                    // Añadimos mb-watana-xl directamente a cada columna para el espacio vertical
                    <div className="col-12 d-flex mb-watana-xl" key={index}> {/* CAMBIO AQUÍ: mb-watana-xl directamente en col */}
                        <FeatureCard {...card} index={index} /> {/* Pasar el índice */}
                    </div>
                ))}
            </div>
        </div>
    </div>
);


function App() {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    const noNavbarRoutes = ['/login', '/signup'];
    const showNavbar = !noNavbarRoutes.includes(location.pathname);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("Sesión cerrada exitosamente.");
        } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        };

        if (loading) {
            return (
                <div className="d-flex align-items-center justify-content-center min-vh-100 bg-watana-light">
                    <div className="spinner-border text-watana-primary" role="status">
                        <span className="visually-hidden">Cargando autenticación...</span>
                    </div>
                    <p className="ms-2 text-watana-secondary-text">Cargando autenticación...</p>
                </div>
            );
        }

        return (
            <HelmetProvider> {/* Envuelve toda la aplicación con HelmetProvider */}
                <div className="d-flex flex-column min-vh-100 bg-watana-light">
                    {showNavbar && (
                        <nav className="navbar navbar-expand-lg navbar-dark bg-watana-secondary shadow-sm"> {/* Cambiado a bg-watana-secondary */}
                            <div className="container-fluid">
                                <Link to="/" className="navbar-brand fs-3 fw-bold">Watana</Link>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarNav">
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                        <NavItem to="/" icon={<HomeIcon className="me-1" style={{ height: '1.25rem', width: '1.25rem' }} />} text="Inicio" />
                                        <NavItem to="/dashboard" icon={<ChartPieIcon className="me-1" style={{ height: '1.25rem', width: '1.25rem' }} />} text="Dashboard" />
                                        <NavItem to="/devices" icon={<DeviceTabletIcon className="me-1" style={{ height: '1.25rem', width: '1.25rem' }} />} text="Dispositivos" />
                                        <NavItem to="/reports" icon={<DocumentTextIcon className="me-1" style={{ height: '1.25rem', width: '1.25rem' }} />} text="Informes" />
                                        <NavItem to="/map" icon={<MapIcon className="me-1" style={{ height: '1.25rem', width: '1.25rem' }} />} text="Mapa" />
                                        <NavItem to="/notifications" icon={<EnvelopeIcon className="me-1" style={{ height: '1.25rem', width: '1.25rem' }} />} text="Notificaciones" />
                                    </ul>
                                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                        {currentUser ? (
                                            <>
                                                <NavItem to="/profile" icon={<UserIcon className="me-1" style={{ height: '1.25rem', width: '1.25rem' }} />} text="Perfil" />
                                                <li className="nav-item">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="btn btn-outline-light me-2 d-flex align-items-center"
                                                    >
                                                        <ArrowRightOnRectangleIcon className="me-1" style={{ height: '1.25rem', width: '1.25rem' }} />
                                                        Cerrar Sesión
                                                    </button>
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                                <NavItem to="/login" icon={<UserIcon className="me-1" style={{ height: '1.25rem', width: '1.25rem' }} />} text="Iniciar Sesión" />
                                                <NavItem to="/signup" icon={<UserIcon className="me-1" style={{ height: '1.25rem', width: '1.25rem' }} />} text="Registrarse" />
                                            </>
                                        )}
                                        <NavItem to="/settings" icon={<Cog6ToothIcon className="me-1" style={{ height: '1.25rem', width: '1.25rem' }} />} text="Configuración" />
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    )}

                    <main className="flex-grow-1">
                        <Suspense fallback={
                            <div className="d-flex align-items-center justify-content-center min-vh-100 bg-watana-light">
                                <div className="spinner-border text-watana-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                                <p className="ms-2 text-watana-secondary-text">Cargando componente...</p>
                            </div>
                        }>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/dashboard" element={currentUser ? <DashboardPage /> : <Login />} />
                                <Route path="/devices" element={currentUser ? <DevicesPage /> : <Login />} />
                                <Route path="/devices/new" element={currentUser ? <DeviceFormPage /> : <Login />} />
                                <Route path="/devices/edit/:id" element={currentUser ? <DeviceFormPage /> : <Login />} />
                                <Route path="/reports" element={currentUser ? <ReportsPage /> : <Login />} />
                                <Route path="/map" element={currentUser ? <MapPage /> : <Login />} />
                                <Route path="/notifications" element={currentUser ? <NotificationsPage /> : <Login />} />
                                <Route path="/profile" element={currentUser ? <ProfilePage /> : <Login />} />
                                <Route path="/settings" element={currentUser ? <SettingsPage /> : <Login />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                            </Routes>
                        </Suspense>
                    </main>

                    <footer className="bg-watana-dark text-white text-center p-3 mt-auto">
                        <p className="mb-0">&copy; {new Date().getFullYear()} Watana. Todos los derechos reservados.</p>
                    </footer>
                </div>
            </HelmetProvider>
        );
    }

    // Helper component for navigation items
    const NavItem = ({ to, icon, text }) => (
        <li className="nav-item">
            <Link
                to={to}
                className="nav-link text-white d-flex align-items-center"
                aria-current="page"
            >
                {icon}
                {text}
            </Link>
        </li>
    );

export default App;
