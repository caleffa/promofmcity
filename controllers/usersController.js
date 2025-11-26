// controllers/usersController.js
const db = require('../db/dbconfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// =====================================================
// GET ALL USERS (requiere token vía middleware)
// =====================================================
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, username, name, lastname, email, role, status, created_at, updated_at FROM user"
        );

        res.json({
            total: rows.length,
            results: rows
        });

    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};



// =====================================================
// CREATE USER (requiere token + verifica duplicados)
// =====================================================
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name } = req.body;

        if (!username || !email || !password || !first_name || !last_name) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        // -----------------------------
        // 🔎 VALIDAR EMAIL DUPLICADO
        // -----------------------------
        const [emailExists] = await db.query(
            "SELECT id FROM user WHERE email = ?",
            [email]
        );

        if (emailExists.length > 0) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        // -----------------------------
        // 🔎 VALIDAR USERNAME DUPLICADO
        // -----------------------------
        const [usernameExists] = await db.query(
            "SELECT id FROM user WHERE username = ?",
            [username]
        );

        if (usernameExists.length > 0) {
            return res.status(400).json({ error: "El nombre de usuario ya está registrado" });
        }

        // -----------------------------
        // Crear usuario
        // -----------------------------
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO user (username, email, password, name, lastname)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            username, email, hashedPassword, first_name, last_name
        ]);

        res.json({
            message: "Usuario creado correctamente",
            userId: result.insertId
        });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: "Error al crear usuario" });
    }
};


// =====================================================
// DELETE USER
// =====================================================
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const [exists] = await db.query("SELECT id FROM user WHERE id = ?", [userId]);
        if (exists.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await db.query("DELETE FROM user WHERE id = ?", [userId]);

        res.json({ message: "Usuario eliminado correctamente" });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};


// =====================================================
// LOGIN USER (no requiere token)
// =====================================================
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y password obligatorios" });
        }

        const [rows] = await db.query(
            "SELECT id, username, email, password, name, lastname FROM user WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || "1d" }
        );

        res.json({
            message: "Login correcto",
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                lastname: user.lastname,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error en login" });
    }
};


// =====================================================
// UPDATE USER (PUT) con validación
// =====================================================
exports.updateUser = async (req, res) => {
    try {

        const userId = req.params.id;
        const { username, email, name, lastname, password, status, role } = req.body;

        // Verificar que el usuario exista
        const [userDB] = await db.query("SELECT * FROM user WHERE id = ?", [userId]);
        if (userDB.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Validar email o username duplicados (por otro usuario)
        if (username || email) {
            const [exist] = await db.query(
                "SELECT id FROM user WHERE (email = ? OR username = ?) AND id <> ?",
                [email || null, username || null, userId]
            );

            if (exist.length > 0) {
                return res.status(400).json({
                    error: "El email o username ya están registrados por otro usuario"
                });
            }
        }

        // Construir campos que se van a actualizar dinámicamente
        const fields = [];
        const values = [];

        if (username) { fields.push("username = ?"); values.push(username); }
        if (email)    { fields.push("email = ?"); values.push(email); }
        if (name)     { fields.push("name = ?"); values.push(name); }
        if (lastname) { fields.push("lastname = ?"); values.push(lastname); }
        if (status !== undefined) { fields.push("status = ?"); values.push(status); }
        if (role !== undefined)   { fields.push("role = ?"); values.push(role); }

        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            fields.push("password = ?");
            values.push(hashedPassword);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: "No se envió ningún campo para actualizar" });
        }

        const sql = `
            UPDATE user
            SET ${fields.join(", ")}
            WHERE id = ?
        `;

        values.push(userId);

        await db.query(sql, values);

        res.json({ message: "Usuario actualizado correctamente" });

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
};


// =====================================================
// GET USER BY ID (GET) 
// =====================================================
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const [rows] = await db.query(
            "SELECT id, username, email, name, lastname, role, status, created_at FROM user WHERE id = ?",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ error: "Error al obtener usuario" });
    }
};