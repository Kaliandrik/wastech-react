// dashboard/components/tela_inicial/components/ImpactSection.tsx
import React, { useEffect, useRef } from 'react';

export interface ImpactItem {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface StatItem {
  id: number;
  number: string;
  label: string;
}

const ImpactSection: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);

  // Ícones SVG em vez de FontAwesome
  const impactItems: ImpactItem[] = [
    {
      id: 1,
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd"/>
        </svg>
      ),
      title: 'Tecnologia a Favor da Natureza',
      description: 'Integramos IoT, sensores inteligentes e algoritmos de IA para otimizar o crescimento das suas plantas'
    },
    {
      id: 2,
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
        </svg>
      ),
      title: 'Reduza a emissão de CO₂',
      description: 'Cada planta cultivada contribui para um futuro mais sustentável e um planeta mais verde'
    },
    {
      id: 3,
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
        </svg>
      ),
      title: 'Comunidade Ativa',
      description: 'Conecte-se com outros jardineiros e compartilhe experiências em nossa plataforma colaborativa'
    },
    {
      id: 4,
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
        </svg>
      ),
      title: 'Resultados Mensuráveis',
      description: 'Acompanhe seu progresso com relatórios detalhados e métricas de sustentabilidade'
    }
  ];

  const statItems: StatItem[] = [
    { id: 1, number: '2.5K+', label: 'Usuários Ativos' },
    { id: 2, number: '15K+', label: 'Plantas Cultivadas' },
    { id: 3, number: '80%', label: 'Redução CO₂' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.stat-number');
          counters.forEach(counter => {
            const target = parseInt(counter.textContent?.replace(/\D/g, '') || '0');
            const suffix = counter.textContent?.includes('K') ? 'K+' :
              counter.textContent?.includes('%') ? '%' : '+';
            const increment = target / 50;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              counter.textContent = Math.floor(current) + (suffix === '+' ? suffix : suffix.replace('+', ''));
            }, 40);
          });
        }
      });
    });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const gridPattern = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E";

  return (
    <section className="mx-auto mb-8 sm:mb-10 lg:mb-15 max-w-[95%] sm:max-w-5xl lg:max-w-6xl rounded-xl sm:rounded-[20px] lg:rounded-[25px] overflow-hidden shadow-lg sm:shadow-xl bg-gradient-to-br from-green-800 via-green-600 to-green-500 relative">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `url('${gridPattern}')` }}
      />

      {/* Top section */}
      <div className="py-8 sm:py-10 lg:py-15 px-4 sm:px-6 lg:px-8 text-center relative z-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.2rem] font-bold text-white mb-0 text-shadow-lg inline-block relative">
          Impacto Coletivo
          <div className="absolute bottom-[-8px] sm:bottom-[-10px] left-1/2 -translate-x-1/2 w-12 sm:w-16 lg:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-green-300 to-green-200 rounded" />
        </h2>
        <h3 className="text-green-50 text-base sm:text-lg lg:text-xl font-medium mt-2 sm:mt-2.5">
          Juntos, cultivamos um futuro mais verde
        </h3>
        <p className="text-green-100 text-sm sm:text-base lg:text-lg max-w-full sm:max-w-[500px] lg:max-w-[600px] mx-auto mt-3 sm:mt-4 lg:mt-4.5 leading-relaxed px-2 sm:px-0">
          Nossa comunidade une tecnologia, sustentabilidade e colaboração para transformar espaços urbanos em verdadeiros oásis de vida. Cada ação conta para um planeta mais saudável!
        </p>

        <a href="/cadastro">
          <button className="mt-4 sm:mt-5 lg:mt-5.5 bg-white text-green-800 px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg font-semibold text-sm sm:text-base border-none shadow-md cursor-pointer hover:bg-gray-50 transition-colors duration-300 active:scale-[0.98]">
            Quero fazer parte
          </button>
        </a>
      </div>

      {/* Impact blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10 p-4 sm:p-6 lg:p-10 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm relative">
        {impactItems.map((item) => (
          <div
            key={item.id}
            className="bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl lg:rounded-[20px] text-center transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg sm:hover:shadow-xl border border-green-800/10 hover:border-green-800 relative overflow-hidden group"
          >
            {/* Hover effect */}
            <div className="absolute inset-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-green-800/5 to-transparent transition-all duration-600 group-hover:left-full" />

            {/* Icon container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-25 lg:h-25 mx-auto mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-br from-green-800 to-green-500 rounded-full flex items-center justify-center relative transition-all duration-300 group-hover:scale-105 sm:group-hover:scale-110 group-hover:rotate-6 sm:group-hover:rotate-12 shadow-lg group-hover:shadow-xl">
              {/* Animated border */}
              <div className="absolute -inset-1 sm:-inset-1.5 bg-gradient-to-r from-green-300 to-green-200 rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="z-10 relative">
                {item.icon}
              </div>
            </div>

            <p className="text-gray-800 text-base sm:text-lg lg:text-xl font-bold mb-0 leading-relaxed relative line-clamp-2">
              {item.title}
            </p>
            <p className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-3 lg:mt-3.5 leading-relaxed opacity-90 group-hover:opacity-100 transition-all duration-300 line-clamp-3 sm:line-clamp-4">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div 
        className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 lg:gap-15 py-6 sm:py-8 lg:py-10 bg-green-800/5 mx-4 sm:mx-6 lg:mx-10 rounded-b-xl sm:rounded-b-[20px] lg:rounded-b-[25px]" 
        ref={statsRef}
      >
        {statItems.map((stat) => (
          <div key={stat.id} className="text-center min-w-[100px] sm:min-w-0">
            <span className="stat-number text-2xl sm:text-3xl lg:text-[2.5rem] font-bold text-green-800 block">
              {stat.number}
            </span>
            <span className="text-gray-600 text-xs sm:text-sm uppercase tracking-wider mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactSection;