export interface PlantAnalysis {
  harvestTime: string;
  growthStages: {
    stage: string;
    duration: string;
    tips: string[];
  }[];
  careTips: string[];
  commonIssues: string[];
  estimatedYield: string;
  exists: boolean;
  scientificName?: string;
  difficulty?: 'Iniciante' | 'Intermediário' | 'Avançado';
  season?: string[];
  waterNeeds?: string;
  sunExposure?: string;
  soilType?: string;
  spacing?: string;
  fertilization?: string;
  companionPlants?: string[];
  pests?: string[];
  diseases?: string[];
  pruning?: string;
  propagation?: string;
  harvestTips?: string[];
  storage?: string;
  nutritionalValue?: string;
}

export class GeminiAIService {
  private static readonly API_KEY = 'AIzaSyB7WmY3FAKFGsDwcS88NecdNTADgdJkqeM';
  private static readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';




  private static readonly PLANT_ALIASES: { [key: string]: string } = {
    
    'caroá': 'crauá',
    'caroá verdadeiro': 'crauá',
    'caroá de rede': 'crauá',
    'crauá de rede': 'crauá',
    'crauá verdadeiro': 'crauá',
    'neoglaziose': 'crauá',
    'neovlagiose': 'crauá',
    'neoglaziovia': 'crauá',
    'fibra de caroá': 'crauá',
    'fibra de crauá': 'crauá',
    'planta da fibra': 'crauá',
    'caroazeiro': 'crauá',
    'crauazeiro': 'crauá',
    'caruá': 'crauá',
    'gravata': 'crauá',
    'gravata de rede': 'crauá',
    'neoglaziovia variegata': 'crauá',
  };
  // Base de dados expandida com 200+ plantas com dados reais
  private static readonly PLANT_DATABASE: { [key: string]: any } = {
    // HORTALIÇAS FOLHOSAS (Dados reais)
    'alface': {
      scientific: 'Lactuca sativa',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno', 'Primavera'],
      harvestTime: '30-60 dias',
      water: 'Alta - manter solo úmido',
      sun: 'Meia-sombra a sol pleno',
      spacing: '25-30 cm entre plantas'
    },
    'alface crespa': {
      scientific: 'Lactuca sativa var. crispa',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno', 'Primavera'],
      harvestTime: '40-70 dias',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'alface americana': {
      scientific: 'Lactuca sativa var. capitata',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno', 'Primavera'],
      harvestTime: '55-80 dias',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'rucula': {
      scientific: 'Eruca sativa',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '20-40 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'espinafre': {
      scientific: 'Spinacia oleracea',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '40-50 dias',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'couve': {
      scientific: 'Brassica oleracea var. acephala',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '60-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'couve flor': {
      scientific: 'Brassica oleracea var. botrytis',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '70-100 dias',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'brócolis': {
      scientific: 'Brassica oleracea var. italica',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '60-90 dias',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'repolho': {
      scientific: 'Brassica oleracea var. capitata',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '80-120 dias',
      water: 'Alta',
      sun: 'Sol pleno'
    },

    // HORTALIÇAS FRUTO (Dados reais)
    'tomate': {
      scientific: 'Solanum lycopersicum',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '70-100 dias',
      water: 'Moderada a alta',
      sun: 'Sol pleno 6-8h'
    },
    'tomate cereja': {
      scientific: 'Solanum lycopersicum var. cerasiforme',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-80 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'pimentão': {
      scientific: 'Capsicum annuum',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '80-100 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'berinjela': {
      scientific: 'Solanum melongena',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '80-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'pepino': {
      scientific: 'Cucumis sativus',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '50-70 dias',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'abobrinha': {
      scientific: 'Cucurbita pepo',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '45-60 dias',
      water: 'Alta',
      sun: 'Sol pleno'
    },

    // RAÍZES E TUBÉRCULOS
    'cenoura': {
      scientific: 'Daucus carota subsp. sativus',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno', 'Primavera'],
      harvestTime: '70-100 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'beterraba': {
      scientific: 'Beta vulgaris subsp. vulgaris',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno', 'Primavera'],
      harvestTime: '55-70 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'rabanete': {
      scientific: 'Raphanus sativus',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '25-40 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'batata': {
      scientific: 'Solanum tuberosum',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'batata doce': {
      scientific: 'Ipomoea batatas',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '120-150 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // FRUTAS BRASILEIRAS (Dados reais)
    'maracujá': {
      scientific: 'Passiflora edulis',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '9-12 meses após plantio',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'limão': {
      scientific: 'Citrus × limon',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos para produção',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'laranja': {
      scientific: 'Citrus × sinensis',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '2-3 anos para produção',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'manga': {
      scientific: 'Mangifera indica',
      difficulty: 'Avançado',
      season: ['Verão'],
      harvestTime: '3-5 anos para produção',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'abacate': {
      scientific: 'Persea americana',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '3-4 anos para produção',
      water: 'Moderada a alta',
      sun: 'Sol pleno'
    },
    'abacaxi': {
      scientific: 'Ananas comosus',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '18-24 meses',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'banana': {
      scientific: 'Musa spp',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '12-18 meses',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'goiaba': {
      scientific: 'Psidium guajava',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // FRUTAS TEMPERADAS
    'maçã': {
      scientific: 'Malus domestica',
      difficulty: 'Avançado',
      season: ['Outono'],
      harvestTime: '2-4 anos para produção',
      water: 'Moderada',
      sun: 'Sol pleno 8h+'
    },
    'pêra': {
      scientific: 'Pyrus communis',
      difficulty: 'Avançado',
      season: ['Verão'],
      harvestTime: '3-5 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'pêssego': {
      scientific: 'Prunus persica',
      difficulty: 'Avançado',
      season: ['Verão'],
      harvestTime: '2-3 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'uva': {
      scientific: 'Vitis vinifera',
      difficulty: 'Avançado',
      season: ['Verão'],
      harvestTime: '2-3 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // FRUTAS VERMELHAS
    'morango': {
      scientific: 'Fragaria × ananassa',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno', 'Primavera'],
      harvestTime: '60-90 dias',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'amora': {
      scientific: 'Rubus spp',
      difficulty: 'Intermediário',
      season: ['Verão'],
      harvestTime: '1-2 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // ERVAS AROMÁTICAS
    'manjericão': {
      scientific: 'Ocimum basilicum',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '30-60 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'salsinha': {
      scientific: 'Petroselinum crispum',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '70-90 dias',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },
    'hortelã': {
      scientific: 'Mentha spp',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '60-90 dias',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'alecrim': {
      scientific: 'Salvia rosmarinus',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '90-120 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'orégano': {
      scientific: 'Origanum vulgare',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '80-100 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },

    // LEGUMINOSAS
    'feijão': {
      scientific: 'Phaseolus vulgaris',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'ervilha': {
      scientific: 'Pisum sativum',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '60-80 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // FLORES
    'girassol': {
      scientific: 'Helianthus annuus',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '70-100 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'rosa': {
      scientific: 'Rosa spp',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '60-90 dias para floração',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'orquídea': {
      scientific: 'Orchidaceae',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '1-2 anos para floração',
      water: 'Moderada',
      sun: 'Luz indireta'
    },

    // PLANTAS MEDICINAIS
    'boldo': {
      scientific: 'Plectranthus barbatus',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },
    'camomila': {
      scientific: 'Matricaria chamomilla',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // NOVAS ADIÇÕES - PLANTAS EXÓTICAS E ESPECIAIS
    'açafrão': {
      scientific: 'Crocus sativus',
      difficulty: 'Avançado',
      season: ['Outono'],
      harvestTime: '6-8 meses',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'alcaparra': {
      scientific: 'Capparis spinosa',
      difficulty: 'Avançado',
      season: ['Primavera', 'Verão'],
      harvestTime: '2-3 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'aspargo': {
      scientific: 'Asparagus officinalis',
      difficulty: 'Intermediário',
      season: ['Primavera'],
      harvestTime: '2-3 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'cevada': {
      scientific: 'Hordeum vulgare',
      difficulty: 'Intermediário',
      season: ['Inverno'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'chia': {
      scientific: 'Salvia hispanica',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '100-120 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'dente de leão': {
      scientific: 'Taraxacum officinale',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '60-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'ervilha de cheiro': {
      scientific: 'Lathyrus odoratus',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '70-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'funcho': {
      scientific: 'Foeniculum vulgare',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '80-100 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    
    'hibisco': {
      scientific: 'Hibiscus sabdariffa',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '120-150 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'jasmim': {
      scientific: 'Jasminum officinale',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '1-2 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'kiwi': {
      scientific: 'Actinidia deliciosa',
      difficulty: 'Avançado',
      season: ['Outono'],
      harvestTime: '3-4 anos',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'lavanda': {
      scientific: 'Lavandula angustifolia',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '1-2 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'mamão': {
      scientific: 'Carica papaya',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '9-12 meses',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'nêspera': {
      scientific: 'Eriobotrya japonica',
      difficulty: 'Intermediário',
      season: ['Primavera'],
      harvestTime: '2-3 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'pitaia': {
      scientific: 'Hylocereus undatus',
      difficulty: 'Intermediário',
      season: ['Verão'],
      harvestTime: '1-2 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'romã': {
      scientific: 'Punica granatum',
      difficulty: 'Intermediário',
      season: ['Outono'],
      harvestTime: '2-3 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'sálvia': {
      scientific: 'Salvia officinalis',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '80-100 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'trigo': {
      scientific: 'Triticum aestivum',
      difficulty: 'Intermediário',
      season: ['Inverno'],
      harvestTime: '120-150 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'urucum': {
      scientific: 'Bixa orellana',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'verbena': {
      scientific: 'Verbena officinalis',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'yam': {
      scientific: 'Dioscorea spp',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '8-10 meses',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'zingiber': {
      scientific: 'Zingiber officinale',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '8-10 meses',
      water: 'Alta',
      sun: 'Meia-sombra'
    },

    // PLANTAS DO CERRADO E NATIVAS BRASILEIRAS
    'crauá': {
      scientific: 'Neoglaziovia variegata',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos para fibras, 5-7 anos para pleno desenvolvimento',
      water: 'Baixa - resistente à seca',
      sun: 'Sol pleno',
      soil: 'Solo bem drenado, pedregoso, pobre em nutrientes',
      spacing: '1-1.5m entre plantas'
    },
    'neoglaziovia variegata': {
      scientific: 'Neoglaziovia variegata',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'mandacaru': {
      scientific: 'Cereus jamacaru',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos para floração',
      water: 'Muito baixa',
      sun: 'Sol pleno'
    },
    'pequi': {
      scientific: 'Caryocar brasiliense',
      difficulty: 'Avançado',
      season: ['Primavera', 'Verão'],
      harvestTime: '8-10 anos para produção',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'buriti': {
      scientific: 'Mauritia flexuosa',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '8-12 anos',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'açaí': {
      scientific: 'Euterpe oleracea',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '3-4 anos',
      water: 'Alta',
      sun: 'Meia-sombra a sol pleno'
    },
    'juçara': {
      scientific: 'Euterpe edulis',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '5-7 anos',
      water: 'Alta',
      sun: 'Sombra parcial'
    },
    'jatobá': {
      scientific: 'Hymenaea courbaril',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '10-15 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // PLANTAS FIBROSAS E TÊXTEIS
    'sisal': {
      scientific: 'Agave sisalana',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '3-4 anos para primeira colheita',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'algodão': {
      scientific: 'Gossypium hirsutum',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '150-180 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'linho': {
      scientific: 'Linum usitatissimum',
      difficulty: 'Intermediário',
      season: ['Inverno', 'Primavera'],
      harvestTime: '100-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'ramie': {
      scientific: 'Boehmeria nivea',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '60-90 dias por corte',
      water: 'Alta',
      sun: 'Sol pleno'
    },

    // PLANTAS ORNAMENTAIS ESPECIAIS
    'antúrio': {
      scientific: 'Anthurium andraeanum',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '1-2 anos para floração',
      water: 'Moderada',
      sun: 'Sombra parcial'
    },
    'costela de adão': {
      scientific: 'Monstera deliciosa',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos para frutificação',
      water: 'Moderada',
      sun: 'Sombra parcial'
    },
    'lírio da paz': {
      scientific: 'Spathiphyllum wallisii',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '1 ano para floração',
      water: 'Alta',
      sun: 'Sombra'
    },
    'samambaia': {
      scientific: 'Nephrolepis exaltata',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '6-12 meses para pleno desenvolvimento',
      water: 'Alta',
      sun: 'Sombra'
    },
    'palmeira rabo de peixe': {
      scientific: 'Caryota mitis',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '3-5 anos',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },

    // PLANTAS CARNÍVORAS BRASILEIRAS
    'drosera': {
      scientific: 'Drosera spp',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '1-2 anos para maturidade',
      water: 'Alta - solo sempre úmido',
      sun: 'Sol pleno a meia-sombra'
    },
    'nepenthes': {
      scientific: 'Nepenthes spp',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos para jarros',
      water: 'Alta umidade do ar',
      sun: 'Meia-sombra'
    },
    'sarracenia': {
      scientific: 'Sarracenia spp',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos',
      water: 'Muita água no prato',
      sun: 'Sol pleno'
    },

    // PLANTAS AQUÁTICAS E PALUSTRES
    'vitória régia': {
      scientific: 'Victoria amazonica',
      difficulty: 'Avançado',
      season: ['Primavera', 'Verão'],
      harvestTime: '2-3 anos',
      water: 'Aquática',
      sun: 'Sol pleno'
    },
    'aguapé': {
      scientific: 'Eichhornia crassipes',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '30-60 dias para cobertura',
      water: 'Aquática',
      sun: 'Sol pleno a meia-sombra'
    },
    'taboa': {
      scientific: 'Typha domingensis',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '1 ano',
      water: 'Pantanal/margens',
      sun: 'Sol pleno'
    },

    // PLANTAS DE SOMBRA ESPECIALIZADAS
    'filodendro': {
      scientific: 'Philodendron spp',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '1-2 anos',
      water: 'Moderada',
      sun: 'Sombra'
    },
    'cacto de natal': {
      scientific: 'Schlumbergera truncata',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '1-2 anos para floração',
      water: 'Moderada',
      sun: 'Luz indireta'
    },
    'bromélia': {
      scientific: 'Bromeliaceae',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '1-3 anos para floração',
      water: 'Moderada - no copo central',
      sun: 'Meia-sombra'
    },

    // PLANTAS AROMÁTICAS ESPECIAIS
    'patchouli': {
      scientific: 'Pogostemon cablin',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '6-8 meses',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'ylang ylang': {
      scientific: 'Cananga odorata',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos para floração',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'vetiver': {
      scientific: 'Chrysopogon zizanioides',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '12-18 meses',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // PLANTAS DE CLIMA DESÉRTICO
    'cacto saguaro': {
      scientific: 'Carnegiea gigantea',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '10-15 anos para floração',
      water: 'Muito baixa',
      sun: 'Sol pleno'
    },
    'rosa do deserto': {
      scientific: 'Adenium obesum',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '2-3 anos para floração',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'agave': {
      scientific: 'Agave americana',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '8-10 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },

    // PLANTAS TREPADEIRAS ESPECIAIS
    'maracujá do mato': {
      scientific: 'Passiflora caerulea',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '1-2 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'jiboia': {
      scientific: 'Epipremnum pinnatum',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '1-2 anos',
      water: 'Moderada',
      sun: 'Sombra a meia-sombra'
    },
    'hera': {
      scientific: 'Hedera helix',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '1-2 anos',
      water: 'Moderada',
      sun: 'Sombra'
    },

    // PLANTAS DE INTERIOR RESISTENTES
    'zamioculca': {
      scientific: 'Zamioculcas zamiifolia',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '1-2 anos',
      water: 'Baixa',
      sun: 'Sombra a meia-sombra'
    },
    'espada de são jorge': {
      scientific: 'Sansevieria trifasciata',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '1-2 anos',
      water: 'Baixa',
      sun: 'Sombra a sol pleno'
    },
    'clorofito': {
      scientific: 'Chlorophytum comosum',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '6-12 meses',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },

    // PLANTAS PARA BONSAI
    'ficus bonsai': {
      scientific: 'Ficus retusa',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '3-5 anos para forma',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'azaleia bonsai': {
      scientific: 'Rhododendron spp',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '2-4 anos',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'junipero bonsai': {
      scientific: 'Juniperus spp',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '5-10 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // PLANTAS COMESTÍVEIS EXÓTICAS
    'fisális': {
      scientific: 'Physalis peruviana',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '120-150 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'jabuticaba': {
      scientific: 'Plinia cauliflora',
      difficulty: 'Intermediário',
      season: ['Primavera'],
      harvestTime: '8-15 anos',
      water: 'Moderada a alta',
      sun: 'Sol pleno'
    },
    'pitanga': {
      scientific: 'Eugenia uniflora',
      difficulty: 'Intermediário',
      season: ['Verão'],
      harvestTime: '3-4 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'cajá': {
      scientific: 'Spondias mombin',
      difficulty: 'Intermediário',
      season: ['Verão'],
      harvestTime: '4-5 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // PLANTAS TINTORIAIS
  
    'indigofera': {
      scientific: 'Indigofera tinctoria',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '1 ano',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'curcuma': {
      scientific: 'Curcuma longa',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '8-10 meses',
      water: 'Alta',
      sun: 'Meia-sombra'
    },

    // PLANTAS PARA CHÁ E INFUSÕES
    'capim santo': {
      scientific: 'Cymbopogon citratus',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'erva cidreira': {
      scientific: 'Melissa officinalis',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '60-90 dias',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },
    'guaco': {
      scientific: 'Mikania glomerata',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '1 ano',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },

        // CEREAIS E GRÃOS (ESSENCIAIS)
    'milho': {
      scientific: 'Zea mays',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '80-120 dias',
      water: 'Moderada a alta',
      sun: 'Sol pleno'
    },
    'milho verde': {
      scientific: 'Zea mays',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '70-90 dias',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'arroz': {
      scientific: 'Oryza sativa',
      difficulty: 'Avançado',
      season: ['Verão'],
      harvestTime: '120-150 dias',
      water: 'Muito alta - plantio alagado',
      sun: 'Sol pleno'
    },
    'aveia': {
      scientific: 'Avena sativa',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'centeio': {
      scientific: 'Secale cereale',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '110-130 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'milheto': {
      scientific: 'Pennisetum glaucum',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-90 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'sorgo': {
      scientific: 'Sorghum bicolor',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '90-120 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },

    // LEGUMINOSAS DE GRÃO
    'feijão carioca': {
      scientific: 'Phaseolus vulgaris',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '70-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'feijão preto': {
      scientific: 'Phaseolus vulgaris',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '75-95 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'feijão de corda': {
      scientific: 'Vigna unguiculata',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-80 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'feijão fradinho': {
      scientific: 'Vigna unguiculata',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '65-85 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'grão de bico': {
      scientific: 'Cicer arietinum',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '100-120 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'lentilha': {
      scientific: 'Lens culinaris',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '110-130 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'soja': {
      scientific: 'Glycine max',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'amendoim': {
      scientific: 'Arachis hypogaea',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '100-130 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // HORTALIÇAS DE FRUTO ADICIONAIS
    'chuchu': {
      scientific: 'Sechium edule',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '90-120 dias',
      water: 'Alta',
      sun: 'Sol pleno a meia-sombra'
    },
    'maxixe': {
      scientific: 'Cucumis anguria',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '50-70 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'quiabo': {
      scientific: 'Abelmoschus esculentus',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-80 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'jiló': {
      scientific: 'Solanum aethiopicum',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '80-100 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'pimenta': {
      scientific: 'Capsicum spp',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '70-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'pimenta malagueta': {
      scientific: 'Capsicum frutescens',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '80-100 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'pimenta dedo de moça': {
      scientific: 'Capsicum baccatum',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '75-95 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'melancia': {
      scientific: 'Citrullus lanatus',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '80-100 dias',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'melão': {
      scientific: 'Cucumis melo',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '75-95 dias',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'moranga': {
      scientific: 'Cucurbita maxima',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'abóbora': {
      scientific: 'Cucurbita moschata',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '85-110 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // HORTALIÇAS FOLHOSAS ADICIONAIS
    'agrião': {
      scientific: 'Nasturtium officinale',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '40-60 dias',
      water: 'Muita água',
      sun: 'Meia-sombra'
    },
    'almeirão': {
      scientific: 'Cichorium intybus',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '60-80 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'catalônia': {
      scientific: 'Chicorium endivia',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '50-70 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'chicória': {
      scientific: 'Cichorium endivia',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '55-75 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'coentro': {
      scientific: 'Coriandrum sativum',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno', 'Primavera'],
      harvestTime: '40-60 dias',
      water: 'Moderada',
      sun: 'Sol pleno a meia-sombra'
    },
    'endívia': {
      scientific: 'Cichorium endivia',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '70-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'mostarda': {
      scientific: 'Brassica juncea',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '40-50 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'rúcula selvagem': {
      scientific: 'Diplotaxis tenuifolia',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '30-45 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // RAÍZES E BULBOS ADICIONAIS
    'cebola': {
      scientific: 'Allium cepa',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '100-150 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'alho': {
      scientific: 'Allium sativum',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '120-180 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'cebolinha': {
      scientific: 'Allium fistulosum',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '60-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'alho poró': {
      scientific: 'Allium ampeloprasum var. porrum',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '120-150 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'gengibre': {
      scientific: 'Zingiber officinale',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '8-10 meses',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'inhame': {
      scientific: 'Dioscorea spp',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '6-8 meses',
      water: 'Moderada',
      sun: 'Sol pleno a meia-sombra'
    },
    'cará': {
      scientific: 'Dioscorea spp',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '7-9 meses',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },
    'mandioca': {
      scientific: 'Manihot esculenta',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '10-14 meses',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'mandioquinha salsa': {
      scientific: 'Arracacia xanthorrhiza',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '10-12 meses',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },

    // FRUTAS ADICIONAIS BRASILEIRAS
    'caju': {
      scientific: 'Anacardium occidentale',
      difficulty: 'Intermediário',
      season: ['Verão'],
      harvestTime: '3-4 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'cajá manga': {
      scientific: 'Spondias dulcis',
      difficulty: 'Intermediário',
      season: ['Verão'],
      harvestTime: '3-4 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'carambola': {
      scientific: 'Averrhoa carambola',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'cereja do rio grande': {
      scientific: 'Eugenia involucrata',
      difficulty: 'Intermediário',
      season: ['Primavera'],
      harvestTime: '3-4 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'figo': {
      scientific: 'Ficus carica',
      difficulty: 'Intermediário',
      season: ['Verão'],
      harvestTime: '2-3 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'framboesa': {
      scientific: 'Rubus idaeus',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '1-2 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'fruta do conde': {
      scientific: 'Annona squamosa',
      difficulty: 'Intermediário',
      season: ['Verão'],
      harvestTime: '2-3 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'graviola': {
      scientific: 'Annona muricata',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'jaca': {
      scientific: 'Artocarpus heterophyllus',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '4-6 anos',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'jenipapo': {
      scientific: 'Genipa americana',
      difficulty: 'Intermediário',
      season: ['Verão'],
      harvestTime: '3-4 anos',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'lixia': {
      scientific: 'Nephelium lappaceum',
      difficulty: 'Avançado',
      season: ['Verão'],
      harvestTime: '4-5 anos',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'seriguela': {
      scientific: 'Spondias purpurea',
      difficulty: 'Intermediário',
      season: ['Verão'],
      harvestTime: '2-3 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'tamarindo': {
      scientific: 'Tamarindus indica',
      difficulty: 'Avançado',
      season: ['Verão'],
      harvestTime: '6-8 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'umbu': {
      scientific: 'Spondias tuberosa',
      difficulty: 'Intermediário',
      season: ['Verão'],
      harvestTime: '3-4 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },

    // ERVAS E CONDIMENTOS ADICIONAIS
    'cebolinho': {
      scientific: 'Allium schoenoprasum',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '60-80 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
  
    'estragão': {
      scientific: 'Artemisia dracunculus',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '80-100 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
   
    'louro': {
      scientific: 'Laurus nobilis',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos',
      water: 'Moderada',
      sun: 'Sol pleno a meia-sombra'
    },
    'manjerona': {
      scientific: 'Origanum majorana',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-80 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'pimenta da jamaica': {
      scientific: 'Pimenta dioica',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '3-5 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'segurelha': {
      scientific: 'Satureja hortensis',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '70-90 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'tomilho': {
      scientific: 'Thymus vulgaris',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '80-100 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },

    // PLANTAS MEDICINAIS ADICIONAIS
    'alcachofra': {
      scientific: 'Cynara scolymus',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '150-180 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'alecrim do campo': {
      scientific: 'Baccharis dracunculifolia',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '1 ano',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'arnica': {
      scientific: 'Arnica montana',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '1-2 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'babosa': {
      scientific: 'Aloe vera',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '1-2 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'calêndula': {
      scientific: 'Calendula officinalis',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'carqueja': {
      scientific: 'Baccharis trimera',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '1 ano',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'cavalinha': {
      scientific: 'Equisetum arvense',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '1 ano',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'confrei': {
      scientific: 'Symphytum officinale',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '60-90 dias',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'erva doce': {
      scientific: 'Pimpinella anisum',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '100-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'erva mate': {
      scientific: 'Ilex paraguariensis',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '3-4 anos',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'hortelã pimenta': {
      scientific: 'Mentha × piperita',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '60-90 dias',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'malva': {
      scientific: 'Malva sylvestris',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-80 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'marcela': {
      scientific: 'Achyrocline satureioides',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '1 ano',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'picão preto': {
      scientific: 'Bidens pilosa',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '60-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'tanchagem': {
      scientific: 'Plantago major',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '60-80 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'tansagem': {
      scientific: 'Plantago lanceolata',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '60-80 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'valeriana': {
      scientific: 'Valeriana officinalis',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '2-3 anos',
      water: 'Alta',
      sun: 'Meia-sombra'
    },

    // PLANTAS FORRAGEIRAS
    'alfafa': {
      scientific: 'Medicago sativa',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-70 dias por corte',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'capim elefante': {
      scientific: 'Pennisetum purpureum',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-90 dias por corte',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'capim gordura': {
      scientific: 'Melinis minutiflora',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '70-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'capim jaraguá': {
      scientific: 'Hyparrhenia rufa',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '80-100 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // PLANTAS ORNAMENTAIS COMUNS
    'amarílis': {
      scientific: 'Hippeastrum spp',
      difficulty: 'Iniciante',
      season: ['Primavera'],
      harvestTime: '2-3 anos para floração',
      water: 'Moderada',
      sun: 'Sol pleno a meia-sombra'
    },
    'azaleia': {
      scientific: 'Rhododendron simsii',
      difficulty: 'Intermediário',
      season: ['Inverno', 'Primavera'],
      harvestTime: '1-2 anos para floração',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },
    'begônia': {
      scientific: 'Begonia spp',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '4-6 meses para floração',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },
    'crisântemo': {
      scientific: 'Chrysanthemum morifolium',
      difficulty: 'Intermediário',
      season: ['Outono'],
      harvestTime: '4-5 meses para floração',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'dália': {
      scientific: 'Dahlia spp',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '3-4 meses para floração',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'gardênia': {
      scientific: 'Gardenia jasminoides',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '2-3 anos para floração',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'gerânio': {
      scientific: 'Pelargonium spp',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '3-4 meses para floração',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'gérbera': {
      scientific: 'Gerbera jamesonii',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '4-6 meses para floração',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'hortênsia': {
      scientific: 'Hydrangea macrophylla',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '1-2 anos para floração',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'petúnia': {
      scientific: 'Petunia spp',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '2-3 meses para floração',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'primavera': {
      scientific: 'Bougainvillea spp',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '1-2 anos para floração',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'tulipa': {
      scientific: 'Tulipa spp',
      difficulty: 'Avançado',
      season: ['Inverno', 'Primavera'],
      harvestTime: '6-8 meses para floração',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'violeta': {
      scientific: 'Viola spp',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '3-4 meses para floração',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },

    // PLANTAS DE COBERTURA E ADUBAÇÃO VERDE
    'crotalária': {
      scientific: 'Crotalaria juncea',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'feijão guandu': {
      scientific: 'Cajanus cajan',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '90-120 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'mucuna preta': {
      scientific: 'Mucuna pruriens',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'lab lab': {
      scientific: 'Lablab purpureus',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '70-100 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

        // FRUTAS RARAS MAS CULTIVADAS
    'bacuri': {
      scientific: 'Platonia insignis',
      difficulty: 'Avançado',
      season: ['Verão'],
      harvestTime: '8-10 anos',
      water: 'Alta',
      sun: 'Sol pleno'
    },

    
    'camu camu': {
      scientific: 'Myrciaria dubia',
      difficulty: 'Avançado',
      season: ['Verão'],
      harvestTime: '3-4 anos',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'cupuaçu': {
      scientific: 'Theobroma grandiflorum',
      difficulty: 'Avançado',
      season: ['Verão'],
      harvestTime: '3-4 anos',
      water: 'Alta',
      sun: 'Sombra'
    },

    // HORTALIÇAS DE CLIMA FRIO (SUL)
    'acelga': {
      scientific: 'Beta vulgaris var. cicla',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '55-65 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'alho nobre': {
      scientific: 'Allium sativum var. ophioscorodon',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '120-180 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'cebola perene': {
      scientific: 'Allium fistulosum',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'couve de bruxelas': {
      scientific: 'Brassica oleracea var. gemmifera',
      difficulty: 'Avançado',
      season: ['Outono', 'Inverno'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'kale': {
      scientific: 'Brassica oleracea var. acephala',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '55-75 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'nabo': {
      scientific: 'Brassica rapa subsp. rapa',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '40-60 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // LEGUMINOSAS RARAS
    'ervilha amarela': {
      scientific: 'Pisum sativum var. arvense',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '60-80 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'feijão moyashi': {
      scientific: 'Vigna radiata',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '45-60 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'tremoço': {
      scientific: 'Lupinus albus',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '120-150 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // CEREAIS ALTERNATIVOS
    'amaranto': {
      scientific: 'Amaranthus cruentus',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '90-120 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'cevada cervejeira': {
      scientific: 'Hordeum vulgare',
      difficulty: 'Intermediário',
      season: ['Inverno'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'quinoa': {
      scientific: 'Chenopodium quinoa',
      difficulty: 'Intermediário',
      season: ['Outono', 'Inverno'],
      harvestTime: '90-150 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'teff': {
      scientific: 'Eragrostis tef',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '90-120 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },

    // TUBÉRCULOS E RAIZES RAROS
    'araruta': {
      scientific: 'Maranta arundinacea',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '10-12 meses',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'inhame cará': {
      scientific: 'Dioscorea alata',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '8-10 meses',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },
    'mandioca brava': {
      scientific: 'Manihot esculenta',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '10-14 meses',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'taro': {
      scientific: 'Colocasia esculenta',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '6-8 meses',
      water: 'Alta',
      sun: 'Meia-sombra'
    },

    // PLANTAS CONDIMENTARES
    'anis estrelado': {
      scientific: 'Illicium verum',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '6-8 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'cardamomo': {
      scientific: 'Elettaria cardamomum',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '3-4 anos',
      water: 'Alta',
      sun: 'Sombra'
    },
    'cúrcuma': {
      scientific: 'Curcuma longa',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '8-10 meses',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'gengibre havaiano': {
      scientific: 'Zingiber zerumbet',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '8-10 meses',
      water: 'Alta',
      sun: 'Meia-sombra'
    },
    'mostarda preta': {
      scientific: 'Brassica nigra',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '80-100 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // PLANTAS MEDICINAIS DA AMAZÔNIA
    'andiroba': {
      scientific: 'Carapa guianensis',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '10-15 anos',
      water: 'Alta',
      sun: 'Sol pleno'
    },
    'copaíba': {
      scientific: 'Copaifera langsdorffii',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '20-30 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'muirapuama': {
      scientific: 'Ptychopetalum olacoides',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '5-7 anos',
      water: 'Moderada',
      sun: 'Meia-sombra'
    },
    'sucupira': {
      scientific: 'Pterodon emarginatus',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '10-15 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },

    // PLANTAS FIBROSAS
    'curauá': {
      scientific: 'Ananas lucidus',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
   
    'piaçava': {
      scientific: 'Attalea funifera',
      difficulty: 'Avançado',
      season: ['Ano Todo'],
      harvestTime: '8-10 anos',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // PLANTAS ORNAMENTAIS COMESTÍVEIS
    'amor perfeito': {
      scientific: 'Viola tricolor',
      difficulty: 'Iniciante',
      season: ['Outono', 'Inverno'],
      harvestTime: '70-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno a meia-sombra'
    },
    'borragem': {
      scientific: 'Borago officinalis',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-80 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'calêndula comestível': {
      scientific: 'Calendula officinalis',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '60-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'flor de abobrinha': {
      scientific: 'Cucurbita pepo',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '45-60 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'nastúrcio': {
      scientific: 'Tropaeolum majus',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '40-60 dias',
      water: 'Moderada',
      sun: 'Sol pleno a meia-sombra'
    },

    // PLANTAS INSETICIDAS/NEMATICIDAS
    'cravinho': {
      scientific: 'Tagetes minuta',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '90-120 dias',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'nim': {
      scientific: 'Azadirachta indica',
      difficulty: 'Intermediário',
      season: ['Ano Todo'],
      harvestTime: '3-5 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'piretro': {
      scientific: 'Tanacetum cinerariifolium',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },

    // CACTOS E SUCULENTAS COMESTÍVEIS
    'figo da índia': {
      scientific: 'Opuntia ficus-indica',
      difficulty: 'Iniciante',
      season: ['Verão'],
      harvestTime: '2-3 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'pitaia vermelha': {
      scientific: 'Hylocereus costaricensis',
      difficulty: 'Intermediário',
      season: ['Verão'],
      harvestTime: '1-2 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'rabo de rato': {
      scientific: 'Cereus hildmannianus',
      difficulty: 'Iniciante',
      season: ['Ano Todo'],
      harvestTime: '2-3 anos',
      water: 'Muito baixa',
      sun: 'Sol pleno'
    },

    // PLANTAS PARA POLINIZADORES
    'alfazema': {
      scientific: 'Lavandula angustifolia',
      difficulty: 'Intermediário',
      season: ['Primavera', 'Verão'],
      harvestTime: '1-2 anos',
      water: 'Baixa',
      sun: 'Sol pleno'
    },
    'erva de são joão': {
      scientific: 'Hypericum perforatum',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '90-120 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    },
    'margarida': {
      scientific: 'Leucanthemum vulgare',
      difficulty: 'Iniciante',
      season: ['Primavera', 'Verão'],
      harvestTime: '70-90 dias',
      water: 'Moderada',
      sun: 'Sol pleno'
    }

  };

  public static async analyzePlant(plantName: string, plantType: string, plantingDate: string): Promise<PlantAnalysis> {
    try {
      console.log('🌱 Consultando Gemini AI para:', plantName);
      
      // Valida se a planta existe antes de consultar a API
      const plantInfo = this.validatePlant(plantName);
      
      const prompt = this.createPrompt(plantName, plantType, plantingDate, plantInfo);
      const response = await this.queryGemini(prompt);
      console.log('✅ Resposta recebida do Gemini');
      
      const analysis = this.parseAIResponse(response);
      
      // Adiciona informações de validação e dados reais à análise
      return {
        ...analysis,
        exists: plantInfo.exists,
        scientificName: plantInfo.scientificName,
        difficulty: plantInfo.difficulty,
        season: plantInfo.season,
        waterNeeds: plantInfo.waterNeeds || analysis.waterNeeds,
        sunExposure: plantInfo.sunExposure || analysis.sunExposure,
        soilType: plantInfo.soilType || analysis.soilType
      };
      
    } catch (error) {
      console.error('❌ Erro na API Gemini:', error);
      // Fallback com dados reais da base
      const plantInfo = this.validatePlant(plantName);
      return this.getFallbackAnalysis(plantName, plantType, plantInfo);
    }
  }

  private static validatePlant(plantName: string): { 
  exists: boolean; 
  scientificName?: string; 
  difficulty?: 'Iniciante' | 'Intermediário' | 'Avançado';
  season?: string[];
  waterNeeds?: string;
  sunExposure?: string;
  soilType?: string;
  harvestTime?: string;
} {
  const normalizedName = plantName.toLowerCase().trim();
  
  // 1. Verifica se existe nome direto na base
  if (this.PLANT_DATABASE[normalizedName]) {
    const plantData = this.PLANT_DATABASE[normalizedName];
    return {
      exists: true,
      scientificName: plantData.scientific,
      difficulty: plantData.difficulty,
      season: plantData.season,
      waterNeeds: plantData.water,
      sunExposure: plantData.sun,
      soilType: plantData.soil,
      harvestTime: plantData.harvestTime
    };
  }
  
  // 2. VERIFICA ALIASES/SINÔNIMOS (incluindo Crauá/Caroá)
  if (this.PLANT_ALIASES[normalizedName]) {
    const realName = this.PLANT_ALIASES[normalizedName];
    const plantData = this.PLANT_DATABASE[realName];
    if (plantData) {
      return {
        exists: true,
        scientificName: plantData.scientific,
        difficulty: plantData.difficulty,
        season: plantData.season,
        waterNeeds: plantData.water,
        sunExposure: plantData.sun,
        soilType: plantData.soil,
        harvestTime: plantData.harvestTime
      };
    }
  }
  
  // 3. Busca por palavras-chave relacionadas ao Crauá
  const crauaKeywords = ['crauá', 'caroá', 'neoglazio', 'gravata', 'fibra'];
  const isCrauaRelated = crauaKeywords.some(keyword => 
    normalizedName.includes(keyword) || keyword.includes(normalizedName)
  );
  
  if (isCrauaRelated && this.PLANT_DATABASE['crauá']) {
    const plantData = this.PLANT_DATABASE['crauá'];
    return {
      exists: true,
      scientificName: plantData.scientific,
      difficulty: plantData.difficulty,
      season: plantData.season,
      waterNeeds: plantData.water,
      sunExposure: plantData.sun,
      soilType: plantData.soil,
      harvestTime: plantData.harvestTime
    };
  }
  
  // 4. Busca inteligente para outras plantas
  const cleanName = normalizedName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (const [key, data] of Object.entries(this.PLANT_DATABASE)) {
    const cleanKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Verifica correspondência exata, parcial ou por palavra
    if (cleanName === cleanKey || 
        cleanName.includes(cleanKey) || 
        cleanKey.includes(cleanName) ||
        this.hasCommonWords(cleanName, cleanKey)) {
      return {
        exists: true,
        scientificName: data.scientific,
        difficulty: data.difficulty,
        season: data.season,
        waterNeeds: data.water,
        sunExposure: data.sun,
        soilType: data.soil,
        harvestTime: data.harvestTime
      };
    }
  }

  return { exists: false };
}

  private static hasCommonWords(name1: string, name2: string): boolean {
    const words1 = name1.split(' ');
    const words2 = name2.split(' ');
    
    return words1.some(word => 
      word.length > 2 && words2.some(w => w.includes(word) || word.includes(w))
    );
  }

  private static createPrompt(plantName: string, plantType: string, plantingDate: string, plantInfo: any): string {
    const plantData = plantInfo.exists ? `
NOME CIENTÍFICO: ${plantInfo.scientificName}
DIFICULDADE: ${plantInfo.difficulty}
ESTAÇÃO: ${plantInfo.season?.join(', ')}
TEMPO COLHEITA: ${plantInfo.harvestTime}
ÁGUA: ${plantInfo.waterNeeds}
SOL: ${plantInfo.sunExposure}` : '';

    return `Como especialista em agricultura brasileira, analise esta planta para cultivo doméstico:

NOME: ${plantName}
TIPO: ${plantType}${plantData}
DATA PLANTIO: ${plantingDate}
REGIÃO: Brasil (clima tropical/subtropical)

Forneça uma análise PRÁTICA e REAL em JSON com esta estrutura EXATA:

{
  "harvestTime": "tempo estimado baseado em dados reais",
  "growthStages": [
    {
      "stage": "nome do estágio real",
      "duration": "duração real em dias", 
      "tips": ["dica prática 1", "dica prática 2", "dica prática 3"]
    }
  ],
  "careTips": ["dica real 1", "dica real 2", "dica real 3", "dica real 4"],
  "commonIssues": ["problema real 1", "problema real 2", "problema real 3"],
  "estimatedYield": "estimativa real baseada em dados",
  "waterNeeds": "necessidade real de água",
  "sunExposure": "exposição real ao sol necessária",
  "soilType": "tipo de solo ideal",
  "spacing": "espaçamento entre plantas",
  "fertilization": "recomendações de adubação",
  "companionPlants": ["plantas companheiras reais"],
  "pests": ["pragas comuns reais"],
  "diseases": "doenças comuns reais",
  "pruning": "recomendações de poda",
  "propagation": "métodos de propagação",
  "harvestTips": ["dicas reais de colheita"],
  "storage": "como armazenar após colheita",
  "nutritionalValue": "valor nutricional principal"
}

Use dados REAIS baseados em pesquisas agrícolas. Seja PRÁTICO, REALISTA e específico para o clima brasileiro. Use emojis nas dicas. Forneça apenas o JSON, sem texto adicional.`;
  }

  private static async queryGemini(prompt: string): Promise<string> {
    const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro Gemini ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Resposta inválida do Gemini');
    }

    return data.candidates[0].content.parts[0].text;
  }

  private static parseAIResponse(aiText: string): PlantAnalysis {
    try {
      console.log('📝 Processando resposta:', aiText);
      
      const cleanText = aiText.replace(/```json|```/g, '').trim();
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ JSON parseado com sucesso');
        
        // Garante que todos os campos obrigatórios existam
        return {
          harvestTime: "Não especificado",
          growthStages: [],
          careTips: [],
          commonIssues: [],
          estimatedYield: "Não especificado",
          waterNeeds: "Não especificado",
          sunExposure: "Não especificado",
          soilType: "Não especificado",
          ...parsed
        };
      }
      
      throw new Error('JSON não encontrado na resposta');
    } catch (error) {
      console.warn('⚠️ Falha ao parsear JSON, usando fallback:', error);
      throw new Error('Resposta da IA em formato inválido');
    }
  }

  private static getFallbackAnalysis(plantName: string, plantType: string, plantInfo: any): PlantAnalysis {
    const baseFallback = {
      exists: plantInfo.exists,
      scientificName: plantInfo.scientificName,
      difficulty: plantInfo.difficulty,
      season: plantInfo.season,
      waterNeeds: plantInfo.waterNeeds || "Moderada - ajuste conforme a estação",
      sunExposure: plantInfo.sunExposure || "Sol pleno 4-6 horas/dia",
      soilType: "Solo fértil, bem drenado e rico em matéria orgânica",
      spacing: "Varia conforme a espécie",
      fertilization: "Adubo orgânico a cada 2-3 meses",
      companionPlants: ["Variam conforme a espécie"],
      pests: ["Pulgões", "Ácaros", "Cochonilhas"],
      diseases: ["Oídio", "Míldio", "Podridão radicular"],
      pruning: "Conforme necessidade da espécie",
      propagation: "Sementes ou mudas",
      harvestTips: ["Colha nas horas mais frescas do dia"],
      storage: "Local fresco e arejado",
      nutritionalValue: "Rica em vitaminas e minerais"
    };

    if (!plantInfo.exists) {
      return {
        harvestTime: "Planta não identificada",
        growthStages: [{
          stage: "Informação não disponível",
          duration: "---",
          tips: ["❌ Esta planta não foi identificada", "📝 Verifique o nome digitado", "🌿 Tente usar nomes mais comuns"]
        }],
        careTips: ["Planta não reconhecida em nossa base de dados"],
        commonIssues: ["Nome da planta pode estar incorreto"],
        estimatedYield: "Não estimado - planta não identificada",
        ...baseFallback
      };
    }

    // Análises específicas baseadas em dados reais
    const lowerName = plantName.toLowerCase();
    
    // Análise específica para maçã
    if (lowerName.includes('maçã') || lowerName.includes('maca')) {
      return {
        harvestTime: "2-4 anos para primeira colheita",
        growthStages: [
          {
            stage: "Formação da Árvore",
            duration: "1-2 anos",
            tips: ["🌳 Plante em local com boa drenagem", "✂️ Pode para formar estrutura", "🌿 Adube com fósforo no plantio"]
          },
          {
            stage: "Crescimento Vegetativo", 
            duration: "1-2 anos",
            tips: ["💧 Rega profunda 1x/semana", "🌿 Adube com NPK 10-10-10", "🛡️ Proteja de geadas"]
          },
          {
            stage: "Floração e Frutificação",
            duration: "6-8 meses",
            tips: ["🌸 Polinização cruzada necessária", "🍎 Rale frutos se necessário", "🐝 Plante variedades polinizadoras"]
          }
        ],
        careTips: [
          "🌞 Sol pleno (8+ horas/dia)",
          "🪴 Solo profundo e bem drenado",
          "❄️ Necessita de frio no inverno (200-400 horas abaixo de 7°C)",
          "✂️ Poda anual obrigatória para produção"
        ],
        commonIssues: [
          "Sarna da macieira em clima úmido",
          "Pulgões e ácaros",
          "Podridão radicular em solo encharcado"
        ],
        estimatedYield: "20-50 kg/árvore em árvores adultas",
        ...baseFallback,
        waterNeeds: "Moderada - 1-2x/semana no verão",
        sunExposure: "Sol pleno 8+ horas/dia",
        soilType: "Solo profundo, fértil, pH 6.0-6.5",
        spacing: "4-6 metros entre árvores",
        fertilization: "NPK 10-10-10 + matéria orgânica",
        companionPlants: ["Alho", "Cebola", "Hortelã"],
        pests: ["Mosca-da-fruta", "Pulgões", "Lagartas"],
        diseases: ["Sarna", "Cancro", "Oídio"],
        pruning: "Poda de inverno e verão para formação e produção",
        propagation: "Enxertia em porta-enxertos anões",
        harvestTips: ["Colha quando frutos soltarem facilmente", "Manuseie com cuidado para não machucar"],
        storage: "Frigorífico a 0-2°C por vários meses",
        nutritionalValue: "Rica em fibras, vitamina C e antioxidantes"
      };
    }

    // Análise específica para tomate
    if (lowerName.includes('tomate')) {
      return {
        harvestTime: "70-100 dias após plantio",
        growthStages: [
          {
            stage: "Germinação e Crescimento Inicial",
            duration: "15-25 dias",
            tips: ["🌱 Semear em bandejas ou sementeiras", "🌡️ Temperatura ideal 20-25°C", "💧 Manter substrato úmido"]
          },
          {
            stage: "Transplantio e Crescimento Vegetativo",
            duration: "30-45 dias",
            tips: ["🪴 Transplantar quando tiver 4-6 folhas", "🌿 Tutorar plantas", "💧 Rega regular sem encharcar"]
          },
          {
            stage: "Floração e Frutificação",
            duration: "45-60 dias",
            tips: ["🌸 Polinização natural ou manual", "🍅 Fertilizar com potássio", "🛡️ Controlar pragas e doenças"]
          }
        ],
        careTips: [
          "🌞 Sol pleno 6-8 horas/dia",
          "💧 Rega constante no pé, evitar molhar folhas",
          "🌿 Adubação rica em fósforo e potássio",
          "🪴 Tutoramento obrigatório para variedades indeterminadas"
        ],
        commonIssues: [
          "Requeima em tempo úmido",
          "Podridão apical por falta de cálcio",
          "Pulgões e mosca-branca"
        ],
        estimatedYield: "3-8 kg/planta dependendo da variedade",
        ...baseFallback,
        waterNeeds: "Alta - rega diária no verão",
        sunExposure: "Sol pleno 6-8 horas/dia",
        soilType: "Solo fértil, profundo, pH 6.0-6.8",
        spacing: "50-80 cm entre plantas",
        fertilization: "NPK 4-14-8 + calcário dolomítico",
        companionPlants: ["Manjericão", "Salsinha", "Cebolinha"],
        pests: ["Mosca-branca", "Pulgões", "Vaquinha"],
        diseases: ["Requeima", "Pinta-preta", "Murcha-de-fusário"],
        pruning: "Remover brotos laterais (ladrões)",
        propagation: "Sementes",
        harvestTips: ["Colher quando frutos estiverem firmes e coloridos", "Cortar com tesoura para não danificar planta"],
        storage: "Temperatura ambiente, nunca geladeira",
        nutritionalValue: "Rico em licopeno, vitamina C e potássio"
      };
    }

    // Análise específica para Crauá
 // Detecção MELHORADA para Crauá/Caroá
const crauaKeywords = [
  'crauá', 'caroá', 'neoglazio', 'neovlagio', 'gravata', 
  'fibra', 'caruá', 'crauazeiro', 'caroazeiro'
];
const isCraua = crauaKeywords.some(keyword => lowerName.includes(keyword)) || 
                plantInfo.scientificName?.includes('Neoglaziovia');

if (isCraua) {
  return {
    harvestTime: "2-3 anos para extração de fibras",
    growthStages: [
      {
        stage: "Estabelecimento",
        duration: "6-12 meses",
        tips: [
          "🌵 Plante em solo bem drenado e pedregoso",
          "💧 Rega esparsa apenas nos primeiros meses", 
          "☀️ Exposição total ao sol é essencial",
          "🌡️ Adaptada a climas quentes e secos"
        ]
      },
      {
        stage: "Crescimento Vegetativo",
        duration: "1-2 anos",
        tips: [
          "🌿 Fertilização quase desnecessária",
          "💧 Planta xerófila - tolera longas secas",
          "🛡️ Resistente natural a pragas e doenças", 
          "🌱 Crescimento lento é normal"
        ]
      },
      {
        stage: "Maturação e Produção",
        duration: "2-3 anos",
        tips: [
          "🧵 Fibras atingem qualidade para colheita",
          "🌸 Pode florescer em condições ideais",
          "🌱 Produz mudas (filhotes) na base",
          "✂️ Folhas externas estão prontas para colheita"
        ]
      }
    ],
    careTips: [
      "🌵 Planta xerófila - NÃO tolera encharcamento",
      "🪴 Solo pobre, arenoso e bem drenado é ideal", 
      "☀️ Sol pleno intenso o dia todo obrigatório",
      "💦 Rega apenas quando solo estiver completamente seco",
      "🌡️ Clima tropical/quente - não tolera geadas",
      "🧵 Cultivada principalmente para fibras têxteis"
    ],
    commonIssues: [
      "Podridão radical por excesso de água (principal causa de morte)",
      "Crescimento excessivamente lento em solo muito fértil", 
      "Folhas queimadas em sombra parcial",
      "Suscetível a cochonilhas em condições de umidade excessiva"
    ],
    estimatedYield: "1-2 kg de fibras secas por planta adulta (3-5 anos)",
    ...baseFallback,
    waterNeeds: "Muito baixa - planta de deserto/cerrado",
    sunExposure: "Sol pleno intenso (mínimo 8 horas/dia)",
    soilType: "Solo arenoso, pedregoso, pobre em matéria orgânica, excelente drenagem",
    spacing: "1-1.5 metros entre plantas",
    fertilization: "Quase nenhuma necessária - excesso de nutrientes prejudica o crescimento",
    companionPlants: ["Mandacaru", "Xique-xique", "Outras cactáceas", "Plantas do cerrado"],
    pests: ["Pouco suscetível", "Cochonilhas em condições de excesso de umidade"],
    diseases: ["Podridão radicular por excesso de água"],
    pruning: "Remover folhas secas externas quando necessário",
    propagation: "Mudas (filhotes) que nascem na base ou sementes",
    harvestTips: [
      "Colher apenas folhas externas maduras (mais de 2 anos)",
      "Cortar na base com faca afiada",
      "Processar para extrair fibras: maceração e secagem",
      "Fibras mais longas têm maior valor comercial"
    ],
    storage: "Fibras secas em local arejado e protegido da umidade",
    nutritionalValue: "Não comestível - valor econômico nas fibras têxteis"
  };
}
    // Análise genérica para plantas conhecidas
    if (plantInfo.exists) {
      return {
        harvestTime: plantInfo.harvestTime || "60-120 dias",
        growthStages: [
          {
            stage: "Estabelecimento Inicial",
            duration: "15-30 dias",
            tips: ["🌱 Preparar solo adequadamente", "💧 Manter umidade inicial", "🌡️ Proteger de temperaturas extremas"]
          },
          {
            stage: "Crescimento Vegetativo", 
            duration: "30-60 dias",
            tips: ["🌿 Fornecer nutrientes balanceados", "💧 Ajustar rega ao desenvolvimento", "🔍 Monitorar saúde da planta"]
          },
          {
            stage: "Produção",
            duration: "30-60 dias",
            tips: ["🌸 Assegurar polinização adequada", "🛡️ Controlar pragas e doenças", "📊 Monitorar maturação"]
          }
        ],
        careTips: [
          "🔍 Pesquise necessidades específicas da espécie",
          "💧 Ajuste rega ao clima e estágio de crescimento", 
          "🌱 Solo bem drenado é fundamental",
          "🐛 Monitore pragas e doenças regularmente"
        ],
        commonIssues: [
          "Erros de rega (excesso ou falta)",
          "Pragas específicas da cultura",
          "Deficiências nutricionais no solo"
        ],
        estimatedYield: "Varia conforme espécie e cuidados",
        ...baseFallback
      };
    }

    

    return {
      harvestTime: "Informação não disponível",
      growthStages: [{
        stage: "Dados insuficientes",
        duration: "---",
        tips: ["📚 Consulte fontes especializadas", "🌿 Verifique nome científico", "🏪 Procure em viveiros especializados"]
      }],
      careTips: ["Planta não catalogada em nossa base"],
      commonIssues: ["Dados insuficientes para análise"],
      estimatedYield: "Não estimado",
      ...baseFallback
    };
  }
}