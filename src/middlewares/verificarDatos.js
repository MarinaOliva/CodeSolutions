// Validar datos enviados en formularios
module.exports = (req, res, next) => {
  
  // Solo se aplica la verificación en métodos que envían datos
  if (req.method === 'POST' || req.method === 'PUT') {
    
    // Si el formulario viene vacío
    if (!req.body || Object.keys(req.body).length === 0) {
      // Mostrar mensaje de error y parar la ejecución
      return res.status(400).render('error', {
        mensaje: 'No enviaste ningún dato. Completa el formulario.'
      });
    }
  }
  
  // Si todo está bien, continuar
  next();
};
