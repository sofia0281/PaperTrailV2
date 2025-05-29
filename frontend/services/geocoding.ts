import axios from "axios";

const OPENCAGE_API_KEY = "dcc75b62c9c5497bb39fa5a9df25bc1f"; 
export async function geocodeAddress(address: string) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}&language=es&countrycode=co`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { latitud: lat, longitud: lng };
    } else {
      throw new Error("No se encontraron coordenadas para la dirección");
    }
  } catch (error) {
    console.error("Error al geocodificar la dirección:", error);
    throw error;
  }
}
