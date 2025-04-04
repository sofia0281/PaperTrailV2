"use client";
import { useState, useEffect, useRef } from "react";
import { citiesData, City } from "./data/citiesData";

interface AutocompleteLocationProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const AutocompleteLocation = ({
  value,
  onChange,
  placeholder = "Ciudad o país de nacimiento", // Cambiado el placeholder
  required = false,
  className = ""
}: AutocompleteLocationProps) => {
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

    const isInputValid = citiesData.some(city => 
      city.name.toLowerCase() === inputValue.toLowerCase() ||
      city.country.toLowerCase() === inputValue.toLowerCase()
    );
    setError(isInputValid ? null : 'Por favor ingrese una ciudad o país válido');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setError(null);

    if (inputValue.trim().length > 0) {
      // Primero busca coincidencias exactas de país
      const countryMatches = citiesData.filter(city => 
        city.country.toLowerCase() === inputValue.toLowerCase()
      );

      // Si encontramos país exacto, mostramos todas sus ciudades
      if (countryMatches.length > 0) {
        setSuggestions(countryMatches);
      } else {
        // Si no, buscamos coincidencias parciales en ciudades y países
        const cityMatches = citiesData
          .filter(city => 
            city.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            city.country.toLowerCase().includes(inputValue.toLowerCase())
          )
          .slice(0, 10);
        setSuggestions(cityMatches);
      }
      
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city: City) => {
    onChange(city.name);
    setShowSuggestions(false);
    validateInput(city.name);
  };

  const handleInputFocus = () => {
    if (value) {
      // Misma lógica de búsqueda que en handleInputChange
      const countryMatches = citiesData.filter(city => 
        city.country.toLowerCase() === value.toLowerCase()
      );

      if (countryMatches.length > 0) {
        setSuggestions(countryMatches);
      } else {
        const cityMatches = citiesData
          .filter(city => city.name.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 10);
        setSuggestions(cityMatches);
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
        className={`w-full border rounded-md p-2 mt-1 outline-none text-sm ${
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
          {suggestions.map((city, index) => (
            <li 
              key={`${city.name}-${index}`}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center"
              onMouseDown={() => handleSuggestionClick(city)}
            >
              <span className="mr-2 text-lg">{city.flag}</span>
              <div>
                <p className="font-medium">{city.name}</p>
                <p className="text-xs text-gray-500">{city.country}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};  