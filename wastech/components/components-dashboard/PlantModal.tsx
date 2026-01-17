import React, { useState, useEffect } from 'react';
import { GeminiAIService } from '../../api/geminiAI';
import type { PlantAnalysis } from '../../api/geminiAI';

interface Plant {
  id: string;
  name: string;
  type: string;
  plantingDate: string;
  formattedDate: string;
  notes?: string;
}

interface PlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plant: Omit<Plant, 'id' | 'formattedDate'>, editingId?: string) => void;
  editingPlant?: Plant | null;
}

export const PlantModal: React.FC<PlantModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlant
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [hasPreviousAnalysis, setHasPreviousAnalysis] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const plantTypes = [
    { value: 'Hortaliça', label: '🥬 Hortaliça' },
    { value: 'Fruta', label: '🍓 Fruta' },
    { value: 'Erva Aromática', label: '🌿 Erva Aromática' },
    { value: 'Legume', label: '🥕 Legume' },
    { value: 'Flor', label: '🌺 Flor' },
    { value: 'Outro', label: '🌱 Outro' }
  ];

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (editingPlant) {
      setName(editingPlant.name);
      setType(editingPlant.type);
      setDate(editingPlant.plantingDate);
      setAnalysis(null);
      setShowAnalysis(false);
      setAnalysisError(null);
      setHasPreviousAnalysis(false);
      
      // Verifica se há notas da IA na planta editada
      if (editingPlant.notes && editingPlant.notes.includes('🤖 IA:')) {
        setHasPreviousAnalysis(true);
        
        // Tenta extrair e mostrar informações da análise anterior
        setTimeout(() => {
          const previousAnalysis = extractAnalysisFromNotes(editingPlant.notes || '');
          if (previousAnalysis) {
            setAnalysis(previousAnalysis);
            setShowAnalysis(true);
          }
        }, 100);
      }
    } else {
      resetForm();
    }
  }, [editingPlant, isOpen]);

  // Extrai informações da análise anterior das notas
  const extractAnalysisFromNotes = (notes: string): PlantAnalysis | null => {
    try {
      // Procura por padrões nas notas
      const harvestTimeMatch = notes.match(/Colheita em ([^\.]+)/);
      const careTipsMatch = notes.match(/IA:.*? - (.*?)\./);
      
      if (harvestTimeMatch || careTipsMatch) {
        // Cria um objeto de análise básico a partir das notas
        return {
          harvestTime: harvestTimeMatch ? harvestTimeMatch[1].trim() : 'Informação não disponível',
          growthStages: [
            {
              stage: "Germinação/Crescimento Inicial",
              duration: "15-30 dias",
              tips: ["Mantenha o solo úmido", "Forneça luz adequada", "Proteja de temperaturas extremas"]
            },
            {
              stage: "Desenvolvimento Vegetativo", 
              duration: "30-60 dias",
              tips: ["Adube regularmente", "Controle pragas", "Mantenha solo bem drenado"]
            },
            {
              stage: "Produção/Colheita",
              duration: "Varia por espécie",
              tips: ["Monitore maturação", "Colha no momento ideal", "Armazene corretamente"]
            }
          ],
          careTips: careTipsMatch ? 
            careTipsMatch[1].split('. ').filter(tip => tip.trim().length > 0).slice(0, 4) : 
            ["Consulte análise anterior para detalhes"],
          commonIssues: ["Pragas comuns", "Doenças fúngicas", "Deficiências nutricionais"],
          estimatedYield: "Varia conforme cuidados",
          exists: true,
          waterNeeds: "Verifique análise anterior",
          sunExposure: "Verifique análise anterior", 
          soilType: "Verifique análise anterior"
        };
      }
    } catch (error) {
      console.warn('Não foi possível extrair análise das notas:', error);
    }
    return null;
  };

  const resetForm = () => {
    setName('');
    setType('');
    setDate(new Date().toISOString().split('T')[0]);
    setAnalysis(null);
    setShowAnalysis(false);
    setAnalysisError(null);
    setHasPreviousAnalysis(false);
  };

  const handleAnalyzePlant = async () => {
    if (!name || !type || !date) {
      alert('Por favor, preencha nome, tipo e data para análise!');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setShowAnalysis(false);
    
    try {
      console.log('🔄 Iniciando análise com Gemini...');
      const plantAnalysis = await GeminiAIService.analyzePlant(name, type, date);
      setAnalysis(plantAnalysis);
      setShowAnalysis(true);
      setHasPreviousAnalysis(false); // Nova análise substitui a anterior
      console.log('✅ Análise concluída com sucesso!');
    } catch (error) {
      console.error('❌ Erro na análise:', error);
      setAnalysisError('Erro ao consultar a IA. Usando análise local.');
      const plantAnalysis = await GeminiAIService.analyzePlant(name, type, date);
      setAnalysis(plantAnalysis);
      setShowAnalysis(true);
      setHasPreviousAnalysis(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!name || !type || !date) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const plantData = {
      name,
      type,
      plantingDate: date,
      notes: analysis ? 
        `🤖 IA: ${name} - Colheita em ${analysis.harvestTime}. ` +
        `${analysis.careTips.slice(0, 2).join('. ')}` : 
        (editingPlant?.notes || 'Planta adicionada - análise pendente')
    };

    onSave(plantData, editingPlant?.id);
    onClose();
    resetForm();
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center z-50 p-0 md:p-4 overflow-y-auto">
      {/* Modal Container - Responsivo */}
      <div className={`bg-white w-full min-h-screen md:min-h-0 md:max-h-[85vh] flex flex-col overflow-hidden ${
        isMobile ? 'rounded-none' : 'rounded-3xl'
      } shadow-2xl md:w-full md:max-w-4xl`}>
        
        {/* Header Gradiente */}
        <div className="flex-shrink-0 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white p-4 md:p-8">
          <div className="flex justify-between items-start md:items-center mb-2">
            <div className="flex items-start md:items-center flex-col md:flex-row">
              <div className="flex items-center mb-2 md:mb-0">
                <div className="bg-white/20 p-2 md:p-3 rounded-xl md:rounded-2xl mr-3 md:mr-4">
                  <span className="text-xl md:text-2xl">🌱</span>
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold tracking-tight leading-tight">
                    {editingPlant ? 'Editar Planta' : 'Nova Planta'}
                  </h3>
                  <p className="text-emerald-100 text-xs md:text-sm font-medium mt-0.5 md:mt-1 line-clamp-2">
                    {editingPlant && hasPreviousAnalysis ? 
                      'Análise anterior carregada' : 
                      'Análise com IA Gemini'}
                  </p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white text-xl md:text-2xl bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded-full transition-all duration-200 ml-2"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="space-y-6 md:space-y-8">
            {/* Seção de Informações Básicas */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-6 md:h-8 bg-green-500 rounded-full"></div>
                <h4 className="text-base md:text-lg font-semibold text-gray-800">
                  Informações da Planta
                </h4>
                {editingPlant && hasPreviousAnalysis && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Análise disponível
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {/* Campo Nome */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="inline-flex items-center">
                      <span className="text-base mr-2">🌿</span>
                      Nome da Planta
                      <span className="text-red-500 ml-1">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 md:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 text-sm md:text-base"
                    placeholder="Ex: Tomate Cereja..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Nome comum ou científico da planta
                  </p>
                </div>

                {/* Campo Tipo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="inline-flex items-center">
                      <span className="text-base mr-2">🏷️</span>
                      Tipo de Planta
                      <span className="text-red-500 ml-1">*</span>
                    </span>
                  </label>
                  <select
                    className="w-full px-4 py-3 md:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none text-sm md:text-base"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="" className="text-gray-400">Selecione...</option>
                    {plantTypes.map(plantType => (
                      <option 
                        key={plantType.value} 
                        value={plantType.value}
                        className="py-2"
                      >
                        {isMobile ? plantType.label.replace(/[^\\x00-\\x7F]/g, '').trim() : plantType.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">
                    Categoria principal
                  </p>
                </div>
              </div>

              {/* Campo Data */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <span className="inline-flex items-center">
                    <span className="text-base mr-2">📅</span>
                    Data de Plantio
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-4 py-3 md:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm md:text-base"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📆
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Data de cultivo
                </p>
              </div>
            </div>

            {/* Botão de Análise IA */}
            <div className="pt-2 md:pt-4">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <h4 className="text-base md:text-lg font-semibold text-gray-800">
                  Análise com IA
                </h4>
                {hasPreviousAnalysis && !showAnalysis && (
                  <button
                    onClick={() => {
                      if (analysis) {
                        setShowAnalysis(!showAnalysis);
                      }
                    }}
                    className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showAnalysis ? 'Ocultar' : 'Ver anterior'}
                  </button>
                )}
              </div>

              <button
                onClick={handleAnalyzePlant}
                disabled={isAnalyzing || !name || !type || !date}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 md:py-5 px-4 md:px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center group"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center space-x-2 md:space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-2 border-white border-t-transparent"></div>
                    <div className="text-left">
                      <span className="block font-bold text-sm md:text-lg">Analisando...</span>
                      <span className="block text-xs md:text-sm font-normal text-indigo-100">
                        {isMobile ? 'Consultando IA' : 'Consultando IA Gemini'}
                      </span>
                    </div>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2 md:space-x-4 w-full">
                    <div className="bg-white/20 p-2 md:p-3 rounded-lg md:rounded-xl group-hover:scale-105 transition-transform">
                      <span className="text-lg md:text-2xl">🤖</span>
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <span className="block font-bold text-base md:text-xl truncate">
                        {hasPreviousAnalysis ? 'REANALISAR' : 'ANALISAR COM IA'}
                      </span>
                      <span className="block text-xs md:text-sm font-normal text-indigo-100 truncate">
                        {hasPreviousAnalysis ? 'Atualizar informações' : 'Previsão de colheita'}
                      </span>
                    </div>
                    {!isMobile && (
                      <div className="ml-auto bg-white/20 p-2 rounded-lg">
                        <span className="text-lg">⚡</span>
                      </div>
                    )}
                  </span>
                )}
              </button>

              {hasPreviousAnalysis && (
                <p className="text-xs md:text-sm text-gray-600 mt-2 text-center">
                  💡 Análise existente. "Reanalisar" para atualizar.
                </p>
              )}
            </div>

            {/* Mensagem de Erro */}
            {analysisError && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 md:p-4 animate-fade-in">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="bg-amber-100 p-1.5 md:p-2 rounded-full">
                    <span className="text-amber-600 text-base md:text-lg">⚠️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-amber-800 text-sm md:text-base">Análise Local</p>
                    <p className="text-xs md:text-sm text-amber-700 truncate">{analysisError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resultado da Análise */}
            {(showAnalysis && analysis) && (
              <div className="space-y-4 md:space-y-6 animate-slide-up pt-2 md:pt-4">
                {/* Cabeçalho da Análise */}
                <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
                    <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${hasPreviousAnalysis ? 'bg-blue-500' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
                      <span className="text-xl md:text-2xl text-white">📊</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base md:text-xl font-bold text-gray-800 truncate">
                        {hasPreviousAnalysis ? 'Análise Anterior' : 'Análise Inteligente'}
                      </h4>
                      <p className="text-gray-600 text-xs md:text-sm truncate">
                        {hasPreviousAnalysis ? `${name}` : `Recomendações para ${name}`}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${hasPreviousAnalysis ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <span className={`text-sm font-medium ${hasPreviousAnalysis ? 'text-blue-600' : 'text-green-600'}`}>
                      {hasPreviousAnalysis ? 'Salva' : 'IA Ativa'}
                    </span>
                  </div>
                </div>

                {/* Tempo de Colheita */}
                <div className={`border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm ${hasPreviousAnalysis ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'}`}>
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className={`p-2 md:p-2.5 rounded-lg md:rounded-xl ${hasPreviousAnalysis ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                        <span className={`${hasPreviousAnalysis ? 'text-blue-600' : 'text-emerald-600'} text-base md:text-xl`}>⏰</span>
                      </div>
                      <div className="min-w-0">
                        <h5 className={`font-semibold text-sm md:text-base ${hasPreviousAnalysis ? 'text-blue-800' : 'text-emerald-800'} truncate`}>
                          Tempo para Colheita
                        </h5>
                        <p className={`text-xs ${hasPreviousAnalysis ? 'text-blue-600' : 'text-emerald-600'} truncate`}>
                          {hasPreviousAnalysis ? 'Informação salva' : 'Baseado em condições ideais'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-1 md:py-2">
                    <p className={`text-2xl md:text-4xl font-bold mb-1 md:mb-2 ${hasPreviousAnalysis ? 'text-blue-700' : 'text-emerald-700'}`}>
                      {analysis.harvestTime}
                    </p>
                    <p className={`text-xs md:text-sm ${hasPreviousAnalysis ? 'text-blue-600' : 'text-emerald-600'} line-clamp-2`}>
                      {analysis.season?.join(', ') || 'Consulte estações adequadas'}
                    </p>
                  </div>
                </div>

                {/* Estágios de Crescimento */}
               {analysis.growthStages && analysis.growthStages.length > 0 && (
  <div className="space-y-3 md:space-y-4">
    <div className="flex items-center space-x-2 md:space-x-3">
      <div className={`w-6 md:w-8 h-0.5 ${hasPreviousAnalysis ? 'bg-blue-300' : 'bg-green-300'}`}></div>
      <h5 className="font-semibold text-gray-700 text-sm md:text-base">
        Fases de Desenvolvimento
      </h5>
    </div>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
      {analysis.growthStages.map((stage, index) => {
        // Nomes simplificados para mobile
        const mobileStageName = stage.stage
          .replace("Germinação/Crescimento Inicial", "Germinação Inicial")
          .replace("Desenvolvimento Vegetativo", "Crescimento Vegetativo")
          .replace("Produção/Colheita", "Produção");
          
        return (
          <div 
            key={index} 
            className={`bg-white border rounded-xl p-3 md:p-5 hover:shadow-lg transition-all duration-300 group ${hasPreviousAnalysis ? 'border-blue-200' : 'border-gray-200'}`}
          >
            <div className="flex items-start justify-between mb-2 md:mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1 md:mb-2">
                  <div className={`${hasPreviousAnalysis ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-base`}>
                    {index + 1}
                  </div>
                  <span className="font-semibold text-gray-800 text-sm md:text-base">
                    {/* Mostra nome simplificado em mobile, completo em desktop */}
                    <span className="block md:hidden">{mobileStageName}</span>
                    <span className="hidden md:block">{stage.stage}</span>
                  </span>
                </div>
                <div className="bg-gray-50 inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full mt-1">
                  <span className="text-xs md:text-sm font-medium text-gray-600">
                    {stage.duration}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              {stage.tips.slice(0, isMobile ? 2 : 3).map((tip, tipIndex) => (
                <div 
                  key={tipIndex} 
                  className="flex items-start space-x-2 md:space-x-3 group-hover:translate-x-1 transition-transform"
                >
                  <div className={`${hasPreviousAnalysis ? 'bg-blue-50' : 'bg-green-50'} p-1 md:p-1.5 rounded-lg mt-0.5 flex-shrink-0`}>
                    <span className={`text-xs md:text-sm ${hasPreviousAnalysis ? 'text-blue-500' : 'text-green-500'}`}>✓</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed flex-1">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

                {/* Dicas de Cuidado */}
                {analysis.careTips && analysis.careTips.length > 0 && (
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className={`w-6 md:w-8 h-0.5 ${hasPreviousAnalysis ? 'bg-blue-300' : 'bg-blue-300'}`}></div>
                      <h5 className="font-semibold text-gray-700 text-sm md:text-base">
                        Dicas de Cuidado
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
                      {analysis.careTips.slice(0, isMobile ? 2 : 4).map((tip, index) => (
                        <div 
                          key={index} 
                          className={`border rounded-xl p-2 md:p-4 hover:shadow-md transition-all ${hasPreviousAnalysis ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'}`}
                        >
                          <div className="flex items-start space-x-2 md:space-x-3">
                            <div className={`p-1.5 md:p-2 rounded-lg ${hasPreviousAnalysis ? 'bg-blue-100' : 'bg-blue-100'} flex-shrink-0`}>
                              <span className={`${hasPreviousAnalysis ? 'text-blue-600' : 'text-blue-600'} text-sm md:text-base`}>💡</span>
                            </div>
                            <p className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed line-clamp-2">
                              {tip}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Problemas Comuns */}
                {analysis.commonIssues && analysis.commonIssues.length > 0 && (
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-6 md:w-8 h-0.5 bg-red-300"></div>
                      <h5 className="font-semibold text-gray-700 text-sm md:text-base">
                        Problemas Comuns
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
                      {analysis.commonIssues.slice(0, isMobile ? 2 : 4).map((issue, index) => (
                        <div 
                          key={index} 
                          className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-2 md:p-4 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start space-x-2 md:space-x-3">
                            <div className="bg-red-100 p-1.5 md:p-2 rounded-lg flex-shrink-0">
                              <span className="text-red-600 text-sm md:text-base">⚠️</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs md:text-sm text-gray-800 font-medium line-clamp-2">
                                {issue}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informações Adicionais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {/* Estimativa de Produção */}
                  {analysis.estimatedYield && analysis.estimatedYield !== 'Varia conforme cuidados' && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl md:rounded-2xl p-3 md:p-5">
                      <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="bg-amber-100 p-2 md:p-3 rounded-lg md:rounded-xl flex-shrink-0">
                          <span className="text-amber-600 text-base md:text-xl">📈</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-amber-800 text-sm md:text-base mb-0.5 md:mb-1 truncate">
                            Produção Estimada
                          </h5>
                          <p className="text-amber-700 font-medium text-xs md:text-sm line-clamp-2">
                            {analysis.estimatedYield}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Exposição Solar */}
                  {analysis.sunExposure && analysis.sunExposure !== 'Verifique análise anterior' && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl md:rounded-2xl p-3 md:p-5">
                      <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="bg-blue-100 p-2 md:p-3 rounded-lg md:rounded-xl flex-shrink-0">
                          <span className="text-blue-600 text-base md:text-xl">☀️</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-blue-800 text-sm md:text-base mb-0.5 md:mb-1 truncate">
                            Necessidade de Sol
                          </h5>
                          <p className="text-blue-700 font-medium text-xs md:text-sm line-clamp-2">
                            {analysis.sunExposure}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nota sobre análise anterior */}
                {hasPreviousAnalysis && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 md:p-4">
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <div className="bg-blue-100 p-1.5 md:p-2 rounded-lg flex-shrink-0">
                        <span className="text-blue-600 text-sm md:text-base">💾</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-blue-800">
                          Análise salva anteriormente
                        </p>
                        <p className="text-xs md:text-sm text-blue-700 mt-0.5 md:mt-1 line-clamp-2">
                          "REANALISAR COM IA" para informações atualizadas.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botões de Ação */}
            <div className="pt-4 md:pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-2 md:space-x-4">
                <button 
                  onClick={handleClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 md:py-4 px-4 md:px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg border border-gray-200 active:scale-[0.98] text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!name || !type || !date}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] text-sm md:text-base"
                >
                  <span className="flex items-center justify-center space-x-1 md:space-x-2">
                    {editingPlant ? (
                      <>
                        <span className="text-base">💾</span>
                        <span>Salvar</span>
                      </>
                    ) : (
                      <>
                        <span className="text-base">🌱</span>
                        <span>{isMobile ? 'Adicionar' : 'Adicionar Jardim'}</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};