'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllTiendasData } from '@/services/tiendasCRUD';

delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function Maps() {
  const [tiendas, setTiendas] = useState<any[]>([]);
  const [colombiaGeoJson, setColombiaGeoJson] = useState<any>(null);

  // Mapa centrado en Colombia con zoom más bajo
  const [mapCenter] = useState<[number, number]>([4.5709, -65.2973]);
  const [zoom] = useState(5.4); // Zoom más alejado para ver Colombia completa

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const data = await getAllTiendasData();
        setTiendas(data);
      } catch (error) {
        console.error('Error cargando tiendas:', error);
      }
    };

    const fetchGeoJson = async () => {
      try {
        const response = await fetch('/colombia.geo.json');
        const geoData = await response.json();
        setColombiaGeoJson(geoData);
      } catch (error) {
        console.error('Error cargando GeoJSON:', error);
      }
    };

    fetchTiendas();
    fetchGeoJson();
  }, []);

  return (
    <div className="w-full h-[600px] mt-10 px-4">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        whenCreated={(map) => {
          map.options.wheelPxPerZoomLevel = 150; // aumenta este número para hacer el zoom más lento
        }}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {colombiaGeoJson && (
          <GeoJSON
            data={colombiaGeoJson}
            style={{ color: '#3C88A3', weight: 2, fillOpacity: 0 }}
          />
        )}

        {tiendas.map((tienda) => {
          const lat = parseFloat(tienda.latitud);
          const lng = parseFloat(tienda.longitud);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Tienda ${tienda.Nombre} tiene coordenadas inválidas`);
            return null;
          }

          return (
            <Marker key={tienda.id} position={[lat, lng]}>
              <Popup>
                <strong>{tienda.Nombre}</strong><br />
                {tienda.Direction}<br />
                {tienda.Ciudad}, {tienda.Departamento}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
