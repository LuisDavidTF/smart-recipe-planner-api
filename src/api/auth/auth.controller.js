import { registerUser } from './auth.service.js';

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;
    if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }
    try {
    const user = await registerUser({ name, email, password_hash: password });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};