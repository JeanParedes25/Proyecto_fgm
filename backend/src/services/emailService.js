const nodemailer = require('nodemailer');

// Configuración del transporte de email con Gmail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const FROM_EMAIL = process.env.EMAIL_FROM || `Funerales Gonzalo Mendoza <${process.env.EMAIL_USER}>`;

// Generar código de 6 dígitos
const generarCodigo = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Función para enviar código de verificación
const enviarCodigoVerificacion = async (email, codigo, nombre) => {
  try {
    const resultado = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Código de Verificación - Funerales Gonzalo Mendoza',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Funerales Gonzalo Mendoza</h1>
            <p style="color: #555; font-size: 16px;">Hola <strong>${nombre}</strong>,</p>
            <p style="color: #555; font-size: 16px;">Gracias por registrarte en nuestro sistema. Para completar tu registro, por favor verifica tu correo electrónico.</p>
            <div style="background-color: #3498db; color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h2 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${codigo}</h2>
            </div>
            <p style="color: #555; font-size: 14px;">Este código expirará en <strong>10 minutos</strong>.</p>
            <p style="color: #777; font-size: 12px; margin-top: 30px; text-align: center;">Si no solicitaste este código, puedes ignorar este correo.</p>
          </div>
        </div>
      `
    });

    console.log('✅ Código de verificación enviado a:', email);
    console.log('📧 Message ID:', resultado.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar código de verificación:', error);
    return false;
  }
};

// Función para enviar código de recuperación de contraseña
const enviarCodigoRecuperacion = async (email, codigo, nombre) => {
  try {
    const resultado = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Recuperación de Contraseña - Funerales Gonzalo Mendoza',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Funerales Gonzalo Mendoza</h1>
            <p style="color: #555; font-size: 16px;">Hola <strong>${nombre}</strong>,</p>
            <p style="color: #555; font-size: 16px;">Recibimos una solicitud para restablecer tu contraseña. Usa el siguiente código:</p>
            <div style="background-color: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h2 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${codigo}</h2>
            </div>
            <p style="color: #555; font-size: 14px;">Este código expirará en <strong>10 minutos</strong>.</p>
            <p style="color: #777; font-size: 12px; margin-top: 30px; text-align: center;">Si no solicitaste este código, tu cuenta puede estar en riesgo. Por favor, contacta con soporte.</p>
          </div>
        </div>
      `
    });

    console.log('✅ Código de recuperación enviado a:', email);
    console.log('📧 Message ID:', resultado.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar código de recuperación:', error);
    return false;
  }
};

// Función para enviar confirmación de cambio de contraseña
const enviarConfirmacionCambioPassword = async (email, nombre) => {
  try {
    const resultado = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Contraseña Actualizada - Funerales Gonzalo Mendoza',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Funerales Gonzalo Mendoza</h1>
            <p style="color: #555; font-size: 16px;">Hola <strong>${nombre}</strong>,</p>
            <p style="color: #555; font-size: 16px;">Tu contraseña ha sido actualizada exitosamente.</p>
            <p style="color: #777; font-size: 12px; margin-top: 30px; text-align: center;">Si no realizaste este cambio, contacta inmediatamente con soporte.</p>
          </div>
        </div>
      `
    });

    console.log('✅ Confirmación de cambio de contraseña enviada a:', email);
    console.log('📧 Message ID:', resultado.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar confirmación de cambio de contraseña:', error);
    return false;
  }
};

module.exports = {
  enviarCodigoVerificacion,
  enviarCodigoRecuperacion,
  enviarConfirmacionCambioPassword,
  generarCodigo
};
