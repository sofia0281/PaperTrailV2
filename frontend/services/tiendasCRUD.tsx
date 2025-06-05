// getAllBooksData trae la información de cada libro de la tabla
export const getAllTiendasData = async () => {
  try {
// comentario
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiendas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_ADMIN_TOKEN}`
        },
      });

    if (!response.ok) throw new Error('Error al obtener tiendas');
    console.log("Respuesta de la API:", response); // Depuración
    const { data } = await response.json();
    console.log(data);
    return data.map((tienda: any) => ({
        id: tienda.id,
        idTienda: tienda.idTienda || tienda.id,
        Nombre:  tienda.Nombre,
        Region:  tienda.Region,
        Departamento:  tienda.Departamento,
        Ciudad:  tienda.Ciudad,
        Direction: tienda.Direction,
        latitud: tienda.latitud,
        longitud: tienda.longitud,
    }));
  } catch (error) {
    console.error('Error en getAllTiendasData:', error);
    throw error;
  }
};


export const getTienda = async (tiendaID: string) => {
  try {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiendas?filters[idTienda][$eq]=${tiendaID}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_ADMIN_TOKEN}`,
            }
        }
    );
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al buscar tienda');
    }
    const responseData = await response.json();
    console.log("Datos recibidos del libro:", responseData);
    
    const booksArray = responseData.data || [];
    

    if (booksArray.length === 0) {
        throw new Error(`No se encontró un tienda con idTienda: ${tiendaID}`);
    }

    const tienda = booksArray[0];
    return {
        id: tienda.id,
        idTienda: tienda.idTienda || tienda.id,
        Nombre:  tienda.Nombre,
        Region:  tienda.Region,
        Departamento:  tienda.Departamento,
        Ciudad:  tienda.Ciudad,
        Direction: tienda.Direction,
        };
    } catch (error) {
        console.error('Error al buscar por idTienda:', error);
        throw error;
    }
};

// esta función permite optener el id del libro 
export const findTiendaIdByIdTienda = async (idTienda: string) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiendas?filters[idTienda][$eq]=${encodeURIComponent(idTienda)}`,
                {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                }
            );
        
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
            const { data } = await response.json();
            console.log("Respuesta completa de la API:", data); // Depuración
            return data[0]?.documentId || null; 
        } catch (error) {
            console.error('Error fetching tienda ID:', error);
            throw new Error('Failed to find tienda ID');
        }
};


  // metodo put para actualizar datos de un libro
  export const putTiendaData = async (tiendaDataForm, idTienda) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');
  
      const tiendaId = await findTiendaIdByIdTienda(idTienda);
      if (!tiendaId) throw new Error('Libro no encontrado');
  
      const requestData = { data: { ...tiendaDataForm } };
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiendas/${tiendaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
  
        if (!response.ok) {
        const errorData = await response.json();
        console.error('Error detallado de Strapi al crear tienda:', errorData);
        throw {
            status: errorData.error.status,
            message: errorData.error.message,
            errors: errorData.error.details.errors,
            errorData
        };
        }
  
      return await response.json();
    } catch (error) {
      console.error('Error in putTiendaData:', error);
      throw error;
    }
  };


export const createTienda = async (tiendaData) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiendas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: tiendaData
        }),
        });

        if (!response.ok) {
        const errorData = await response.json();
        console.error('Error detallado de Strapi al crear tienda:', errorData);
        throw {
            status: errorData.error.status,
            message: errorData.error.message,
            errors: errorData.error.details.errors,
            errorData
        };
        }

        const data = await response.json();
        console.log('Tienda creada:', data);
        return data;
    } catch (error) {
        console.error('Error al enviar datos a Strapi:', error.message);
        throw error;
    }
    };


export const deleteTienda= async (idTienda) => {
    try {
      const token = localStorage.getItem('authToken');

      // Paso 1: Buscar el usuario por username para obtener su ID
      console.log("yendo a buscar libro")
      const bookIdData = await findTiendaIdByIdTienda(idTienda, token);
      if (!bookIdData) throw new Error('Libro no encontrado');
      const bookId = bookIdData;
  
      // 2. Hacer la petición DELETE
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiendas/${bookId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text(); // Leer error como texto
        throw new Error(errorText || 'Error al eliminar la tienda');
      }
  
      // 3. Manejar respuesta exitosa (puede ser vacía)
      if (response.status === 204) {
        return { success: true, message: 'tienda eliminada' };
      } else {
        return await response.json(); // Solo si hay JSON
      }
  
    } catch (error) {
      console.error('Error en deleteTienda:', error.message);
      alert(error.message || 'Error al eliminar la tienda');
      throw error; // Propagar el error
    }
  };
  
export const getTiendaByRegionDepartamentoCiudad = async (region: string, departamento:string,ciudad:string) => {
  try {
    const token = localStorage.getItem('authToken');
    const filters = [
      `filters[Region][$eq]=${encodeURIComponent(region)}`,
      `filters[Departamento][$eq]=${encodeURIComponent(departamento)}`,
      `filters[Ciudad][$eq]=${encodeURIComponent(ciudad)}`
    ].join('&');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiendas?${filters}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_ADMIN_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener tienda");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener tienda :", error);
    throw error;
  }
};
