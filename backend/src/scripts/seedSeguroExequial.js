// Script para crear datos por defecto de Seguro de Asistencia Exequial
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const seguroSchema = new mongoose.Schema({
  tipo: { type: String, required: true, unique: true },
  titulo: String,
  descripcion: String,
  precio: Number,
  caracteristicas: [String],
  requisitos: [String],
  coberturas: [String],
  activo: { type: Boolean, default: true }
});

const Seguro = mongoose.model('Seguro', seguroSchema);

async function seedSeguroExequial() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Conectado a MongoDB\n');

    // Verificar si ya existe
    const existente = await Seguro.findOne({ tipo: 'exequial' });
    
    if (existente) {
      console.log('⚠ El seguro exequial ya existe. Eliminando para recrear...');
      await Seguro.deleteOne({ tipo: 'exequial' });
    }

    // Crear nuevo seguro exequial
    const  seguroExequial = new Seguro({
      tipo: 'exequial',
      titulo: 'Asistencia Exequial',
      descripcion: 'Protege a tu familia con nuestro seguro de asistencia exequial. Por solo $1 al mes, garantiza un funeral digno y sin preocupaciones económicas.',
      precio: 1,
      caracteristicas: [
        'Cobertura integral de servicios funerarios',
        'Atención personalizada las 24 horas',
        'Traslado nacional incluido',
        'Asesoría legal y administrativa',
        'Sin periodo de carencia',
        'Renovación automática'
      ],
      requisitos: [
        'Ser mayor de 18 años',
        'Documento de identidad vigente',
        'Datos de contacto actualizados',
        'Pago mensual de $1'
      ],
      coberturas: [
        'Servicios funerarios completos',
        'Sala de velación',
        'Carroza fúnebre',
        'Trámites legales',
        'Urna o ataúd básico',
        'Cremación o inhumación',
        'Traslado del cuerpo',
        'Acompañamiento profesional'
      ],
      activo: true
    });

    await seguroExequial.save();
    console.log('✓ Seguro de Asistencia Exequial creado exitosamente');
    console.log(`  - Precio: $${seguroExequial.precio}/mes`);
    console.log(`  - Características: ${seguroExequial.caracteristicas.length}`);
    console.log(`  - Coberturas: ${seguroExequial.coberturas.length}\n`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedSeguroExequial();
