import React, { useState } from 'react';

interface Plant {
  id: string;
  name: string;
  type: string;
  plantingDate: string;
  formattedDate: string;
  notes?: string;
}

interface PlantsListProps {
  plants: Plant[];
  onEditPlant: (plant: Plant) => void;
  onRemovePlant: (id: string) => void;
  showAll?: boolean;
}

export const PlantsList: React.FC<PlantsListProps> = ({
  plants,
  onEditPlant,
  onRemovePlant,
  showAll = false
}) => {
  const [selectedPlantForReport, setSelectedPlantForReport] = useState<Plant | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const displayedPlants = showAll ? plants : plants.slice(0, 2);

  if (plants.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <span className="text-2xl sm:text-3xl">🌱</span>
        </div>
        <h3 className="text-gray-800 font-bold text-base sm:text-lg mb-1.5 sm:mb-2">Nenhuma planta cadastrada</h3>
        <p className="text-gray-600 text-sm sm:text-base">Adicione sua primeira planta para começar seu jardim!</p>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Hortaliça': return 'bg-green-100 text-green-800';
      case 'Fruta': return 'bg-red-100 text-red-800';
      case 'Erva Aromática': return 'bg-purple-100 text-purple-800';
      case 'Legume': return 'bg-orange-100 text-orange-800';
      case 'Flor': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generatePlantPDF = async (plant: Plant) => {
    setSelectedPlantForReport(plant);
    setIsGeneratingPDF(true);
    
    const notes = plant.notes || '';
    const hasIAReport = notes.includes('🤖 IA:');
    
    if (!hasIAReport) {
      alert('Esta planta não possui relatório da IA. Faça uma análise primeiro.');
      setIsGeneratingPDF(false);
      return;
    }

    try {
      const harvestMatch = notes.match(/Colheita em ([^\.]+)/);
      const harvestTime = harvestMatch ? harvestMatch[1].trim() : 'Não especificado';
      
      const tipsMatch = notes.match(/IA:.*? - (.*)/);
      const tips = tipsMatch ? tipsMatch[1] : 'Informações não disponíveis';
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Relatório IA - ${plant.name}</title>
          <style>
            @page { margin: 10mm 5mm; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 10px 15px; 
              color: #1f2937;
              line-height: 1.5;
              font-size: 12px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 15px;
              border-bottom: 2px solid #10b981;
              padding-bottom: 10px;
            }
            .logo { font-size: 32px; color: #10b981; margin-bottom: 5px; }
            .title { 
              font-size: 16px; 
              font-weight: bold; 
              color: #111827; 
              margin: 5px 0 3px 0;
            }
            .subtitle { 
              font-size: 10px; 
              color: #6b7280; 
              font-weight: 500;
            }
            .section { 
              margin-bottom: 15px; 
              page-break-inside: avoid;
            }
            .section-title { 
              font-size: 12px; 
              font-weight: 600; 
              color: #111827; 
              margin-bottom: 8px;
              padding-bottom: 5px;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 8px;
              margin-bottom: 15px;
            }
            .info-card {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              padding: 8px;
            }
            .info-label {
              font-size: 9px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 3px;
              letter-spacing: 0.3px;
            }
            .info-value {
              font-size: 10px;
              font-weight: 500;
              color: #111827;
            }
            .highlight-box {
              background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
              border: 1px solid #c7d2fe;
              border-radius: 8px;
              padding: 12px;
              margin: 15px 0;
            }
            .highlight-title {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 11px;
              font-weight: 600;
              color: #3730a3;
              margin-bottom: 6px;
            }
            .harvest-time {
              font-size: 16px;
              font-weight: bold;
              color: #059669;
              text-align: center;
              margin: 8px 0;
            }
            .ai-content {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 12px;
              margin: 15px 0;
            }
            .tips-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 6px;
              margin-top: 10px;
            }
            .tip-item {
              background: #ecfdf5;
              border: 1px solid #a7f3d0;
              border-radius: 4px;
              padding: 6px;
              font-size: 9px;
              color: #065f46;
            }
            .footer {
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 9px;
              color: #6b7280;
            }
            .watermark {
              position: fixed;
              bottom: 10px;
              right: 10px;
              opacity: 0.1;
              font-size: 32px;
              color: #10b981;
            }
            @media print {
              body { margin: 0; padding: 5mm; }
              .no-print { display: none; }
            }
            @media (max-width: 640px) {
              body { padding: 8px; font-size: 11px; }
              .info-grid { grid-template-columns: 1fr; }
              .tips-grid { grid-template-columns: 1fr; }
            }
          </style>
        </head>
        <body>
          <div class="watermark">🌱</div>
          
          <div class="header">
            <div class="logo">🌿</div>
            <h1 class="title">RELATÓRIO DE ANÁLISE DA IA</h1>
            <div class="subtitle">Jardim Inteligente com Google Gemini AI</div>
          </div>
          
          <div class="section">
            <h2 class="section-title">📋 INFORMAÇÕES DA PLANTA</h2>
            <div class="info-grid">
              <div class="info-card">
                <div class="info-label">Nome da Planta</div>
                <div class="info-value">${plant.name}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Tipo</div>
                <div class="info-value">${plant.type}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Data de Plantio</div>
                <div class="info-value">${plant.formattedDate}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Data de Cadastro</div>
                <div class="info-value">${plant.plantingDate}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">🤖 ANÁLISE DA INTELIGÊNCIA ARTIFICIAL</h2>
            
            <div class="highlight-box">
              <div class="highlight-title">
                <span>⏰</span>
                <span>TEMPO ESTIMADO PARA COLHEITA</span>
              </div>
              <div class="harvest-time">${harvestTime}</div>
            </div>
            
            <div class="ai-content">
              <div style="font-weight: 600; color: #4f46e5; margin-bottom: 8px; display: flex; align-items: center; gap: 5px;">
                <span>💡</span>
                <span>RECOMENDAÇÕES E CUIDADOS</span>
              </div>
              <div style="color: #374151; line-height: 1.6; font-size: 11px;">
                ${tips.replace(/\. /g, '.<br><br>')}
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">🌱 DICAS GERAIS DE CULTIVO</h2>
            <div class="tips-grid">
              <div class="tip-item">• Monitore o crescimento regularmente</div>
              <div class="tip-item">• Ajuste a rega conforme a estação</div>
              <div class="tip-item">• Observe sinais de pragas ou doenças</div>
              <div class="tip-item">• Mantenha o solo bem drenado</div>
              <div class="tip-item">• Forneça luz solar adequada</div>
              <div class="tip-item">• Consulte especialistas se necessário</div>
            </div>
          </div>
          
          <div class="footer">
            <div style="margin-bottom: 10px;">
              <div style="font-weight: 600; color: #111827; margin-bottom: 3px; font-size: 10px;">
                Gerado pelo Jardim Inteligente
              </div>
              <div style="font-size: 9px;">
                ${new Date().toLocaleDateString('pt-BR', { 
                  day: '2-digit',
                  month: 'short', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <div style="font-size: 8px; color: #9ca3af; max-width: 300px; margin: 0 auto; line-height: 1.4;">
              Este relatório foi gerado automaticamente pela análise da IA Google Gemini. 
              As informações são baseadas em dados agrícolas e podem variar conforme condições locais.
            </div>
          </div>

          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              font-weight: 600;
              cursor: pointer;
              margin: 5px;
              font-size: 12px;
            ">
              🖨️ Imprimir PDF
            </button>
            <button onclick="window.close()" style="
              background: #6b7280;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              font-weight: 600;
              cursor: pointer;
              margin: 5px;
              font-size: 12px;
            ">
              ✕ Fechar
            </button>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Não foi possível abrir a janela de impressão. Verifique os bloqueadores de pop-up.');
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      printWindow.onload = () => {
        setIsGeneratingPDF(false);
        setSelectedPlantForReport(null);
        printWindow.focus();
        printWindow.document.title = `Relatório IA - ${plant.name}`;
        alert('PDF pronto para impressão! Na janela aberta, clique em "Imprimir PDF" e selecione "Salvar como PDF" nas opções da impressora.');
      };

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente ou verifique os bloqueadores de pop-up.');
      setIsGeneratingPDF(false);
    }
  };

  // Componente de Card de Planta otimizado para mobile
  const PlantCard = ({ plant, showReportButton = true }: { 
    plant: Plant; 
    showReportButton?: boolean;
  }) => (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-green-200 transition-colors shadow-sm p-3 sm:p-4 mb-3 sm:mb-0">
      {/* Cabeçalho da Planta - Layout flex responsivo */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
          {/* Ícone */}
          <div className="flex-shrink-0 p-1.5 sm:p-2.5 rounded-md sm:rounded-lg bg-green-50">
            <span className="text-base sm:text-lg">
              {plant.type === 'Hortaliça' ? '🥬' :
               plant.type === 'Fruta' ? '🍓' :
               plant.type === 'Erva Aromática' ? '🌿' :
               plant.type === 'Legume' ? '🥕' :
               plant.type === 'Flor' ? '🌺' : '🌱'}
            </span>
          </div>
          
          {/* Informações da Planta */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">
              {plant.name}
            </h4>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
              <span className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-green-100 text-green-800">
                {plant.type}
              </span>
              <span className="text-gray-400 hidden xs:inline">•</span>
              <span className="text-xs text-gray-500">
                {plant.formattedDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notas da IA - Ocultar texto longo em mobile */}
      {plant.notes && (
        <div className="mb-3 p-2.5 sm:p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
          <div className="flex items-start space-x-2">
            <span className="text-purple-500 mt-0.5 text-sm flex-shrink-0">🤖</span>
            <p className="text-xs sm:text-sm text-gray-700 flex-1 line-clamp-2">
              {plant.notes}
            </p>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
              Análise IA disponível
            </span>
          </div>
        </div>
      )}

      {/* Botões de Ação - Layout responsivo */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
        {/* Botão Relatório PDF - ocupa linha inteira em mobile pequeno */}
        {showReportButton && (
          <button 
            onClick={() => generatePlantPDF(plant)}
            disabled={isGeneratingPDF}
            className={`
              col-span-1 xs:col-span-1
              bg-gradient-to-r from-purple-500 to-indigo-500 
              hover:from-purple-600 hover:to-indigo-600 
              text-white transition-all 
              font-medium flex items-center justify-center 
              text-xs sm:text-sm 
              py-2 sm:py-2.5 px-2 sm:px-3
              rounded-md sm:rounded-lg
              ${isGeneratingPDF ? 'opacity-70 cursor-not-allowed' : ''}
              shadow-sm hover:shadow-md
              min-h-[40px] sm:min-h-[44px]
            `}
          >
            {isGeneratingPDF && selectedPlantForReport?.id === plant.id ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-white border-t-transparent mr-1.5 sm:mr-2"></div>
                <span className="hidden xs:inline">Gerando...</span>
                <span className="xs:hidden">Processando</span>
              </span>
            ) : (
              <>
                <span className="mr-1.5 sm:mr-2 text-xs sm:text-sm">📄</span>
                <span className="truncate text-xs sm:text-sm">Relatório PDF</span>
              </>
            )}
          </button>
        )}
        
        {/* Botão Editar */}
        <button 
          onClick={() => onEditPlant(plant)}
          className="
            col-span-1 xs:col-span-1
            bg-blue-50 hover:bg-blue-100 
            text-blue-700 transition-all 
            font-medium flex items-center justify-center 
            text-xs sm:text-sm 
            py-2 sm:py-2.5 px-2 sm:px-3
            rounded-md sm:rounded-lg
            shadow-sm hover:shadow-md
            min-h-[40px] sm:min-h-[44px]
          "
        >
          <span className="mr-1.5 sm:mr-2 text-xs sm:text-sm">✏️</span>
          <span className="truncate text-xs sm:text-sm">Editar</span>
        </button>
        
        {/* Botão Remover */}
        <button 
          onClick={() => onRemovePlant(plant.id)}
          className="
            col-span-1 xs:col-span-1
            bg-red-50 hover:bg-red-100 
            text-red-700 transition-all 
            font-medium flex items-center justify-center 
            text-xs sm:text-sm 
            py-2 sm:py-2.5 px-2 sm:px-3
            rounded-md sm:rounded-lg
            shadow-sm hover:shadow-md
            min-h-[40px] sm:min-h-[44px]
          "
        >
          <span className="mr-1.5 sm:mr-2 text-xs sm:text-sm">🗑️</span>
          <span className="truncate text-xs sm:text-sm">Remover</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Cabeçalho - SOMENTE SE NÃO FOR SHOW ALL */}
        {!showAll && (
          <div className="flex justify-between items-center px-1">
            
          </div>
        )}

        {/* Lista de Plantas */}
        <div className="space-y-3 sm:space-y-4">
          {displayedPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} showReportButton={true} />
          ))}
        </div>

        {/* Mensagem quando não está mostrando todas */}
        {!showAll && plants.length <= 2 && plants.length > 0 && (
          <div className="text-center py-3 sm:py-4">
            <p className="text-xs sm:text-sm text-gray-600">
              Mostrando todas as {plants.length} {plants.length === 1 ? 'planta' : 'plantas'} do seu jardim
            </p>
          </div>
        )}

        {/* Resumo do Jardim - SOMENTE SE NÃO FOR SHOW ALL */}
        {!showAll && plants.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-200 mt-3 sm:mt-4">
            <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-xs sm:text-sm">
              <span className="text-emerald-600 mr-1.5 sm:mr-2">📊</span>
              Resumo do Jardim
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              <div className="text-center bg-white rounded-md sm:rounded-lg p-1.5 sm:p-2 shadow-sm">
                <p className="text-lg sm:text-xl font-bold text-gray-800">{plants.length}</p>
                <p className="text-xs text-gray-600 mt-0.5">Total</p>
              </div>
              
              <div className="text-center bg-white rounded-md sm:rounded-lg p-1.5 sm:p-2 shadow-sm">
                <p className="text-lg sm:text-xl font-bold text-green-600">
                  {plants.filter(p => p.type === 'Hortaliça').length}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Hortaliças</p>
              </div>
              
              <div className="text-center bg-white rounded-md sm:rounded-lg p-1.5 sm:p-2 shadow-sm">
                <p className="text-lg sm:text-xl font-bold text-red-600">
                  {plants.filter(p => p.type === 'Fruta').length}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Frutas</p>
              </div>
              
              <div className="text-center bg-white rounded-md sm:rounded-lg p-1.5 sm:p-2 shadow-sm">
                <p className="text-lg sm:text-xl font-bold text-purple-600">
                  {plants.filter(p => p.type === 'Erva Aromática').length}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Ervas</p>
              </div>
            </div>
            
            {/* Informação sobre PDF */}
            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-md sm:rounded-lg border border-purple-200">
              <div className="flex items-start space-x-1.5 sm:space-x-2">
                <span className="text-purple-600 text-xs sm:text-sm flex-shrink-0">💡</span>
                <p className="text-xs text-purple-800">
                  Clique em <span className="font-semibold">"Relatório PDF"</span> para baixar análise completa
                </p>
              </div>
              <p className="text-xs text-purple-600 mt-1 text-[10px] sm:text-xs">
                🖨️ Será aberta nova aba para impressão. Selecione "Salvar como PDF".
              </p>
            </div>
          </div>
        )}

        {/* Estatísticas quando é showAll */}
        {showAll && (
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Distribuição por Tipo</h4>
            <div className="space-y-1.5 sm:space-y-2">
              {['Hortaliça', 'Fruta', 'Erva Aromática', 'Legume', 'Flor', 'Outro'].map((type) => {
                const count = plants.filter(p => p.type === type).length;
                if (count === 0) return null;
                
                const percentage = Math.round((count / plants.length) * 100);
                const typeColors = getTypeColor(type);
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0">
                      <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 ${typeColors.split(' ')[0]}`}></div>
                      <span className="text-xs sm:text-sm text-gray-700 truncate">{type}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 sm:space-x-2 ml-2">
                      <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-1 sm:h-1.5">
                        <div 
                          className={`h-1 sm:h-1.5 rounded-full ${typeColors.split(' ')[0]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-800 w-8 sm:w-10 text-right">
                        {count} ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE GERANDO PDF */}
      {isGeneratingPDF && selectedPlantForReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 max-w-xs sm:max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl text-purple-600">📄</span>
              </div>
              
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-3 sm:border-4 border-purple-500 border-t-transparent mx-auto mb-2 sm:mb-3"></div>
              
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-1.5">
                Preparando PDF...
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                Gerando relatório para<br/>
                <span className="font-semibold text-purple-700">{selectedPlantForReport.name}</span>
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md sm:rounded-lg p-2 sm:p-3">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <span className="font-semibold">Instruções:</span> Nova aba será aberta.<br/>
                  Clique <span className="font-bold">"Imprimir PDF"</span> e selecione<br/>
                  <span className="font-bold">"Salvar como PDF"</span>.
                </p>
              </div>
              
              <p className="text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-4">
                ⚠️ Se não abrir, verifique bloqueadores de pop-up.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};