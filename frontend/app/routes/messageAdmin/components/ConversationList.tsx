'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ConversationList({ onSelectUser }: { onSelectUser: (id: number, username: string) => void }) {
  const [usuarios, setUsuarios] = useState<any[]>([]);

  const fetchUsuariosConMensajes = async () => {
    try {
      const res = await axios.get('http://localhost:1337/api/mensajes?populate=user');
      const mensajes = res.data.data;

      const mapaUsuarios = new Map();
      mensajes.forEach((msg: any) => {
        const user = msg.user;
        if (user && user.id && user.username) {
          mapaUsuarios.set(user.id, user.username);
        }
      });

      const listaUsuarios = Array.from(mapaUsuarios.entries()).map(([id, username]) => ({ id, username }));
      setUsuarios(listaUsuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsuariosConMensajes(); // Primera carga

    const intervalId = setInterval(() => {
      fetchUsuariosConMensajes(); // Carga periódica
    }, 5000); // Cada 5 segundos

    return () => clearInterval(intervalId); // Limpieza del intervalo
  }, []);

  return (
    <div className="p-4 w-64 border-r overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Conversaciones</h2>
      {usuarios.map((user) => (
        <div
          key={user.id}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded"
          onClick={() => onSelectUser(user.id, user.username)}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
}
