// servicio-pagos/server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

const pagosDB = [];

app.post('/pagos', async (req, res) => {
    const { inscripcionId } = req.body;
    console.log(`[Pagos] Solicitud de pago recibida para inscripción: ${inscripcionId}`);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const pagoId = `PAY-${Date.now()}`;
    pagosDB.push({ id: pagoId, inscripcionId, status: 'COMPLETADO' });

    console.log(`[Pagos] Pago ${pagoId} completado.`);

    try {
        console.log(`[Pagos] Notificando al servicio de inscripciones...`);
        
        // URL PÚBLICA DEL SERVICIO DE INSCRIPCIONES PARA LA COMUNICACIÓN INTERNA
        const response = await fetch('https://servicio-inscripciones-escolar.onrender.com/inscripciones/confirmar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ materiaId: inscripcionId }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Falló la confirmación de la inscripción: ${errorText}`);
        }
        console.log('[Pagos] Notificación a inscripciones fue exitosa.');
    } catch (error) {
        console.error("[Pagos] Error al comunicarse con el servicio de inscripciones:", error.message);
    }

    res.status(201).json({ success: true, comprobanteId: pagoId, message: 'Pago completado y materia inscrita.' });
});

app.listen(PORT, () => {
    console.log(`Microservicio de Pagos escuchando en el puerto ${PORT}`);
});

