export const loginUser = async (email, password) => {

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`;
    console.log("URL de autenticación:", url);
    try {
        console.log("Enviando solicitud de inicio de sesión a Strapi...");
        console.log("Email:", email);
        console.log("Contraseña:", password);

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
      const errorData = await response.json();
      console.error('Error detallado de Strapi2:', errorData);
      throw {
        status: errorData.error.status,
        message: errorData.error.message,
        errors: errorData.error.details.errors,
        errorData
      };
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
export const createUser = async (userData) => {
    try {
      const roleId = await obtenerIdRol(); // Obtén el ID del rol "Authenticated"
      const datosUsuario = {
        ...userData,
        role: roleId, // Asigna el ID del rol
      };
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario),
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





  //Seccion para suscribirse 
  export const suscribeUser = async (submittedEmail: string) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return { success: false, message: 'No hay token de autenticación' };

    const queryUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?filters[email][$eq]=${submittedEmail}`;
    const userRes = await fetch(queryUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!userRes.ok) {
      return { success: false, message: 'No se pudo buscar el usuario' };
    }

    const users = await userRes.json();

    if (!users || users.length === 0) {
      return { success: false, message: 'El correo no está registrado en el sistema' };
    }

    const user = users[0];
    if (user.suscripcion === true) {
      return { success: true, alreadySubscribed: true };
    }

    const updateRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ suscripcion: true }),
    });

    if (!updateRes.ok) {
      const errorData = await updateRes.json();
      return { success: false, message: errorData.error?.message || 'Error al actualizar la suscripción' };
    }

    const updatedUser = await updateRes.json();

    return { success: true, user: updatedUser };

  } catch (err: any) {
    // Aquí atrapas errores inesperados del sistema y devuelves mensaje de error
    return { success: false, message: err.message || 'Error inesperado' };
  }
};

  


//. parte de la suscripcion para recopilar todo los usuarios y saber quienes estan suscritos o no
export const fetchAllUsers = async () => {
  try {
    const token = localStorage.getItem('authToken'); // o 'authToken', asegúrate de usar el correcto
    if (!token) {
      console.warn('No se encontró token de autenticación');
      return [];
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?populate=role`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al obtener usuarios:', errorData);
      throw new Error('No se pudo obtener la lista de usuarios');
    }

    const data = await response.json();
    console.log("Usuarios obtenidos:", data);
    return data;
  } catch (error) {
    console.error('Error en fetchAllUsers:', error.message);
    return [];
  }
};
