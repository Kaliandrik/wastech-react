// wastech/pages/etcc.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { culturas } from "../data/culturas";

const ETCC: React.FC = () => {
    const [eto, setEto] = useState("");
    const [culturaSelecionada, setCulturaSelecionada] = useState("");
    const [faseSelecionada, setFaseSelecionada] = useState("");
    const [resultado, setResultado] = useState<any>(null);
    
    // NOVOS ESTADOS
    const [useCustomKc, setUseCustomKc] = useState(false);
    const [customKc, setCustomKc] = useState("");
    const [diasCiclo, setDiasCiclo] = useState("");

    const calcularEtc = () => {
        // Validação ETo
        if (!eto) {
            alert("Por favor, preencha o ETo!");
            return;
        }

        // Validação Kc (tabela ou custom)
        if (!useCustomKc && (!culturaSelecionada || !faseSelecionada)) {
            alert("Por favor, selecione uma cultura e fase OU use Kc personalizado!");
            return;
        }

        if (useCustomKc && !customKc) {
            alert("Por favor, insira um valor para Kc personalizado!");
            return;
        }

        // Validação números
        const etoNumero = parseFloat(eto);
        if (isNaN(etoNumero) || etoNumero <= 0) {
            alert("Por favor, insira um valor válido para ETo!");
            return;
        }

        let kc: number;
        let culturaNome: string;
        let faseNome: string;
        let duracaoCiclo: number;

        if (useCustomKc) {
            // VALIDAÇÃO Kc custom
            const kcNumero = parseFloat(customKc);
            if (isNaN(kcNumero) || kcNumero < 0.1 || kcNumero > 2.0) {
                alert("Por favor, insira um Kc válido (entre 0.1 e 2.0)!");
                return;
            }
            
            // VALIDAÇÃO Dias do ciclo
            const diasNumero = diasCiclo ? parseInt(diasCiclo) : 1;
            if (diasNumero <= 0 || diasNumero > 365) {
                alert("Por favor, insira dias válidos (1-365)!");
                return;
            }
            
            kc = kcNumero;
            culturaNome = "Personalizado";
            faseNome = "Personalizado";
            duracaoCiclo = diasNumero;
        } else {
            // Kc da tabela
            const cultura = culturas.find(c => c.nome === culturaSelecionada);
            if (!cultura) {
                alert("Cultura não encontrada!");
                return;
            }
            kc = cultura.kcValores[faseSelecionada as keyof typeof cultura.kcValores];
            culturaNome = culturaSelecionada;
            faseNome = faseSelecionada;
            duracaoCiclo = cultura.duracao;
        }

        // Cálculo ETc
        const etcDiario = (etoNumero * kc).toFixed(2);
        
        // NOVO: Cálculo da média do Kc para cultura completa
        let kcMedioCiclo = kc;
        let etcTotalCiclo = (etoNumero * kc * duracaoCiclo).toFixed(2);
        let etcMediaPorDiaCiclo = etcDiario;
        
        if (!useCustomKc && culturaSelecionada) {
            const cultura = culturas.find(c => c.nome === culturaSelecionada);
            if (cultura) {
                // Calcular Kc médio do ciclo completo
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
                
                if (totalDias > 0) {
                    kcMedioCiclo = parseFloat((somaPonderada / totalDias).toFixed(2));
                    etcMediaPorDiaCiclo = (etoNumero * kcMedioCiclo).toFixed(2);
                    etcTotalCiclo = (etoNumero * kcMedioCiclo * cultura.duracao).toFixed(2);
                }
            }
        }

        setResultado({
            etcDiario,
            etcMediaPorDiaCiclo,
            etcTotalCiclo,
            kc,
            kcMedioCiclo,
            cultura: culturaNome,
            fase: faseNome,
            eto: etoNumero,
            duracaoCiclo,
            isCustom: useCustomKc,
            showMediaCiclo: !useCustomKc
        });
    };

    const limparCampos = () => {
        setEto("");
        setCulturaSelecionada("");
        setFaseSelecionada("");
        setCustomKc("");
        setDiasCiclo("");
        setUseCustomKc(false);
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

    // NOVO: Renderizar seção de Kc personalizado
    const renderKcPersonalizado = () => (
        <div style={styles.inputGroup}>
            <label style={styles.label}>
                <input 
                    type="checkbox" 
                    checked={useCustomKc}
                    onChange={(e) => {
                        setUseCustomKc(e.target.checked);
                        if (e.target.checked) {
                            setCulturaSelecionada("");
                            setFaseSelecionada("");
                        }
                    }}
                    style={{ marginRight: "8px" }}
                />
                ✏️ Usar meu próprio Kc (avançado)
            </label>
            
            {useCustomKc && (
                <div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="number"
                                step="0.01"
                                min="0.1"
                                max="2.0"
                                value={customKc}
                                onChange={(e) => setCustomKc(e.target.value)}
                                placeholder="Kc (ex: 1.15)"
                                style={styles.input}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <input
                                type="number"
                                min="1"
                                max="365"
                                value={diasCiclo}
                                onChange={(e) => setDiasCiclo(e.target.value)}
                                placeholder="Dias do ciclo"
                                style={styles.input}
                            />
                        </div>
                    </div>
                    <small style={{color: "#6b7280", display: "block", marginTop: "5px"}}>
                        Kc entre 0.1-2.0 | Dias: 1-365 | Consulte um técnico para valores precisos
                    </small>
                </div>
            )}
        </div>
    );

    // NOVO: Renderizar resultados
    const renderResultado = () => {
        if (!resultado) return null;
        
        return (
            <div style={styles.resultado}>
                <h3 style={{color: "#16a34a", textAlign: "center"}}>
                    📊 Resultado {resultado.isCustom ? "(Kc Personalizado)" : ""}
                </h3>
                
                <div style={styles.resultadoContent}>
                    {/* Informações básicas */}
                    <div style={styles.resultRow}>
                        <div style={styles.resultCol}>
                            <p><strong>🌱 Cultura:</strong> {resultado.cultura}</p>
                        </div>
                        <div style={styles.resultCol}>
                            <p><strong>📈 Fase:</strong> {getFaseNome(resultado.fase)}</p>
                        </div>
                    </div>
                    
                    <div style={styles.resultRow}>
                        <div style={styles.resultCol}>
                            <p><strong>🔢 Kc utilizado:</strong> {resultado.kc}</p>
                        </div>
                        <div style={styles.resultCol}>
                            <p><strong>🌤️ ETo:</strong> {resultado.eto} mm/dia</p>
                        </div>
                    </div>
                    
                    <div style={styles.resultRow}>
                        <div style={styles.resultCol}>
                            <p><strong>📅 Dias do ciclo:</strong> {resultado.duracaoCiclo}</p>
                        </div>
                        <div style={styles.resultCol}>
                            <p><strong>📊 Tipo:</strong> {resultado.isCustom ? "Personalizado" : "Tabela FAO"}</p>
                        </div>
                    </div>

                    {/* ETc DIÁRIO (fase atual) */}
                    <div style={styles.etcCard}>
                        <h4 style={{color: "#15803d", marginBottom: "10px", textAlign: "center"}}>
                            💧 ETc da Fase Atual
                        </h4>
                        <div style={styles.etcValue}>
                            {resultado.etcDiario} mm/dia
                        </div>
                        <p style={styles.etcText}>
                            Aplicar <strong>{resultado.etcDiario} litros por m² por dia</strong> para {resultado.cultura}
                        </p>
                    </div>

                    {/* MÉDIA DO CICLO COMPLETO (apenas para culturas da tabela) */}
                    {resultado.showMediaCiclo && resultado.kcMedioCiclo !== resultado.kc && (
                        <div style={styles.mediaCard}>
                            <h4 style={{color: "#ea580c", marginBottom: "10px", textAlign: "center"}}>
                                📈 Média do Ciclo Completo
                            </h4>
                            
                            <div style={styles.mediaGrid}>
                                <div style={styles.mediaItem}>
                                    <div style={styles.mediaLabel}>Kc Médio do Ciclo:</div>
                                    <div style={styles.mediaValue}>{resultado.kcMedioCiclo}</div>
                                </div>
                                <div style={styles.mediaItem}>
                                    <div style={styles.mediaLabel}>ETc Média/Dia:</div>
                                    <div style={styles.mediaValue}>{resultado.etcMediaPorDiaCiclo} mm</div>
                                </div>
                                <div style={styles.mediaItem}>
                                    <div style={styles.mediaLabel}>ETc Total/Ciclo:</div>
                                    <div style={styles.mediaValue}>{resultado.etcTotalCiclo} mm</div>
                                </div>
                            </div>
                            
                            <p style={styles.mediaText}>
                                Para o ciclo completo de {resultado.duracaoCiclo} dias, 
                                a <strong>média diária</strong> é {resultado.etcMediaPorDiaCiclo} mm/dia
                            </p>
                        </div>
                    )}

                    {/* CONVERSÕES ÚTEIS */}
                    <div style={styles.conversaoCard}>
                        <h4 style={{color: "#0e7490", marginBottom: "10px", textAlign: "center"}}>
                            🔄 Conversões Práticas
                        </h4>
                        <div style={styles.conversaoGrid}>
                            <div style={styles.conversaoItem}>
                                <div style={styles.conversaoLabel}>Por hectare/dia:</div>
                                <div style={styles.conversaoValue}>
                                    {(parseFloat(resultado.etcDiario) * 10).toFixed(0)} m³/ha
                                </div>
                            </div>
                            <div style={styles.conversaoItem}>
                                <div style={styles.conversaoLabel}>Por mês (30 dias):</div>
                                <div style={styles.conversaoValue}>
                                    {(parseFloat(resultado.etcDiario) * 30).toFixed(1)} mm
                                </div>
                            </div>
                            <div style={styles.conversaoItem}>
                                <div style={styles.conversaoLabel}>Por ciclo completo:</div>
                                <div style={styles.conversaoValue}>
                                    {(parseFloat(resultado.etcDiario) * resultado.duracaoCiclo).toFixed(1)} mm
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AVISO para Kc personalizado */}
                    {resultado.isCustom && (
                        <div style={styles.warningBox}>
                            <p style={{margin: 0, fontSize: "14px"}}>
                                ⚠️ <strong>Atenção:</strong> Kc personalizado usado. 
                                Certifique-se que o valor é apropriado para suas condições.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Calculadora de ETc</h1>
            <p style={styles.pageSubtitle}>Evapotranspiração da Cultura</p>
            
            <div style={styles.card}>
                {/* ETo */}
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

                {/* Cultura e Fase OU Kc Personalizado */}
                <div style={styles.selectionContainer}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>🌱 Selecione uma cultura:</label>
                        <select
                            value={culturaSelecionada}
                            onChange={(e) => {
                                setCulturaSelecionada(e.target.value);
                                setFaseSelecionada("");
                                if (e.target.value) setUseCustomKc(false);
                            }}
                            style={styles.select}
                            disabled={useCustomKc}
                        >
                            <option value="">Selecione uma cultura</option>
                            {culturas.map((cultura, index) => (
                                <option key={index} value={cultura.nome}>
                                    {cultura.nome} ({cultura.duracao} dias)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>📈 Selecione uma fase:</label>
                        <select
                            value={faseSelecionada}
                            onChange={(e) => {
                                setFaseSelecionada(e.target.value);
                                if (e.target.value) setUseCustomKc(false);
                            }}
                            style={styles.select}
                            disabled={!culturaSelecionada || useCustomKc}
                        >
                            <option value="">Primeiro selecione a cultura</option>
                            <option value="fase1">Fase 1 - Inicial</option>
                            <option value="fase2">Fase 2 - Desenvolvimento</option>
                            <option value="fase3">Fase 3 - Meio</option>
                            <option value="fase4">Fase 4 - Final</option>
                        </select>
                    </div>

                    {/* Divisor com OU */}
                    <div style={styles.divider}>
                        <div style={styles.dividerLine}></div>
                        <span style={styles.dividerText}>OU</span>
                        <div style={styles.dividerLine}></div>
                    </div>

                    {/* Kc Personalizado */}
                    {renderKcPersonalizado()}
                </div>

                {/* Valores de Kc da cultura selecionada */}
                {culturaSelecionada && !useCustomKc && (
                    <div style={styles.kcInfo}>
                        <h4 style={{color: "#15803d", marginBottom: "10px"}}>
                            📊 Valores de Kc para {culturaSelecionada}:
                        </h4>
                        <div style={styles.kcGrid}>
                            <div style={styles.kcItem}>
                                <span style={styles.kcLabel}>Fase 1:</span>
                                <span style={styles.kcValue}>
                                    {culturas.find(c => c.nome === culturaSelecionada)?.kcValores.fase1}
                                </span>
                            </div>
                            <div style={styles.kcItem}>
                                <span style={styles.kcLabel}>Fase 2:</span>
                                <span style={styles.kcValue}>
                                    {culturas.find(c => c.nome === culturaSelecionada)?.kcValores.fase2}
                                </span>
                            </div>
                            <div style={styles.kcItem}>
                                <span style={styles.kcLabel}>Fase 3:</span>
                                <span style={styles.kcValue}>
                                    {culturas.find(c => c.nome === culturaSelecionada)?.kcValores.fase3}
                                </span>
                            </div>
                            <div style={styles.kcItem}>
                                <span style={styles.kcLabel}>Fase 4:</span>
                                <span style={styles.kcValue}>
                                    {culturas.find(c => c.nome === culturaSelecionada)?.kcValores.fase4}
                                </span>
                            </div>
                        </div>
                        <p style={styles.kcNote}>
                            <strong>Dica:</strong> Para ver a média do ciclo completo, selecione uma fase e calcule!
                        </p>
                    </div>
                )}

                {/* Botões */}
                <div style={styles.buttonGroup}>
                    <button onClick={calcularEtc} style={styles.button}>
                        🧮 Calcular ETc
                    </button>
                    
                    <button onClick={limparCampos} style={styles.buttonSecondary}>
                        🗑️ Limpar Tudo
                    </button>
                </div>

                {/* Resultados */}
                {renderResultado()}
            </div>

            {/* Informações educacionais */}
            <div style={styles.infoBox}>
                <h3 style={styles.infoTitle}>📚 Entendendo os Resultados</h3>
                
                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                        <h4 style={styles.infoSubtitle}>💧 ETc da Fase</h4>
                        <p style={styles.paragraph}>
                            <strong>Necessidade diária de água</strong> para a fase específica selecionada.
                            Use este valor para programar sua irrigação diária.
                        </p>
                    </div>
                    
                    <div style={styles.infoItem}>
                        <h4 style={styles.infoSubtitle}>📈 Média do Ciclo</h4>
                        <p style={styles.paragraph}>
                            <strong>Média diária considerando todo o ciclo</strong> da cultura.
                            Útil para planejamento de longo prazo e dimensionamento de sistemas.
                        </p>
                    </div>
                    
                    <div style={styles.infoItem}>
                        <h4 style={styles.infoSubtitle}>🎯 Kc Personalizado</h4>
                        <p style={styles.paragraph}>
                            Para <strong>agricultores experientes</strong> que conhecem as necessidades 
                            específicas de suas variedades, solos e condições climáticas locais.
                        </p>
                    </div>
                </div>

                <div style={styles.formulaBox}>
                    <h4 style={styles.formulaTitle}>🧮 Fórmulas Utilizadas</h4>
                    <div style={styles.formulaGrid}>
                        <div style={styles.formulaItem}>
                            <div style={styles.formula}>ETc = ETo × Kc</div>
                            <p style={styles.formulaText}>Cálculo diário para fase específica</p>
                        </div>
                        <div style={styles.formulaItem}>
                            <div style={styles.formula}>ETc Média = ETo × Kc Médio</div>
                            <p style={styles.formulaText}>Média para todo o ciclo</p>
                        </div>
                        <div style={styles.formulaItem}>
                            <div style={styles.formula}>1 mm = 10 m³/ha</div>
                            <p style={styles.formulaText}>Conversão para área</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navegação */}
            <div style={styles.linkContainer}>
                <Link to="/eto">
                    <button style={styles.buttonSecondary}>
                        ↩️ Calcular ETo
                    </button>
                </Link>
                
                <Link to="/ko">
                    <button style={styles.button}>
                        📋 Tabela Kc Completa
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

// ESTILOS COMPLETOS
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
        maxWidth: "600px",
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "25px",
        marginBottom: "20px"
    },
    selectionContainer: {
        backgroundColor: "#f8fafc",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px"
    },
    inputGroup: {
        marginBottom: "15px"
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
        color: "#374151",
        fontSize: "15px"
    },
    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "16px",
        boxSizing: "border-box" as "border-box",
        backgroundColor: "white"
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
    divider: {
        display: "flex",
        alignItems: "center",
        margin: "20px 0",
        color: "#6b7280"
    },
    dividerLine: {
        flex: 1,
        height: "1px",
        backgroundColor: "#d1d5db"
    },
    dividerText: {
        margin: "0 15px",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#6b7280"
    },
    kcInfo: {
        backgroundColor: "#f0fdf4",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        border: "1px solid #bbf7d0"
    },
    kcGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
        marginBottom: "10px"
    },
    kcItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 12px",
        backgroundColor: "#dcfce7",
        borderRadius: "6px"
    },
    kcLabel: {
        fontSize: "14px",
        color: "#15803d"
    },
    kcValue: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#166534"
    },
    kcNote: {
        fontSize: "13px",
        color: "#4b5563",
        textAlign: "center" as "center",
        marginTop: "10px",
        fontStyle: "italic"
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
        padding: "14px 20px",
        fontSize: "16px",
        cursor: "pointer",
        flex: 1,
        fontWeight: "bold",
        transition: "background-color 0.3s"
    },
    buttonSecondary: {
        backgroundColor: "#6b7280",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "14px 20px",
        fontSize: "16px",
        cursor: "pointer",
        flex: 1,
        transition: "background-color 0.3s"
    },
    resultado: {
        marginTop: "25px",
        padding: "25px",
        backgroundColor: "#f8fafc",
        border: "2px solid #16a34a",
        borderRadius: "12px"
    },
    resultadoContent: {
        textAlign: "center" as "center"
    },
    resultRow: {
        display: "flex",
        gap: "15px",
        marginBottom: "10px"
    },
    resultCol: {
        flex: 1,
        padding: "10px",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #e5e7eb"
    },
    etcCard: {
        backgroundColor: "#f0fdf4",
        padding: "20px",
        borderRadius: "10px",
        margin: "20px 0",
        border: "2px solid #22c55e"
    },
    etcValue: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#16a34a",
        margin: "15px 0"
    },
    etcText: {
        fontSize: "16px",
        color: "#374151",
        marginTop: "10px"
    },
    mediaCard: {
        backgroundColor: "#ffedd5",
        padding: "20px",
        borderRadius: "10px",
        margin: "20px 0",
        border: "2px solid #ea580c"
    },
    mediaGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "15px",
        margin: "15px 0"
    },
    mediaItem: {
        textAlign: "center" as "center",
        padding: "15px",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #fed7aa"
    },
    mediaLabel: {
        fontSize: "12px",
        color: "#92400e",
        marginBottom: "5px"
    },
    mediaValue: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#ea580c"
    },
    mediaText: {
        fontSize: "14px",
        color: "#92400e",
        textAlign: "center" as "center",
        marginTop: "10px"
    },
    conversaoCard: {
        backgroundColor: "#e0f2fe",
        padding: "20px",
        borderRadius: "10px",
        margin: "20px 0",
        border: "2px solid #0ea5e9"
    },
    conversaoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "15px",
        margin: "15px 0"
    },
    conversaoItem: {
        textAlign: "center" as "center",
        padding: "15px",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #bae6fd"
    },
    conversaoLabel: {
        fontSize: "12px",
        color: "#0369a1",
        marginBottom: "5px"
    },
    conversaoValue: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#0e7490"
    },
    warningBox: {
        backgroundColor: "#fef3c7",
        border: "1px solid #f59e0b",
        borderRadius: "8px",
        padding: "12px",
        marginTop: "15px"
    },
    infoBox: {
        background: "white",
        width: "100%",
        maxWidth: "600px",
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "25px",
        marginBottom: "20px"
    },
    infoTitle: {
        color: "#16a34a",
        marginBottom: "20px",
        fontSize: "22px",
        textAlign: "center" as "center"
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "20px",
        marginBottom: "25px"
    },
    infoItem: {
        padding: "15px",
        backgroundColor: "#f8fafc",
        borderRadius: "10px",
        border: "1px solid #e5e7eb"
    },
    infoSubtitle: {
        color: "#15803d",
        marginBottom: "10px",
        fontSize: "16px"
    },
    paragraph: {
        lineHeight: "1.5",
        fontSize: "14px",
        color: "#4b5563"
    },
    formulaBox: {
        backgroundColor: "#1e293b",
        color: "white",
        padding: "20px",
        borderRadius: "10px"
    },
    formulaTitle: {
        color: "#bbf7d0",
        marginBottom: "15px",
        fontSize: "18px",
        textAlign: "center" as "center"
    },
    formulaGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px"
    },
    formulaItem: {
        textAlign: "center" as "center"
    },
    formula: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#22c55e",
        fontFamily: "monospace",
        marginBottom: "8px"
    },
    formulaText: {
        fontSize: "12px",
        color: "#94a3b8"
    },
    linkContainer: {
        display: "flex",
        gap: "10px",
        width: "100%",
        maxWidth: "600px",
        flexWrap: "wrap" as "wrap",
        justifyContent: "center"
    }
};

export default ETCC;