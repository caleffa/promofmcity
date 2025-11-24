// controllers/usersController.js
const db = require('../db/dbconfig'); // conexión MySQL


exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id,first_name,last_name,email,phone,role,status,created_at,updated_at FROM user');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};


exports.createUser = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name } = req.body;

        if (!username || !email || !password || !first_name || !last_name ) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const sql = `
            INSERT INTO user (username, email, password, last_name, first_name)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [username, email, password, first_name, last_name]);

        res.json({
            message: "Usuario creado correctamente",
            userId: result.insertId
        });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: "Error al crear usuario" });
    }
};