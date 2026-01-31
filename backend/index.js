// NOVA VERSÃO SIMPLIFICADA - SEM NASA API

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configurações
const PORT = process.env.PORT || 3000;
const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hora de cache
const DATA_DIR = path.join(__dirname, 'data');
const CACHE_FILE = path.join(DATA_DIR, 'fires_cache.json');

// Middleware
app.use(cors());
app.use(express.json());

// Criar diretório de dados se não existir
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ==================== FUNÇÕES AUXILIARES ====================

/**
 * Carrega dados do arquivo MODIS local
 */
function loadLocalData() {
  try {
    // Tenta arquivo na pasta public
    const filePath = path.join(__dirname, '../public/MODIS_C6_1_South_America_MCD14DL_NRT_2026021.txt');
    
    if (!fs.existsSync(filePath)) {
      console.log('⚠️  Arquivo local não encontrado:', filePath);
      return [];
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) return [];
    
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
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
        bright_t31: parseFloat(values[10]) || 0,
        frp: parseFloat(values[11]) || 0,
        daynight: values[12]?.trim() || '',
        source: 'modis_local',
        timestamp: new Date().toISOString()
      };
    }).filter(f => !isNaN(f.latitude) && !isNaN(f.longitude));
    
    console.log(`📁 Local: ${data.length} focos carregados`);
    return data;
    
  } catch (error) {
    console.error('❌ Erro ao carregar dados locais:', error);
    return [];
  }
}

/**
 * Gerencia cache de dados
 */
class FireDataCache {
  constructor() {
    this.cacheFile = CACHE_FILE;
    this.loadCache();
    
    // Atualização automática a cada 1 hora
    setInterval(() => this.updateCache(), CACHE_DURATION);
    
    // Primeira atualização após 5 segundos
    setTimeout(() => this.updateCache(), 5000);
  }
  
  loadCache() {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const cacheData = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
        const cacheAge = Date.now() - cacheData.timestamp;
        
        if (cacheAge < CACHE_DURATION) {
          console.log(`📂 Cache carregado (${Math.round(cacheAge / 1000 / 60)} minutos atrás)`);
          this.data = cacheData.data;
          this.timestamp = cacheData.timestamp;
          return;
        }
        console.log(`🔄 Cache expirado (${Math.round(cacheAge / 1000 / 60)} minutos)`);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar cache:', error);
    }
    
    // Cache inválido ou não existe
    this.data = [];
    this.timestamp = 0;
  }
  
  async updateCache(force = false) {
    try {
      console.log('🔄 Atualizando cache de dados...');
      
      // Sempre carrega do arquivo local
      const fireData = loadLocalData();
      
      // Salva no cache
      this.data = fireData;
      this.timestamp = Date.now();
      
      fs.writeFileSync(this.cacheFile, JSON.stringify({
        data: fireData,
        timestamp: this.timestamp,
        source: 'modis_local',
        count: fireData.length,
        lastUpdate: new Date().toLocaleString('pt-BR')
      }, null, 2));
      
      console.log(`💾 Cache atualizado: ${fireData.length} focos`);
      
    } catch (error) {
      console.error('❌ Erro ao atualizar cache:', error);
    }
  }
  
  getData() {
    return {
      data: this.data,
      timestamp: this.timestamp,
      source: 'modis_local',
      count: this.data.length,
      lastUpdate: this.timestamp ? new Date(this.timestamp).toLocaleString('pt-BR') : 'Nunca'
    };
  }
}

// Inicializar cache
const fireCache = new FireDataCache();

// ==================== ROTAS ====================

// Rota de teste
app.get('/api', (req, res) => {
  const cacheInfo = fireCache.getData();
  
  res.json({ 
    message: '🔥 Wastech Fire Monitor API',
    version: '2.0.0',
    status: 'online',
    endpoints: [
      '/api/fires',
      '/api/fires/update',
      '/api/status'
    ],
    cache: {
      count: cacheInfo.count,
      lastUpdate: cacheInfo.lastUpdate,
      source: cacheInfo.source
    }
  });
});

// Rota principal - dados de incêndio
app.get('/api/fires', async (req, res) => {
  try {
    const cacheInfo = fireCache.getData();
    
    res.json({
      data: cacheInfo.data,
      metadata: {
        count: cacheInfo.count,
        lastUpdate: cacheInfo.lastUpdate,
        source: cacheInfo.source,
        note: 'Dados do arquivo MODIS local'
      }
    });
    
  } catch (error) {
    console.error('❌ Erro na rota /api/fires:', error);
    res.status(500).json({ 
      error: 'Erro ao processar dados',
      message: error.message,
      data: [] // Garante que o frontend não quebre
    });
  }
});

// Rota para forçar atualização dos dados
app.get('/api/fires/update', async (req, res) => {
  try {
    await fireCache.updateCache(true);
    const cacheInfo = fireCache.getData();
    
    res.json({
      success: true,
      message: 'Dados atualizados com sucesso',
      metadata: {
        count: cacheInfo.count,
        lastUpdate: cacheInfo.lastUpdate,
        source: cacheInfo.source
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de status do sistema
app.get('/api/status', (req, res) => {
  const cacheInfo = fireCache.getData();
  const uptime = process.uptime();
  
  res.json({
    status: 'online',
    uptime: {
      seconds: uptime,
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
    },
    cache: {
      count: cacheInfo.count,
      lastUpdate: cacheInfo.lastUpdate,
      source: cacheInfo.source,
      ageMinutes: cacheInfo.timestamp ? Math.floor((Date.now() - cacheInfo.timestamp) / 60000) : 'N/A'
    },
    config: {
      cacheDurationHours: CACHE_DURATION / 1000 / 60 / 60,
      dataSource: 'MODIS Local File'
    }
  });
});

// Rota de saúde
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Contate o administrador'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🔥  Wastech Fire Monitor API`);
  console.log(`🌐  URL: http://localhost:${PORT}`);
  console.log(`📡  API: http://localhost:${PORT}/api`);
  console.log(`📁  Fonte: Arquivo MODIS local`);
  console.log(`🔄  Atualização automática: ${CACHE_DURATION / 1000 / 60} minutos`);
  console.log(`========================================\n`);
});