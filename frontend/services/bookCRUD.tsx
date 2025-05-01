export const createBook = async (bookData) => {
  try {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: bookData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error detallado de Strapi al crear libro:', errorData);
      throw {
        status: errorData.error.status,
        message: errorData.error.message,
        errors: errorData.error.details.errors,
        errorData
      };
    }

    const data = await response.json();
    console.log('Libro creado en Book:', data);
    return data;
  } catch (error) {
    console.error('Error al enviar datos a Strapi:', error.message);
    throw error;
  }
};


export const createBookWithImage = async (bookData, imageFile) => {
  try {
    // 1. Crear el libro (solo datos)
    const bookResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: bookData }),
    });

    if (!bookResponse.ok) {
      const errorData = await bookResponse.json();
      console.error('Error al crear libro:', errorData);
      throw new Error('Error al crear el libro');
    }

    const bookDataResponse = await bookResponse.json();
    const bookId = bookDataResponse.data.id;
    console.log('Libro creado con ID:', bookId);

    // 2. Subir la imagen y asociarla al libro
    const formData = new FormData();
    formData.append('files', imageFile); // El archivo real
    formData.append('ref', 'api::book.book'); // Nombre del modelo
    formData.append('refId', bookId); // ID del libro
    formData.append('field', 'cover'); // Nombre del campo media en el modelo

    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.json();
      console.error('Error al subir imagen:', uploadError);
      throw new Error('Error al subir la imagen');
    }

    const uploadResult = await uploadResponse.json();
    console.log('Imagen subida:', uploadResult);

    return { book: bookDataResponse, image: uploadResult };

  } catch (error) {
    console.error('Error en createBookWithImage:', error);
    throw error;
  }
};


// getAllBooksData trae la información de cada libro de la tabla
export const getAllBooksData = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books?populate=cover`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_ADMIN_TOKEN}`
      }
    });

    if (!response.ok) throw new Error('Error al obtener libros');
    
    const { data } = await response.json();
    console.log(data);
    return data.map((book: any) => ({
      id: book.id,
      idLibro: book.idLibro || book.id,
      title: book.title,
      price: book.price,
      author: book.author,
      condition: book.condition,
      cantidad:book.cantidad,
      cover: {
        url: book.cover?.url || '/placeholder-book.jpg'
      }
    }));
  } catch (error) {
    console.error('Error en getAllBooksData:', error);
    throw error;
  }
};
// export const getAllLibrosData = async () => {
//   try {
//       const token = localStorage.getItem('authToken');
//       const booksResponse = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`,
//           {
//               method: 'GET',
//               headers: {
//                   'Content-Type': 'application/json',
//                   'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_ADMIN_TOKEN}`,
//               }
//           });

//       if (!booksResponse.ok) {
//           const errorData = await booksResponse.json();
//           console.error('Error trayendo informacion de los libros:', errorData);
//           throw new Error(errorData.message || 'Failed to fetch books');
//       }
//       const responseData = await booksResponse.json();
//       console.log('Respuesta completa de la API:', responseData);

//       // Extraer el array de libros de la respuesta de Strapi v4
//       const booksArray = responseData.data || responseData;
//       console.log(booksArray)
//       // Verificar si es un array antes de mapear
//       if (!Array.isArray(booksArray)) {
//           console.error('La respuesta no es un array:', booksArray);
//           return [];
//       }
//       return booksArray;
//   } catch (error) {
//       console.error('Error in getAllbooksData:', error);
//       throw new Error(typeof error === 'string' ? error : 'Error al obtener libros');
//   }
// };

// trae la información del libro con la UID que en este caso es el idLibro
export const getBookByIdLibro = async (idLibro: string) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books?filters[idLibro][$eq]=${idLibro}&populate=cover`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error al buscar libro');
    }

    const responseData = await response.json();
    console.log("Datos recibidos del libro:", responseData);
    
    const booksArray = responseData.data || [];
    

    if (booksArray.length === 0) {
      throw new Error(`No se encontró un libro con idLibro: ${idLibro}`);
    }

    const book = booksArray[0];
    return {
      id: book.id,
      idLibro: book.idLibro,
      ISBN_ISSN: book.ISBN_ISSN,
      fecha_publicacion: book.fecha_publicacion,
      title: book.title,
      condition: book.condition,
      author: book.author,
      price: book.price,
      editorial: book.editorial,
      numero_paginas: book.numero_paginas,
      genero: book.genero,
      idioma: book.idioma,
      cantidad: book.cantidad,
      cover: book.cover
    };
  } catch (error) {
    console.error('Error al buscar por idLibro:', error);
    throw error;
  }
};


// esta función permite optener el id del libro 
  export const findBookIdByIdLibro = async (idLibro: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books?filters[idLibro][$eq]=${encodeURIComponent(idLibro)}`,
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
      console.error('Error fetching user ID:', error);
      throw new Error('Failed to find user ID');
    }
  };


// metodo put para actualizar datos de un libro
export const putBookData = async (bookDataForm, idLibro) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');

    // Buscar el ID interno del libro en Strapi
    const bookId = await findBookIdByIdLibro(idLibro);
    if (!bookId) throw new Error('Libro no encontrado');

    // Preparar los datos para Strapi v4
    const requestData = {
      data: {
        ...bookDataForm,
        // Si necesitas actualizar la imagen, deberías manejar eso aparte
        // con un endpoint específico para uploads
      }
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error detallado de Strapi:', errorData);
      throw {
        status: errorData.error?.status || 500,
        message: errorData.error?.message || 'Error desconocido',
        errors: errorData.error?.details?.errors || [],
        errorData
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error in putBookData:', error);
    throw error;
  }
};


export const deleteBook = async (idLibro) => {
    try {
      const token = localStorage.getItem('authToken');

      // Paso 1: Buscar el usuario por username para obtener su ID
      console.log("yendo a buscar libro")
      const bookIdData = await findBookIdByIdLibro(idLibro, token);
      if (!bookIdData) throw new Error('Libro no encontrado');
      const bookId = bookIdData;
  
      // 2. Hacer la petición DELETE
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text(); // Leer error como texto
        throw new Error(errorText || 'Error al eliminar el libro');
      }
  
      // 3. Manejar respuesta exitosa (puede ser vacía)
      if (response.status === 204) {
        return { success: true, message: 'Libro eliminado' };
      } else {
        return await response.json(); // Solo si hay JSON
      }
  
    } catch (error) {
      console.error('Error en deleteBook:', error.message);
      alert(error.message || 'Error al eliminar el libro');
      throw error; // Propagar el error
    }
  };