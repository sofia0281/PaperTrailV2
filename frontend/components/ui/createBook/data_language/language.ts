
import ciudadesData from './idiomas_banderas.json';

// Tipa los datos importados (ajusta según la estructura real de tu JSON)
export interface editorial {
  nombre: string;
  bandera: string;
}

// Exporta los datos del JSON con el tipo correcto
export const citiesData: idioma[] = ciudadesData;

// Exporta el tipo (igual que antes)
export type CityType = typeof citiesData[0];