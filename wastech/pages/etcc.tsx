// wastech/pages/etcc.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { culturas } from "../data/culturas";

const ETCC: React.FC = () => {
    const [eto, setEto] = useState("");
    const [culturaSelecionada, setCulturaSelecionada] = useState("");
    const [faseSelecionada, setFaseSelecionada] = useState("");
    const [resultado, setResultado] = useState<any>(null);

    const calcularEtc = () => {
        if (!eto || !culturaSelecionada || !faseSelecionada) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        const etoNumero = parseFloat(eto);
        if (isNaN(etoNumero) || etoNumero <= 0) {
            alert("Por favor, insira um valor válido para ETo!");
            return;
        }

        const cultura = culturas.find(c => c.nome === culturaSelecionada);
        if (!cultura) {
            alert("Cultura não encontrada!");
            return;
        }

        const kc = cultura.kcValores[faseSelecionada as keyof typeof cultura.kcValores];
        const etc = (etoNumero * kc).toFixed(2);

        setResultado({
            etc,
            kc,
            cultura: culturaSelecionada,
            fase: faseSelecionada,
            eto: etoNumero
        });
    };

    const limparCampos = () => {
        setEto("");
        setCulturaSelecionada("");
        setFaseSelecionada("");
        setResultado(null);
    };

    const getFaseNome = (fase: string) => {
        const fases: { [key: string]: string } = {
            fase1: "Fase 1 - Inicial",
            fase2: "Fase 2 - Desenvolvimento", 
            fase3: "Fase 3 - Meio",
            fase4: "Fase 4 - Final"
        };
        return fases[fase] || fase;
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Calculadora de ETc</h1>
            <p style={styles.pageSubtitle}>Evapotranspiração da Cultura</p>
            
            <div style={styles.card}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>🌤️ ETo (mm/dia):</label>
                    <input
                        type="number"
                        step="0.1"
                        value={eto}
                        onChange={(e) => setEto(e.target.value)}
                        placeholder="Ex: 4.5"
                        style={styles.input}
                    />
                    <small style={{color: "#6b7280", display: "block", marginTop: "5px"}}>
                        Use o valor do ETo calculado na página anterior
                    </small>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>🌱 Cultura:</label>
                    <select
                        value={culturaSelecionada}
                        onChange={(e) => {
                            setCulturaSelecionada(e.target.value);
                            setFaseSelecionada("");
                        }}
                        style={styles.select}
                    >
                        <option value="">Selecione uma cultura</option>
                        {culturas.map((cultura, index) => (
                            <option key={index} value={cultura.nome}>
                                {cultura.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>📈 Fase de Crescimento:</label>
                    <select
                        value={faseSelecionada}
                        onChange={(e) => setFaseSelecionada(e.target.value)}
                        style={styles.select}
                        disabled={!culturaSelecionada}
                    >
                        <option value="">Selecione uma fase</option>
                        <option value="fase1">Fase 1 - Inicial (KC: 0.3-0.5)</option>
                        <option value="fase2">Fase 2 - Desenvolvimento (KC: 0.5-1.0)</option>
                        <option value="fase3">Fase 3 - Meio (KC: 1.0-1.3)</option>
                        <option value="fase4">Fase 4 - Final (KC: 0.8-0.3)</option>
                    </select>
                </div>

                {culturaSelecionada && (
                    <div style={styles.kcInfo}>
                        <h4 style={{color: "#15803d", marginBottom: "10px"}}>📊 Valores de Kc para {culturaSelecionada}:</h4>
                        <div style={styles.kcGrid}>
                            <span>Fase 1: {culturas.find(c => c.nome === culturaSelecionada)?.kcValores.fase1}</span>
                            <span>Fase 2: {culturas.find(c => c.nome === culturaSelecionada)?.kcValores.fase2}</span>
                            <span>Fase 3: {culturas.find(c => c.nome === culturaSelecionada)?.kcValores.fase3}</span>
                            <span>Fase 4: {culturas.find(c => c.nome === culturaSelecionada)?.kcValores.fase4}</span>
                        </div>
                    </div>
                )}

                <div style={styles.buttonGroup}>
                    <button onClick={calcularEtc} style={styles.button}>
                        🧮 Calcular ETc
                    </button>
                    
                    <button onClick={limparCampos} style={styles.buttonSecondary}>
                        🗑️ Limpar
                    </button>
                </div>

                {resultado && (
                    <div style={styles.resultado}>
                        <h3 style={{color: "#16a34a", textAlign: "center"}}>📊 Resultado do Cálculo</h3>
                        <div style={styles.resultadoContent}>
                            <p><strong>🌱 Cultura:</strong> {resultado.cultura}</p>
                            <p><strong>📈 Fase:</strong> {getFaseNome(resultado.fase)}</p>
                            <p><strong>🔢 Kc utilizado:</strong> {resultado.kc}</p>
                            <p><strong>🌤️ ETo informado:</strong> {resultado.eto} mm/dia</p>
                            <h4 style={{color: "#15803d", marginTop: "15px", fontSize: "20px"}}>
                                💧 ETc = {resultado.etc} mm/dia
                            </h4>
                            <p style={{fontWeight: "bold", color: "#0e7490", textAlign: "center", marginTop: "10px"}}>
                                Recomendação: Aplicar {resultado.etc} litros de água por m² para {resultado.cultura}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div style={styles.infoBox}>
                <h3 style={styles.infoTitle}>🌱 O que é ETc?</h3>
                <p style={styles.paragraph}>
                    <strong>ETc (Evapotranspiração da Cultura)</strong> é a quantidade REAL de água 
                    que uma cultura específica precisa, considerando seu tipo e estágio de crescimento.
                </p>
                
                <h4 style={styles.infoSubtitle}>🔢 Fórmula:</h4>
                <div style={styles.formula}>
                    ETc = ETo × Kc
                </div>
                
                <h4 style={styles.infoSubtitle}>📝 Onde:</h4>
                <ul style={styles.list}>
                    <li style={styles.listItem}><strong>ETc</strong> = Água que sua cultura realmente precisa</li>
                    <li style={styles.listItem}><strong>ETo</strong> = Água de referência (grama)</li>
                    <li style={styles.listItem}><strong>Kc</strong> = Coeficiente que varia por cultura e fase</li>
                </ul>

                <h4 style={styles.infoSubtitle}>📈 Variação do Kc:</h4>
                <ol style={styles.orderedList}>
                    <li style={styles.listItem}><strong>Fase 1 (Inicial):</strong> Kc baixo - planta pequena, pouca água</li>
                    <li style={styles.listItem}><strong>Fase 2 (Desenvolvimento):</strong> Kc aumentando - crescimento acelerado</li>
                    <li style={styles.listItem}><strong>Fase 3 (Meio):</strong> Kc máximo - planta adulta, máxima necessidade</li>
                    <li style={styles.listItem}><strong>Fase 4 (Final):</strong> Kc diminuindo - maturação, menos água</li>
                </ol>
            </div>

            <div style={styles.linkContainer}>
                <Link to="/eto">
                    <button style={styles.buttonSecondary}>
                        ↩️ Voltar para ETo
                    </button>
                </Link>
                
                <Link to="/ko">
                    <button style={styles.button}>
                        📋 Ver Tabela Kc Completa
                    </button>
                </Link>

                <Link to="/dashboard">
                    <button style={styles.buttonSecondary}>
                        🏠 Dashboard
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
    card: {
        background: "white",
        width: "100%",
        maxWidth: "500px",
        borderRadius: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        padding: "25px",
        marginBottom: "20px"
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
    select: {
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "16px",
        backgroundColor: "white",
        boxSizing: "border-box" as "border-box"
    },
    kcInfo: {
        backgroundColor: "#f0fdf4",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "1px solid #bbf7d0"
    },
    kcGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
        fontSize: "14px"
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
    formula: {
        backgroundColor: "#1e293b",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        textAlign: "center" as "center",
        fontSize: "18px",
        fontWeight: "bold",
        margin: "10px 0"
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
    orderedList: {
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
        maxWidth: "500px",
        flexWrap: "wrap" as "wrap"
    }
};

export default ETCC;