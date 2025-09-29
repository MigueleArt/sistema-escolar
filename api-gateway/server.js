// api-gateway/server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
// Render asigna el puerto dinámicamente, por eso usamos process.env.PORT
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Proxy para el servicio de inscripciones
app.use('/api/inscripciones', createProxyMiddleware({
    // URL PÚBLICA DEL SERVICIO DE INSCRIPCIONES
    target: 'https://servicio-inscripciones-escolar.onrender.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/inscripciones': '/inscripciones',
    },
}));

// Proxy para el servicio de pagos
app.use('/api/pagos', createProxyMiddleware({
    // URL PÚBLICA DEL SERVICIO DE PAGOS
    target: 'https://servicio-pagos-escolar.onrender.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/pagos': '/pagos',
    },
}));

app.listen(PORT, () => {
    console.log(`API Gateway escuchando en el puerto ${PORT}`);
});
