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
      const temps = registrosDia.map((x: any) => x.main.temp);
      const tempMax = Math.max(...temps);
      const tempMin = Math.min(...temps);

      const umidadeMedia =
        registrosDia.reduce((s: number, x: any) => s + x.main.humidity, 0) / registrosDia.length;

      const ventoMedio =
        registrosDia.reduce((s: number, x: any) => s + x.wind.speed, 0) / registrosDia.length;

      const nublados =
        registrosDia.reduce((s: number, x: any) => s + x.clouds.all, 0) / registrosDia.length;

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
  // 🔵 INTERFACE
  // ==========================================================
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Calculadora de ETo</h1>
        <p style={styles.pageSubtitle}>Evapotranspiração de Referência</p>
      </div>

      <button
        onClick={handleLocation}
        disabled={loading}
        style={{
          ...styles.geoButton,
          ...(loading ? styles.geoButtonLoading : styles.geoButtonActive),
        }}
      >
        <span style={styles.geoButtonIcon}>📍</span>
        {loading ? "Obtendo localização..." : "Usar minha localização"}
      </button>

      {error && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>❌</span>
          {error}
        </div>
      )}

      {/* RESULTADO AUTOMÁTICO */}
      {data && !manualMode && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>📍 Coordenadas</h2>
          </div>
          <div style={styles.coordContainer}>
            <div style={styles.coordItem}>
              <span style={styles.coordLabel}>Latitude:</span>
              <span style={styles.coordValue}>{data.lat.toFixed(3)}°</span>
            </div>
            <div style={styles.coordItem}>
              <span style={styles.coordLabel}>Longitude:</span>
              <span style={styles.coordValue}>{data.lon.toFixed(3)}°</span>
            </div>
          </div>

          <div style={styles.divider} />

          <h3 style={styles.sectionTitle}>🌦️ Médias do período (06h–18h)</h3>
          
          <div style={styles.weatherGrid}>
            <div style={styles.weatherItem}>
              <span style={styles.weatherIcon}>🌡️</span>
              <div>
                <div style={styles.weatherLabel}>Máxima</div>
                <div style={styles.weatherValue}>{data.tempMax.toFixed(1)}°C</div>
              </div>
            </div>
            <div style={styles.weatherItem}>
              <span style={styles.weatherIcon}>🌡️</span>
              <div>
                <div style={styles.weatherLabel}>Mínima</div>
                <div style={styles.weatherValue}>{data.tempMin.toFixed(1)}°C</div>
              </div>
            </div>
            <div style={styles.weatherItem}>
              <span style={styles.weatherIcon}>💧</span>
              <div>
                <div style={styles.weatherLabel}>Umidade</div>
                <div style={styles.weatherValue}>{data.umidade}%</div>
              </div>
            </div>
            <div style={styles.weatherItem}>
              <span style={styles.weatherIcon}>💨</span>
              <div>
                <div style={styles.weatherLabel}>Vento</div>
                <div style={styles.weatherValue}>{data.vento} m/s</div>
              </div>
            </div>
            <div style={styles.weatherItem}>
              <span style={styles.weatherIcon}>☁️</span>
              <div>
                <div style={styles.weatherLabel}>Nuvens</div>
                <div style={styles.weatherValue}>{data.nuvens}%</div>
              </div>
            </div>
          </div>

          <div style={styles.resultCard}>
            <div style={styles.resultLabel}>ETo estimada para hoje</div>
            <div style={styles.resultValue}>
              <span style={styles.resultNumber}>{data.eto}</span>
              <span style={styles.resultUnit}>mm/dia</span>
            </div>
            <div style={styles.resultDesc}>
              💧 Recomendação: {data.eto} L/m²
            </div>
          </div>
        </div>
      )}

      <div style={styles.separator}>
        <span style={styles.separatorLine} />
        <span style={styles.separatorText}>ou</span>
        <span style={styles.separatorLine} />
      </div>

      {/* MANUAL */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>📝 Inserir Dados Manualmente</h2>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <span style={styles.labelIcon}>🌡️</span>
            Temperatura Média (°C)
          </label>
          <input
            type="number"
            value={temperatura}
            onChange={(e) => setTemperatura(e.target.value)}
            style={styles.input}
            placeholder="Ex: 25.5"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <span style={styles.labelIcon}>💧</span>
            Umidade Relativa (%)
          </label>
          <input
            type="number"
            value={umidade}
            onChange={(e) => setUmidade(e.target.value)}
            style={styles.input}
            placeholder="Ex: 70"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <span style={styles.labelIcon}>💨</span>
            Velocidade do Vento (m/s)
          </label>
          <input
            type="number"
            value={vento}
            onChange={(e) => setVento(e.target.value)}
            style={styles.input}
            placeholder="Ex: 2.5"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <span style={styles.labelIcon}>☀️</span>
            Radiação Solar (MJ/m²/dia)
          </label>
          <input
            type="number"
            value={radiacao}
            onChange={(e) => setRadiacao(e.target.value)}
            style={styles.input}
            placeholder="Ex: 20"
          />
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={calcularEToManual} style={styles.buttonPrimary}>
            <span style={styles.buttonIcon}>🧮</span>
            Calcular
          </button>
          <button onClick={limparCampos} style={styles.buttonSecondary}>
            <span style={styles.buttonIcon}>🗑️</span>
            Limpar
          </button>
        </div>

        {resultadoManual !== null && (
          <div style={styles.manualResult}>
            <div style={styles.resultCard}>
              <div style={styles.resultLabel}>Resultado do cálculo manual</div>
              <div style={styles.resultValue}>
                <span style={styles.resultNumber}>{resultadoManual}</span>
                <span style={styles.resultUnit}>mm/dia</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INFO */}
      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>🌱 O que é ETo?</h3>
        <p style={styles.infoText}>
          ETo é a evapotranspiração de referência — quanto uma grama padrão consome de água em 1 dia.
        </p>
        
        <h4 style={styles.infoSubtitle}>Como usar:</h4>
        <ul style={styles.infoList}>
          <li style={styles.infoListItem}>
            <span style={styles.infoBullet}>•</span>
            Use o valor para calcular a irrigação diária
          </li>
          <li style={styles.infoListItem}>
            <span style={styles.infoBullet}>•</span>
            Aplique ETc = ETo × Kc (coeficiente da cultura)
          </li>
        </ul>
      </div>

      <div style={styles.navigation}>
        <Link to="/dashboard" style={styles.navLink}>
          <button style={styles.navButtonSecondary}>
            <span style={styles.navIcon}>↩️</span>
            Voltar
          </button>
        </Link>
        <Link to="/etcc" style={styles.navLink}>
          <button style={styles.navButtonPrimary}>
            <span style={styles.navIcon}>➡️</span>
            Calcular ETc
          </button>
        </Link>
      </div>
    </div>
  );
};

