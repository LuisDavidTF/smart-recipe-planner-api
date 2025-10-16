const errorHandler = (err, req, res, next) => {
  if (err.code === 'P2002') { // Error de Prisma por violación de unicidad
    return res.status(409).json({ error: 'El email ya está registrado.' });// Conflict status code si el email ya está registrado
  }

  // Para cualquier otro error, loguealo y envía una respuesta genérica.
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
};

export default errorHandler;