// api-gateway/server.js (PARA PRODUCCIÓN EN RENDER)
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
// Render asigna el puerto a través de una variable de entorno.
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Proxy para el servicio de inscripciones
app.use('/api/inscripciones', createProxyMiddleware({
    target: 'https://servicio-inscripciones-escolar.onrender.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/inscripciones': '', // Regla de reescritura de ruta corregida
    },
}));

// Proxy para el servicio de pagos
app.use('/api/pagos', createProxyMiddleware({
    target: 'https://servicio-pagos-escolar.onrender.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/pagos': '', // Regla de reescritura de ruta corregida
    },
}));

app.listen(PORT, () => {
    console.log(`API Gateway escuchando en el puerto ${PORT}`);
});

