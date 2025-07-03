// src/components/auth/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpia errores anteriores
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Usuario inició sesión exitosamente');
            navigate('/dashboard'); // Redirige al dashboard después del login
        } catch (err) {
            console.error('Error al iniciar sesión:', err.message);
            setError('Error al iniciar sesión: ' + err.message);
        }
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
            <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4 fs-3 fw-bold">Iniciar Sesión</h2>
                    {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-bold">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label fw-bold">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                    <p className="mt-3 text-center text-secondary">
                        ¿No tienes una cuenta? <Link to="/signup" className="text-primary text-decoration-none">Regístrate aquí</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;