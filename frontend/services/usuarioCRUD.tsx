

// Función para obtener la información del usuario , se usa para obtener el role o toda la info del usuario
export const fetchUserData = async () => {
    const token = localStorage.getItem('authToken'); // Obtener el token JWT del almacenamiento local

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me?populate=role`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario');
        }

        const userData = await response.json();
        console.log('Datos del usuario:', userData);
        return userData;
    } catch (error) {
        console.error('Error:', error.message);
    }
};
export const putUserData = async (userDataForm) => {
    try {
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('user'); // Obtener el objeto user como cadena JSON
        const user = JSON.parse(userString); // Parsear la cadena JSON a un objeto
        const userId = user.id; // Acceder al campo id

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userDataForm), // Enviar todos los campos
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos del usuario');
        }

        const updatedUser = await response.json();
        console.log('Usuario actualizado:', updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Error:', error.message);
        alert('Error al actualizar los datos');
    }
};



// Función para obtener el ID del rol "Authenticated"
const obtenerIdRol = async () => {
    try {
      console.log('Obteniendo ID del rol "Authenticated"...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users-permissions/roles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error detallado de Strapi:', errorData);
        throw new Error('Error al obtener los roles');
      }
  
      const data = await response.json();
      const rolAuthenticated = data.roles.find((rol) => rol.name === 'Authenticated');
  
      if (!rolAuthenticated) {
        throw new Error('No se encontró el rol "Authenticated"');
      }
  
      console.log('ID del rol "Authenticated":', rolAuthenticated.id);
      return rolAuthenticated.id;
    } catch (error) {
      console.error('Error al obtener el ID del rol:', error.message);
      throw error;
    }
  };
  
  // Función para crear un usuario en Strapi
export const createUsuario = async (userData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error detallado de Strapi2:', errorData);
        throw new Error('Error al crear el usuario2');
      }
  
      const data = await response.json();
      console.log('Usuario creado en Strapi2:', data);
      return data;
    } catch (error) {
      console.error('Error al enviar datos a Strapi:', error.message);
      throw error;
    }
  };