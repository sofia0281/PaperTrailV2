'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllPedidos, getItemsByPedido, updatePedidoStatus } from '@/services/pedidosCRUD';
import { useAuth } from '@/context/AuthContext';

const AdminPedidos = () => {
  const { authUser } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pedidosPerPage = 10;

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const response = await getAllPedidos();
        console.log("Pedidos response:", response);
        setPedidos(response.data || []);
      } catch (err) {
        setError(err.message || 'Error al cargar los pedidos');
        console.error("Error fetching pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const fetchPedidoDetails = async (pedidoId) => {
    try {
      setLoading(true);
      const itemsResponse = await getItemsByPedido(pedidoId);
      console.log("Items response:", pedidoId);
      console.log("Usando ID para PUT:", item.id);
      const itemsData = Array.isArray(itemsResponse?.data) ? itemsResponse.data : [];
      
      const calculatedTotal = itemsData.reduce((sum, item) => {
        return sum + (item.PrecioItem * item.Cantidad);
      }, 0);

      setItems(itemsData);
      setTotal(calculatedTotal);
      setSelectedPedido(pedidoId);
    } catch (err) {
      setError(err.message || 'Error al cargar los detalles');
      console.error("Error fetching pedido details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (pedidoId, newStatus) => {
    try {
      await updatePedidoStatus(pedidoId, newStatus);
      console.log("Estado actualizado:", pedidoId, newStatus);
      // Actualizar el estado local
      setPedidos(pedidos.map(pedido => 
        pedido.id === pedidoId ? { ...pedido, estado: newStatus } : pedido
      ));
      if (selectedPedido === pedidoId) {
        fetchPedidoDetails(pedidoId); // Refrescar detalles
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar el estado');
      console.error("Error updating status:", err);
    }
  };

  // Filtrar pedidos
  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = 
      (pedido.id?.toString()?.includes(searchTerm)) || 
      (pedido.usuarioNombre?.toLowerCase().includes(searchTerm.toLowerCase()));
  
    const matchesStatus = statusFilter === 'todos' || pedido.estado === statusFilter;
  
    return matchesSearch && matchesStatus;
  });
  

  // Paginación
  const indexOfLastPedido = currentPage * pedidosPerPage;
  const indexOfFirstPedido = indexOfLastPedido - pedidosPerPage;
  const currentPedidos = filteredPedidos.slice(indexOfFirstPedido, indexOfLastPedido);
  const totalPages = Math.ceil(filteredPedidos.length / pedidosPerPage);

  if (loading && pedidos.length === 0) {
    return <div className="p-4">Cargando lista de pedidos...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración - Pedidos</h1>
      
      {/* Filtros y búsqueda */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por ID de pedido o nombre de usuario"
            className="flex-1 p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="recibido">recibido</option>
                          <option value="confirmado">confirmado</option>
                          <option value="procesando">procesando</option>
                          <option value="enviado">enviado</option>
                          <option value="entregado">entregado</option>
          </select>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPedidos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">No se encontraron pedidos</td>
                  </tr>
                ) : (
                  currentPedidos.map((pedido) => (
                    <tr 
                      key={pedido.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedPedido === pedido.id ? 'bg-blue-50' : ''}`}
                      onClick={() => fetchPedidoDetails(pedido.id)}
                    >
                      <td className="px-6 py-4">#{pedido.id}</td>
                      <td className="px-6 py-4">{pedido.usuarioNombre || 'N/A'}</td>
                      <td className="px-6 py-4">{new Date(pedido.fecha).toLocaleDateString()}</td>
                      <td className="px-6 py-4">${pedido.total?.toLocaleString('es-CO') || '0'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          pedido.estado === 'completado' ? 'bg-green-100 text-green-800' :
                          pedido.estado === 'cancelado' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pedido.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="p-1 border rounded text-sm"
                          value={pedido.estado}
                          onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="recibido">recibido</option>
                          <option value="confirmado">confirmado</option>
                          <option value="procesando">procesando</option>
                          <option value="enviado">enviado</option>
                          <option value="entregado">entregado</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-6 py-3 flex justify-between items-center bg-gray-50">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detalles del pedido seleccionado */}
        <div className="bg-white p-4 rounded-lg shadow">
          {selectedPedido ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Detalles del Pedido #{selectedPedido}</h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Productos:</h3>
                {items.length === 0 ? (
                  <p>No hay productos en este pedido</p>
                ) : (
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item.IdItem} className="border-b pb-2">
                        <p className="font-medium">{item.NombreProducto}</p>
                        <p>Cantidad: {item.Cantidad}</p>
                        <p>Precio unitario: ${item.PrecioItem.toLocaleString('es-CO')}</p>
                        <p>Subtotal: ${(item.PrecioItem * item.Cantidad).toLocaleString('es-CO')}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="font-medium">Total del pedido: <span className="float-right">${total.toLocaleString('es-CO')}</span></p>
              </div>
            </>
          ) : (
            <p>Seleccione un pedido para ver los detalles</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPedidos;