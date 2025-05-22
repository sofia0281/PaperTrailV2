"use client";
import { useState, useEffect, useRef } from "react";
import colombiaData from "./data_colombia.json";
import {XCircle } from "lucide-react";
interface AutocompleteColombiaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
    type: "region" | "departamento" | "ciudad";
    dependencia?: string;
    disabled?: boolean;
}

export const AutocompleteColombia = ({
    value,
    onChange,
    placeholder = "",
    required = false,
    className = "",
    type,
    dependencia = "",
    disabled = false
}: AutocompleteColombiaProps) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inputValue, setInputValue] = useState(value);
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
        setInputValue(value);
    }, [value]);


    const validateInput = (value: string): boolean => {
        if (!required && !value) return true; // No es requerido y está vacío
        
        const options = getFilteredData();
        const isValid = options.some(option => option.toLowerCase() === value.toLowerCase());
        
        if (!isValid) {
        setError(`Por favor seleccione una opción válida de la lista`);
        return false;
        }
        
        setError(null);
        return true;
    };

    const getFilteredData = (): string[] => {
        if (disabled) return [];
        
        try {
        if (type === "region") {
            return colombiaData.regiones.map(region => region.nombre);
        }
        
        if (type === "departamento" && dependencia) {
            const region = colombiaData.regiones.find(r => r.nombre === dependencia);
            return region ? region.departamentos.map(d => d.nombre) : [];
        }
        
        if (type === "ciudad" && dependencia) {
            for (const region of colombiaData.regiones) {
                for (const departamento of region.departamentos) {
                    if (departamento.nombre === dependencia) {
                        return departamento.ciudades;
                    }
                }
            }
        }
        } catch (error) {
            console.error("Error al obtener datos de Colombia:", error);
        }
        
        return [];
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        setError(null); // Limpiar error al escribir

        const filteredData = getFilteredData();
        
        if (val.trim().length > 0) {
            const matches = filteredData.filter(item =>
                item.toLowerCase().includes(val.toLowerCase())
            );
            setSuggestions(matches);
        } else {
            setSuggestions(filteredData);
        }
        
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (item: string) => {
        setInputValue(item);
        onChange(item);
        setShowSuggestions(false);
        setError(null);
    };    

    const handleInputFocus = () => {
        if (disabled) return;
        
        const filteredData = getFilteredData();
        setSuggestions(filteredData);
        setShowSuggestions(true);
    };

    const handleBlur = () => {
        setTimeout(() => {
        setShowSuggestions(false);
        validateInput(inputValue);
        }, 200);
    };    

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleBlur}
                className={`border rounded-md p-2 w-full focus:outline-none focus:ring-2 ${
                error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-500'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder={placeholder}
                required={required}
                autoComplete="off"
                disabled={disabled}
            />
            
            {error && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                <XCircle size={14} className="mr-1" />
                <span>{error}</span>
                </div>
            )}
            
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((item, index) => (
                    <li 
                    key={`${item}-${index}`}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSuggestionClick(item)}
                    onMouseDown={(e) => e.preventDefault()}
                    >
                    {item}
                    </li>
                ))}
                </ul>
            )}
            </div>
        );
    };