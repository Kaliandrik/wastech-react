// wastech/pages/Eto/index.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_KEY = "80131bb7e89396928dfc0e1f97f65471";

const ETo: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada neste dispositivo.");
      return;
    }

    setLoading(true);
    setError(null);
    setManualMode(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchWeather(latitude, longitude);
      },
      (error) => {
        setError("Erro ao obter localização: " + error.message);
        setLoading(false);
      }
    );
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      if (!response.ok) {
        throw new Error("Erro ao acessar a API do clima");
      }

      const json = await response.json();
      const hoje = new Date().getDate();
      const registrosHoje = json.list.filter(
        (item: any) => new Date(item.dt * 1000).getDate() === hoje
      );

      if (registrosHoje.length === 0) {
        setError("A API não enviou dados para hoje.");
        return;
      }

      // Cálculos
      const temps = registrosHoje.map((x: any) => x.main.temp);
      const tempMax = Math.max(...temps);
      const tempMin = Math.min(...temps);

      const umidadeMedia = registrosHoje.reduce((s: number, x: any) => s + x.main.humidity, 0) / registrosHoje.length;
      const ventoMedio = registrosHoje.reduce((s: number, x: any) => s + x.wind.speed, 0) / registrosHoje.length;
      const nublados = registrosHoje.reduce((s: number, x: any) => s + x.clouds.all, 0) / registrosHoje.length;

      const climaMedio = {
        tempMax,
        tempMin,
        umidade: Math.round(umidadeMedia),
        vento: Number(ventoMedio.toFixed(1)),
        nuvens: Math.round(nublados),
      };

      const eto = calcularETo(climaMedio);

      setData({
        lat,
        lon,
        ...climaMedio,
        eto,
      });
    } catch (err) {
      setError("Erro ao obter dados climáticos: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const calcularETo = (d: any) => {
    const Tmean = (d.tempMax + d.tempMin) / 2;
    const RH = d.umidade;
    const u2 = d.vento;
    const nublado = d.nuvens;

    const Rs = (1 - nublado / 100) * 25;
    const delta = (4098 * (0.6108 * Math.exp((17.27 * Tmean) / (Tmean + 237.3)))) / Math.pow(Tmean + 237.3, 2);
    const gamma = 0.665e-3 * 101.3;
    const es = 0.6108 * Math.exp((17.27 * Tmean) / (Tmean + 237.3));
    const ea = es * (RH / 100);

    const ETo = (0.408 * delta * Rs + gamma * (900 / (Tmean + 273)) * u2 * (es - ea)) / (delta + gamma * (1 + 0.34 * u2));

    return Math.max(0, Math.min(Number(ETo), 15)).toFixed(2);
  };

  // Modo manual
  const [temperatura, setTemperatura] = useState("");
  const [umidade, setUmidade] = useState("");
  const [vento, setVento] = useState("");
  const [radiacao, setRadiacao] = useState("");
  const [resultadoManual, setResultadoManual] = useState<number | null>(null);

  const calcularEToManual = () => {
    if (!temperatura || !umidade || !vento || !radiacao) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    const temp = parseFloat(temperatura);
    const umid = parseFloat(umidade);
    const velVento = parseFloat(vento);
    const rad = parseFloat(radiacao);

    if (isNaN(temp) || isNaN(umid) || isNaN(velVento) || isNaN(rad)) {
      alert("Por favor, insira valores válidos!");
      return;
    }

    // Fórmula simplificada de Hargreaves-Samani para ETo
    const eTo = 0.0023 * (temp + 17.8) * Math.sqrt(temp + 17.8) * rad;
    setResultadoManual(parseFloat(eTo.toFixed(2)));
    setManualMode(true);
  };

  const limparCampos = () => {
    setTemperatura("");
    setUmidade("");
    setVento("");
    setRadiacao("");
    setResultadoManual(null);
    setData(null);
    setManualMode(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Calculadora de ETo</h1>
      <p style={styles.pageSubtitle}>Evapotranspiração de Referência</p>
      
      {/* Botão de Geolocalização */}
      <button
        onClick={handleLocation}
        disabled={loading}
        style={{
          ...styles.geoButton,
          backgroundColor: loading ? "#94a3b8" : "#22c55e",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "📍 Obtendo dados..." : "📍 Usar minha localização automática"}
      </button>

      {error && (
        <div style={styles.errorBox}>
          ❌ {error}
        </div>
      )}

      {/* Resultado da Geolocalização */}
      {data && !manualMode && (
        <div style={styles.card}>
          <h2 style={{ textAlign: "center", marginBottom: "10px" }}>📍 Coordenadas</h2>
          <p><strong>Latitude:</strong> {data.lat.toFixed(3)}</p>
          <p><strong>Longitude:</strong> {data.lon.toFixed(3)}</p>

          <h3 style={{ textAlign: "center", marginTop: "15px" }}>🌦️ Médias do Dia</h3>

          <p>🌡️ <strong>Máxima:</strong> {data.tempMax.toFixed(1)} °C</p>
          <p>🌡️ <strong>Mínima:</strong> {data.tempMin.toFixed(1)} °C</p>
          <p>💧 <strong>Umidade média:</strong> {data.umidade}%</p>
          <p>💨 <strong>Vento médio:</strong> {data.vento} m/s</p>
          <p>☁️ <strong>Nuvens médias:</strong> {data.nuvens}%</p>

          <h2 style={{ textAlign: "center", marginTop: "20px", fontSize: "22px" }}>
            📊 ETo estimada de hoje:{" "}
            <span style={{ color: "#16a34a" }}>{data.eto} mm/dia</span>
          </h2>

          <p style={{ marginTop: "15px", textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "#0e7c27" }}>
            💧 Recomendação: aplicar {data.eto} litros por m².
          </p>
        </div>
      )}

      {/* Separador */}
      <div style={styles.separator}>
        <span style={styles.separatorText}>OU</span>
      </div>

      {/* Modo Manual */}
      <div style={styles.card}>
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>📝 Inserir Dados Manualmente</h3>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>🌡️ Temperatura Média (°C):</label>
          <input
            type="number"
            step="0.1"
            value={temperatura}
            onChange={(e) => setTemperatura(e.target.value)}
            placeholder="Ex: 25.5"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>💧 Umidade Relativa (%):</label>
          <input
            type="number"
            step="0.1"
            value={umidade}
            onChange={(e) => setUmidade(e.target.value)}
            placeholder="Ex: 65.0"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>💨 Velocidade do Vento (m/s):</label>
          <input
            type="number"
            step="0.1"
            value={vento}
            onChange={(e) => setVento(e.target.value)}
            placeholder="Ex: 2.0"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>☀️ Radiação Solar (MJ/m²/dia):</label>
          <input
            type="number"
            step="0.1"
            value={radiacao}
            onChange={(e) => setRadiacao(e.target.value)}
            placeholder="Ex: 15.8"
            style={styles.input}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={calcularEToManual} style={styles.button}>
            🧮 Calcular ETo Manual
          </button>
          
          <button onClick={limparCampos} style={styles.buttonSecondary}>
            🗑️ Limpar
          </button>
        </div>

        {resultadoManual !== null && (
          <div style={styles.resultado}>
            <h3 style={{color: "#16a34a", textAlign: "center"}}>📊 Resultado do Cálculo</h3>
            <div style={styles.resultadoContent}>
              <h4 style={{color: "#15803d", marginTop: "10px", fontSize: "24px"}}>
                💧 ETo = {resultadoManual} mm/dia
              </h4>
              <p style={{fontWeight: "bold", color: "#0e7490", textAlign: "center"}}>
                Esta é a quantidade de água que uma superfície de grama consome por dia
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Informações */}
      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>🌱 O que é ETo?</h3>
        <p style={styles.paragraph}>
          <strong>ETo (Evapotranspiração de Referência)</strong> é a quantidade de água que 
          uma superfície extensa de grama consome por dia, sob condições ideais.
        </p>
        
        <h4 style={styles.infoSubtitle}>📝 Como usar:</h4>
        <ul style={styles.list}>
          <li style={styles.listItem}>Use o ETo calculado para determinar quanto suas culturas precisam de água</li>
          <li style={styles.listItem}>Combine com o coeficiente Kc para calcular a ETc (Evapotranspiração da Cultura)</li>
          <li style={styles.listItem}>Fórmula: <strong>ETc = ETo × Kc</strong></li>
        </ul>
      </div>

      {/* Navegação */}
      <div style={styles.linkContainer}>
        <Link to="/dashboard">
          <button style={styles.buttonSecondary}>
            ↩️ Voltar para Dashboard
          </button>
        </Link>
        
        <Link to="/etcc">
          <button style={styles.button}>
            ➡️ Calcular ETc
          </button>
        </Link>
      </div>
    </div>
  );
};

// Estilos
const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        background: "#f1f8f1",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center"
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center" as "center",
        marginBottom: "10px",
        color: "#1a3c1a"
    },
    pageSubtitle: {
        fontSize: "18px",
        textAlign: "center" as "center",
        marginBottom: "30px",
        color: "#4b5563"
    },
    geoButton: {
        color: "white",
        border: "none",
        borderRadius: "10px",
        padding: "14px 24px",
        fontSize: "18px",
        width: "100%",
        maxWidth: "300px",
        marginBottom: "20px",
        fontWeight: "bold"
    },
    errorBox: {
        marginTop: "10px",
        padding: "15px",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "10px",
        color: "#dc2626",
        maxWidth: "400px",
        textAlign: "center" as "center"
    },
    card: {
        background: "white",
        width: "100%",
        maxWidth: "500px",
        borderRadius: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        padding: "25px",
        marginBottom: "20px"
    },
    separator: {
        width: "100%",
        maxWidth: "500px",
        textAlign: "center" as "center",
        margin: "20px 0",
        position: "relative" as "relative",
        "&::before": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "0",
            right: "0",
            height: "1px",
            background: "#d1d5db"
        }
    },
    separatorText: {
        background: "#f1f8f1",
        padding: "0 15px",
        color: "#6b7280",
        fontWeight: "bold"
    },
    inputGroup: {
        marginBottom: "20px"
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
        color: "#374151",
        fontSize: "16px"
    },
    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "16px",
        boxSizing: "border-box" as "border-box"
    },
    buttonGroup: {
        display: "flex",
        gap: "10px",
        marginTop: "20px"
    },
    button: {
        backgroundColor: "#22c55e",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "12px 20px",
        fontSize: "16px",
        cursor: "pointer",
        flex: 1,
        fontWeight: "bold"
    },
    buttonSecondary: {
        backgroundColor: "#6b7280",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "12px 20px",
        fontSize: "16px",
        cursor: "pointer",
        flex: 1
    },
    resultado: {
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#f0fdf4",
        border: "2px solid #16a34a",
        borderRadius: "10px"
    },
    resultadoContent: {
        textAlign: "center" as "center"
    },
    infoBox: {
        background: "white",
        width: "100%",
        maxWidth: "500px",
        borderRadius: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        padding: "20px",
        marginBottom: "20px"
    },
    infoTitle: {
        color: "#16a34a",
        marginBottom: "15px",
        fontSize: "20px"
    },
    infoSubtitle: {
        color: "#15803d",
        marginTop: "15px",
        marginBottom: "10px",
        fontSize: "16px"
    },
    paragraph: {
        marginBottom: "10px",
        lineHeight: "1.5",
        fontSize: "15px"
    },
    list: {
        marginLeft: "20px",
        marginBottom: "15px"
    },
    listItem: {
        marginBottom: "8px",
        lineHeight: "1.4"
    },
    linkContainer: {
        display: "flex",
        gap: "10px",
        width: "100%",
        maxWidth: "500px"
    }
};

export default ETo;