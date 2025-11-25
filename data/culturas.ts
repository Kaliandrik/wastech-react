// wastech/data/culturas.ts
export interface Cultura {
  nome: string;
  duracao: string;
  fases: string;
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
    duracao: "75 a 140", 
    fases: "(27-37-26-10)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.0, fase4: 0.8 }
  },
  { 
    nome: "Algodão", 
    duracao: "180 a 195", 
    fases: "(16-27-31-26)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.2, fase4: 0.7 }
  },
  { 
    nome: "Amendoim", 
    duracao: "130 a 140", 
    fases: "(22-26-34-18)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.1, fase4: 0.6 }
  },
  { 
    nome: "Batata", 
    duracao: "105 a 145", 
    fases: "(21-25-33-21)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.1, fase4: 0.7 }
  },
  { 
    nome: "Berinjela", 
    duracao: "130 a 140", 
    fases: "(22-32-30-16)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.1, fase4: 0.7 }
  },
  { 
    nome: "Beterraba", 
    duracao: "70 a 90", 
    fases: "(25-35-28-12)",
    kcValores: { fase1: 0.4, fase2: 0.8, fase3: 1.1, fase4: 0.8 }
  },
  { 
    nome: "Cebola (seca)", 
    duracao: "150 a 210", 
    fases: "(10-17-49-24)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.1, fase4: 0.7 }
  },
  { 
    nome: "Cenoura", 
    duracao: "100 a 150", 
    fases: "(19-27-39-15)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.1, fase4: 0.7 }
  },
  { 
    nome: "Crucíferas", 
    duracao: "80 a 95", 
    fases: "(26-37-25-12)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.0, fase4: 0.8 }
  },
  { 
    nome: "Feijão vagem", 
    duracao: "75 a 90", 
    fases: "(21-34-33-12)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.1, fase4: 0.7 }
  },
  { 
    nome: "Feijão seco", 
    duracao: "95 a 110", 
    fases: "(16-25-40-19)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.1, fase4: 0.4 }
  },
  { 
    nome: "Girassol", 
    duracao: "125 a 130", 
    fases: "(17-27-36-20)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.1, fase4: 0.4 }
  },
  { 
    nome: "Melão", 
    duracao: "120 a 160", 
    fases: "(20-28-37-15)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.1, fase4: 0.7 }
  },
  { 
    nome: "Milho-doce", 
    duracao: "80 a 110", 
    fases: "(23-29-37-11)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.1, fase4: 0.9 }
  },
  { 
    nome: "Milho grãos", 
    duracao: "125 a 180", 
    fases: "(17-28-33-22)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.2, fase4: 0.5 }
  },
  { 
    nome: "Pepino", 
    duracao: "105 a 130", 
    fases: "(19-28-38-15)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.0, fase4: 0.8 }
  },
  { 
    nome: "Rabanete", 
    duracao: "35 a 40", 
    fases: "(20-27-40-13)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.0, fase4: 0.8 }
  },
  { 
    nome: "Tomate", 
    duracao: "135 a 180", 
    fases: "(21-28-33-18)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.2, fase4: 0.7 }
  },
  { 
    nome: "Trigo", 
    duracao: "120 a 150", 
    fases: "(13-20-43-24)",
    kcValores: { fase1: 0.4, fase2: 0.7, fase3: 1.2, fase4: 0.3 }
  }
];