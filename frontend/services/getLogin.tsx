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
