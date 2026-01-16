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

  const plantTypes = [
    { value: 'Hortaliça', label: '🥬 Hortaliça' },
    { value: 'Fruta', label: '🍓 Fruta' },
    { value: 'Erva Aromática', label: '🌿 Erva Aromática' },
    { value: 'Legume', label: '🥕 Legume' },
    { value: 'Flor', label: '🌺 Flor' },
    { value: 'Outro', label: '🌱 Outro' }
  ];

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header Gradiente */}
        <div className="flex-shrink-0 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white p-8">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-2xl mr-4">
                <span className="text-2xl">🌱</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">
                  {editingPlant ? 'Editar Planta' : 'Adicionar Nova Planta'}
                </h3>
                <p className="text-emerald-100 mt-1 font-medium">
                  {editingPlant && hasPreviousAnalysis ? 
                    'Análise anterior carregada - pode reanalisar se quiser' : 
                    'Análise com IA Gemini para cultivo otimizado'}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white text-2xl bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-200"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            {/* Seção de Informações Básicas */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Informações da Planta
                </h4>
                {editingPlant && hasPreviousAnalysis && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Análise anterior disponível
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campo Nome */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="inline-flex items-center">
                      <span className="text-lg mr-2">🌿</span>
                      Nome da Planta
                      <span className="text-red-500 ml-1">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
                    placeholder="Ex: Tomate Cereja, Alface Crespa, Crauá..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Digite o nome comum ou científico da planta
                  </p>
                </div>

                {/* Campo Tipo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="inline-flex items-center">
                      <span className="text-lg mr-2">🏷️</span>
                      Tipo de Planta
                      <span className="text-red-500 ml-1">*</span>
                    </span>
                  </label>
                  <select
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="" className="text-gray-400">Selecione uma categoria...</option>
                    {plantTypes.map(plantType => (
                      <option 
                        key={plantType.value} 
                        value={plantType.value}
                        className="py-2"
                      >
                        {plantType.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">
                    Escolha a categoria principal da planta
                  </p>
                </div>
              </div>

              {/* Campo Data */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <span className="inline-flex items-center">
                    <span className="text-lg mr-2">📅</span>
                    Data de Plantio
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <div className="relative max-w-md">
                  <input
                    type="date"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📆
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Data em que a planta foi ou será cultivada
                </p>
              </div>
            </div>

            {/* Botão de Análise IA */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800">
                  Análise com Inteligência Artificial
                </h4>
                {hasPreviousAnalysis && !showAnalysis && (
                  <button
                    onClick={() => {
                      if (analysis) {
                        setShowAnalysis(!showAnalysis);
                      }
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showAnalysis ? 'Ocultar análise' : 'Mostrar análise anterior'}
                  </button>
                )}
              </div>

              <button
                onClick={handleAnalyzePlant}
                disabled={isAnalyzing || !name || !type || !date}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-5 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center group"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <div className="text-left">
                      <span className="block font-bold text-lg">Analisando...</span>
                      <span className="block text-sm font-normal text-indigo-100">Consultando IA Gemini</span>
                    </div>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-xl">
                        {hasPreviousAnalysis ? 'REANALISAR COM IA' : 'ANALISAR COM IA'}
                      </span>
                      <span className="block text-sm font-normal text-indigo-100">
                        {hasPreviousAnalysis ? 'Atualizar informações da planta' : 'Previsão de colheita e cuidados'}
                      </span>
                    </div>
                    <div className="ml-auto bg-white/20 p-2 rounded-lg">
                      <span className="text-lg">⚡</span>
                    </div>
                  </span>
                )}
              </button>

              {hasPreviousAnalysis && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  💡 Já existe uma análise anterior. Clique em "Reanalisar" para atualizar.
                </p>
              )}
            </div>

            {/* Mensagem de Erro */}
            {analysisError && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <span className="text-amber-600 text-lg">⚠️</span>
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">Análise Local</p>
                    <p className="text-sm text-amber-700">{analysisError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resultado da Análise (nova ou anterior) */}
            {(showAnalysis && analysis) && (
              <div className="space-y-6 animate-slide-up pt-4">
                {/* Cabeçalho da Análise */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl ${hasPreviousAnalysis ? 'bg-blue-500' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
                      <span className="text-2xl text-white">📊</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">
                        {hasPreviousAnalysis ? 'Análise Anterior' : 'Análise Inteligente'}
                      </h4>
                      <p className="text-gray-600">
                        {hasPreviousAnalysis ? 
                          `Informações salvas para ${name}` : 
                          `Recomendações personalizadas para ${name}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${hasPreviousAnalysis ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <span className={`text-sm font-medium ${hasPreviousAnalysis ? 'text-blue-600' : 'text-green-600'}`}>
                      {hasPreviousAnalysis ? 'Salva anteriormente' : 'IA Ativa'}
                    </span>
                  </div>
                </div>

                {/* Tempo de Colheita - Card Principal */}
                <div className={`border rounded-2xl p-6 shadow-sm ${hasPreviousAnalysis ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${hasPreviousAnalysis ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                        <span className={`text-xl ${hasPreviousAnalysis ? 'text-blue-600' : 'text-emerald-600'}`}>⏰</span>
                      </div>
                      <div>
                        <h5 className={`font-semibold ${hasPreviousAnalysis ? 'text-blue-800' : 'text-emerald-800'}`}>
                          Tempo Estimado para Colheita
                        </h5>
                        <p className={`text-sm ${hasPreviousAnalysis ? 'text-blue-600' : 'text-emerald-600'}`}>
                          {hasPreviousAnalysis ? 'Informação salva anteriormente' : 'Baseado em condições ideais'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-2">
                    <p className={`text-4xl font-bold mb-2 ${hasPreviousAnalysis ? 'text-blue-700' : 'text-emerald-700'}`}>
                      {analysis.harvestTime}
                    </p>
                    <p className={`text-sm ${hasPreviousAnalysis ? 'text-blue-600' : 'text-emerald-600'}`}>
                      {analysis.season?.join(', ') || 'Consulte as estações adequadas'}
                    </p>
                  </div>
                </div>

                {/* Estágios de Crescimento */}
                {analysis.growthStages && analysis.growthStages.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-0.5 ${hasPreviousAnalysis ? 'bg-blue-300' : 'bg-green-300'}`}></div>
                      <h5 className="font-semibold text-gray-700">
                        Fases de Desenvolvimento
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {analysis.growthStages.map((stage, index) => (
                        <div 
                          key={index} 
                          className={`bg-white border rounded-xl p-5 hover:shadow-lg transition-all duration-300 group ${hasPreviousAnalysis ? 'border-blue-200' : 'border-gray-200'}`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className={`${hasPreviousAnalysis ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} w-8 h-8 rounded-full flex items-center justify-center font-bold`}>
                                  {index + 1}
                                </div>
                                <span className="font-semibold text-gray-800">
                                  {stage.stage}
                                </span>
                              </div>
                              <div className="bg-gray-50 inline-flex items-center px-3 py-1 rounded-full">
                                <span className="text-sm font-medium text-gray-600">
                                  {stage.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {stage.tips.map((tip, tipIndex) => (
                              <div 
                                key={tipIndex} 
                                className="flex items-start space-x-3 group-hover:translate-x-1 transition-transform"
                              >
                                <div className={`${hasPreviousAnalysis ? 'bg-blue-50' : 'bg-green-50'} p-1.5 rounded-lg mt-0.5`}>
                                  <span className={`text-sm ${hasPreviousAnalysis ? 'text-blue-500' : 'text-green-500'}`}>✓</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                                  {tip}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dicas de Cuidado */}
                {analysis.careTips && analysis.careTips.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-0.5 ${hasPreviousAnalysis ? 'bg-blue-300' : 'bg-blue-300'}`}></div>
                      <h5 className="font-semibold text-gray-700">
                        Dicas Essenciais de Cuidado
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.careTips.map((tip, index) => (
                        <div 
                          key={index} 
                          className={`border rounded-xl p-4 hover:shadow-md transition-all ${hasPreviousAnalysis ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'}`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${hasPreviousAnalysis ? 'bg-blue-100' : 'bg-blue-100'}`}>
                              <span className={`${hasPreviousAnalysis ? 'text-blue-600' : 'text-blue-600'}`}>💡</span>
                            </div>
                            <p className="text-sm text-gray-800 font-medium leading-relaxed">
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
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-0.5 bg-red-300"></div>
                      <h5 className="font-semibold text-gray-700">
                        Problemas Comuns e Soluções
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysis.commonIssues.map((issue, index) => (
                        <div 
                          key={index} 
                          className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-4 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="bg-red-100 p-2 rounded-lg">
                              <span className="text-red-600">⚠️</span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-800 font-medium">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Estimativa de Produção */}
                  {analysis.estimatedYield && analysis.estimatedYield !== 'Varia conforme cuidados' && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5">
                      <div className="flex items-center space-x-4">
                        <div className="bg-amber-100 p-3 rounded-xl">
                          <span className="text-amber-600 text-xl">📈</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-amber-800 mb-1">
                            Estimativa de Produção
                          </h5>
                          <p className="text-amber-700 font-medium">
                            {analysis.estimatedYield}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Exposição Solar */}
                  {analysis.sunExposure && analysis.sunExposure !== 'Verifique análise anterior' && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <span className="text-blue-600 text-xl">☀️</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-blue-800 mb-1">
                            Necessidade de Sol
                          </h5>
                          <p className="text-blue-700 font-medium">
                            {analysis.sunExposure}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nota sobre análise anterior */}
                {hasPreviousAnalysis && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <span className="text-blue-600">💾</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Esta é uma análise salva anteriormente
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Clique em "REANALISAR COM IA" para obter informações atualizadas.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botões de Ação */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex space-x-4">
                <button 
                  onClick={handleClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg border border-gray-200 active:scale-95"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!name || !type || !date}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                >
                  <span className="flex items-center justify-center space-x-2">
                    {editingPlant ? (
                      <>
                        <span>💾</span>
                        <span>Salvar Alterações</span>
                      </>
                    ) : (
                      <>
                        <span>🌱</span>
                        <span>Adicionar ao Meu Jardim</span>
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