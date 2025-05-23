"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { AutocompleteLanguage } from "./Autocompleteidioma";
import { AutocompleteGenero } from "./data_gender/AutocompleteGenero";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [condition, setCondition] = useState(searchParams.get("condition") || "Todos");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [author, setAuthor] = useState(searchParams.get("author") || "");
  const [genero, setGenero] = useState(searchParams.get("genero") || "");
  const [idioma, setIdioma] = useState(searchParams.get("idioma") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");

  const [showYearFilter, setShowYearFilter] = useState(!!searchParams.get("year"));

  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({
    condition: false,
    maxPrice: false,
    author: false,
    genero: false,
    idioma: false,
    year: !!searchParams.get("year")
  });

  useEffect(() => {
    setActiveFilters({
      condition: searchParams.has("condition") && searchParams.get("condition") !== "Todos",
      maxPrice: searchParams.has("maxPrice"),
      author: searchParams.has("author"),
      genero: searchParams.has("genero"),
      idioma: searchParams.has("idioma"),
      year: searchParams.has("year")
    });
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchParams.get("q")) params.set("q", searchParams.get("q")!);
    if (condition !== "Todos") params.set("condition", condition);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (author) params.set("author", author);
    if (genero) params.set("genero", genero);
    if (idioma) params.set("idioma", idioma);
    if (showYearFilter && year) params.set("year", year);

    console.log("Filtros aplicados:", params.toString());


    router.push(`/routes/search?${params.toString()}`);
  };

  const getInputClass = (filterName: string) => {
    const base = "mt-1 w-full h-10 rounded-md shadow-sm transition-all duration-200 px-2 flex items-center";
    return base + (activeFilters[filterName]
      ? " bg-orange-500 border-orange-600 text-white"
      : " bg-white border border-gray-300 text-gray-900");
  };

  const getInputTextClass = (filterName: string) => {
    return (
      "w-full h-full bg-transparent border-none focus:ring-0 outline-none text-sm" +
      (activeFilters[filterName] ? " text-white placeholder-white" : " text-gray-900 placeholder-gray-400")
    );
  };

  return (
    <div className="w-full md:w-64 bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Filtros</h3>
      <div className="space-y-4">
        {/* Condición */}
        <div className="block">
          <label className="text-gray-700">Condición</label>
          <div className={getInputClass("condition")}>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className={`w-full h-full px-2 py-1 rounded outline-none appearance-none transition-colors duration-200 ${
                activeFilters["condition"]
                ? "bg-orange-500 text-white"
                : "bg-white text-black"
            }`}
            >
            <option value="Todos" style={{ color: "black", backgroundColor: "white" }}>Todos</option>
            <option value="Nuevo" style={{ color: "black", backgroundColor: "white" }}>Nuevo</option>
            <option value="Usado" style={{ color: "black", backgroundColor: "white" }}>Usado</option>
            </select>


          </div>
        </div>

        {/* Precio máximo */}
        <div className="block">
          <label className="text-gray-700">Precio máximo</label>
          <div className={getInputClass("maxPrice")}>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Ej: 20000"
              className={getInputTextClass("maxPrice")}
            />
          </div>
        </div>

        {/* Autor */}
        <div className="block">
          <label className="text-gray-700">Autor</label>
          <div className={getInputClass("author")}>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Escribe el autor"
              className={getInputTextClass("author")}
            />
          </div>
        </div>

        {/* Género */}
        {/* Género */}
<div className="block">
  <label className="text-gray-700">Género</label>
  <div className={getInputClass("genero")}>
    <div className="w-full h-full">
      <AutocompleteGenero
        value={genero}
        onChange={(value) => setGenero(value)}
        placeholder="Busca un género literario"
        className={getInputTextClass("genero")}
        isActive={activeFilters.genero}
      />
    </div>
  </div>
</div>

        {/* Idioma */}
        <div className="block">
        <label className="text-gray-700">Idioma</label>
        <div className={getInputClass("idioma")}>
            <div className="w-full h-full">
            <AutocompleteLanguage
                value={idioma}
                onChange={(value) => setIdioma(value)}
                placeholder="Selecciona idioma"
                className={getInputTextClass("idioma")}
                isActive={activeFilters.idioma}
            />
            </div>
        </div>
        </div>

        {/* Año (con toggle) */}
        <div className="block">
          <button
            type="button"
            onClick={() => setShowYearFilter(!showYearFilter)}
            className={`w-full text-left px-2 py-2 rounded-md font-medium transition-all ${
              showYearFilter ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {showYearFilter ? "Año de publicación (activo)" : "Año de publicación"}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showYearFilter ? "max-h-40 mt-2" : "max-h-0"
            }`}
          >
            <div className="flex items-center space-x-4 mt-2">
              <input
                type="range"
                min="1900"
                max={new Date().getFullYear()}
                step="1"
                value={year || new Date().getFullYear()}
                onChange={(e) => setYear(e.target.value)}
                className="w-full accent-orange-500"
              />
              <span className="w-16 text-right text-orange-600 font-semibold">
                {year || "Todos"}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de aplicar */}
        <button
          onClick={applyFilters}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition-colors duration-200 mt-12"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );
};

export default Filter;
