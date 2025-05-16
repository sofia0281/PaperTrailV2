  
  export const createPedido = async (pedidoData) => {
    try {
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: pedidoData
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error detallado de Strapi al crear pedido:', errorData);
        throw {
          status: errorData.error.status,
          message: errorData.error.message,
          errors: errorData.error.details.errors,
          errorData
        };
      }
  
      const data = await response.json();
      console.log('Pedido  creado en api pedidos:', data);
      return data;
    } catch (error) {
      console.error('Error al enviar datos a Strapi:', error.message);
      throw error;
    }
  };


// services/pedidosCRUD.ts

/**
 * Actualiza un pedido para relacionarlo con sus items
 */
export const updatePedidoWithItems = async (pedidoId: string, itemIds: string[]) => {
  console.log("Actualizando pedido con items:", pedidoId, itemIds);
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error("No hay token de autenticación");

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos/${pedidoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        data: {
          items: itemIds // Array de IDs de los items relacionados
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error al actualizar relación de pedido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updatePedidoWithItems:", error);
    throw error;
  }
};


  // services/pedidosCRUD.ts

export const getPedidoWithItems = async (pedidoId: string) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error("No hay token de autenticación");

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos/${pedidoId}?populate=items`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Error al obtener pedido con items");
    }

    const data = await response.json();
    
    return {
      ...data.data.attributes,
      id: data.data.id,
      items: data.data.attributes.items?.data?.map(item => ({
        id: item.id,
        ...item.attributes
      })) || []
    };
  } catch (error) {
    console.error("Error en getPedidoWithItems:", error);
    throw error;
  }
};

// services/pedidoCRUD.ts
export const createItemPedido = async (itemData: {
  PrecioItem: number;
  Cantidad: number;
  IdItem: string;
  IdPedido: string;
  Title:string;
  totalPrice:number;
}) => {
  try {
    const token = localStorage.getItem('authToken'); // Token del usuario

    // Convertir a enteros si es necesario
    const payload = {
      data: {
        PrecioItem: Math.round(itemData.PrecioItem), // Asegurar que sea entero
        Cantidad: itemData.Cantidad,
        IdItem: itemData.IdItem.toString(), // Asegurar que sea string
        IdPedido: itemData.IdPedido.toString(), // Asegurar que sea string
        Title:itemData.Title.toString(),
        totalPrice: Math.round(itemData.totalPrice)

      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/item-pedidos`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Usar token de usuario
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error detallado:', errorData); // Para debug
      throw new Error(errorData.error?.message || "Error al crear ítem de pedido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error completo en createItemPedido:", error);
    throw error;
  }
};


// services/pedidoCRUD.ts
export const getPedidosByUser = async (userId: number) => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?filters[usuario][id][$eq]=${userId}&populate=*`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
   
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error al obtener pedidos");
    }

    //console.log("Pedidos obtenidos:", response);
    return await response.json();
    
  } catch (error) {
    console.error("Error en getPedidosByUser:", error);
    throw error;
  }
};




export const getItemsByPedido = async (pedidoId: string) => {

  console.log("Obteniendo items por IdPedido:", pedidoId);
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/item-pedidos?filters[IdPedido][$eq]=${pedidoId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Error al obtener items del pedido");
  }

  return await response.json();
};  


export const getPedidoUsr = async (pedidoId: string) => {
 //pedidoId = "lumn6phfh93o36kxzu91jcmy"
  console.log("Obteniendo items por IdPedido:", pedidoId);
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos/${pedidoId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Error al obtener items del pedido");
  }

  return await response.json();
};  




export const getAllPedidos = async () => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?populate=usuario`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error al obtener todos los pedidos");
    }

    const data = await response.json();
    console.log("Pedidos obtenidos:", data);

    return {
      data: data.data.map((pedido: any) => ({
        id: pedido.documentId,  // ID interno de Strapi
        
        idPedido: pedido.documentId,  // UID personalizado
        total: pedido.TotalPrecio || 0,
        estado: pedido.estado || 'pendiente',
        usuarioNombre: pedido.usuario?.username || 'Desconocido',
      }))
    };
  } catch (error) {
    console.error("Error en getAllPedidos:", error);
    throw error;
  }
};



export const getItemStrapiByPedidoId = async (pedidoId) => {
  const token = localStorage.getItem('authToken');

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?filters[IdPedido][$eq]=${pedidoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  console.log("Respuesta de Strapi:-  -------------------------", data);
  return data.data?.[0]; // <- esto es importante: solo uno, no todo el array
};


export const updatePedidoStatus = async (pedidoId, newStatus) => {
  console.log("Actualizando estado de pedido:", pedidoId, "Nuevo estado:", newStatus);
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error("Token no encontrado");

    // Ya no necesitamos buscar el item, usamos directamente el ID
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos/${pedidoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        data: {
          estado: newStatus
        }
      })
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: { message: "Respuesta no es JSON" } };
      }
      console.error('❌ Error detallado del backend:', errorData);
      throw new Error(errorData.error?.message || 'Error al actualizar el estado');
    }

    const result = await response.json();
    console.log("✅ Estado actualizado correctamente:", result);
    return result;
  } catch (error) {
    console.error("⚠️ Error completo en updatePedidoStatus:", error);
    throw new Error("No se pudo actualizar el estado.");
  }
};




export const getPedidoById = async (pedidoId: string) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pedidos?filters[idPedido][$eq]=${pedidoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Error al obtener el pedido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getPedidoById:", error);
    throw error;
  }
};





export const getItemsByPedidoId = async (pedidoId: number) => {
  console.log("Obteniendo items por IdPedido:", pedidoId);
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/item-pedidos?filters[IdPedido]=${pedidoId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error al obtener item-pedidos');
    }

    const data = await response.json();
    console.log('Items obtenidos:', data);
    return data.data.map((item: any) => ({
      Id: item.id,
      Title: item.Title || 'Sin nombre',
      TotalProdcutos: item.Cantidad,
      PrecioItem: item.PrecioItem,
    }));
  } catch (error) {
    console.error('Error en getItemsByPedidoId:', error);
    return [];
  }
};


