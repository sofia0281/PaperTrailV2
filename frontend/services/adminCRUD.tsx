
const obtenerIdRol = async () => {
    try {
        // console.log('Obteniendo ID del rol "Authenticated"...');
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
        const rolAuthenticated = data.roles.find((role) => role.name === 'Admin');
        if (!rolAuthenticated) {
        throw new Error('No se encontró el rol "Authenticated"');
        }
        // console.log('ID del rol "Authenticated":', rolAuthenticated.id);
        return rolAuthenticated.id;
    } catch (error) {
        console.error('Error al obtener el ID del rol:', error.message);
        throw error;
    }
};

export const getAdminsData = async () => {
    try {
        const token = localStorage.getItem('authToken');
      // 1. Primero obtenemos el ID del rol "Administrator"
        const roleId = await obtenerIdRol();
      // 2. Luego filtramos los usuarios por ese rol
        const usersResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?filters[role][id]=${roleId}&populate=role`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

        if (!usersResponse.ok) {
            const errorData = await usersResponse.json();
            console.error('Error fetching admins:', errorData);
            throw new Error(errorData.message || 'Failed to fetch admins');
        }
        const usersData = await usersResponse.json();
        console.log(usersData)
      // 3. Transformamos la respuesta porque strapi envia los datos muy anidados, de esta forma los podremos visualizar mejor
        return usersData.map((user: any) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: new Date(user.createdAt).toLocaleDateString(),
            role: {
                id: user.role?.id,
                name: user.role?.name,
                type: user.role?.type
            },
            Nombre:user.Nombre,
            Apellido:user.apellido,
            cedula:user.cedula,
            Genero:user.Genero,
            Fecha_nacimiento:user.Fecha_nacimiento,
            Lugar_nacimiento:user.lugar_nacimiento,
            TemaL_1:user.TemaL_1,
            TemaL_2:user.TemaL_2,
            Direccion:user.Direccion,
        }));

    } catch (error) {
        console.error('Error in getAdminsData:', error);
        throw new Error(typeof error === 'string' ? error : 'Error al obtener administradores');
    }
};


export const getAdminData = async (adminID: string) => {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${adminID}?populate=role`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        if (!response.ok) throw new Error('Error al obtener admin');
        const dataAdmin = await response.json();
        return dataAdmin
        // {
        //     id: data.id,
        //     username: data.username,
        //     email: data.email,
        //     Nombre: data.Nombre,
        //     Apellido: data.Apellido,
        //     Fecha_nacimiento:data.Fecha_nacimiento,
        //     Lugar_nacimiento:data.lugar_nacimiento,
        //     cedula:data.cedula,
        //     Genero:data.Genero,
        //     Direccion:data.Direccion,
        //     password:data.password
        // };
    } catch (error) {
      console.error('Error en getAdminData:', error);
      throw error;
    }
  };

  export const putAdminData = async (userAdminForm , adminID) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${adminID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userAdminForm), // Enviar todos los campos
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos del usuario');
        }

        const updatedUser = await response.json();
        console.log('Usuario actualizado:', updatedUser);
        alert('Datos actualizados correctamente');
        return updatedUser;
    } catch (error) {
        console.error('Error:', error.message);
        alert('Error al actualizar los datos');
    }
};


export const deleteAdmin= async (adminID) =>{
    try{
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${adminID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el Administrador');
        }

        const deleteUser = await response.json();
        return deleteUser;
    }catch(error){
        console.error('Error:', error.message);
        alert('Error al eliminar el administrador');
    }
};


export const createAdmin = async (adminData) => {
    try {
        const token = localStorage.getItem('authToken');
        const roleId = await obtenerIdRol(); // Obtén el ID del rol "Authenticated"
        console.log("rol",roleId)
        const datosUsuario = {
            ...adminData,
            role: roleId, // Asigna el ID del rol
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(datosUsuario),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error detallado de Strapi:', errorData);
            throw new Error('Error al crear el usuario');
        }

        const data = await response.json();
        console.log('Usuario creado en Strapi:', data);
        return data;
        } catch (error) {
        console.error('Error al enviar datos a Strapi:', error.message);
        throw error;
        }
};