"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchBooks } from "@/services/bookCRUD";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        const res = await searchBooks(searchTerm);
        setResults(res);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false); // ← Esta es la línea clave que añadimos
    if (searchTerm.trim()) {
      router.push(`/routes/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSelectBook = (id: string) => {
    setShowDropdown(false);
    setSearchTerm('');
    router.push(`/routes/books/${id}`);
  };

  return (
    <div className="relative flex-grow mx-4 max-w-lg">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length > 1 && setShowDropdown(true)}
          placeholder="Título, Autor, Año, ISSN"
          className="w-full p-2 pl-4 pr-10 rounded-lg bg-white text-black focus:outline-none shadow-md"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:scale-110 cursor-pointer"
        >
          <Search size={20} />
        </button>
      </form>

      {/* Dropdown */}
      {showDropdown && results.length > 0 && (
        <ul className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map((book) => (
            <li
            key={book.id}
            onClick={() => handleSelectBook(book.idLibro)}
            className="flex items-center justify-between p-2 gap-3 cursor-pointer hover:bg-orange-100"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${book.cover?.url}`}
                alt={book.title}
                className="w-10 h-14 object-cover rounded shrink-0"
              />
              <span className="font-medium truncate">{book.title}</span>
            </div>
            <span className="text-sm font-semibold text-orange-600 whitespace-nowrap ml-2">
            {book.price?.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>

          </li>
          
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;