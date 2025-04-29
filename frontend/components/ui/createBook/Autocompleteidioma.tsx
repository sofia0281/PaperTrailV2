"use client";

import { useState, useEffect, useRef } from "react";
import { citiesData, idioma as LanguageType } from "@/components/ui/createBook/data_language/language";

interface AutocompleteLanguageProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const AutocompleteLanguage = ({
  value,
  onChange,
  placeholder = "Idioma", // Puedes cambiarlo si quieres
  required = false,
  className = ""
}: AutocompleteLanguageProps) => {
  const [suggestions, setSuggestions] = useState<LanguageType[]>([]);
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

    const isInputValid = citiesData.some(lang =>
      lang.idioma.toLowerCase() === inputValue.toLowerCase()
    );
    setError(isInputValid ? null : "Por favor ingrese un idioma válido");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setError(null);

    if (inputValue.trim().length > 0) {
      const matches = citiesData
        .filter(lang =>
          lang.idioma.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, 10);
      
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (language: LanguageType) => {
    onChange(language.idioma);
    setShowSuggestions(false);
    validateInput(language.idioma);
  };

  const handleInputFocus = () => {
    if (value) {
      const matches = citiesData
        .filter(lang => lang.idioma.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);

      setSuggestions(matches);
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
          error ? "border-red-500" : "border-gray-300"
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
          {suggestions.map((lang, index) => (
            <li 
              key={`${lang.idioma}-${index}`}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center"
              onMouseDown={() => handleSuggestionClick(lang)}
            >
              <span className="mr-2 text-lg">{lang.bandera}</span>
              <div>
                <p className="font-medium">{lang.idioma}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};