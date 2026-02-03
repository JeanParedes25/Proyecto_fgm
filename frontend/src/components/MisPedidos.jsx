import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { API_BASE_URL, buildWhatsAppUrl } from '../constants/config';
import { useEmpresa } from '../hooks/useEmpresa';
import './MisPedidos.css';

function MisPedidos({ onBack }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const { empresa } = useEmpresa();

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/pedidos-floristerias/mis-pedidos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPedidos(data.pedidos || []);
      } else {
        setError('Error al cargar los pedidos');
      }
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'pendiente': { texto: 'Pendiente', clase: 'estado-pendiente', icono: '⏳' },
      'confirmado': { texto: 'Confirmado', clase: 'estado-confirmado', icono: '✅' },
      'cancelado': { texto: 'Cancelado', clase: 'estado-cancelado', icono: '❌' },
      'cancelado_admin': { texto: 'Cancelado', clase: 'estado-cancelado', icono: '❌' },
      'cancelado_usuario': { texto: 'Cancelado', clase: 'estado-cancelado', icono: '❌' },
      'entregado': { texto: 'Entregado', clase: 'estado-entregado', icono: '📦' }
    };
    return estados[estado] || estados['pendiente'];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generarNumeroComprobante = (pedido) => {
    const base = pedido?._id ? parseInt(pedido._id.slice(-6), 16) : Date.now() % 1000000;
    const seguro = Number.isFinite(base) ? base : Math.floor(Date.now() % 1000000);
    return `CMP-${String(seguro).padStart(6, '0')}`;
  };

  const formatMoney = (valor) => `$${Number(valor || 0).toFixed(2)}`;

  const obtenerItemsComprobante = (pedido) => {
    if (Array.isArray(pedido?.items) && pedido.items.length > 0) {
      return pedido.items.map((item) => ({
        descripcion: item.descripcion || item.nombre || 'Servicio',
        cantidad: Number(item.cantidad || 1),
        precioUnitario: Number(item.precio || 0)
      }));
    }

    const descripcionArreglo = pedido?.descripcionArreglo || 'Sin descripción';
    const para = pedido?.nombrePersonaFallecida ? ` — Para: ${pedido.nombrePersonaFallecida}` : '';
    const descripcion = `Arreglo floral ${pedido?.codigoArreglo || ''} — ${descripcionArreglo}${para}`.trim();
    
    return [{
      descripcion,
      cantidad: pedido?.cantidad || 1,
      precioUnitario: pedido?.precioUnitario || pedido?.precio || 0
    }];
  };

  const calcularTotalItem = (item) => item.cantidad * item.precioUnitario;
  const calcularSubtotal = (items) => items.reduce((total, item) => total + calcularTotalItem(item), 0);

  const abrirComprobante = (pedido) => setPedidoSeleccionado(pedido);
  const cerrarComprobante = () => setPedidoSeleccionado(null);

  const abrirWhatsAppCancelacion = () => {
    const baseUrl = buildWhatsAppUrl(empresa?.telefonos?.[0]);
    if (!baseUrl) return;
    const mensaje = encodeURIComponent(
      'Hola, se canceló mi pedido y necesito más información, por favor.'
    );
    window.open(`${baseUrl}?text=${mensaje}`, '_blank');
  };

  // Función para generar PDF con jsPDF directamente en nueva pestaña
  const generarComprobantePDF = async (pedido) => {
    if (!pedido) return;

    const numeroComprobante = generarNumeroComprobante(pedido);
    const items = obtenerItemsComprobante(pedido);
    const subtotal = calcularSubtotal(items);

    // Crear el PDF en formato A4 (210mm x 297mm)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;

    // Colores
    const primaryColor = [27, 77, 255]; // Azul
    const goldColor = [196, 154, 108]; // Dorado
    const grayColor = [107, 114, 128];
    const darkColor = [17, 24, 39];
    const greenColor = [19, 122, 58]; // Verde para CONFIRMADO

    // === MARCA DE AGUA ===
    try {
      const logoPath = `${process.env.PUBLIC_URL}/logo_fgm.png`;
      const logoData = await fetch(logoPath)
        .then(res => res.blob())
        .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }));

      // Marca de agua en el centro con opacidad
      const watermarkSize = 80;
      const watermarkX = (pageWidth - watermarkSize) / 2;
      const watermarkY = (pageHeight - watermarkSize) / 2;
      doc.setGState(new doc.GState({ opacity: 0.06 }));
      doc.addImage(logoData, 'PNG', watermarkX, watermarkY, watermarkSize, watermarkSize);
      doc.setGState(new doc.GState({ opacity: 1 }));

      // Logo en el encabezado (pequeño)
      const headerLogoSize = 20;
      doc.addImage(logoData, 'PNG', margin, yPos - 2, headerLogoSize, headerLogoSize);
    } catch (err) {
      console.log('No se pudo cargar el logo:', err);
    }

    // === ENCABEZADO ===
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text('Funeraria Grupo FGM', margin + 25, yPos + 5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text('COMPROBANTE DE SERVICIO', margin + 25, yPos + 12);

    // Cuadro del número de comprobante (derecha)
    const boxWidth = 60;
    const boxX = pageWidth - margin - boxWidth;
    doc.setDrawColor(27, 77, 255);
    doc.setFillColor(240, 244, 255);
    doc.rect(boxX, yPos, boxWidth, 25, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.text('N° COMPROBANTE', boxX + (boxWidth / 2), yPos + 6, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(numeroComprobante, boxX + (boxWidth / 2), yPos + 13, { align: 'center' });

    // Sello CONFIRMADO
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...greenColor);
    doc.setDrawColor(...greenColor);
    doc.setFillColor(236, 249, 242);
    doc.rect(boxX + 5, yPos + 17, boxWidth - 10, 6, 'FD');
    doc.text('CONFIRMADO', boxX + (boxWidth / 2), yPos + 21.5, { align: 'center' });

    yPos += 30;

    // Línea separadora
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // === FECHA DE EMISIÓN ===
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayColor);
    doc.text('Fecha de emisión:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkColor);
    doc.text(formatDate(pedido.createdAt), margin + 35, yPos);
    yPos += 10;

    // === DATOS DEL CLIENTE ===
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayColor);
    doc.text('DATOS DEL CLIENTE', margin, yPos);
    yPos += 2;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayColor);
    doc.text('NOMBRE:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkColor);
    doc.text(pedido.nombreCliente || '-', margin + 25, yPos);
    yPos += 6;

    if (pedido.telefonoCliente) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...grayColor);
      doc.text('TELÉFONO:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...darkColor);
      doc.text(pedido.telefonoCliente, margin + 25, yPos);
      yPos += 6;
    }

    if (pedido.emailCliente) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...grayColor);
      doc.text('CORREO:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...darkColor);
      doc.text(pedido.emailCliente, margin + 25, yPos);
      yPos += 6;
    }

    yPos += 4;

    // === DETALLE DEL PEDIDO ===
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayColor);
    doc.text('DETALLE DEL PEDIDO', margin, yPos);
    yPos += 2;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;

    // Tabla de items
    const colDescripcion = margin;
    const colCantidad = pageWidth - margin - 90;
    const colPrecioUnit = pageWidth - margin - 60;
    const colTotal = pageWidth - margin - 30;

    // Encabezado de tabla
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, yPos, contentWidth, 8, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.rect(margin, yPos, contentWidth, 8, 'S');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayColor);
    doc.text('DESCRIPCIÓN', colDescripcion + 2, yPos + 5);
    doc.text('CANT.', colCantidad + 2, yPos + 5);
    doc.text('P. UNIT.', colPrecioUnit + 2, yPos + 5);
    doc.text('TOTAL', colTotal - 2, yPos + 5, { align: 'right' });
    yPos += 8;

    // Filas de items
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkColor);
    doc.setFontSize(9);
    
    items.forEach((item, index) => {
      const rowHeight = 8;
      
      // Alternar color de fondo
      if (index % 2 !== 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, yPos, contentWidth, rowHeight, 'F');
      }
      
      doc.setDrawColor(229, 231, 235);
      doc.rect(margin, yPos, contentWidth, rowHeight, 'S');

      // Descripción con texto largo manejado
      const maxDescWidth = colCantidad - colDescripcion - 5;
      const descripcionLines = doc.splitTextToSize(item.descripcion, maxDescWidth);
      doc.text(descripcionLines[0], colDescripcion + 2, yPos + 5);
      
      doc.text(String(item.cantidad), colCantidad + 2, yPos + 5);
      doc.text(formatMoney(item.precioUnitario), colPrecioUnit + 2, yPos + 5);
      doc.setFont('helvetica', 'bold');
      doc.text(formatMoney(calcularTotalItem(item)), colTotal - 2, yPos + 5, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      
      yPos += rowHeight;
    });

    yPos += 4;

    // === TOTALES ===
    const totalesX = pageWidth - margin - 60;
    const totalesWidth = 60;

    doc.setDrawColor(229, 231, 235);
    doc.line(totalesX, yPos, pageWidth - margin, yPos);
    yPos += 5;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkColor);
    doc.text('Subtotal:', totalesX, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(formatMoney(subtotal), pageWidth - margin - 2, yPos, { align: 'right' });
    yPos += 7;

    doc.setDrawColor(229, 231, 235);
    doc.line(totalesX, yPos, pageWidth - margin, yPos);
    yPos += 5;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text('TOTAL A PAGAR:', totalesX, yPos);
    doc.setTextColor(...primaryColor);
    doc.text(formatMoney(subtotal), pageWidth - margin - 2, yPos, { align: 'right' });
    yPos += 10;

    // === MENSAJE FINAL ===
    yPos += 5;
    doc.setFillColor(252, 250, 247);
    doc.setDrawColor(...goldColor);
    const mensajeHeight = 16;
    doc.rect(margin, yPos, contentWidth, mensajeHeight, 'FD');
    doc.line(margin, yPos, margin, yPos + mensajeHeight);
    doc.line(margin + 1, yPos, margin + 1, yPos + mensajeHeight);
    doc.line(margin + 2, yPos, margin + 2, yPos + mensajeHeight);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...grayColor);
    const mensaje1 = 'Gracias por confiar en nosotros.';
    const mensaje2 = 'Su tranquilidad y la de su familia es nuestra prioridad.';
    doc.text(mensaje1, pageWidth / 2, yPos + 7, { align: 'center' });
    doc.text(mensaje2, pageWidth / 2, yPos + 12, { align: 'center' });
    yPos += mensajeHeight + 10;

    // === PIE DE PÁGINA ===
    const footerY = pageHeight - margin - 5;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text(
      'Este es un comprobante de servicio. Conserve este documento.',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    // Abrir el PDF en una nueva pestaña
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  const descargarComprobantePDF = () => {
    if (!pedidoSeleccionado) return;
    generarComprobantePDF(pedidoSeleccionado);
  };

  const imprimirComprobante = () => {
    // El PDF se abre en nueva pestaña y desde allí se puede imprimir
    if (!pedidoSeleccionado) return;
    generarComprobantePDF(pedidoSeleccionado);
  };

  const enviarPorWhatsApp = () => {
    if (!pedidoSeleccionado) return;
    const numeroComprobante = generarNumeroComprobante(pedidoSeleccionado);
    const mensaje = `Hola, adjunto mi comprobante de servicio.\nNúmero de comprobante: ${numeroComprobante}\nGracias por su atención.`;
    const baseUrl = buildWhatsAppUrl(empresa?.telefonos?.[0]);
    if (!baseUrl) return;
    const urlWhatsApp = `${baseUrl}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
  };

  if (loading) {
    return (
      <div className="mis-pedidos-container">
        <button className="back-button" onClick={onBack}>
          ← Volver
        </button>
        <div className="loading">Cargando pedidos...</div>
      </div>
    );
  }

  const itemsComprobante = pedidoSeleccionado ? obtenerItemsComprobante(pedidoSeleccionado) : [];
  const subtotalComprobante = calcularSubtotal(itemsComprobante);

  return (
    <div className="mis-pedidos-container">
      <button className="back-button" onClick={onBack}>
        ← Volver
      </button>

      <div className="mis-pedidos-header">
        <h1>🌹 Mis Pedidos de Flores</h1>
        <p>Consulta el estado de tus pedidos realizados</p>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {pedidos.length === 0 ? (
        <div className="no-pedidos">
          <div className="no-pedidos-icon">📦</div>
          <h2>No tienes pedidos</h2>
          <p>Tus pedidos de arreglos florales aparecerán aquí</p>
        </div>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => {
            const estadoInfo = getEstadoBadge(pedido.estado);
            return (
              <div key={pedido._id} className="pedido-card">
                <div className="pedido-header">
                  <div className="pedido-codigo">
                    <h3>Pedido #{pedido._id.slice(-6)}</h3>
                    <span className={`estado-badge ${estadoInfo.clase}`}>
                      {estadoInfo.icono} {estadoInfo.texto}
                    </span>
                  </div>
                  <div className="pedido-fecha">
                    {formatDate(pedido.createdAt)}
                  </div>
                </div>

                <div className="pedido-body">
                  <div className="pedido-info">
                    <div className="info-item">
                      <strong>Arreglo:</strong>
                      <span>{pedido.codigoArreglo}</span>
                    </div>
                    {pedido.descripcionArreglo && (
                      <div className="info-item">
                        <strong>Descripción:</strong>
                        <span>{pedido.descripcionArreglo}</span>
                      </div>
                    )}
                    <div className="info-item">
                      <strong>Cantidad:</strong>
                      <span>{pedido.cantidad || 1}</span>
                    </div>
                    <div className="info-item">
                      <strong>Para:</strong>
                      <span>{pedido.nombrePersonaFallecida}</span>
                    </div>
                    <div className="info-item">
                      <strong>Precio Unitario:</strong>
                      <span>${parseFloat(pedido.precioUnitario || pedido.precio || 0).toFixed(2)}</span>
                    </div>
                    <div className="info-item precio">
                      <strong>Total:</strong>
                      <span className="precio-valor">${parseFloat(pedido.total || pedido.precio || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="pedido-footer">
                  {/* Caso 1: Pendiente */}
                  {pedido.estado === 'pendiente' && (
                    <>
                      <div className="notificacion-estado pendiente">
                        <p className="pedido-nota">
                          ⏳ Tu pedido está pendiente de confirmación por el administrador.
                        </p>
                      </div>
                    </>
                  )}

                  {/* Caso 2: Confirmado */}
                  {pedido.estado === 'confirmado' && (
                    <>
                      <div className="notificacion-estado confirmado">
                        <p className="pedido-nota confirmado">
                          ✅ Tu pedido ha sido confirmado con éxito.
                        </p>
                      </div>
                      <div className="pedido-actions" style={{ marginTop: '10px' }}>
                        <button
                          type="button"
                          className="comprobante-btn"
                          onClick={() => generarComprobantePDF(pedido)}
                        >
                          📄 Generar comprobante
                        </button>
                      </div>
                    </>
                  )}

                  {/* Caso 3: Cancelado por administrador */}
                  {pedido.estado === 'cancelado_admin' && (
                    <div className="notificacion-estado cancelado">
                      <p className="pedido-nota cancelado">
                        ❌ Su pedido ha sido cancelado por el administrador.
                      </p>
                    </div>
                  )}

                  {/* Caso 4: Cancelado por usuario */}
                  {pedido.estado === 'cancelado_usuario' && (
                    <>
                      <div className="notificacion-estado cancelado destacada">
                        <p className="pedido-nota cancelado">
                          ❌ Su pedido ha sido cancelado.
                        </p>
                        <p className="pedido-nota-secundaria">
                          Por favor comuníquese con nuestro asesor para más información.
                        </p>
                      </div>
                      <div className="pedido-actions" style={{ marginTop: '10px' }}>
                        <button
                          type="button"
                          className="btn-whatsapp-cancelacion"
                          onClick={abrirWhatsAppCancelacion}
                        >
                          📲 Contactar por WhatsApp
                        </button>
                      </div>
                    </>
                  )}

                  {/* Caso legacy: cancelado genérico */}
                  {pedido.estado === 'cancelado' && (
                    <div className="notificacion-estado cancelado">
                      <p className="pedido-nota cancelado">
                        ❌ Este pedido fue cancelado.
                      </p>
                    </div>
                  )}

                  {/* Estado entregado */}
                  {pedido.estado === 'entregado' && (
                    <div className="notificacion-estado entregado">
                      <p className="pedido-nota entregado">
                        📦 Tu pedido ha sido entregado exitosamente.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pedidoSeleccionado && pedidoSeleccionado.estado === 'pendiente' && (
        <div className="comprobante-modal" role="dialog" aria-modal="true">
          <div className="comprobante-dialog">
            <div className="comprobante-mensaje-pendiente">
              <div className="icono-pendiente">⏳</div>
              <h3>Comprobante en proceso</h3>
              <p>
                Una vez que su pedido sea aceptado por el administrador,
                <br />
                se generará automáticamente su comprobante.
              </p>
              <button
                type="button"
                className="comprobante-accion secundaria"
                onClick={cerrarComprobante}
                style={{ marginTop: '24px' }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisPedidos;
