const Empresa = require('../models/empresa');

const seedearEmpresa = async () => {
  try {
    // Verificar si ya existe un documento de empresa
    const empresaExistente = await Empresa.findOne({ esUnico: true });
    
    if (empresaExistente) {
      console.log('✅ La empresa ya existe en la base de datos');
      return;
    }
    
    // Crear documento de empresa con datos por defecto
    const datosEmpresa = {
      nombreEmpresa: 'Funerales Gonzalo Mendoza',
      direccion: 'España 19-31 y Olmedo, Riobamba - Ecuador',
      telefonos: [
        '099 282 9095',
        '032 944 608',
        '098 402 1738'
      ],
      correo: 'israelmendoza18@hotmail.com',
      paginaWeb: 'www.funeralesgonzalomendoza.com',
      derechosReservados: '© Funerales Gonzalo Mendoza. Todos los derechos reservados.',
      esUnico: true,
      fechaActualizacion: new Date(),
      fechaCreacion: new Date()
    };
    
    const empresa = new Empresa(datosEmpresa);
    await empresa.save();
    
    console.log('✅ Datos de empresa insertados correctamente');
    console.log('Datos insertados:', datosEmpresa);
  } catch (error) {
    console.error('ERROR: Error al ejecutar seeding de empresa:', error.message);
  }
};

module.exports = seedearEmpresa;
