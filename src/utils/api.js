const BASE_URL = 'http://127.0.0.1:8000/api';

export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const url = endpoint.startsWith('/') ? `${BASE_URL}${endpoint}` : `${BASE_URL}/${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        let mensajeError = 'No autorizado';
        try {
            const data = await response.clone().json();
            if (data.mensaje || data.message || data.error) {
                mensajeError = data.mensaje || data.message || data.error;
            }
        } catch (error) {
        }
        
        throw new Error(mensajeError);
    }

    return response;
};

export default apiFetch;
