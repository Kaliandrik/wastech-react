// wastech/data/culturas.ts
export interface Cultura {
  nome: string;
  duracao: number;
  fases: string; // formato "20-30-40-10"
  kcValores: {
    fase1: number;
    fase2: number;
    fase3: number;
    fase4: number;
  };
}

export const culturas: Cultura[] = [
  {
    nome: "Alface",
    duracao: 60,
    fases: "15-25-15-5", // 15+25+15+5 = 60 ✓
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.0, fase4: 0.9 }
  },
  {
    nome: "Tomate",
    duracao: 120,
    fases: "25-35-45-15", // 25+35+45+15 = 120 ✓
    kcValores: { fase1: 0.5, fase2: 0.8, fase3: 1.2, fase4: 0.7 }
  },
  {
    nome: "Milho",
    duracao: 110,
    fases: "20-30-40-20", // 20+30+40+20 = 110 ✓
    kcValores: { fase1: 0.3, fase2: 0.7, fase3: 1.1, fase4: 0.6 }
  },
  {
    nome: "Feijão",
    duracao: 80,
    fases: "15-25-25-15", // 15+25+25+15 = 80 ✓
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.0, fase4: 0.5 }
  },
  {
    nome: "Soja",
    duracao: 115,
    fases: "20-30-40-25", // 20+30+40+25 = 115 ✓
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.1, fase4: 0.5 }
  },
  {
    nome: "Arroz",
    duracao: 125,
    fases: "20-30-45-30", // 20+30+45+30 = 125 ✓
    kcValores: { fase1: 1.1, fase2: 1.2, fase3: 1.2, fase4: 0.9 }
  },
  {
    nome: "Cana-de-açúcar",
    duracao: 365,
    fases: "60-90-150-65", // 60+90+150+65 = 365 ✓
    kcValores: { fase1: 0.4, fase2: 0.8, fase3: 1.2, fase4: 0.7 }
  },
  {
    nome: "Café",
    duracao: 240,
    fases: "30-60-120-30", // 30+60+120+30 = 240 ✓
    kcValores: { fase1: 0.6, fase2: 0.9, fase3: 1.1, fase4: 0.8 }
  },
  {
    nome: "Cenoura",
    duracao: 90,
    fases: "20-30-30-10", // 20+30+30+10 = 90 ✓
    kcValores: { fase1: 0.5, fase2: 0.8, fase3: 1.1, fase4: 0.7 }
  },
  {
    nome: "Batata",
    duracao: 100,
    fases: "20-30-35-15", // 20+30+35+15 = 100 ✓
    kcValores: { fase1: 0.5, fase2: 0.8, fase3: 1.1, fase4: 0.7 }
  },
  {
    nome: "Repolho",
    duracao: 70,
    fases: "15-25-20-10", // 15+25+20+10 = 70 ✓
    kcValores: { fase1: 0.5, fase2: 0.8, fase3: 1.0, fase4: 0.8 }
  },
  {
    nome: "Pimentão",
    duracao: 110,
    fases: "25-30-40-15", // 25+30+40+15 = 110 ✓
    kcValores: { fase1: 0.5, fase2: 0.8, fase3: 1.1, fase4: 0.8 }
  }
];