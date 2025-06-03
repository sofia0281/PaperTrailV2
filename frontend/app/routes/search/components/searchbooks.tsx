"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchBooksWithFilters } from "@/services/bookCRUD";
import Filter from "./filter";
import { motion } from "framer-motion"; // Asegúrate de tenerlo instalado

const Search = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [prevFilters, setPrevFilters] = useState<string | null>(null);
  const currentFiltersRef = useRef<string>("");

  const query = searchParams.get("q") || "";

  useEffect(() => {
    const currentFilters = searchParams.toString();

    // Guardar el filtro anterior
    if (currentFilters !== currentFiltersRef.current) {
      setPrevFilters(currentFiltersRef.current);
      currentFiltersRef.current = currentFilters;
    }

    const fetchBooks = async () => {
      const filters = {
        q: searchParams.get("q") || undefined,
        condition: searchParams.get("condition") || undefined,
        maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined,
        author: searchParams.get("author") || undefined,
        genero: searchParams.get("genero") || undefined,
        idioma: searchParams.get("idioma") || undefined,
        year: searchParams.get("year") || undefined,
      };

      try {
        setLoading(true);
        const results = await searchBooksWithFilters(filters);
        setBooks(results);
      } catch (err) {
        setError("Error al cargar libros");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

  const handleRestoreFilters = () => {
    if (prevFilters) {
      router.push(`/routes/search?${prevFilters}`);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Resultados para: <span className="text-orange-500">{query}</span>
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <Filter />
        </div>

        <div className="flex flex-col gap-6 md:w-3/4">
          {loading ? (
            <div className="text-center py-10">Cargando libros...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : books.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-10 text-gray-500 space-y-4"
            >
              <p>No se encontraron libros con los filtros seleccionados.</p>

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                📚
              </motion.div>

              {prevFilters && (
                <button
                  onClick={handleRestoreFilters}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition"
                >
                  Volver a filtros anteriores
                </button>
              )}
            </motion.div>
          ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {books.map((book: any) => (
              <div
                key={book.id}
                className="flex flex-col md:flex-row bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="w-full md:w-48 h-64 bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/routes/books/${book.idLibro}`)}
                >
                  <img
                    src={
                      book.cover?.url?.includes("http")
                        ? book.cover.url
                        : `${book.cover?.url}`
                    }
                    alt={`Portada de ${book.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{book.title}</h3>
                    <p className="text-gray-600">Autor: {book.author || "N/A"}</p>
                    <p className="text-gray-600">Género: {book.genero || "N/A"}</p>
                    <p className="text-gray-600">Idioma: {book.idioma || "N/A"}</p>
                    <p className="text-gray-600">Editorial: {book.editorial || "N/A"}</p>
                    <p className="text-gray-600">Condición: {book.condition || "N/A"}</p>
                    <p className="text-gray-600">Año de Publicación: {book.year || "N/A"}</p>
                  </div>
                  <p className="text-orange-500 text-lg font-bold mt-4">{formatPrice(book.price)}</p>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Search;
