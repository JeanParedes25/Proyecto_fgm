import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import './EstadisticasFlores.css';
import { API_BASE_URL } from '../constants/config';

function EstadisticasFlores() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  const fetchEstadisticas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/estadisticas/flores`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }

      const data = await response.json();
      setEstadisticas(data);
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="estadisticas-loading">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="estadisticas-error">{error}</div>;
  }

  if (!estadisticas) {
    return <div className="estadisticas-empty">No hay datos disponibles</div>;
  }

  // Preparar datos para gráfico de barras
  const chartDataBarras = {
    labels: estadisticas.top_flores.map(f => f.codigo),
    datasets: [
      {
        label: 'Cantidad Vendida',
        data: estadisticas.top_flores.map(f => f.cantidad_vendida),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Preparar datos para gráfico de pastel
  const chartDataPastel = {
    labels: estadisticas.top_flores.map(f => f.codigo),
    datasets: [
      {
        label: 'Ingresos por Flores',
        data: estadisticas.top_flores.map(f => parseFloat(f.monto_total)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="estadisticas-flores-container">
      <div className="estadisticas-header">
        <h2>📊 Estadísticas de Ventas de Flores</h2>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="resumen-cards">
        <div className="card resumen-card">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <p className="card-label">Total de Pedidos</p>
            <p className="card-value">{estadisticas.resumen.total_pedidos}</p>
          </div>
        </div>

        <div className="card resumen-card">
          <div className="card-icon">🌹</div>
          <div className="card-content">
            <p className="card-label">Tipos de Flores</p>
            <p className="card-value">{estadisticas.resumen.flores_unicas}</p>
          </div>
        </div>

        <div className="card resumen-card">
          <div className="card-icon">💵</div>
          <div className="card-content">
            <p className="card-label">Monto Total</p>
            <p className="card-value">${estadisticas.resumen.monto_total}</p>
          </div>
        </div>

        <div className="card resumen-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <p className="card-label">Promedio por Pedido</p>
            <p className="card-value">${estadisticas.resumen.promedio_pedido}</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="graficos-container">
        <div className="grafico-card">
          <h3>Flores Más Vendidas (Top 5)</h3>
          <div className="grafico-wrapper">
            <Bar 
              data={chartDataBarras}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top'
                  },
                  title: {
                    display: true,
                    text: 'Cantidad de Flores Vendidas'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="grafico-card">
          <h3>Ingresos por Tipo de Flor (Top 5)</h3>
          <div className="grafico-wrapper">
            <Pie
              data={chartDataPastel}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right'
                  },
                  title: {
                    display: true,
                    text: 'Distribución de Ingresos'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabla Detallada */}
      <div className="tabla-container">
        <h3>Detalle Completo de Ventas</h3>
        <div className="tabla-wrapper">
          <table className="tabla-estadisticas">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Cantidad Vendida</th>
                <th>Veces Comprado</th>
                <th>Monto Total</th>
                <th>Precio Unitario</th>
              </tr>
            </thead>
            <tbody>
              {estadisticas.todas_flores.map((flor, idx) => (
                <tr key={idx} className={idx < 5 ? 'destacado' : ''}>
                  <td><strong>{flor.codigo}</strong></td>
                  <td>{flor.descripcion}</td>
                  <td className="cantidad">{flor.cantidad_vendida}</td>
                  <td className="veces">{flor.veces_comprado}</td>
                  <td className="monto">${flor.monto_total.toFixed(2)}</td>
                  <td className="precio">${flor.precio_unitario.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EstadisticasFlores;
