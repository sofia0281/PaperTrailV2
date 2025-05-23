// services/cardCRUD.js



//Aqui se crea la tarjeta en la base de datos
export const createCard = async (cardData) => {

    console.log('Datos de la tarjeta:', cardData);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: cardData,
        }),
      });
  
      //if (!response.ok) {
      //  const errorData = await response.json();
      //  console.error('Error al crear tarjeta:', errorData);
      // throw {
      //    status: errorData.error.status,
      //   message: errorData.error.message,
      //    errors: errorData.error.details.errors,
      //    errorData,
      //  };
      //}
  
      const data = await response.json();
      console.log('Tarjeta creada:', data);
      return data;
    } catch (error) {
      console.error('Error al enviar datos a Strapi (Card):', error.message);
      throw error;
    }
  };
  

//aqui la buscamos

export const getCardsByUser = async (userId: number) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cards?filters[user][id][$eq]=${userId}&populate=*`);
    if (!res.ok) throw new Error("Error al obtener tarjetas");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error al obtener tarjetas:", error.message);
    throw error;
  }
};




  // Eliminar tarjeta
  export const deleteCard = async (cardId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cards/${cardId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al eliminar tarjeta:', errorData);
        throw new Error(errorData.error?.message || 'Error desconocido');
      }
  
      // Solo intenta parsear JSON si hay contenido
      const result = response.status === 204 ? null : await response.json();
      return result;
    } catch (error) {
      console.error('Error en deleteCard:', error);
      throw error;
    }
  };
  
  
  // Actualizar tarjeta
  export const updateCard = async (documentId, updatedData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cards/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: updatedData }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al actualizar tarjeta:', errorData);
        throw new Error(errorData.error?.message || 'Error desconocido');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error en updateCard:', error);
      throw error;
    }
  };
  
  
  // Verificar si ya existe una tarjeta con el mismo número
  export const checkCardExistsByNumber = async (cardNumber) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cards?filters[Numero][$eq]=${cardNumber}`);
      const data = await response.json();
      return data.data.length > 0;
    } catch (error) {
      console.error('Error al verificar tarjeta existente:', error);
      return false;
    }
  };