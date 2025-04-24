// getAllBooksData trae la información de cada libro de la tabla
export const getAllBooksData = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const booksResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

        if (!booksResponse.ok) {
            const errorData = await booksResponse.json();
            console.error('Error trayendo informacion de los libros:', errorData);
            throw new Error(errorData.message || 'Failed to fetch books');
        }
        const responseData = await booksResponse.json();
        // console.log('Respuesta completa de la API:', responseData);

        // Extraer el array de libros de la respuesta de Strapi v4
        const booksArray = responseData.data || responseData;
        console.log(booksArray)
        // Verificar si es un array antes de mapear
        if (!Array.isArray(booksArray)) {
            console.error('La respuesta no es un array:', booksArray);
            return [];
        }
        
        return booksArray.map((book: any) => ({
            id: book.id,
            title: book.title,
            price: book.price,
            author: book.author,
            cantidad: book.cantidad,
            idLibro: book.idLibro
        }
    ));
    } catch (error) {
        console.error('Error in getbooksData:', error);
        throw new Error(typeof error === 'string' ? error : 'Error al obtener libros');
    }
};



// trae la información del libro con la UID que en este caso es el idLibro
export const getBookByIdLibro = async (idLibro: string) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books?filters[idLibro][$eq]=${idLibro}`,
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
        console.log("esto se recibe del libro:");
        console.log(responseData);
        const booksArray = responseData.data || [];

        if (booksArray.length === 0) {
            throw new Error(`No se encontró un libro con idLibro: ${idLibro}`);
        }

        const book = booksArray[0];
        // Transformar a la estructura esperada
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
            idioma:  book.idioma,
            cantidad:  book.cantidad
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

    // Paso 1: Buscar el usuario por username para obtener su ID
    console.log("yendo a buscar libro")
    const bookIdData = await findBookIdByIdLibro(idLibro, token);
    if (!bookIdData) throw new Error('Libro no encontrado');
    const bookId = bookIdData;
    // Paso 2: Actualizar el usuario con el ID obtenido
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: bookDataForm
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error detallado:', errorData);
      throw new Error('Error al actualizar libro');
    }

    const updatedUser = await response.json();
    console.log('Libro actualizado:', updatedUser);
    return updatedUser;

  } catch (error) {
    console.error('Error en putBookData:', error.message);
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