// 🎨 ESTILOS MODERNOS E RESPONSIVOS
const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "24px 16px",
    background: "linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)",
    minHeight: "100vh",
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    alignItems: "center" as "center",
  },
  header: {
    textAlign: "center" as "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "clamp(28px, 6vw, 36px)",
    fontWeight: "700" as "700",
    background: "linear-gradient(135deg, #166534 0%, #22c55e 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  pageSubtitle: {
    fontSize: "16px",
    color: "#4b5563",
    fontWeight: "400" as "400",
  },
  geoButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "white",
    border: "none",
    borderRadius: "50px",
    padding: "14px 28px",
    fontSize: "16px",
    width: "100%",
    maxWidth: "320px",
    marginBottom: "24px",
    fontWeight: "600" as "600",
    cursor: "pointer" as "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  geoButtonActive: {
    backgroundColor: "#22c55e",
    ":hover": {
      backgroundColor: "#16a34a",
      transform: "translateY(-2px)",
      boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.3)",
    },
  },
  geoButtonLoading: {
    backgroundColor: "#94a3b8",
    cursor: "not-allowed",
  },
  geoButtonIcon: {
    fontSize: "18px",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
    marginBottom: "16px",
    padding: "12px 20px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    color: "#dc2626",
    maxWidth: "400px",
    width: "100%",
    fontSize: "14px",
  },
  errorIcon: {
    fontSize: "16px",
  },
  card: {
    background: "white",
    width: "100%",
    maxWidth: "520px",
    borderRadius: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "24px",
    marginBottom: "24px",
    transition: "transform 0.2s ease",
    ":hover": {
      transform: "translateY(-4px)",
    },
  },
  cardHeader: {
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600" as "600",
    color: "#166534",
    margin: 0,
  },
  coordContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "16px",
  },
  coordItem: {
    flex: 1,
    backgroundColor: "#f8faf8",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center" as "center",
  },
  coordLabel: {
    display: "block",
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  coordValue: {
    fontSize: "16px",
    fontWeight: "600" as "600",
    color: "#166534",
  },
  divider: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #22c55e, transparent)",
    margin: "20px 0",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600" as "600",
    color: "#374151",
    marginBottom: "16px",
  },
  weatherGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  },
  weatherItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f8faf8",
    padding: "12px",
    borderRadius: "12px",
  },
  weatherIcon: {
    fontSize: "20px",
  },
  weatherLabel: {
    fontSize: "12px",
    color: "#6b7280",
  },
  weatherValue: {
    fontSize: "16px",
    fontWeight: "600" as "600",
    color: "#166534",
  },
  resultCard: {
    backgroundColor: "#f0fdf4",
    border: "2px solid #22c55e",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center" as "center",
  },
  resultLabel: {
    fontSize: "14px",
    color: "#166534",
    marginBottom: "8px",
    textTransform: "uppercase" as "uppercase",
    letterSpacing: "0.05em",
  },
  resultValue: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: "4px",
    marginBottom: "8px",
  },
  resultNumber: {
    fontSize: "36px",
    fontWeight: "700" as "700",
    color: "#166534",
    lineHeight: 1,
  },
  resultUnit: {
    fontSize: "16px",
    color: "#4b5563",
    fontWeight: "500" as "500",
  },
  resultDesc: {
    fontSize: "14px",
    color: "#15803d",
    fontWeight: "500" as "500",
  },
  separator: {
    width: "100%",
    maxWidth: "520px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    margin: "16px 0",
  },
  separatorLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, #22c55e, transparent)",
  },
  separatorText: {
    color: "#4b5563",
    fontWeight: "500" as "500",
    fontSize: "14px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
    fontWeight: "500" as "500",
    color: "#374151",
    fontSize: "14px",
  },
  labelIcon: {
    fontSize: "16px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "15px",
    transition: "all 0.2s ease",
    boxSizing: "border-box" as "border-box",
    outline: "none",
    ":focus": {
      borderColor: "#22c55e",
      boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.2)",
    },
  },
  buttonGroup: {
    display: "flex" as "flex",
    gap: "12px",
    marginTop: "24px",
  },
  buttonPrimary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "14px 20px",
    fontSize: "15px",
    fontWeight: "600" as "600",
    cursor: "pointer" as "pointer",
    flex: 1,
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#16a34a",
      transform: "translateY(-2px)",
      boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.3)",
    },
  },
  buttonSecondary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "14px 20px",
    fontSize: "15px",
    fontWeight: "600" as "600",
    cursor: "pointer" as "pointer",
    flex: 1,
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#4b5563",
      transform: "translateY(-2px)",
    },
  },
  buttonIcon: {
    fontSize: "16px",
  },
  manualResult: {
    marginTop: "20px",
  },
  infoCard: {
    background: "white",
    width: "100%",
    maxWidth: "520px",
    borderRadius: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "24px",
    marginBottom: "24px",
  },
  infoTitle: {
    fontSize: "18px",
    fontWeight: "600" as "600",
    color: "#166534",
    marginBottom: "12px",
  },
  infoText: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#4b5563",
    marginBottom: "16px",
  },
  infoSubtitle: {
    fontSize: "16px",
    fontWeight: "600" as "600",
    color: "#374151",
    marginBottom: "12px",
  },
  infoList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  infoListItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: "1.5",
  },
  infoBullet: {
    color: "#22c55e",
    fontSize: "18px",
    lineHeight: 1,
  },
  navigation: {
    display: "flex" as "flex",
    gap: "12px",
    width: "100%",
    maxWidth: "520px",
  },
  navLink: {
    flex: 1,
    textDecoration: "none",
  },
  navButtonPrimary: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "14px 20px",
    fontSize: "15px",
    fontWeight: "600" as "600",
    cursor: "pointer" as "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#16a34a",
      transform: "translateY(-2px)",
    },
  },
  navButtonSecondary: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    backgroundColor: "white",
    color: "#4b5563",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    padding: "14px 20px",
    fontSize: "15px",
    fontWeight: "600" as "600",
    cursor: "pointer" as "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#f8faf8",
      borderColor: "#22c55e",
      transform: "translateY(-2px)",
    },
  },
  navIcon: {
    fontSize: "16px",
  },
};

export default ETo;