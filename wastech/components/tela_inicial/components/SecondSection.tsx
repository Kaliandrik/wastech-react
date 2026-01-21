// dashboard/components/tela_inicial/components/SecondSection.tsx
import React from 'react';

const SecondSection: React.FC = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center bg-white rounded-xl sm:rounded-2xl lg:rounded-[20px] mx-4 sm:mx-6 lg:mx-[5%] mb-6 sm:mb-8 lg:mb-10 py-6 sm:py-8 lg:py-10 shadow-sm px-4 sm:px-6 lg:px-0">
      {/* Text Section */}
      <div className="flex-1 w-full lg:w-auto text-center lg:text-left px-2 sm:px-4 lg:pl-8 xl:pl-10 mb-6 lg:mb-0 order-2 lg:order-1">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-gray-800 mb-4 lg:mb-0 leading-tight">
          <span className="block">Sua Horta na</span>
          <span className="block">palma da sua</span>
          <span className="block">mão!!</span>
        </h2>
        
        {/* Adicionando texto descritivo para melhor UX em mobile */}
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-3 lg:hidden max-w-md mx-auto lg:mx-0">
          Controle e monitore sua horta de qualquer lugar através do nosso aplicativo móvel
        </p>
        
        {/* Botão CTA para mobile/tablet */}
        <div className="mt-4 lg:hidden">
          <a href="/app-download">
            <button className="bg-green-800 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg active:scale-[0.98]">
              Baixar App
            </button>
          </a>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end items-center relative px-2 sm:px-4 lg:pr-8 xl:pr-10 min-h-[200px] sm:min-h-[240px] lg:min-h-[260px] order-1 lg:order-2 mb-4 lg:mb-0">
        {/* Background Decorative Element */}
        <div className="bg-green-300 w-32 h-40 sm:w-40 sm:h-48 lg:w-56 lg:h-64 rounded-3xl sm:rounded-[45px] lg:rounded-[60px] absolute right-4 sm:right-8 lg:right-2.5 top-4 sm:top-6 lg:top-2.5 z-10"></div>
        
        {/* Main Image */}
        <img 
          src="/Imagens/homem_olhando_planta.png" 
          alt="Homem segurando plantas" 
          className="w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[320px] xl:max-w-[340px] rounded-lg sm:rounded-xl lg:rounded-[18px] relative z-20 shadow-lg transform -translate-x-2 sm:-translate-x-4 lg:translate-x-0"
          loading="lazy"
        />
        
        {/* Decorative elements for mobile/tablet */}
        <div className="hidden sm:block absolute -bottom-3 -left-3 w-12 h-12 bg-green-100 rounded-full z-0 lg:hidden"></div>
        <div className="hidden sm:block absolute -top-3 -right-3 w-10 h-10 bg-green-200 rounded-full z-0 lg:hidden"></div>
      </div>

      {/* Desktop-only additional content */}
      <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-24 bg-gradient-to-b from-green-300 to-transparent"></div>
    </section>
  );
};

export default SecondSection;