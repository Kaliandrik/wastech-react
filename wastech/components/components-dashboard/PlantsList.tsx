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
  showAll?: boolean; // ✅ NOVO: prop para mostrar todas
}

export const PlantsList: React.FC<PlantsListProps> = ({
  plants,
  onEditPlant,
  onRemovePlant,
  showAll = false // ✅ PADRÃO: não mostra todas
}) => {
  const [selectedPlantForReport, setSelectedPlantForReport] = useState<Plant | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // ✅ AGORA USA A PROP showAll PARA DECIDIR
  const displayedPlants = showAll ? plants : plants.slice(0, 2);

  if (plants.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🌱</span>
        </div>
        <h3 className="text-gray-800 font-bold text-lg mb-2">Nenhuma planta cadastrada</h3>
        <p className="text-gray-600">Adicione sua primeira planta para começar seu jardim!</p>
      </div>
    );
  }

  // Função para obter cor baseada no tipo
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

  // Função para gerar PDF
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
          <title>Relatório IA - ${plant.name}</title>
          <style>
            @page { margin: 20mm; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              color: #1f2937;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              border-bottom: 3px solid #10b981;
              padding-bottom: 20px;
            }
            .logo { font-size: 48px; color: #10b981; margin-bottom: 10px; }
            .title { 
              font-size: 24px; 
              font-weight: bold; 
              color: #111827; 
              margin: 10px 0 5px 0;
            }
            .subtitle { 
              font-size: 14px; 
              color: #6b7280; 
              font-weight: 500;
            }
            .section { 
              margin-bottom: 25px; 
              page-break-inside: avoid;
            }
            .section-title { 
              font-size: 16px; 
              font-weight: 600; 
              color: #111827; 
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e5e7eb;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .info-card {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
            }
            .info-label {
              font-size: 11px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 5px;
              letter-spacing: 0.5px;
            }
            .info-value {
              font-size: 14px;
              font-weight: 500;
              color: #111827;
            }
            .highlight-box {
              background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
              border: 1px solid #c7d2fe;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
            }
            .highlight-title {
              display: flex;
              align-items: center;
              gap: 10px;
              font-size: 14px;
              font-weight: 600;
              color: #3730a3;
              margin-bottom: 10px;
            }
            .harvest-time {
              font-size: 20px;
              font-weight: bold;
              color: #059669;
              text-align: center;
              margin: 10px 0;
            }
            .ai-content {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .tips-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              margin-top: 15px;
            }
            .tip-item {
              background: #ecfdf5;
              border: 1px solid #a7f3d0;
              border-radius: 6px;
              padding: 10px;
              font-size: 12px;
              color: #065f46;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              font-size: 11px;
              color: #6b7280;
            }
            .watermark {
              position: fixed;
              bottom: 20px;
              right: 20px;
              opacity: 0.1;
              font-size: 48px;
              color: #10b981;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
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
              <div style="font-weight: 600; color: #4f46e5; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span>💡</span>
                <span>RECOMENDAÇÕES E CUIDADOS</span>
              </div>
              <div style="color: #374151; line-height: 1.8;">
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
            <div style="margin-bottom: 15px;">
              <div style="font-weight: 600; color: #111827; margin-bottom: 5px;">
                Gerado pelo Jardim Inteligente
              </div>
              <div>Relatório emitido em: ${new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</div>
            </div>
            
            <div style="font-size: 10px; color: #9ca3af; max-width: 400px; margin: 0 auto;">
              Este relatório foi gerado automaticamente pela análise da IA Google Gemini. 
              As informações são baseadas em dados agrícolas e podem variar conforme condições locais.
            </div>
          </div>

          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              margin: 10px;
            ">
              🖨️ Imprimir PDF
            </button>
            <button onclick="window.close()" style="
              background: #6b7280;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              margin: 10px;
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

  // Componente de Card de Planta (reutilizável)
  const PlantCard = ({ plant, isCompact = false, showReportButton = true }: { 
    plant: Plant; 
    isCompact?: boolean;
    showReportButton?: boolean;
  }) => (
    <div className={`bg-white rounded-xl border border-gray-200 hover:border-green-200 transition-colors shadow-sm ${isCompact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(plant.type).split(' ')[0]} bg-opacity-20`}>
            <span className="text-lg">
              {plant.type === 'Hortaliça' ? '🥬' :
               plant.type === 'Fruta' ? '🍓' :
               plant.type === 'Erva Aromática' ? '🌿' :
               plant.type === 'Legume' ? '🥕' :
               plant.type === 'Flor' ? '🌺' : '🌱'}
            </span>
          </div>
          <div>
            <h4 className={`font-bold text-gray-800 ${isCompact ? 'text-sm' : ''}`}>{plant.name}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(plant.type)}`}>
                {plant.type}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{plant.formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notas da IA */}
      {plant.notes && !isCompact && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
          <div className="flex items-start space-x-2">
            <span className="text-purple-500 mt-0.5">🤖</span>
            <p className="text-sm text-gray-700 flex-1 line-clamp-2">
              {plant.notes}
            </p>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              Análise da IA disponível
            </span>
          </div>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex space-x-2">
        {showReportButton && (
          <button 
            onClick={() => generatePlantPDF(plant)}
            disabled={isGeneratingPDF}
            className={`flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-colors font-medium flex items-center justify-center ${
              isCompact ? 'text-xs py-1.5 px-2 rounded' : 'text-sm py-2.5 px-3 rounded-lg'
            } ${isGeneratingPDF ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isGeneratingPDF && selectedPlantForReport?.id === plant.id ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Gerando...
              </span>
            ) : (
              <>
                <span className="mr-1">📄</span>
                Relatório PDF
              </>
            )}
          </button>
        )}
        
        <button 
          onClick={() => onEditPlant(plant)}
          className={`flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors font-medium flex items-center justify-center ${
            isCompact ? 'text-xs py-1.5 px-2 rounded' : 'text-sm py-2.5 px-3 rounded-lg'
          }`}
        >
          <span className="mr-1">✏️</span>
          Editar
        </button>
        
        <button 
          onClick={() => onRemovePlant(plant.id)}
          className={`flex-1 bg-red-50 hover:bg-red-100 text-red-700 transition-colors font-medium flex items-center justify-center ${
            isCompact ? 'text-xs py-1.5 px-2 rounded' : 'text-sm py-2.5 px-3 rounded-lg'
          }`}
        >
          <span className="mr-1">🗑️</span>
          Remover
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Cabeçalho - SOMENTE SE NÃO FOR SHOW ALL */}
        {!showAll && (
          <div className="flex justify-between items-center px-1">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Suas Plantas</h3>
              <p className="text-sm text-gray-600">
                {plants.length} {plants.length === 1 ? 'planta' : 'plantas'} cadastradas
              </p>
            </div>
          </div>
        )}

        {/* Lista de Plantas */}
        <div className="space-y-4">
          {displayedPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} showReportButton={true} />
          ))}
        </div>

        {/* Mensagem quando não está mostrando todas */}
        {!showAll && plants.length <= 2 && plants.length > 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">
              Mostrando todas as {plants.length} {plants.length === 1 ? 'planta' : 'plantas'} do seu jardim
            </p>
          </div>
        )}

        {/* Resumo do Jardim - SOMENTE SE NÃO FOR SHOW ALL */}
        {!showAll && plants.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200 mt-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="text-emerald-600 mr-2">📊</span>
              Resumo do Jardim
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <p className="text-2xl font-bold text-gray-800">{plants.length}</p>
                <p className="text-xs text-gray-600 mt-1">Total</p>
              </div>
              
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <p className="text-2xl font-bold text-green-600">
                  {plants.filter(p => p.type === 'Hortaliça').length}
                </p>
                <p className="text-xs text-gray-600 mt-1">Hortaliças</p>
              </div>
              
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <p className="text-2xl font-bold text-red-600">
                  {plants.filter(p => p.type === 'Fruta').length}
                </p>
                <p className="text-xs text-gray-600 mt-1">Frutas</p>
              </div>
              
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <p className="text-2xl font-bold text-purple-600">
                  {plants.filter(p => p.type === 'Erva Aromática').length}
                </p>
                <p className="text-xs text-gray-600 mt-1">Ervas</p>
              </div>
            </div>
            
            {/* Informação sobre PDF */}
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">💡</span>
                <p className="text-sm text-purple-800">
                  Clique em <span className="font-semibold">"Relatório PDF"</span> para baixar análise completa
                </p>
              </div>
              <p className="text-xs text-purple-600 mt-2">
                🖨️ Será aberta uma nova aba para impressão. Selecione "Salvar como PDF" na impressora.
              </p>
            </div>
          </div>
        )}

        {/* Estatísticas quando é showAll */}
        {showAll && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-4">Distribuição por Tipo</h4>
            <div className="space-y-3">
              {['Hortaliça', 'Fruta', 'Erva Aromática', 'Legume', 'Flor', 'Outro'].map((type) => {
                const count = plants.filter(p => p.type === type).length;
                if (count === 0) return null;
                
                const percentage = Math.round((count / plants.length) * 100);
                const typeColors = getTypeColor(type);
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${typeColors.split(' ')[0]}`}></div>
                      <span className="text-sm text-gray-700">{type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${typeColors.split(' ')[0]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800 w-10 text-right">
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-purple-600">📄</span>
              </div>
              
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Preparando PDF...
              </h3>
              <p className="text-gray-600 mb-4">
                Gerando relatório para<br/>
                <span className="font-semibold text-purple-700">{selectedPlantForReport.name}</span>
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Instruções:</span> Uma nova aba será aberta.<br/>
                  Clique em <span className="font-bold">"Imprimir PDF"</span> e selecione<br/>
                  <span className="font-bold">"Salvar como PDF"</span> nas opções da impressora.
                </p>
              </div>
              
              <p className="text-xs text-gray-500 mt-6">
                ⚠️ Se uma nova aba não abrir, verifique os bloqueadores de pop-up.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};