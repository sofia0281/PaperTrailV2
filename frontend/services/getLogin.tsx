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
            identifier: email, // Strapi espera "identifier" para el correo o nombre de usuario
            password: password, // Contraseña en texto plano
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en la autenticación:", error);
        throw error;
    }
};

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
  
  // Llamar a la función después de que el usuario inicie sesión
  