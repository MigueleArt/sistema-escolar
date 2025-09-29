// servicio-inscripciones/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simulación de base de datos en memoria
const materiasDB = {
    'MAT101': { id: 'MAT101', nombre: 'Cálculo Diferencial', cupo: 25, inscritos: 10 },
    'FIS201': { id: 'FIS201', nombre: 'Física Clásica', cupo: 30, inscritos: 28 },
    'PROG301': { id: 'PROG301', nombre: 'Estructura de Datos', cupo: 20, inscritos: 20 },
    'DB401': { id: 'DB401', nombre: 'Bases de Datos Avanzadas', cupo: 25, inscritos: 15 },
};
const inscripcionesDB = [];

// Endpoint para obtener todas las materias (usado por el frontend)
app.get('/materias', (req, res) => {
    res.json(Object.values(materiasDB));
});

// Endpoint para procesar una inscripción
app.post('/inscripciones', (req, res) => {
    const { materiaId } = req.body;
    console.log(`[Inscripciones] Solicitud recibida para materia: ${materiaId}`);

    const materia = materiasDB[materiaId];
    if (!materia) {
        return res.status(404).json({ error: 'Materia no encontrada' });
    }

    if (materia.inscritos >= materia.cupo) {
        return res.status(400).json({ error: 'No hay cupo disponible.' });
    }

    // Lógica de pre-inscripción
    const nuevaInscripcion = { materiaId, status: 'PENDIENTE_PAGO', timestamp: new Date() };
    inscripcionesDB.push(nuevaInscripcion);

    console.log(`[Inscripciones] Pre-inscripción exitosa para ${materiaId}`);
    res.status(201).json({ success: true, message: 'Pre-inscripción exitosa. Realiza el pago para confirmar.' });
});

// Endpoint para confirmar una inscripción (llamado internamente por el servicio de pagos)
app.post('/inscripciones/confirmar', (req, res) => {
    const { materiaId } = req.body;
    console.log(`[Inscripciones] Confirmando inscripción para: ${materiaId}`);
    
    const materia = materiasDB[materiaId];
    if (materia) {
        materia.inscritos++;
        console.log(`[Inscripciones] Cupo actualizado para ${materiaId}: ${materia.inscritos}/${materia.cupo}`);
    }
    
    // Aquí también se actualizaría el estado en la base de datos de inscripciones
    res.status(200).json({ success: true, message: 'Inscripción confirmada.' });
});


app.listen(PORT, () => {
    console.log(`Microservicio de Inscripciones escuchando en el puerto ${PORT}`);
});