"use client";
import { useState, useEffect, useRef } from "react";
import { citiesData, City } from "./data_Editorial/editorial";

interface AutocompleteEditorialProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const AutocompleteEditorial = ({
  value,
  onChange,
  placeholder = "Editorial de publicación", // Cambiado el placeholder
  required = false,
  className = ""
}: AutocompleteEditorialProps) => {
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value && required) {
      validateInput(value);
    }
  }, [value]);

  const validateInput = (inputValue: string) => {
    if (!inputValue.trim()) {
      setError(required ? 'Este campo es requerido' : null);
      return;
    }

    const isInputValid = citiesData.some(editorial => 
      editorial.nombre.toLowerCase() === inputValue.toLowerCase() ||
      editorial.pais.toLowerCase() === inputValue.toLowerCase()
    );
    setError(isInputValid ? null : 'Por favor ingrese una editorial válida');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setError(null);

    if (inputValue.trim().length > 0) {
      // Primero busca coincidencias exactas de país
      const countryMatches = citiesData.filter(editorial => 
        editorial.pais.toLowerCase() === inputValue.toLowerCase()
      );

      // Si encontramos país exacto, mostramos todas sus editoriales
      if (countryMatches.length > 0) {
        setSuggestions(countryMatches);
      } else {
        // Si no, buscamos coincidencias parciales en editoriales y países
        const editorialMatches = citiesData
          .filter(editorial => 
            editorial.nombre.toLowerCase().includes(inputValue.toLowerCase()) ||
            editorial.pais.toLowerCase().includes(inputValue.toLowerCase())
          )
          .slice(0, 10);
        setSuggestions(editorialMatches);
      }
      
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (editorial: City) => {
    onChange(editorial.nombre);
    setShowSuggestions(false);
    validateInput(editorial.nombre);
  };

  const handleInputFocus = () => {
    if (value) {
      // Misma lógica de búsqueda que en handleInputChange
      const countryMatches = citiesData.filter(editorial => 
        editorial.pais.toLowerCase() === value.toLowerCase()
      );

      if (countryMatches.length > 0) {
        setSuggestions(countryMatches);
      } else {
        const editorialMatches = citiesData
          .filter(editorial => editorial.nombre.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 10);
        setSuggestions(editorialMatches);
      }
      setShowSuggestions(true);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className={`border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((editorial, index) => (
            <li 
              key={`${editorial.nombre}-${index}`}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center"
              onMouseDown={() => handleSuggestionClick(editorial)}
            >
              <span className="mr-2 text-lg">{editorial.bandera}</span>
              <div>
                <p className="font-medium">{editorial.nombre}</p>
                <p className="text-xs text-gray-500">{editorial.pais}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
