"use client";

import { useState, useEffect, useRef } from "react";
import generosData from './gender_emoji.json';

interface GeneroType {
  genero: string;
  emoji: string;
}

interface AutocompleteGeneroProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  isActive?: boolean; // Nuevo prop para indicar si el filtro está activo
}

export const AutocompleteGenero = ({
  value,
  onChange,
  placeholder = "Género literario",
  required = false,
  className = "",
  isActive = false // Valor por defecto false
}: AutocompleteGeneroProps) => {
  const [suggestions, setSuggestions] = useState<GeneroType[]>([]);
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
      setError(required ? "Este campo es requerido" : null);
      return;
    }

    const isInputValid = generosData.some(gen =>
      gen.genero.toLowerCase() === inputValue.toLowerCase()
    );
    setError(isInputValid ? null : "Por favor ingrese un género válido");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setError(null);

    if (inputValue.trim().length > 0) {
      const matches = generosData
        .filter(gen =>
          gen.genero.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, 10);
      
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (genero: GeneroType) => {
    onChange(genero.genero);
    setShowSuggestions(false);
    validateInput(genero.genero);
  };

  const handleInputFocus = () => {
    if (value) {
      const matches = generosData
        .filter(gen => gen.genero.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);

      setSuggestions(matches);
      setShowSuggestions(true);
    }
  };

  return (
    <div className={`relative h-full ${className}`} ref={containerRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className={`w-full h-full bg-transparent border-none focus:ring-0 outline-none text-sm ${
          error ? "text-red-500 placeholder-red-400" : 
          isActive ? "text-white placeholder-white" : "text-gray-900 placeholder-gray-400"
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
          {suggestions.map((gen, index) => (
            <li 
              key={`${gen.genero}-${index}`}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center"
              onMouseDown={() => handleSuggestionClick(gen)}
            >
              <span className="mr-2 text-lg">{gen.emoji}</span>
              <div>
                <p className="font-medium text-gray-900">{gen.genero}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};