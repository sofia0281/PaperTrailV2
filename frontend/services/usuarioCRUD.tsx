
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
export const createUsuario = async (usuarioData) => {
    try {
      const roleId = await obtenerIdRol(); // Obtén el ID del rol "Authenticated"
      const datosUsuario = {
        ...usuarioData,
        role: roleId, // Asigna el ID del rol
      };
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: datosUsuario 
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error detallado de Strapi2:', errorData);
        throw {
          status: errorData.error.status,
          message: errorData.error.message,
          errors: errorData.error.details.errors,
          errorData
        };
      }
  
      const data = await response.json();
      // console.log('Usuario creado en Strapi2:', data);
      return data;
    } catch (error) {
      console.error('Error al enviar datos a Strapi2:', error.message);
      throw error;
    }
  };

// 1. Función para buscar usuario por username
export const findUserIdByUsername = async (username: string): Promise<number | null> => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios?filters[username][$eq]=${encodeURIComponent(username)}`,
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

export const putUsuarioData = async (userDataForm) => {
  try {
    const token = localStorage.getItem('authToken');
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const username = user.username; 

    // Paso 1: Buscar el usuario por username para obtener su ID
    console.log("yendo a buscar usuario")
    const userData = await findUserIdByUsername(username, token);
    if (!userData) throw new Error('Usuario no encontrado');
    const userId = userData;
    // Paso 2: Actualizar el usuario con el ID obtenido
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: userDataForm
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error detallado2:', errorData);
      throw new Error('Error al actualizar usuario2');
    }

    const updatedUser = await response.json();
    console.log('Usuario actualizado:', updatedUser);
    return updatedUser;

  } catch (error) {
    console.error('Error en putUsuarioData2:', error.message);
    throw error; 
  }
};