'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function UsuarioChat() {
  const { authUser } = useAuth(); // 👈 Obtener usuario logueado
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    if (!authUser?.id) return; // Asegura que haya usuario

    const fetchMensajes = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1337/api/mensajes?filters[user][id]=${authUser.id}&populate=respuestas`
        );
        setMensajes(res.data.data);
      } catch (error) {
        console.error('Error al obtener mensajes:', error);
      }
    };

    fetchMensajes(); // Primera carga
    const interval = setInterval(fetchMensajes, 3000); // Auto refresh

    return () => clearInterval(interval);
  }, [authUser]);

  const enviarMensaje = async () => {
    if (!authUser?.id || !mensaje.trim()) return;

    try {
      await axios.post('http://localhost:1337/api/mensajes', {
        data: {
          contenido: mensaje,
          user: authUser.id,
        },
      });
      setMensaje('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Soporte al cliente</h2>

      <div
        style={{
          border: '1px solid #ccc',
          padding: 10,
          minHeight: 300,
          marginBottom: 10,
          backgroundColor: '#f9f9f9',
        }}
      >
        {mensajes.length === 0 && <p>No hay mensajes todavía.</p>}

        {mensajes.map((msg) => (
          <div key={msg.id} style={{ marginBottom: 15 }}>
            <div style={{ backgroundColor: '#e1ffc7', padding: 8, borderRadius: 6 }}>
              <strong>Tú:</strong> {msg.contenido}
            </div>

            {(msg.respuestas || []).map((res) => (
              <div
                key={res.id}
                style={{
                  backgroundColor: '#dce5ff',
                  padding: 8,
                  borderRadius: 6,
                  marginTop: 5,
                }}
              >
                <strong>Admin:</strong> {res.contenido}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={enviarMensaje}>Enviar</button>
      </div>
    </div>
  );
}
