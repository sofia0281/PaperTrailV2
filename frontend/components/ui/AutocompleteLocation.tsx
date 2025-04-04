"use client";
import { useState, useEffect } from "react";
import { getCities } from 'countries-cities';

interface AutocompleteLocationProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const AutocompleteLocation = ({
  value,
  onChange,
  placeholder = "Ciudad de nacimiento",
  required = false
}: AutocompleteLocationProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar todas las ciudades del mundo
    const loadCities = async () => {
      try {
        setIsLoading(true);
        // Obtener ciudades de todos los países
        const countries = require('countries-cities').getCountries();
        const cities = countries.flatMap((country: string) => 
          getCities(country) || []
        );
        setAllCities(cities);
      } catch (error) {
        console.error("Error loading cities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCities();
  }, []);

  useEffect(() => {
    if (value && required) {
      validateInput(value);
    }
  }, [value, allCities]);

  const validateInput = (inputValue: string) => {
    if (!inputValue.trim()) {
      setError(required ? 'Este campo es requerido' : null);
      return;
    }

    const isCityValid = allCities.some(city => 
      city.toLowerCase() === inputValue.toLowerCase()
    );
    setError(isCityValid ? null : 'Por favor ingrese una ciudad válida');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setError(null);

    if (inputValue.trim().length > 0) {
      const cityMatches = allCities
        .filter(city => city.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 10); // Mostrar más sugerencias para ciudades globales

      setSuggestions(cityMatches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    validateInput(suggestion);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      validateInput(value);
    }, 200);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => value && setShowSuggestions(true)}
        onBlur={handleBlur}
        className={`w-full border rounded-md p-2 mt-1 outline-none text-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        disabled={isLoading}
      />
      
      {isLoading && (
        <p className="text-xs text-gray-500 mt-1">Cargando ciudades...</p>
      )}

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((city, index) => (
            <li 
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              onMouseDown={() => handleSuggestionClick(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};