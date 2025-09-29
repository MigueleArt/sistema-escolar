// servicio-pagos/server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // para comunicación server-to-server

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Simulación de base de datos de pagos
const pagosDB = [];

// Endpoint para procesar un pago
app.post('/pagos', async (req, res) => {
    const { inscripcionId } = req.body; // En este prototipo, el ID de materia es el ID de inscripción
    console.log(`[Pagos] Solicitud de pago recibida para inscripción: ${inscripcionId}`);

    // Simula el procesamiento con una pasarela externa (dura 2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const pagoId = `PAY-${Date.now()}`;
    const nuevoPago = {
        id: pagoId,
        inscripcionId,
        monto: 5500.00,
        status: 'COMPLETADO',
        fecha: new Date()
    };
    pagosDB.push(nuevoPago);

    console.log(`[Pagos] Pago ${pagoId} completado.`);

    // --- Comunicación entre Microservicios ---
    // El servicio de pagos ahora le notifica al de inscripciones que confirme la inscripción.
    try {
        console.log(`[Pagos] Notificando al servicio de inscripciones...`);
        const response = await fetch('http://localhost:3001/inscripciones/confirmar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ materiaId: inscripcionId }),
        });
        if (!response.ok) {
            throw new Error('Falló la confirmación de la inscripción');
        }
        console.log('[Pagos] Notificación a inscripciones fue exitosa.');
    } catch (error) {
        console.error("[Pagos] Error al comunicarse con el servicio de inscripciones:", error.message);
        // Aquí iría lógica para reintentos o compensación (Saga pattern)
    }

    res.status(201).json({ success: true, comprobanteId: pagoId, message: 'Pago completado y materia inscrita.' });
});

app.listen(PORT, () => {
    console.log(`Microservicio de Pagos escuchando en el puerto ${PORT}`);
});
