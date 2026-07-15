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

    // Adaptado a los atributos 'name' exactos de tu formulario index.html
    const {
        fecha,
        reunion,
        asignado_a,
        numero_papeleta,
        nombre_persona,
        respuesta_si_no,
        porque
    } = req.body;

    try {
        // Asegúrate de que los nombres de las columnas coincidan con tu tabla en la base de datos
        const query = `
            INSERT INTO reuniones (
                fecha, 
                reunion, 
                asignado_a, 
                numero_papeleta, 
                nombre_persona,
                respuesta_casa, 
                porque
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        await pool.query(query, [
            fecha,
            reunion,
            asignado_a,
            numero_papeleta || null, // Si viene vacío, guarda NULL en la base de datos
            nombre_persona,
            respuesta_si_no,
            porque
        ]);

        res.status(200).json({ mensaje: "Formulario guardado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor al intentar guardar los datos" });
    }
};