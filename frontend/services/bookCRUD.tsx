export const getAllBooksData = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const booksResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`,
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




export const getBookByIdLibro = async (idLibro: string) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books?filters[idLibro][$eq]=${idLibro}`,
        {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`,
            }
        }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Error al buscar libro');
        }

        const responseData = await response.json();
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


export const putBookData = async (bookForm , IdLibro) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books?filters[idLibro][$eq]=${IdLibro}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(bookForm), // Enviar todos los campos
        });

        if (!response.ok) {
            console.log(response)
            throw new Error('Error al actualizar los datos del libro');
        }

        const updatedBook = await response.json();
        console.log('Libro actualizado:', updatedBook);
        // alert('Datos actualizados correctamente');
        return updatedBook;
    } catch (error) {
        console.error('Error:', error.message);
        alert('Error al actualizar los datos');
    }
};