// Importa el JSON (asegúrate de tener "resolveJsonModule": true en tsconfig.json)
import ciudadesData from './ciudades_mundo.json';

// Tipa los datos importados (ajusta según la estructura real de tu JSON)
export interface City {
  name: string;
  country: string;
  flag: string;
}

// Exporta los datos del JSON con el tipo correcto
export const citiesData: City[] = ciudadesData;

// Exporta el tipo (igual que antes)
export type CityType = typeof citiesData[0];