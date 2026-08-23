import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { GeocodedLocation } from '../../services/geocodingService';
import type { GeoJSONPolygon } from '../../services/sentinel2Service';

const markerIcon = L.divIcon({ className: 'soilmint-location-marker', html: '<span></span>', iconSize: [20, 20], iconAnchor: [10, 10] });

type FarmBoundaryMapProps = {
  location: GeocodedLocation | null;
  geometry: GeoJSONPolygon | null;
  onLocationChange: (location: GeocodedLocation) => void;
  onGeometryChange: (geometry: GeoJSONPolygon | null) => void;
};

function RecenterMap({ location }: { location: GeocodedLocation }) {
  const map = useMap();
  useEffect(() => { map.setView([location.latitude, location.longitude], Math.max(map.getZoom(), 15)); }, [location, map]);
  return null;
}

function DrawingLayer({ geometry, drawing, editing, onGeometryChange }: { geometry: GeoJSONPolygon | null; drawing: boolean; editing: boolean; onGeometryChange: (geometry: GeoJSONPolygon | null) => void }) {
  const map = useMap();
  useEffect(() => {
    const layers: L.Layer[] = [];
    let points: L.LatLng[] = geometry?.coordinates[0].slice(0, -1).map(([longitude, latitude]) => L.latLng(latitude, longitude)) || [];
    let polygon: L.Polygon | null = null;

    const emit = () => {
      if (points.length < 3) return;
      const coordinates = points.map((point) => [point.lng, point.lat]);
      coordinates.push(coordinates[0]);
      onGeometryChange({ type: 'Polygon', coordinates: [coordinates] });
    };
    const redraw = () => {
      if (polygon) map.removeLayer(polygon);
      polygon = points.length >= 3 ? L.polygon(points, { color: '#34d399', fillColor: '#34d399', fillOpacity: 0.18, weight: 2 }).addTo(map) : null;
      if (polygon) layers.push(polygon);
    };
    const addVertex = (point: L.LatLng) => {
      points.push(point);
      redraw();
      emit();
    };
    const onMapClick = (event: L.LeafletMouseEvent) => { if (drawing) addVertex(event.latlng); };
    map.on('click', onMapClick);
    redraw();

    if (editing && points.length >= 3) {
      points.forEach((point, index) => {
        const handle = L.marker(point, { draggable: true, icon: L.divIcon({ className: 'soilmint-vertex-marker', html: `<span>${index + 1}</span>`, iconSize: [18, 18], iconAnchor: [9, 9] }) }).addTo(map);
        handle.on('drag', (event: L.LeafletEvent) => { points[index] = (event.target as L.Marker).getLatLng(); redraw(); emit(); });
        layers.push(handle);
      });
    }
    return () => { map.off('click', onMapClick); layers.forEach((layer) => map.removeLayer(layer)); };
  }, [drawing, editing, geometry, map, onGeometryChange]);
  return null;
}

export function FarmBoundaryMap({ location, geometry, onLocationChange, onGeometryChange }: FarmBoundaryMapProps) {
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [drawing, setDrawing] = useState(false);
  const [editing, setEditing] = useState(false);

  const searchLocation = async () => {
    if (!searchText.trim()) return;
    setSearching(true); setSearchError('');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&countrycodes=in&q=${encodeURIComponent(searchText)}`, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Search unavailable');
      const result = (await response.json() as Array<{ lat: string; lon: string; display_name: string; address?: Record<string, string> }>)[0];
      if (!result) throw new Error('No location found');
      const address = result.address || {};
      onLocationChange({ latitude: Number(result.lat), longitude: Number(result.lon), formattedAddress: result.display_name, village: address.village || address.hamlet || address.suburb || null, taluk: address.municipality || address.town || address.city_district || null, district: address.state_district || address.county || null, state: address.state || null, country: address.country || 'India', confidence: 60 });
    } catch { setSearchError('Location not found. Try a more specific village, district, or state.'); }
    finally { setSearching(false); }
  };

  if (!location) {
    return <div className="space-y-3 rounded-[1.2rem] border border-yellow-400/20 bg-yellow-500/10 p-4"><p className="text-sm text-yellow-100">Farm location could not be resolved from the record. Search and select the correct location to continue.</p><div className="flex gap-2"><input value={searchText} onChange={(event) => setSearchText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void searchLocation(); }} placeholder="Search village, district, state" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none" /><button type="button" onClick={() => void searchLocation()} disabled={searching} className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200 disabled:opacity-50"><Search className="size-4" />{searching ? 'Searching' : 'Search'}</button></div>{searchError && <p className="text-xs text-red-300">{searchError}</p>}</div>;
  }

  return <div className="space-y-3">
    <div className="flex flex-wrap gap-2"><input value={searchText} onChange={(event) => setSearchText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void searchLocation(); }} placeholder="Search another location" className="min-w-[12rem] flex-1 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none" /><button type="button" onClick={() => void searchLocation()} disabled={searching} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 disabled:opacity-50"><Search className="size-4" />Search</button><button type="button" onClick={() => { setDrawing(true); setEditing(false); }} className="rounded-lg border border-emerald-400/20 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200">Draw Polygon</button>{geometry && <button type="button" onClick={() => { setEditing(true); setDrawing(false); }} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">Edit Boundary</button>}{geometry && <button type="button" onClick={() => { onGeometryChange(null); setEditing(false); }} className="inline-flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200"><Trash2 className="size-4" />Delete</button>}</div>
    {searchError && <p className="text-xs text-red-300">{searchError}</p>}
    <MapContainer center={[location.latitude, location.longitude]} zoom={15} scrollWheelZoom className="h-[min(56vh,430px)] min-h-[280px] w-full overflow-hidden rounded-[1.2rem] border border-white/10"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><RecenterMap location={location} /><Marker position={[location.latitude, location.longitude]} icon={markerIcon} /><DrawingLayer geometry={geometry} drawing={drawing} editing={editing} onGeometryChange={onGeometryChange} /></MapContainer>
    <p className="text-xs text-slate-400">{drawing ? 'Click around the farm to add polygon points. Select Edit Boundary when finished.' : editing ? 'Drag the numbered vertices to correct the boundary.' : 'Pan and zoom to inspect roads and geographical context.'}</p>
  </div>;
}
