// api-gateway/server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware para habilitar CORS y parsear JSON
app.use(cors());
app.use(express.json());

// Proxy para el servicio de inscripciones
app.use('/api/inscripciones', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/inscripciones': '/inscripciones', // Reescribe /api/inscripciones -> /inscripciones
    },
}));

// Proxy para el servicio de pagos
app.use('/api/pagos', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/api/pagos': '/pagos', // Reescribe /api/pagos -> /pagos
    },
}));

app.listen(PORT, () => {
    console.log(`API Gateway escuchando en el puerto ${PORT}`);
});
