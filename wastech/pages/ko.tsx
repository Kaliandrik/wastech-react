// wastech/pages/ko.tsx - VERSÃO SIMPLIFICADA E FUNCIONAL
import React from "react";
import { Link } from "react-router-dom";
import { Cultura, culturas } from "./cultura";

const Ko: React.FC = () => {
  // Função para calcular média do Kc
  const calcularMediaKc = (cultura: any) => {
    const fases = cultura.fases.split("-").map(Number);
    const valores = [
      cultura.kcValores.fase1,
      cultura.kcValores.fase2,
      cultura.kcValores.fase3,
      cultura.kcValores.fase4
    ];
    
    let somaPonderada = 0;
    let totalDias = 0;
    
    fases.forEach((dias: number, index: number) => {
      somaPonderada += dias * valores[index];
      totalDias += dias;
    });
    
    return totalDias > 0 ? parseFloat((somaPonderada / totalDias).toFixed(2)) : 0;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tabela de Coeficientes de Cultura (Kc)</h1>
      <p style={styles.pageSubtitle}>Valores de Kc para diferentes culturas e fases de crescimento</p>
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Cultura</th>
              <th style={styles.th}>Duração Total (dias)</th>
              <th style={styles.th}>Fases (% ciclo)</th>
              <th style={styles.th}>Kc Inicial</th>
              <th style={styles.th}>Kc Desenv.</th>
              <th style={styles.th}>Kc Meio</th>
              <th style={styles.th}>Kc Final</th>
              <th style={styles.th}>Kc Médio</th>
            </tr>
          </thead>
          <tbody>
            {culturas.map((cultura, index) => {
              const kcMedia = calcularMediaKc(cultura);
              return (
                <tr key={index} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={{...styles.td, fontWeight: "bold"}}>{cultura.nome}</td>
                  <td style={styles.td}>{cultura.duracao}</td>
                  <td style={styles.td}>{cultura.fases}</td>
                  <td style={styles.td}>{cultura.kcValores.fase1}</td>
                  <td style={styles.td}>{cultura.kcValores.fase2}</td>
                  <td style={styles.td}>{cultura.kcValores.fase3}</td>
                  <td style={styles.td}>{cultura.kcValores.fase4}</td>
                  <td style={{
                    ...styles.td, 
                    fontWeight: "bold", 
                    backgroundColor: kcMedia < 0.7 ? "#dcfce7" : 
                                    kcMedia < 1.0 ? "#bbf7d0" : 
                                    "#86efac",
                    color: "#166534"
                  }}>
                    {kcMedia}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>📊 Como interpretar o Kc Médio?</h3>
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: "#dcfce7"}}></div>
            <span>Baixo consumo (&lt; 0.7)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: "#bbf7d0"}}></div>
            <span>Consumo moderado (0.7 - 1.0)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: "#86efac"}}></div>
            <span>Alto consumo (&gt; 1.0)</span>
          </div>
        </div>

        <div style={styles.summary}>
          <div style={styles.summaryCard}>
            <h4 style={styles.summaryTitle}>🌱 Menor Kc Médio</h4>
            <p style={styles.summaryValue}>
              {(() => {
                const minCultura = culturas.reduce((min, curr) => 
                  calcularMediaKc(curr) < calcularMediaKc(min) ? curr : min
                );
                return `${minCultura.nome}: ${calcularMediaKc(minCultura)}`;
              })()}
            </p>
            <p style={styles.summaryText}>Menor necessidade hídrica</p>
          </div>
          
          <div style={styles.summaryCard}>
            <h4 style={styles.summaryTitle}>💧 Maior Kc Médio</h4>
            <p style={styles.summaryValue}>
              {(() => {
                const maxCultura = culturas.reduce((max, curr) => 
                  calcularMediaKc(curr) > calcularMediaKc(max) ? curr : max
                );
                return `${maxCultura.nome}: ${calcularMediaKc(maxCultura)}`;
              })()}
            </p>
            <p style={styles.summaryText}>Maior necessidade hídrica</p>
          </div>
          
          <div style={styles.summaryCard}>
            <h4 style={styles.summaryTitle}>📈 Média Geral</h4>
            <p style={styles.summaryValue}>
              {(() => {
                const soma = culturas.reduce((acc, curr) => 
                  acc + calcularMediaKc(curr), 0
                );
                return (soma / culturas.length).toFixed(2);
              })()}
            </p>
            <p style={styles.summaryText}>Média de todas as culturas</p>
          </div>
        </div>
      </div>

      {/* Resto do código permanece igual... */}
      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>🌱 O que é o Kc (Coeficiente de Cultura)?</h3>
        <p style={styles.paragraph}>
          <strong>Kc</strong> é um número que indica <strong>quanta água uma planta precisa</strong> 
          em comparação com a grama (padrão de referência ETo).
        </p>
        
        <h4 style={styles.infoSubtitle}>🔢 Como funciona:</h4>
        <ul style={styles.list}>
          <li style={styles.listItem}><strong>Kc = 1.0</strong> → Planta precisa da MESMA água que a grama</li>
          <li style={styles.listItem}><strong>Kc &lt; 1.0</strong> → Planta precisa de MENOS água</li>
          <li style={styles.listItem}><strong>Kc &gt; 1.0</strong> → Planta precisa de MAIS água</li>
        </ul>
      </div>

      <div style={styles.linkContainer}>
        <Link to="/etcc">
          <button style={styles.button}>
            🧮 Calcular ETc
          </button>
        </Link>
        <Link to="/dashboard">
          <button style={styles.buttonSecondary}>
            🏠 Voltar para Dashboard
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
    minHeight: "100vh"
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center" as "center",
    marginBottom: "10px",
    color: "#1a3c1a"
  },
  pageSubtitle: {
    fontSize: "16px",
    textAlign: "center" as "center",
    marginBottom: "30px",
    color: "#4b5563"
  },
  tableContainer: {
    overflowX: "auto" as "auto",
    marginBottom: "30px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    padding: "10px"
  },
  table: {
    borderCollapse: "collapse" as "collapse",
    width: "100%",
    textAlign: "center" as "center",
    fontSize: "14px"
  },
  tableHeader: {
    backgroundColor: "#22c55e"
  },
  th: {
    padding: "12px 8px",
    border: "1px solid #ddd",
    fontWeight: "bold",
    color: "white",
    fontSize: "13px",
    whiteSpace: "nowrap" as "nowrap"
  },
  td: {
    padding: "10px 6px",
    border: "1px solid #ddd",
    fontSize: "13px"
  },
  trEven: {
    backgroundColor: "#f8f9fa"
  },
  trOdd: {
    backgroundColor: "white"
  },
  infoBox: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
  },
  infoTitle: {
    color: "#16a34a",
    marginBottom: "15px",
    fontSize: "18px"
  },
  legend: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap" as "wrap"
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px"
  },
  legendColor: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    border: "1px solid #ddd"
  },
  summary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "20px"
  },
  summaryCard: {
    backgroundColor: "#f0fdf4",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center" as "center",
    border: "1px solid #bbf7d0"
  },
  summaryTitle: {
    color: "#15803d",
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "bold"
  },
  summaryValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#16a34a",
    margin: "10px 0"
  },
  summaryText: {
    fontSize: "12px",
    color: "#4b5563",
    margin: 0
  },
  paragraph: {
    marginBottom: "10px",
    lineHeight: "1.5",
    fontSize: "15px"
  },
  infoSubtitle: {
    color: "#15803d",
    marginTop: "20px",
    marginBottom: "10px",
    fontSize: "16px"
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
    justifyContent: "center",
    marginTop: "30px",
    flexWrap: "wrap" as "wrap"
  },
  button: {
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    minWidth: "150px"
  },
  buttonSecondary: {
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
    minWidth: "150px"
  }
};

export default Ko;