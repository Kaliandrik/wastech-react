// wastech/pages/CrauaPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/components-dashboard/Header';
import { Navbar } from '../components/components-dashboard/Navbar';

const CrauaPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generateCultivationGuidePDF = () => {
    setIsGeneratingPDF(true);
    
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Guia de Cultivo - Crauá (Neoglaziovia variegata)</title>
          <style>
            @page { 
              margin: 15mm;
              @bottom-left {
                content: "Guia de Cultivo - Crauá";
                font-size: 10px;
                color: #666;
              }
              @bottom-right {
                content: "Página " counter(page) " de " counter(pages);
                font-size: 10px;
                color: #666;
              }
            }
            
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              color: #1f2937;
              line-height: 1.6;
              background: #fff;
            }
            
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              border-bottom: 3px solid #f59e0b;
              padding-bottom: 20px;
              page-break-after: avoid;
            }
            
            .logo { 
              font-size: 48px; 
              color: #f59e0b; 
              margin-bottom: 10px;
            }
            
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
              font-size: 18px; 
              font-weight: 700; 
              color: #92400e; 
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #fbbf24;
              background: linear-gradient(90deg, #fed7aa, transparent);
              padding: 10px 15px;
              border-radius: 5px;
            }
            
            .section-subtitle {
              font-size: 16px;
              font-weight: 600;
              color: #b45309;
              margin: 15px 0 10px 0;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            
            .info-card {
              background: #fffbeb;
              border: 1px solid #fbbf24;
              border-radius: 8px;
              padding: 15px;
              page-break-inside: avoid;
            }
            
            .info-label {
              font-size: 11px;
              color: #b45309;
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
              background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
              border: 1px solid #f59e0b;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
              page-break-inside: avoid;
            }
            
            .highlight-title {
              display: flex;
              align-items: center;
              gap: 10px;
              font-size: 14px;
              font-weight: 600;
              color: #92400e;
              margin-bottom: 10px;
            }
            
            .warning-box {
              background: #fef3c7;
              border: 2px solid #f59e0b;
              border-radius: 8px;
              padding: 15px;
              margin: 15px 0;
              page-break-inside: avoid;
            }
            
            .warning-title {
              font-weight: 600;
              color: #92400e;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .tip-box {
              background: #ecfdf5;
              border: 1px solid #a7f3d0;
              border-radius: 8px;
              padding: 15px;
              margin: 10px 0;
              page-break-inside: avoid;
            }
            
            .tip-title {
              font-weight: 600;
              color: #065f46;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .timeline {
              position: relative;
              padding-left: 20px;
              margin: 20px 0;
            }
            
            .timeline::before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 3px;
              background: #f59e0b;
            }
            
            .timeline-item {
              position: relative;
              margin-bottom: 20px;
              padding-left: 20px;
            }
            
            .timeline-item::before {
              content: '';
              position: absolute;
              left: -8px;
              top: 5px;
              width: 12px;
              height: 12px;
              background: #f59e0b;
              border-radius: 50%;
              border: 3px solid white;
            }
            
            .timeline-date {
              font-weight: 600;
              color: #92400e;
              margin-bottom: 5px;
            }
            
            .table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 12px;
            }
            
            .table th {
              background: #fed7aa;
              color: #92400e;
              font-weight: 600;
              text-align: left;
              padding: 10px;
              border: 1px solid #fbbf24;
            }
            
            .table td {
              padding: 10px;
              border: 1px solid #fbbf24;
              background: #fffbeb;
            }
            
            .products-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
              margin: 15px 0;
            }
            
            .product-item {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 6px;
              padding: 10px;
              text-align: center;
              font-size: 12px;
            }
            
            .product-emoji {
              font-size: 20px;
              margin-bottom: 5px;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              font-size: 11px;
              color: #6b7280;
              page-break-before: avoid;
            }
            
            .watermark {
              position: fixed;
              bottom: 20px;
              right: 20px;
              opacity: 0.05;
              font-size: 72px;
              color: #f59e0b;
              z-index: -1;
            }
            
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <div class="watermark">🌵</div>
          
          <div class="header">
            <div class="logo">🌵</div>
            <h1 class="title">GUIA COMPLETO DE CULTIVO</h1>
            <h2 class="subtitle">Crauá (Neoglaziovia variegata)</h2>
            <p style="color: #6b7280; font-size: 12px;">
              Planta fibrosa do Cerrado e Caatinga brasileiros
            </p>
          </div>
          
          <div class="section">
            <h2 class="section-title">📋 INFORMAÇÕES BÁSICAS</h2>
            <div class="info-grid">
              <div class="info-card">
                <div class="info-label">Nome Científico</div>
                <div class="info-value">Neoglaziovia variegata</div>
              </div>
              <div class="info-card">
                <div class="info-label">Família</div>
                <div class="info-value">Bromeliaceae</div>
              </div>
              <div class="info-card">
                <div class="info-label">Nomes Populares</div>
                <div class="info-value">Crauá, Caroá, Gravata, Caraguatá</div>
              </div>
              <div class="info-card">
                <div class="info-label">Origem</div>
                <div class="info-value">Brasil (Endêmica)</div>
              </div>
              <div class="info-card">
                <div class="info-label">Biomas Naturais</div>
                <div class="info-value">Cerrado e Caatinga</div>
              </div>
              <div class="info-card">
                <div class="info-label">Status de Conservação</div>
                <div class="info-value">Vulnerável (ameaçada)</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">🌿 CARACTERÍSTICAS DA PLANTA</h2>
            
            <div class="warning-box">
              <div class="warning-title">⚠️ ATENÇÃO: PLANTA XERÓFILA</div>
              <p style="color: #92400e; margin: 0;">
                O Crauá é adaptado a condições semiáridas. O excesso de água é a principal causa de morte da planta!
              </p>
            </div>
            
            <h3 class="section-subtitle">Morfologia</h3>
            <ul style="color: #374151; margin: 10px 0 20px 0; padding-left: 20px;">
              <li><strong>Porte:</strong> Planta terrestre ou rupícola</li>
              <li><strong>Forma:</strong> Roseta com folhas longas e rígidas</li>
              <li><strong>Altura:</strong> 0.5 - 1.5 metros</li>
              <li><strong>Folhas:</strong> Longas, fibrosas, em roseta (até 2m)</li>
              <li><strong>Flores:</strong> Vermelho-vivo, rosa ou púrpura</li>
              <li><strong>Ciclo:</strong> Perene, monocárpica (floresce uma vez)</li>
            </ul>
          </div>
          
          <div class="page-break"></div>
          
          <div class="section">
            <h2 class="section-title">🪴 CONDIÇÕES DE CULTIVO</h2>
            
            <div class="highlight-box">
              <div class="highlight-title">🌞 LUMINOSIDADE</div>
              <p style="font-size: 18px; font-weight: bold; color: #92400e; text-align: center; margin: 0;">
                SOL PLENO OBRIGATÓRIO<br/>
                (Mínimo 8 horas/dia)
              </p>
            </div>
            
            <table class="table">
              <thead>
                <tr>
                  <th>Fator</th>
                  <th>Recomendação</th>
                  <th>Importância</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>🌞 Luz Solar</strong></td>
                  <td>Sol pleno intenso</td>
                  <td>Fundamental para crescimento e qualidade das fibras</td>
                </tr>
                <tr>
                  <td><strong>💧 Água</strong></td>
                  <td>Muito baixa</td>
                  <td>Planta xerófila - tolera longas secas</td>
                </tr>
                <tr>
                  <td><strong>🪴 Solo</strong></td>
                  <td>Arenoso, pedregoso, pobre</td>
                  <td>Excelente drenagem é obrigatória</td>
                </tr>
                <tr>
                  <td><strong>🌡️ Temperatura</strong></td>
                  <td>20-35°C ideal</td>
                  <td>Não tolera geadas</td>
                </tr>
                <tr>
                  <td><strong>📏 Espaçamento</strong></td>
                  <td>1-1.5m entre plantas</td>
                  <td>Cresce em roseta larga</td>
                </tr>
              </tbody>
            </table>
            
            <div class="tip-box">
              <div class="tip-title">💡 DICA IMPORTANTE</div>
              <p style="margin: 0;">
                Solo muito fértil prejudica o crescimento do Crauá. Ele prefere solos pobres e 
                bem drenados, típicos do Cerrado.
              </p>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">⏳ CRONOGRAMA DE CULTIVO</h2>
            
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-date">FASE 1: Estabelecimento (0-12 meses)</div>
                <ul style="margin: 5px 0 0 0; padding-left: 15px;">
                  <li>Plantio de mudas (filhotes)</li>
                  <li>Rega moderada inicial (1x/semana)</li>
                  <li>Proteção contra ventos fortes</li>
                  <li>Desenvolvimento das raízes</li>
                </ul>
              </div>
              
              <div class="timeline-item">
                <div class="timeline-date">FASE 2: Crescimento (1-2 anos)</div>
                <ul style="margin: 5px 0 0 0; padding-left: 15px;">
                  <li>Formação completa da roseta</li>
                  <li>Redução gradual da rega</li>
                  <li>Resistência natural estabelecida</li>
                  <li>Produção de novos filhotes</li>
                </ul>
              </div>
              
              <div class="timeline-item">
                <div class="timeline-date">FASE 3: Maturação (2-3 anos)</div>
                <ul style="margin: 5px 0 0 0; padding-left: 15px;">
                  <li>Folhas prontas para colheita de fibras</li>
                  <li>Rega apenas em secas prolongadas</li>
                  <li>Planta totalmente adaptada</li>
                  <li>Pode florescer em condições ideais</li>
                </ul>
              </div>
              
              <div class="timeline-item">
                <div class="timeline-date">FASE 4: Colheita (3+ anos)</div>
                <ul style="margin: 5px 0 0 0; padding-left: 15px;">
                  <li>Colheita de folhas externas maduras</li>
                  <li>Processamento das fibras</li>
                  <li>Renovação natural da planta</li>
                  <li>Ciclo perene continua</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="page-break"></div>
          
          <div class="section">
            <h2 class="section-title">🚫 O QUE NÃO FAZER</h2>
            
            <div class="warning-box">
              <div class="warning-title">❌ ERROS COMUNS QUE MATAM O CRAUÁ</div>
              <ul style="color: #92400e; margin: 10px 0 0 0; padding-left: 20px;">
                <li><strong>Excesso de água</strong> - Principal causa de morte</li>
                <li><strong>Solo argiloso/úmido</strong> - Provoca podridão radicular</li>
                <li><strong>Sombra parcial</strong> - Prejudica crescimento e fibras</li>
                <li><strong>Fertilização excessiva</strong> - Solo pobre é melhor</li>
                <li><strong>Plantio muito próximo</strong> - Espaçamento mínimo 1m</li>
                <li><strong>Regar o centro da roseta</strong> - Provoca apodrecimento</li>
              </ul>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">🧵 PROCESSAMENTO DAS FIBRAS</h2>
            
            <h3 class="section-subtitle">Método Tradicional</h3>
            <ol style="color: #374151; margin: 10px 0 20px 0; padding-left: 20px;">
              <li><strong>Colheita:</strong> Folhas externas maduras (3+ anos)</li>
              <li><strong>Secagem:</strong> Ao sol por 7-15 dias</li>
              <li><strong>Maceração:</strong> Imersão em água por 10-20 dias</li>
              <li><strong>Batimento:</strong> Para separar as fibras</li>
              <li><strong>Lavagem:</strong> Remoção de resíduos</li>
              <li><strong>Secagem final:</strong> Fibras prontas para uso</li>
            </ol>
            
            <h3 class="section-subtitle">Produtos que Podem ser Feitos</h3>
            <div class="products-grid">
              <div class="product-item">
                <div class="product-emoji">🧺</div>
                Cestas e cestos
              </div>
              <div class="product-item">
                <div class="product-emoji">👟</div>
                Sandálias e chinelos
              </div>
              <div class="product-item">
                <div class="product-emoji">👜</div>
                Bolsas e sacolas
              </div>
              <div class="product-item">
                <div class="product-emoji">🎨</div>
                Arte e decoração
              </div>
              <div class="product-item">
                <div class="product-emoji">🏠</div>
                Materiais de construção
              </div>
              <div class="product-item">
                <div class="product-emoji">🧶</div>
                Fios e cordas
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">🌍 IMPORTÂNCIA ECOLÓGICA E SOCIAL</h2>
            
            <div class="info-card">
              <div class="info-label">Valor Ecológico</div>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Fixação de solo em áreas suscetíveis à erosão</li>
                <li>Habitat para fauna do Cerrado</li>
                <li>Resistente ao fogo (adaptação natural)</li>
                <li>Contribui para biodiversidade</li>
                <li>Planta nativa e endêmica do Brasil</li>
              </ul>
            </div>
            
            <div class="info-card" style="margin-top: 15px;">
              <div class="info-label">Valor Social e Econômico</div>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Fonte de renda para comunidades tradicionais</li>
                <li>Matéria-prima para artesanato sustentável</li>
                <li>Conhecimento tradicional preservado</li>
                <li>Turismo ecológico e cultural</li>
                <li>Produto com identidade brasileira</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <div style="margin-bottom: 15px;">
              <div style="font-weight: 600; color: #111827; margin-bottom: 5px;">
                Guia de Cultivo - Crauá (Neoglaziovia variegata)
              </div>
              <div>Documento gerado em: ${new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
              })}</div>
            </div>
            
            <div style="font-size: 10px; color: #9ca3af; max-width: 500px; margin: 0 auto;">
              🌵 Este guia foi desenvolvido com base em pesquisas botânicas e conhecimento tradicional 
              sobre o Crauá. As informações são para cultivo doméstico e conservação da espécie. 
              Consulte especialistas para projetos comerciais.
            </div>
            
            <div style="margin-top: 20px; font-size: 10px; color: #92400e;">
              <strong>Conserve o Cerrado brasileiro!</strong> Esta espécie é nativa e importante para nosso bioma.
            </div>
          </div>

          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              margin: 10px;
              font-size: 16px;
            ">
              🖨️ Imprimir / Salvar como PDF
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
              font-size: 16px;
            ">
              ✕ Fechar Janela
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
        printWindow.focus();
        printWindow.document.title = 'Guia de Cultivo - Crauá';
        
        // Mostra instruções após carregar
        setTimeout(() => {
          alert('Guia pronto! Na janela aberta, clique em "Imprimir / Salvar como PDF" e selecione "Salvar como PDF" nas opções da impressora.');
        }, 500);
      };

    } catch (error) {
      console.error('Erro ao gerar guia:', error);
      alert('Erro ao gerar guia. Verifique os bloqueadores de pop-up e tente novamente.');
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Header />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center md:text-left">
            <button
              onClick={() => navigate(-1)}
              className="mb-6 inline-flex items-center text-amber-100 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              Voltar para o Dashboard
            </button>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="block">Crauá</span>
              <span className="text-amber-200 text-3xl md:text-4xl font-normal">
                Neoglaziovia variegata
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 max-w-3xl">
              A planta fibrosa do Cerrado e Caatinga brasileiros
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" fill="currentColor" opacity="0.1"></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Facts */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                </div>
                Informações Rápidas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="text-sm text-amber-600 font-semibold mb-1">Nome Científico</div>
                  <div className="text-lg font-bold text-gray-800">Neoglaziovia variegata</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="text-sm text-amber-600 font-semibold mb-1">Família</div>
                  <div className="text-lg font-bold text-gray-800">Bromeliaceae</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="text-sm text-amber-600 font-semibold mb-1">Nomes Populares</div>
                  <div className="text-lg font-bold text-gray-800">Crauá, Caroá, Gravata, Caraguatá</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="text-sm text-amber-600 font-semibold mb-1">Origem</div>
                  <div className="text-lg font-bold text-gray-800">Brasil (Endêmica)</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                  </svg>
                </div>
                Descrição da Planta
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  O <strong>Crauá</strong> é uma espécie de bromélia terrestre nativa do Brasil, 
                  com ocorrência predominante nos biomas <strong>Cerrado</strong> e <strong>Caatinga</strong>. 
                  É conhecida popularmente também como <strong>Caroá</strong>, <strong>Gravata</strong>, 
                  <strong> Caraguatá</strong> ou <strong>Coroatá</strong>, dependendo da região do Brasil.
                </p>
                
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
                  <p className="text-amber-800 italic">
                    "Esta planta é especialmente valorizada por suas fibras têxteis de alta qualidade, 
                    utilizadas tradicionalmente pelas comunidades do Nordeste brasileiro."
                  </p>
                </div>
                
                <p className="leading-relaxed">
                  Pertence à família <strong>Bromeliaceae</strong>, mesma família do abacaxi, 
                  e se destaca por sua capacidade de sobreviver em condições semiáridas. 
                  Suas folhas longas e fibrosas são a matéria-prima para a produção de 
                  cordas, redes, cestos e outros artefatos artesanais.
                </p>
              </div>
            </div>

            {/* Characteristics */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                Características Morfológicas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">🌿 Estrutura</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-amber-100 rounded-full p-1 mr-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      </div>
                      <span><strong>Porte:</strong> Planta terrestre ou rupícola</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 rounded-full p-1 mr-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      </div>
                      <span><strong>Forma:</strong> Roseta com folhas longas e rígidas</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 rounded-full p-1 mr-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      </div>
                      <span><strong>Altura:</strong> 0.5 - 1.5 metros</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 rounded-full p-1 mr-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      </div>
                      <span><strong>Folhas:</strong> Longas, fibrosas, em roseta</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">🌸 Flores</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-amber-100 rounded-full p-1 mr-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      </div>
                      <span><strong>Cor:</strong> Vermelho-vivo, rosa ou púrpura</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 rounded-full p-1 mr-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      </div>
                      <span><strong>Forma:</strong> Tubular, típica de bromélias</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 rounded-full p-1 mr-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      </div>
                      <span><strong>Inflorescência:</strong> Terminal, em espiga</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 rounded-full p-1 mr-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      </div>
                      <span><strong>Polinização:</strong> Principalmente por beija-flores</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Habitat and Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                Habitat e Distribuição
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-amber-100 rounded-lg p-3 mr-4">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">🌵 Biomas Naturais</h3>
                    <p className="text-gray-700">
                      Ocorre naturalmente nos biomas <strong>Cerrado</strong> e <strong>Caatinga</strong>, 
                      em regiões de clima semiárido. É especialmente adaptada a solos pobres, 
                      pedregosos e com boa drenagem.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-amber-100 rounded-lg p-3 mr-4">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">📍 Distribuição Geográfica</h3>
                    <p className="text-gray-700">
                      Presente principalmente nos estados do <strong>Nordeste brasileiro</strong> 
                      (BA, CE, PI, MA) e <strong>Centro-Oeste</strong> (MT, GO). É uma espécie 
                      endêmica do Brasil, ou seja, não ocorre naturalmente em outros países.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Side Info */}
          <div className="space-y-8">
            {/* Cultivation Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"/>
                  </svg>
                </div>
                Cultivo
              </h3>
              
              <div className="space-y-3">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm text-green-600 font-semibold">🌞 Luminosidade</div>
                  <div className="font-medium">Sol pleno obrigatório (8+ horas/dia)</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm text-green-600 font-semibold">💧 Água</div>
                  <div className="font-medium">Muito baixa - planta xerófila</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm text-green-600 font-semibold">🪴 Solo</div>
                  <div className="font-medium">Arenoso, pedregoso, bem drenado</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm text-green-600 font-semibold">⏳ Crescimento</div>
                  <div className="font-medium">Lento - 2-3 anos para colheita</div>
                </div>
              </div>
              
              <button
                onClick={generateCultivationGuidePDF}
                disabled={isGeneratingPDF}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 rounded-lg mt-4 transition flex items-center justify-center"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Gerando Guia...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Baixar Guia Completo
                  </>
                )}
              </button>
            </div>

            {/* Uses Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
                  </svg>
                </div>
                Usos Tradicionais
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">🧵</span>
                  </div>
                  <div>
                    <div className="font-medium">Fibras têxteis</div>
                    <div className="text-sm text-gray-600">Cordas, redes, cestos</div>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">🏠</span>
                  </div>
                  <div>
                    <div className="font-medium">Construção</div>
                    <div className="text-sm text-gray-600">Telhados, vedações</div>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">🎨</span>
                  </div>
                  <div>
                    <div className="font-medium">Artesanato</div>
                    <div className="text-sm text-gray-600">Bolsas, tapetes, decoração</div>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">🌱</span>
                  </div>
                  <div>
                    <div className="font-medium">Paisagismo</div>
                    <div className="text-sm text-gray-600">Jardins secos e xerófilos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conservation Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                Status de Conservação
              </h3>
              
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800">Ameaçada</span>
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                    Vulnerável
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  A coleta excessiva e a destruição do habitat (Cerrado) estão 
                  ameaçando as populações naturais do Crauá.
                </p>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700 mb-2">Principais Ameaças:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                    Desmatamento do Cerrado
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                    Coleta predatória
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                    Expansão agrícola
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                    Queimadas frequentes
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              Adicionar ao Meu Jardim
            </button>

            <button className="w-full border border-amber-300 text-amber-600 hover:bg-amber-50 font-bold py-3 rounded-xl transition flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
              </svg>
              Compartilhar
            </button>
          </div>
        </div>

        {/* Detailed Information Sections */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ecological Importance */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
              <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
              </div>
              Importância Ecológica
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span>Fixação de solo em áreas suscetíveis à erosão</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span>Fornece habitat para pequenos animais</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span>Resistente ao fogo e secas prolongadas</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✓</span>
                <span>Contribui para a biodiversidade do Cerrado</span>
              </li>
            </ul>
          </div>

          {/* Economic Value */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-100">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
              Valor Econômico
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">💰</span>
                <span>Fonte de renda para comunidades tradicionais</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">🧵</span>
                <span>Matéria-prima para indústria têxtil artesanal</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">🌿</span>
                <span>Potencial para produtos sustentáveis</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">📈</span>
                <span>Mercado crescente para fibras naturais</span>
              </li>
            </ul>
          </div>

          {/* Interesting Facts */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
              </div>
              Curiosidades
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🔬</span>
                <span>Descrita cientificamente no século XIX</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">⏳</span>
                <span>Floresce apenas uma vez na vida</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🧶</span>
                <span>Fibras podem atingir 2 metros de comprimento</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🌍</span>
                <span>Espécie endêmica exclusiva do Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Quer cultivar o Crauá?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Esta planta é perfeita para jardins sustentáveis, xerófilos e para quem 
              deseja contribuir com a conservação das espécies nativas do Cerrado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition"
              >
                Adicionar ao Meu Jardim
              </button>
              <button
                onClick={generateCultivationGuidePDF}
                disabled={isGeneratingPDF}
                className="border border-amber-500 text-amber-500 hover:bg-amber-50 font-bold py-3 px-8 rounded-xl transition flex items-center justify-center"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent mr-2"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Baixar Guia de Cultivo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de carregamento */}
      {isGeneratingPDF && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-amber-600">📚</span>
              </div>
              
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Preparando Guia de Cultivo...
              </h3>
              <p className="text-gray-600 mb-4">
                Gerando PDF completo do Crauá<br/>
                <span className="font-semibold text-amber-700">Neoglaziovia variegata</span>
              </p>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Instruções:</span> Uma nova aba será aberta.<br/>
                  Clique em <span className="font-bold">"Imprimir / Salvar como PDF"</span> e selecione<br/>
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
    </div>
  );
};

export default CrauaPage;