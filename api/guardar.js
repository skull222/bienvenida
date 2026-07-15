// api/guardar.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    // Capturamos los campos exactos enviados por index_2.html
    const {
        fecha,
        reunion,
        persona,        // <-- Nuevo campo agregado
        asignado_a,
        numero_papeleta,
        nombre_persona,
        respuesta_si_no,
        porque
    } = req.body;

    try {
        // Añadimos la columna 'persona' a nuestra consulta estructurada
        const query = `
            INSERT INTO reuniones (
                fecha, 
                reunion, 
                persona,
                asignado_a, 
                numero_papeleta, 
                nombre_persona,
                respuesta_casa, 
                porque
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

        await pool.query(query, [
            fecha,
            reunion,
            persona,                        // <-- Enviamos el valor del select
            asignado_a,
            numero_papeleta || null,        // Si viene vacío, guarda NULL en la BD
            nombre_persona,
            respuesta_si_no,
            porque || null                  // Al ya no ser requerido en el HTML, guardamos NULL si está vacío
        ]);

        res.status(200).json({ mensaje: "Formulario guardado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor al intentar guardar los datos" });
    }
};
