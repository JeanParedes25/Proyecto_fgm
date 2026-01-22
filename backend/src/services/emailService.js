const nodemailer = require('nodemailer');

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER || 'jeanparedes918@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'tu_contraseña_de_aplicación'
  }
});

// Verificar la configuración del transportador
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Error en la configuración del email:', error);
  } else {
    console.log('✅ Servidor de email listo para enviar mensajes');
  }
});

// Función para enviar código de verificación
const enviarCodigoVerificacion = async (email, codigo, nombre) => {
  try {
    const mailOptions = {
      from: `"Funeraria San Miguel" <${process.env.EMAIL_USER || 'jeanparedes918@gmail.com'}>`,
      to: email,
      subject: 'Código de Verificación - Funeraria San Miguel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Funeraria San Miguel</h1>
            <p style="color: #555; font-size: 16px;">Hola <strong>${nombre}</strong>,</p>
            <p style="color: #555; font-size: 16px;">Gracias por registrarte en nuestro sistema. Para completar tu registro, por favor verifica tu correo electrónico.</p>
            <div style="background-color: #3498db; color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h2 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${codigo}</h2>
            </div>
            <p style="color: #555; font-size: 14px;">Este código expirará en <strong>15 minutos</strong>.</p>
            <p style="color: #777; font-size: 12px; margin-top: 30px; text-align: center;">Si no solicitaste este código, puedes ignorar este correo.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Código de verificación enviado a:', email);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar código de verificación:', error);
    return false;
  }
};

// Función para enviar código de recuperación de contraseña
const enviarCodigoRecuperacion = async (email, codigo, nombre) => {
  try {
    const mailOptions = {
      from: `"Funeraria San Miguel" <${process.env.EMAIL_USER || 'jeanparedes918@gmail.com'}>`,
      to: email,
      subject: 'Recuperación de Contraseña - Funeraria San Miguel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Funeraria San Miguel</h1>
            <p style="color: #555; font-size: 16px;">Hola <strong>${nombre}</strong>,</p>
            <p style="color: #555; font-size: 16px;">Recibimos una solicitud para restablecer tu contraseña. Usa el siguiente código:</p>
            <div style="background-color: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h2 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${codigo}</h2>
            </div>
            <p style="color: #555; font-size: 14px;">Este código expirará en <strong>15 minutos</strong>.</p>
            <p style="color: #777; font-size: 12px; margin-top: 30px; text-align: center;">Si no solicitaste este código, tu cuenta puede estar en riesgo. Por favor, contacta con soporte.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Código de recuperación enviado a:', email);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar código de recuperación:', error);
    return false;
  }
};

// Función para enviar confirmación de cambio de contraseña
const enviarConfirmacionCambioPassword = async (email, nombre) => {
  try {
    const mailOptions = {
      from: `"Funeraria San Miguel" <${process.env.EMAIL_USER || 'jeanparedes918@gmail.com'}>`,
      to: email,
      subject: 'Contraseña Actualizada - Funeraria San Miguel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Funeraria San Miguel</h1>
            <p style="color: #555; font-size: 16px;">Hola <strong>${nombre}</strong>,</p>
            <p style="color: #555; font-size: 16px;">Tu contraseña ha sido actualizada exitosamente el ${new Date().toLocaleString('es-PE', { dateStyle: 'long', timeStyle: 'short' })}.</p>
            <p style="color: #777; font-size: 12px; margin-top: 30px; text-align: center;">Si no realizaste este cambio, contacta inmediatamente con soporte.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Confirmación de cambio de contraseña enviada a:', email);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar confirmación de cambio de contraseña:', error);
    return false;
  }
};

// Generar código de 6 dígitos
const generarCodigo = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  enviarCodigoVerificacion,
  enviarCodigoRecuperacion,
  enviarConfirmacionCambioPassword,
  generarCodigo
};
