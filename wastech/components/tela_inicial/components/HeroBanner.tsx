// dashboard/components/tela_inicial/components/HeroBanner.tsx
import React, { useState, useEffect } from 'react';

export interface CarouselSlide {
  id: number;
  image: string;
  alt: string;
}

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: CarouselSlide[] = [
    { id: 1, image: '/Imagens/mulher_regando.png', alt: 'Mulher regando plantas' },
    { id: 2, image: '/Imagens/horta_urbana.png', alt: 'Horta urbana' },
    { id: 3, image: '/Imagens/regador_plantação.jpg', alt: 'Regador em plantação' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[540px] flex items-center rounded-b-[20px] mb-6 sm:mb-8 lg:mb-10 overflow-hidden">
      {/* Gradient Overlay para melhor legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10 rounded-b-[20px]" />
      
      {/* Carousel */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center sm:bg-left transition-opacity duration-700 ease-in-out rounded-b-[20px] ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
        ))}
        
        {/* Controles do Carousel */}
        <button 
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/85 text-green-800 border-none rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 text-lg sm:text-xl md:text-2xl font-bold cursor-pointer shadow-md hover:bg-green-800 hover:text-white hover:shadow-lg transition-all duration-300 z-30 flex items-center justify-center active:scale-95"
          onClick={prevSlide}
          aria-label="Slide anterior"
        >
          &#10094;
        </button>
        <button 
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/85 text-green-800 border-none rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 text-lg sm:text-xl md:text-2xl font-bold cursor-pointer shadow-md hover:bg-green-800 hover:text-white hover:shadow-lg transition-all duration-300 z-30 flex items-center justify-center active:scale-95"
          onClick={nextSlide}
          aria-label="Próximo slide"
        >
          &#10095;
        </button>
        
        {/* Indicadores de Slide (Dots) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 text-white max-w-[90%] sm:max-w-[80%] md:max-w-[480px] ml-4 sm:ml-8 md:ml-[5%] lg:ml-[10%] px-2 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-tight mb-3 sm:mb-4 text-shadow-lg">
          <span className="block sm:inline">Transforme</span>
          <span className="block sm:inline"> Seu espaço em</span>
          <span className="block sm:inline"> uma Horta</span>
          <span className="block sm:inline"> inteligente</span>
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg mb-5 sm:mb-6 md:mb-7 text-shadow-md max-w-[90%]">
          Plante, aprenda, conheça
          <span className="block sm:inline"> e salve o planeta.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5">
          <a href="/cadastro" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-green-800 text-white border-none rounded-lg px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg font-semibold cursor-pointer hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg active:scale-[0.98]">
              Comece Agora
            </button>
          </a>
          
          <a href="/sobre" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-white text-green-800 border-none rounded-lg px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg font-semibold cursor-pointer hover:bg-gray-100 transition-colors duration-300 shadow-md hover:shadow-lg active:scale-[0.98]">
              Saiba mais
            </button>
          </a>
        </div>
      </div>

      {/* Indicadores de scroll para mobile */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center z-30">
        <span className="text-white/70 text-xs mb-1">Role para baixo</span>
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;