export const loginUser = async (email: string, password: string) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: email.trim(), // Añadido .trim() para limpieza
        password: password.trim() // Añadido .trim() para limpieza
      }),
    });

    const data = await response.json();
    
    // Manejo mejorado de errores de Strapi
    if (!response.ok) {
      const errorMessage = data.error?.message || "Error en la autenticación";
      console.error("Error de Strapi:", errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Error en la conexión con Strapi:", error);
    throw new Error("No se pudo conectar al servidor");
  }
};

// Función para obtener la información del usuario (sin cambios)
export const fetchUserData = async () => {
  const token = localStorage.getItem('authToken');

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
    return userData;
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Función para actualizar usuario (mejora en manejo de errores)
export const putUserData = async (userDataForm: any) => {
  try {
    const token = localStorage.getItem('authToken');
    const userString = localStorage.getItem('user');
    
    if (!token || !userString) {
      throw new Error('No se encontraron datos de autenticación');
    }

    const user = JSON.parse(userString);
    const userId = user.id;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userDataForm),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error al actualizar usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar usuario:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Función para obtener ID de rol (sin cambios)
const obtenerIdRol = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users-permissions/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener roles');
    }

    const data = await response.json();
    const rolAuthenticated = data.roles.find((rol: any) => rol.name === 'Authenticated');

    if (!rolAuthenticated) {
      throw new Error('Rol no encontrado');
    }

    return rolAuthenticated.id;
  } catch (error) {
    console.error('Error al obtener rol:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Función para crear usuario (mejora en validación)
export const createUser = async (userData: any) => {
  try {
    const roleId = await obtenerIdRol();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        role: roleId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error al crear usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear usuario:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};