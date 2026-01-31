const API_URL = "http://localhost:3000/api/fires";
const LOCAL_NASA_FILE = "/MODIS_C6_1_South_America_MCD14DL_NRT_2026021.txt";
const CACHE_KEY = "nasa_fires_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

export interface FireData {
  latitude: number;
  longitude: number;
  brightness: number;
  scan: number;
  track: number;
  acq_date: string;
  acq_time: string;
  satellite: string;
  confidence: string;
  version: string;
  bright_t31?: number;
  frp: number;
  daynight: string;
  [key: string]: any;
}

export async function getFires(forceUpdate = false): Promise<FireData[]> {
  // 1. Verificar cache
  if (!forceUpdate) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log("📂 Dados do cache");
        return data;
      }
    }
  }

  // 2. Tentar API local
  try {
    console.log("🌐 Buscando da API local...");
    const response = await fetch(API_URL, { 
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      const fireData: FireData[] = await response.json();
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: fireData,
        timestamp: Date.now()
      }));
      
      console.log(`✅ ${fireData.length} focos da API`);
      return fireData;
    }
    
    throw new Error(`API: ${response.status}`);
    
  } catch (apiError) {
    console.warn("⚠️ API offline:", apiError);
    
    // 3. Fallback para arquivo local direto
    try {
      console.log("📁 Tentando arquivo local...");
      const response = await fetch(LOCAL_NASA_FILE);
      
      if (!response.ok) throw new Error(`Arquivo: ${response.status}`);
      
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) return [];
      
      const fireData: FireData[] = lines.slice(1).map(line => {
        const values = line.split(',');
        const bright_t31 = values[10] ? parseFloat(values[10]) : undefined;
        
        return {
          latitude: parseFloat(values[0]) || 0,
          longitude: parseFloat(values[1]) || 0,
          brightness: parseFloat(values[2]) || 0,
          scan: parseFloat(values[3]) || 0,
          track: parseFloat(values[4]) || 0,
          acq_date: values[5] || '',
          acq_time: values[6] || '',
          satellite: values[7] || '',
          confidence: values[8] || '',
          version: values[9] || '',
          bright_t31: bright_t31,
          frp: parseFloat(values[11]) || 0,
          daynight: values[12]?.trim() || ''
        };
      }).filter(f => !isNaN(f.latitude) && !isNaN(f.longitude));
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: fireData,
        timestamp: Date.now()
      }));
      
      console.log(`📁 ${fireData.length} focos do arquivo`);
      return fireData;
      
    } catch (fileError) {
      console.error("❌ Todos os métodos falharam:", fileError);
      
      // 4. Último fallback: cache antigo
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        console.log("⚡ Usando cache antigo");
        return JSON.parse(cached).data;
      }
      
      return [];
    }
  }
}

export async function refreshFires(): Promise<FireData[]> {
  return await getFires(true);
}

export function getLastUpdateTime(): Date | null {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { timestamp } = JSON.parse(cached);
    return new Date(timestamp);
  }
  return null;
}