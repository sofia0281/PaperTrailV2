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

    return await response.json();
  } catch (error) {
    console.error("Error en getPedidosByUser:", error);
    throw error;
  }
};

// services/pedidoCRUD.ts
export const getItemsByPedido = async (pedidoId: string) => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/item-pedidos?filters[IdPedido][$eq]=${pedidoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error al obtener items del pedido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getItemsByPedido:", error);
    throw error;
  }
};