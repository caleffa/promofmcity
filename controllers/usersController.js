// controllers/usersController.js
const db = require('../config/dbconfig'); // conexión MySQL

// GET /users
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id,first_name,last_name,email,phone,role,status,created_at,updated_at FROM users");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

module.exports = {
    getAllUsers
};