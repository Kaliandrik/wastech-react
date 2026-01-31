import React, { useEffect, useState, useCallback } from "react";
import { getUserLocation } from "../services/fire/location";
import { getFires, refreshFires, getLastUpdateTime } from "../services/fire/fireApi";
import { calcDistance } from "../utils/fire/distance";
import { geocodePlace } from "../services/fire/geocode";
import FireMap from "../components/fire/FireMapComponent";
import AlertBox from "../components/fire/AlertBox";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Tipos TypeScript
interface Location {
  lat: number;
  lng: number;
}

interface FireData {
  latitude: number;
  longitude: number;
  frp?: number;
  brightness?: number;
  scan?: number;
  track?: number;
  confidence?: string;
  acq_date?: string;
  [key: string]: any;
}

const Incendios: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Location | null>(null);
  const [fires, setFires] = useState<FireData[]>([]);
  const [nearbyFires, setNearbyFires] = useState<FireData[]>([]);
  const [viewLocation, setViewLocation] = useState<Location | null>(null);
  const [place, setPlace] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Função principal para carregar dados
  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // 1. Obtém localização do usuário (só na primeira carga)
      if (!user) {
        const location = await getUserLocation();
        setUser(location);
      }

      // 2. Obtém dados das queimadas (com ou sem cache)
      const fireData = await getFires(forceRefresh);

      // 3. TRATAMENTO DOS DADOS
      const validFires = fireData
        .map((f: any) => ({
          ...f,
          latitude: parseFloat(f.latitude),
          longitude: parseFloat(f.longitude),
          frp: parseFloat(f.frp || 0),
          brightness: parseFloat(f.brightness || 0),
          scan: parseFloat(f.scan || 0),
          track: parseFloat(f.track || 0)
        }))
        .filter((f: any) => !isNaN(f.latitude) && !isNaN(f.longitude));

      setFires(validFires);

      // 4. Filtra queimadas num raio de 10km (só se tiver user)
      const currentLocation = viewLocation || user;
      if (currentLocation) {
        const near = validFires.filter((fire: FireData) => {
          const dist = calcDistance(
            currentLocation.lat,
            currentLocation.lng,
            fire.latitude,
            fire.longitude
          );
          return dist <= 10;
        });
        setNearbyFires(near);
      }

      // 5. Atualiza timestamp da última atualização
      const updateTime = getLastUpdateTime();
      setLastUpdate(updateTime);

    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err instanceof Error ? err.message : "Não foi possível carregar os dados de monitoramento.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, viewLocation]);

  // Carregamento inicial
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Função para atualizar manualmente
  const handleRefresh = async () => {
    await loadData(true);
  };

  // Função de Busca por Cidade
  async function handleSearchPlace() {
    if (!place.trim()) return;
    try {
      setError(null);
      const result = await geocodePlace(place);
      setViewLocation({ lat: result.lat, lng: result.lng });
      
      // Atualiza queimadas próximas à nova localização
      if (fires.length > 0) {
        const near = fires.filter((fire) => {
          const dist = calcDistance(
            result.lat,
            result.lng,
            fire.latitude,
            fire.longitude
          );
          return dist <= 10;
        });
        setNearbyFires(near);
      }
    } catch (err) {
      setError("Local não encontrado. Tente novamente.");
    }
  }

  // Formatar tempo desde a última atualização
  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "Nunca";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return "Agora mesmo";
    if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Estatísticas
  const totalFires = fires.length;
  const highIntensityFires = fires.filter(f => f.frp && f.frp > 10).length;
  const veryHighIntensityFires = fires.filter(f => f.frp && f.frp > 50).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Carregando Monitoramento Wastech...</h2>
        <p className="text-gray-500 mt-2">Buscando dados de satélite da NASA</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* CABEÇALHO COM BOTÃO DE VOLTAR - RESPONSIVO MELHORADO */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {/* Botão Voltar para Dashboard - TOTALMENTE RESPONSIVO */}
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center justify-center sm:justify-start space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto order-2 sm:order-1"
                title="Voltar para Dashboard"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm sm:text-base">Dashboard</span>
              </button>
              
              {/* Título - RESPONSIVO */}
              <div className="order-1 sm:order-2 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center sm:justify-start">
                  <span className="text-red-600 mr-2">🔥</span> 
                  <span className="whitespace-nowrap">Wastech Fire Monitor</span>
                </h1>
                <div className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">
                  Monitoramento de Queimadas em Tempo Real
                </div>
              </div>
            </div>
            
            {/* Informações de atualização - RESPONSIVO */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <div className="text-xs sm:text-sm text-center sm:text-left">
                <span className="text-gray-500">Última atualização: </span>
                <span className="font-medium text-gray-700">{formatTimeAgo(lastUpdate)}</span>
              </div>
              <button 
                className={`px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 w-full sm:w-auto ${
                  refreshing 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                onClick={handleRefresh}
                disabled={refreshing}
                title="Atualizar dados agora"
              >
                {refreshing ? (
                  <>
                    <span className="animate-spin text-sm">🔄</span>
                    <span className="text-sm">Atualizando...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">🔄</span>
                    <span className="text-sm">Atualizar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ESTATÍSTICAS - RESPONSIVO */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-800">{totalFires}</div>
            <div className="text-gray-600 text-xs sm:text-sm mt-1">Focos Ativos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{highIntensityFires}</div>
            <div className="text-gray-600 text-xs sm:text-sm mt-1">Alta Intensidade</div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{veryHighIntensityFires}</div>
            <div className="text-gray-600 text-xs sm:text-sm mt-1">Muito Alta</div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{nearbyFires.length}</div>
            <div className="text-gray-600 text-xs sm:text-sm mt-1">Próximos de Você</div>
          </div>
        </div>
      </div>

      {/* 🔎 BUSCA E CONTROLES - RESPONSIVO */}
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-3">
            <input 
              type="text" 
              placeholder="Buscar cidade, estado ou coordenadas..." 
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchPlace()}
              className="flex-grow px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 md:gap-3">
              <button 
                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                onClick={handleSearchPlace}
              >
                <span className="mr-1 sm:mr-2">🔍</span>
                <span className="whitespace-nowrap">Buscar</span>
              </button>
              {user && (
                <button 
                  className="px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center text-sm sm:text-base"
                  onClick={() => {
                    setViewLocation(null);
                    const near = fires.filter((fire) => {
                      const dist = calcDistance(
                        user.lat,
                        user.lng,
                        fire.latitude,
                        fire.longitude
                      );
                      return dist <= 10;
                    });
                    setNearbyFires(near);
                  }}
                  title="Voltar para minha localização"
                >
                  <span className="mr-1 sm:mr-2">📍</span>
                  <span className="whitespace-nowrap">Minha Localização</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MENSAGENS DE ERRO/STATUS - RESPONSIVO */}
      {error && (
        <div className="container mx-auto px-3 sm:px-4 py-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span className="text-sm sm:text-base">{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-bold text-sm sm:text-base"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {refreshing && (
        <div className="container mx-auto px-3 sm:px-4 py-2">
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base text-center">
            🔄 Atualizando dados da NASA...
          </div>
        </div>
      )}

      {/* 🗺️ MAPA - RESPONSIVO */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {user ? (
            <>
              <div className="h-[400px] sm:h-[500px] md:h-[600px]">
                <FireMap
                  user={user}
                  fires={fires}
                  viewLocation={viewLocation}
                />
              </div>
              {nearbyFires.length > 0 && (
                <div className="p-3 sm:p-4 border-t">
                  <AlertBox distance={10} />
                </div>
              )}
            </>
          ) : (
            <div className="p-6 sm:p-8 text-center">
              <p className="text-gray-600 text-sm sm:text-base">Permita o acesso à localização para ver o mapa</p>
            </div>
          )}
        </div>
      </div>

      {/* RODAPÉ INFORMATIVO COM BOTÃO - RESPONSIVO */}
      <footer className="bg-gray-800 text-white mt-6 sm:mt-8 py-4 sm:py-6">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs sm:text-sm text-center md:text-left">
              <p className="mb-2">
                <strong className="font-semibold">Fonte de dados:</strong> NASA FIRMS - Dados de satélite VIIRS atualizados a cada 24h
              </p>
              <p className="mb-2">
                <strong className="font-semibold">FRP (Fire Radiative Power):</strong> Medida da intensidade do fogo em MW (Megawatts)
              </p>
              <p className="text-gray-300 mt-2 sm:mt-4">
                ⚠️ Dados são atualizados automaticamente. Raio de proximidade: 10km.
              </p>
            </div>
            
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors w-full sm:w-auto text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="whitespace-nowrap">Voltar para Dashboard</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Incendios;