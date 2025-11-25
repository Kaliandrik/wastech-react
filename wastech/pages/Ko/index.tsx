// wastech/pages/Ko/index.tsx
import React from "react";
import { Link } from "react-router-dom";
import { culturas } from "../../data/culturas";

const Ko: React.FC = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Tabela de Coeficientes de Cultura (Kc)</h1>
            <p style={styles.pageSubtitle}>Valores de Kc para diferentes culturas e fases de crescimento</p>
            
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Cultura</th>
                            <th style={styles.th}>Duração Total do Ciclo (dias)</th>
                            <th style={styles.th}>Percentual das 4 Fases (1-2-3-4)</th>
                            <th style={styles.th}>Kc Fase 1</th>
                            <th style={styles.th}>Kc Fase 2</th>
                            <th style={styles.th}>Kc Fase 3</th>
                            <th style={styles.th}>Kc Fase 4</th>
                        </tr>
                    </thead>
                    <tbody>
                        {culturas.map((cultura, index) => (
                            <tr key={index} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                                <td style={{...styles.td, fontWeight: "bold"}}>{cultura.nome}</td>
                                <td style={styles.td}>{cultura.duracao}</td>
                                <td style={styles.td}>{cultura.fases}</td>
                                <td style={styles.td}>{cultura.kcValores.fase1}</td>
                                <td style={styles.td}>{cultura.kcValores.fase2}</td>
                                <td style={styles.td}>{cultura.kcValores.fase3}</td>
                                <td style={styles.td}>{cultura.kcValores.fase4}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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

                <h4 style={styles.infoSubtitle}>📈 Variação nas 4 fases:</h4>
                <div style={styles.phasesGrid}>
                    <div style={styles.phaseCard}>
                        <h5 style={styles.phaseTitle}>🌱 Fase 1 - Inicial</h5>
                        <p style={styles.phaseDescription}>
                            <strong>Kc: 0.3 - 0.5</strong><br/>
                            Planta pequena, sistema radicial superficial, pouca necessidade de água
                        </p>
                    </div>
                    <div style={styles.phaseCard}>
                        <h5 style={styles.phaseTitle}>📈 Fase 2 - Desenvolvimento</h5>
                        <p style={styles.phaseDescription}>
                            <strong>Kc: 0.5 → 1.0</strong><br/>
                            Crescimento acelerado, aumento da área foliar, necessidade crescente
                        </p>
                    </div>
                    <div style={styles.phaseCard}>
                        <h5 style={styles.phaseTitle}>🌿 Fase 3 - Meio</h5>
                        <p style={styles.phaseDescription}>
                            <strong>Kc: 1.0 - 1.3</strong><br/>
                            Planta adulta, máxima cobertura vegetal, necessidade máxima de água
                        </p>
                    </div>
                    <div style={styles.phaseCard}>
                        <h5 style={styles.phaseTitle}>🍂 Fase 4 - Final</h5>
                        <p style={styles.phaseDescription}>
                            <strong>Kc: 0.8 - 0.3</strong><br/>
                            Maturação e senescência, redução da atividade fisiológica
                        </p>
                    </div>
                </div>

                <div style={styles.formulaBox}>
                    <h4 style={styles.formulaTitle}>🧮 Fórmula Principal:</h4>
                    <div style={styles.formula}>
                        ETc = ETo × Kc
                    </div>
                    <p style={styles.formulaExplanation}>
                        <strong>ETc</strong> = Água REAL que sua cultura precisa<br/>
                        <strong>ETo</strong> = Água de referência (grama)<br/>
                        <strong>Kc</strong> = Coeficiente da cultura (tabela acima)
                    </p>
                </div>

                <div style={styles.exampleBox}>
                    <h4 style={styles.exampleTitle}>💡 Exemplo Prático:</h4>
                    <p style={styles.paragraph}>
                        Se o <strong>ETo = 4.5 mm/dia</strong> e você cultiva <strong>Tomate na Fase 3 (Kc = 1.2)</strong>:
                    </p>
                    <div style={styles.calculation}>
                        ETc = 4.5 × 1.2 = <strong>5.4 mm/dia</strong>
                    </div>
                    <p style={styles.paragraph}>
                        Significa que seu tomateiro precisa de <strong>5.4 litros de água por m² por dia</strong>!
                    </p>
                </div>
            </div>

            <div style={styles.linkContainer}>
                <Link to="/etcc">
                    <button style={styles.button}>
                        🧮 Calcular ETc
                    </button>
                </Link>

                <Link to="/eto">
                    <button style={styles.buttonSecondary}>
                        🌤️ Calcular ETo
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
        fontSize: "14px",
        whiteSpace: "nowrap" as "nowrap"
    },
    td: {
        padding: "10px 8px",
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
        padding: "25px",
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
    },
    infoTitle: {
        color: "#16a34a",
        marginBottom: "15px",
        fontSize: "20px"
    },
    infoSubtitle: {
        color: "#15803d",
        marginTop: "20px",
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
    phasesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "15px",
        margin: "20px 0"
    },
    phaseCard: {
        backgroundColor: "#f0fdf4",
        padding: "15px",
        borderRadius: "8px",
        border: "1px solid #bbf7d0"
    },
    phaseTitle: {
        color: "#15803d",
        marginBottom: "8px",
        fontSize: "14px",
        fontWeight: "bold"
    },
    phaseDescription: {
        fontSize: "13px",
        lineHeight: "1.4",
        margin: 0
    },
    formulaBox: {
        backgroundColor: "#1e293b",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        margin: "20px 0",
        textAlign: "center" as "center"
    },
    formulaTitle: {
        color: "#bbf7d0",
        marginBottom: "15px",
        fontSize: "18px"
    },
    formula: {
        fontSize: "24px",
        fontWeight: "bold",
        margin: "15px 0",
        color: "#22c55e"
    },
    formulaExplanation: {
        fontSize: "14px",
        lineHeight: "1.5",
        opacity: 0.9
    },
    exampleBox: {
        backgroundColor: "#fef7ed",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #fed7aa",
        marginTop: "20px"
    },
    exampleTitle: {
        color: "#ea580c",
        marginBottom: "15px",
        fontSize: "16px"
    },
    calculation: {
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "8px",
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "center" as "center",
        margin: "15px 0",
        border: "2px solid #22c55e"
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