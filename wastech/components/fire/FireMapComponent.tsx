import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Pane } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corrija os ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  lat: number;
  lng: number;
}

interface FireData {
  latitude: number;
  longitude: number;
  frp?: number;
  confidence?: string;
  acq_date?: string;
  [key: string]: any;
}

interface MapProps {
  user: Location;
  fires: FireData[];
  viewLocation: Location | null;
}

// 🔴 CONFIGURAÇÃO DO ÍCONE GIGANTE E PULSANTE
const createFireIcon = (frp: number = 0) => {
  // Define a cor com base na intensidade (FRP)
  const color = frp >= 50 ? "#dc2626" : frp >= 20 ? "#f59e0b" : "#16a34a";
  
  return new L.DivIcon({
    className: "fire-marker-glow", // Esta classe deve estar no seu index.css com a animação
    html: `
      <div style="
        width: 45px; 
        height: 45px;
        background: ${color};
        border-radius: 50%;
        border: 4px solid white;
        display: flex; 
        align-items: center; 
        justify-content: center;
        box-shadow: 0 0 25px ${color}, 0 0 10px rgba(0,0,0,0.5);
      ">
        <span style="font-size: 24px;">🔥</span>
      </div>
    `,
    iconSize: [45, 45],
    iconAnchor: [22, 22], // Centraliza o ícone exatamente na coordenada
  });
};

const Map: React.FC<MapProps> = ({ user, fires, viewLocation }) => {
  // Define o centro do mapa (prioridade para busca, depois localização do usuário)
  const centerPosition = viewLocation 
    ? [viewLocation.lat, viewLocation.lng] 
    : [user.lat, user.lng];

  return (
    <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", border: "1px solid #334155" }}>
      <MapContainer
        key={JSON.stringify(centerPosition)} // Força o mapa a atualizar ao mudar de local
        center={centerPosition as [number, number]}
        zoom={10}
        scrollWheelZoom
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />

        {/* A Pane com zIndex 1000 garante que nossos fogos 
           fiquem ACIMA dos triângulos ou qualquer outra marcação padrão.
        */}
        <Pane name="fire-icons-pane" style={{ zIndex: 1000 }} />

        {/* RENDERIZAÇÃO DE TODOS OS FOCOS DE QUEIMADA */}
        {fires.map((fire, index) => (
          <Marker
            key={`fire-marker-${index}`}
            pane="fire-icons-pane"
            position={[fire.latitude, fire.longitude]}
            icon={createFireIcon(fire.frp || 0)}
          >
            <Popup className="fire-popup">
              <div style={{ textAlign: 'center', minWidth: '150px' }}>
                <strong style={{ color: '#dc2626', fontSize: '16px' }}>🚨 FOCO DETECTADO</strong>
                <hr style={{ margin: '8px 0', opacity: 0.2 }} />
                <div style={{ textAlign: 'left', fontSize: '13px' }}>
                  <b>Intensidade (FRP):</b> {fire.frp || "N/A"}<br />
                  <b>Confiança:</b> {fire.confidence || "N/A"}%<br />
                  <b>Data:</b> {fire.acq_date || "Recente"}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* LOCALIZAÇÃO DO USUÁRIO (PONTO AZUL PADRÃO) */}
        <Marker position={[user.lat, user.lng]}>
          <Popup>Sua Localização</Popup>
        </Marker>

        {/* RAIO DE MONITORAMENTO DE 10KM */}
        <Circle
          center={[user.lat, user.lng]}
          radius={10000} // 10km
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            dashArray: '10, 10'
          }}
        />
      </MapContainer>

      {/* LEGENDA FIXA NO CANTO DO MAPA */}
      <div style={{
        position: "absolute", bottom: 25, left: 25,
        background: "rgba(255, 255, 255, 0.9)", padding: "12px", borderRadius: "12px",
        zIndex: 1100, boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
        fontSize: "12px", color: "#333", border: "1px solid #ddd"
      }}>
        <strong style={{ display: 'block', marginBottom: '5px' }}>Monitoramento de Fogo</strong>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
<div style={{ width: 12, height: 12, borderRadius: "50%", background: "#dc2626" }}></div> Crítico (FRP &gt; 50)        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }}></div> Alerta (FRP 20-50)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2px dashed #3b82f6" }}></div> Raio de 10km
        </div>
      </div>
    </div>
  );
};

export default Map;