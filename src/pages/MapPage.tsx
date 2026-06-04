import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import L from "leaflet";
import { listShelters } from "../api/shelters";
import { listDisasters } from "../api/disasters";
import { allSOS } from "../api/sos";
import type { Disaster, EmergencyRequest, Shelter } from "../types/models";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type LatLng = { lat: number; lng: number };

function parseLatLng(s: string): LatLng | null {
  const parts = s.split(",").map((p) => p.trim());
  if (parts.length !== 2) return null;
  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

async function geocode(query: string): Promise<LatLng | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (!data?.length) return null;
  return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
}

export function MapPage() {
  const [sos, setSos] = useState<EmergencyRequest[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [shelterCoords, setShelterCoords] = useState<Record<number, LatLng>>({});
  const [disasterCoords, setDisasterCoords] = useState<Record<number, LatLng>>({});

  useEffect(() => {
    allSOS().then(setSos).catch(() => setSos([]));
    listShelters().then(setShelters).catch(() => setShelters([]));
    listDisasters().then(setDisasters).catch(() => setDisasters([]));
  }, []);

  useEffect(() => {
    (async () => {
      for (const s of shelters) {
        if (shelterCoords[s.id]) continue;
        const c = await geocode(s.address);
        if (c) setShelterCoords((m) => ({ ...m, [s.id]: c }));
        await new Promise((r) => setTimeout(r, 700));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shelters]);

  useEffect(() => {
    (async () => {
      for (const d of disasters) {
        if (disasterCoords[d.id]) continue;
        const c = await geocode(d.location);
        if (c) setDisasterCoords((m) => ({ ...m, [d.id]: c }));
        await new Promise((r) => setTimeout(r, 700));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disasters]);

  const sosMarkers = useMemo(
    () => sos.map((r) => ({ req: r, coord: parseLatLng(r.location) })).filter((x) => x.coord),
    [sos]
  );

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="text-xl font-semibold mb-4">Map</h1>

      <div className="h-[70vh] border rounded overflow-hidden">
        <MapContainer center={[6.9271, 79.8612]} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <LayersControl position="topright">
            <LayersControl.Overlay checked name="SOS Requests">
              <>
                {sosMarkers.map(({ req, coord }) => (
                  <Marker key={`sos-${req.id}`} position={[coord!.lat, coord!.lng]}>
                    <Popup>
                      <div className="font-semibold">SOS #{req.id}</div>
                      <div>Type: {req.requestType}</div>
                      <div>Status: {req.status}</div>
                      <div>Loc: {req.location}</div>
                    </Popup>
                  </Marker>
                ))}
              </>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Shelters (geocoded)">
              <>
                {shelters
                  .filter((s) => shelterCoords[s.id])
                  .map((s) => {
                    const c = shelterCoords[s.id]!;
                    return (
                      <Marker key={`shelter-${s.id}`} position={[c.lat, c.lng]}>
                        <Popup>
                          <div className="font-semibold">{s.shelterName}</div>
                          <div>{s.address}</div>
                          <div>Capacity: {s.currentOccupancy}/{s.totalCapacity}</div>
                        </Popup>
                      </Marker>
                    );
                  })}
              </>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Disasters (geocoded)">
              <>
                {disasters
                  .filter((d) => disasterCoords[d.id])
                  .map((d) => {
                    const c = disasterCoords[d.id]!;
                    return (
                      <Marker key={`disaster-${d.id}`} position={[c.lat, c.lng]}>
                        <Popup>
                          <div className="font-semibold">{d.disasterType}</div>
                          <div>{d.location}</div>
                          <div>Severity: {d.severityLevel}</div>
                          <div>Status: {d.status}</div>
                        </Popup>
                      </Marker>
                    );
                  })}
              </>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        SOS markers use exact lat/lng from API. Shelters/Disasters are geocoded from text fields (dev-only approach).
      </div>
    </div>
  );
}
