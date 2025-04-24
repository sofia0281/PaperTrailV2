"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import ButtonSuscribete from "@/components/ui/buttonsuscribete";
import CardBooks from "@/components/ui/cardbooks";

interface StrapiBook {
  id: number;
  attributes: {
    title: string;
    price: number;
    author?: string;
    condition?: string;
    cover: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

const Home = () => {
  const router = useRouter();
  const [books, setBooks] = useState<StrapiBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('http://localhost:1337/api/books?populate=cover');
        if (!res.ok) throw new Error('Error al cargar libros');
        const { data } = await res.json();
        console.log("Datos recibidos de Strapi:", data); // Verifica la estructura aquí
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
  
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Sección de destacados */}
      <section className="flex justify-center items-center py-8">
      <div className="w-3/4 h-[400px] rounded-lg overflow-hidden">
        <img 
          src="/img/bannerPaperTrail.webp" 
          alt="Banner"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
      </div>
    </section>

      {/* Título principal */}
      <h2 className="text-center text-xl md:text-2xl font-semibold">
        ENCUENTRA TODOS TUS <span className="text-orange-500">LIBROS FAVORITOS</span>
      </h2>

      {/* Botones de categorías y novedades */}
      <div className="flex justify-center gap-4 my-4">
        <button className="bg-[#3C88A3] text-white px-4 py-2 rounded-md hover:scale-105 transition-transform">
          📚 Categorías
        </button>
        <button className="bg-[#3C88A3] text-white px-4 py-2 rounded-md hover:scale-105 transition-transform">
          ✨ Novedades
        </button>
      </div>
      {/* Lista de libros dinámica */}
      {loading ? (
        <div className="text-center py-10">Cargando libros...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 px-6 py-6">
          {books.slice(0,10).map((book) => (
            <CardBooks
              key={book.id}
              title={book.title}
              price={book.price}
              author={book.author}
              condition={book.condition || "Usado/Nuevo"}
              imageUrl={book.cover?.url}
            />
          ))}
        </div>
      )}

      {/* Sección de suscripción */}
      <ButtonSuscribete />
    </div>
  );
};

export default Home;