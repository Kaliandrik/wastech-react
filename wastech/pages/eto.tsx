// wastech/pages/eto.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_KEY = "80131bb7e89396928dfc0e1f97f65471";

const ETo: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [temperatura, setTemperatura] = useState("");
  const [umidade, setUmidade] = useState("");
  const [vento, setVento] = useState("");
  const [radiacao, setRadiacao] = useState("");
  const [resultadoManual, setResultadoManual] = useState<number | null>(null);

  // ==========================================================
  // 🔵 OBTER LOCALIZAÇÃO
  // ==========================================================
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

  // ==========================================================
  // 🔵 BUSCAR DADOS DO CLIMA (FILTRANDO 06h–18h)
  // ==========================================================
  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      if (!response.ok) throw new Error("Erro ao acessar a API");

      const json = await response.json();

      // ---- DATA DO DISPOSITIVO ----
      const hoje = new Date();
      const diaAtual = hoje.getDate();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();

      // ----------------------------------------------------------
      // 🔥 FILTRAR SOMENTE HORÁRIOS ENTRE 06:00 e 18:00
      // ----------------------------------------------------------
      const registrosDia = json.list.filter((item: any) => {
        const data = new Date(item.dt * 1000);
        const hora = data.getHours();

        return (
          data.getDate() === diaAtual &&
          data.getMonth() === mesAtual &&
          data.getFullYear() === anoAtual &&
          hora >= 6 &&
          hora <= 18
        );
      });

      if (registrosDia.length === 0) {
        alert("A API não enviou dados suficientes para o período 06h–18h.");
        return;
      }

      // ----------------------------------------------------------
      // 🔢 MÉDIAS DO PERÍODO
      // ----------------------------------------------------------
      const temps = registrosDia.map((x) => x.main.temp);
      const tempMax = Math.max(...temps);
      const tempMin = Math.min(...temps);

      const umidadeMedia =
        registrosDia.reduce((s, x) => s + x.main.humidity, 0) / registrosDia.length;

      const ventoMedio =
        registrosDia.reduce((s, x) => s + x.wind.speed, 0) / registrosDia.length;

      const nublados =
        registrosDia.reduce((s, x) => s + x.clouds.all, 0) / registrosDia.length;

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
      alert("Erro ao obter clima: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // 🔵 CÁLCULO DE ETo (FAO56 SIMPLIFICADO)
  // ==========================================================
  const calcularETo = (d: any) => {
    const Tmean = (d.tempMax + d.tempMin) / 2;
    const RH = d.umidade;
    const u2 = d.vento;
    const nublado = d.nuvens;

    // radiação corrigida
    const Rs = (1 - nublado / 100) * 25;

    const delta =
      (4098 * (0.6108 * Math.exp((17.27 * Tmean) / (Tmean + 237.3)))) /
      Math.pow(Tmean + 237.3, 2);

    const gamma = 0.665e-3 * 101.3;
    const es = 0.6108 * Math.exp((17.27 * Tmean) / (Tmean + 237.3));
    const ea = es * (RH / 100);

    const ETo =
      (0.408 * delta * Rs +
        gamma * (900 / (Tmean + 273)) * u2 * (es - ea)) /
      (delta + gamma * (1 + 0.34 * u2));

    // limitar valores malucos
    return Math.max(0, Math.min(Number(ETo), 15)).toFixed(2);
  };

  // ==========================================================
  // 🔵 CÁLCULO MANUAL
  // ==========================================================
  const calcularEToManual = () => {
    if (!temperatura || !umidade || !vento || !radiacao) {
      alert("Preencha todos os campos!");
      return;
    }

    const temp = parseFloat(temperatura);
    const umid = parseFloat(umidade);
    const velVento = parseFloat(vento);
    const rad = parseFloat(radiacao);

    if (isNaN(temp) || isNaN(umid) || isNaN(velVento) || isNaN(rad)) {
      alert("Insira valores válidos!");
      return;
    }

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

  // ==========================================================
  // 🔵 INTERFACE (SEM MUDANÇAS)
  // ==========================================================
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Calculadora de ETo</h1>
      <p style={styles.pageSubtitle}>Evapotranspiração de Referência</p>

      <button
        onClick={handleLocation}
        disabled={loading}
        style={{
          ...styles.geoButton,
          backgroundColor: loading ? "#94a3b8" : "#22c55e",
        }}
      >
        {loading ? "📍 Obtendo dados..." : "📍 Usar minha localização automática"}
      </button>

      {error && <div style={styles.errorBox}>❌ {error}</div>}

      {/* RESULTADO AUTOMÁTICO */}
      {data && !manualMode && (
        <div style={styles.card}>
          <h2 style={{ textAlign: "center" }}>📍 Coordenadas</h2>
          <p><strong>Latitude:</strong> {data.lat.toFixed(3)}</p>
          <p><strong>Longitude:</strong> {data.lon.toFixed(3)}</p>

          <h3 style={{ textAlign: "center", marginTop: "10px" }}>🌦️ Médias (06h–18h)</h3>

          <p>🌡️ <strong>Máxima:</strong> {data.tempMax.toFixed(1)} °C</p>
          <p>🌡️ <strong>Mínima:</strong> {data.tempMin.toFixed(1)} °C</p>
          <p>💧 <strong>Umidade média:</strong> {data.umidade}%</p>
          <p>💨 <strong>Vento médio:</strong> {data.vento} m/s</p>
          <p>☁️ <strong>Nuvens médias:</strong> {data.nuvens}%</p>

          <h2 style={{ textAlign: "center", marginTop: "20px", fontSize: "22px" }}>
            📊 ETo estimada de hoje:{" "}
            <span style={{ color: "#16a34a" }}>{data.eto} mm/dia</span>
          </h2>

          <p style={{ fontSize: "1.1rem", color: "#2e7d32", textAlign: "center" }}>
            💧 Recomendação: {data.eto} L/m²
          </p>
        </div>
      )}

      {/* ... resto da interface permanece igual ... */}

      <div style={styles.separator}>
        <span style={styles.separatorText}>OU</span>
      </div>

      {/* MANUAL */}
      <div style={styles.card}>
        <h3 style={{ textAlign: "center" }}>📝 Inserir Dados Manualmente</h3>

        <div style={styles.inputGroup}>
          <label style={styles.label}>🌡️ Temperatura Média (°C):</label>
          <input
            type="number"
            value={temperatura}
            onChange={(e) => setTemperatura(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>💧 Umidade Relativa (%):</label>
          <input
            type="number"
            value={umidade}
            onChange={(e) => setUmidade(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>💨 Vento (m/s):</label>
          <input
            type="number"
            value={vento}
            onChange={(e) => setVento(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>☀️ Radiação Solar (MJ/m²/dia):</label>
          <input
            type="number"
            value={radiacao}
            onChange={(e) => setRadiacao(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={calcularEToManual} style={styles.button}>🧮 Calcular</button>
          <button onClick={limparCampos} style={styles.buttonSecondary}>🗑️ Limpar</button>
        </div>

        {resultadoManual !== null && (
          <div style={styles.resultado}>
            <h3 style={{ color: "#16a34a", textAlign: "center" }}>📊 Resultado</h3>
            <h4 style={{ color: "#15803d", fontSize: "24px", textAlign: "center" }}>
              💧 ETo = {resultadoManual} mm/dia
            </h4>
          </div>
        )}
      </div>

      {/* INFO */}
      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>🌱 O que é ETo?</h3>
        <p style={styles.paragraph}>
          ETo é a evapotranspiração de referência — quanto uma grama padrão consome de água em 1 dia.
        </p>

        <h4 style={styles.infoSubtitle}>Como usar:</h4>
        <ul style={styles.list}>
          <li style={styles.listItem}>Use o valor para calcular a irrigação diária.</li>
          <li style={styles.listItem}>Aplique ETc = ETo × Kc.</li>
        </ul>
      </div>

      <div style={styles.linkContainer}>
        <Link to="/dashboard">
          <button style={styles.buttonSecondary}>↩️ Voltar</button>
        </Link>
        <Link to="/etcc">
          <button style={styles.button}>➡️ Calcular ETc</button>
        </Link>
      </div>
    </div>
  );
};

// 🔵 ESTILOS (inalterados)
const styles = {
  container: { fontFamily: "Arial", padding: 20, background: "#f1f8f1", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#1a3c1a" },
  pageSubtitle: { fontSize: 18, textAlign: "center", marginBottom: 30, color: "#4b5563" },
  geoButton: { color: "white", border: "none", borderRadius: 10, padding: "14px 24px", fontSize: 18, width: "100%", maxWidth: 300, marginBottom: 20, fontWeight: "bold" },
  errorBox: { marginTop: 10, padding: 15, backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, color: "#dc2626", maxWidth: 400, textAlign: "center" },
  card: { background: "white", width: "100%", maxWidth: 500, borderRadius: 15, boxShadow: "0 2px 10px rgba(0,0,0,0.15)", padding: 25, marginBottom: 20 },
  separator: { width: "100%", maxWidth: 500, textAlign: "center", margin: "20px 0", position: "relative" },
  separatorText: { background: "#f1f8f1", padding: "0 15px", color: "#6b7280", fontWeight: "bold" },
  inputGroup: { marginBottom: 20 },
  label: { display: "block", marginBottom: 8, fontWeight: "bold", color: "#374151", fontSize: 16 },
  input: { width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 8, fontSize: 16, boxSizing: "border-box" },
  buttonGroup: { display: "flex", gap: 10, marginTop: 20 },
  button: { backgroundColor: "#22c55e", color: "white", border: "none", borderRadius: 8, padding: "12px 20px", fontSize: 16, cursor: "pointer", flex: 1, fontWeight: "bold" },
  buttonSecondary: { backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: 8, padding: "12px 20px", fontSize: 16, cursor: "pointer", flex: 1 },
  resultado: { marginTop: 20, padding: 20, backgroundColor: "#f0fdf4", border: "2px solid #16a34a", borderRadius: 10 },
  infoBox: { background: "white", width: "100%", maxWidth: 500, borderRadius: 15, boxShadow: "0 2px 10px rgba(0,0,0,0.15)", padding: 20, marginBottom: 20 },
  infoTitle: { color: "#16a34a", marginBottom: 15, fontSize: 20 },
  infoSubtitle: { color: "#15803d", marginTop: 15, marginBottom: 10, fontSize: 16 },
  list: { marginLeft: 20, marginBottom: 15 },
  listItem: { marginBottom: 8, lineHeight: 1.4 },
  paragraph: { marginBottom: 10, lineHeight: 1.5, fontSize: 15 },
  linkContainer: { display: "flex", gap: 10, width: "100%", maxWidth: 500 },
};

export default ETo;
