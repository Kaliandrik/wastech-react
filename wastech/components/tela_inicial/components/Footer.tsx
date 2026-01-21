// dashboard/components/tela_inicial/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-center py-6 md:py-10 px-4 sm:px-6 lg:px-8 font-sans border-t-4 border-green-900">
      {/* Container principal com largura máxima */}
      <div className="max-w-7xl mx-auto">
        
        {/* Seção superior: logo, navegação e redes sociais */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-6 md:mb-8">
          
          {/* Logo - centralizada em mobile, alinhada à esquerda em desktop */}
          <div className="flex items-center justify-center lg:justify-start">
            <img 
              src="/Imagens/logoverde.png" 
              alt="Wastech Logo" 
              className="h-20 md:h-24 lg:h-30 w-auto"
            />
          </div>

          {/* Navegação - vertical em mobile, horizontal em desktop */}
          <nav className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-5">
            <a href="#" className="no-underline text-black font-medium hover:text-green-700 transition-colors text-sm sm:text-base">
              Comunidade
            </a>
            <a href="#" className="no-underline text-black font-medium hover:text-green-700 transition-colors text-sm sm:text-base">
              Sobre Nós
            </a>
            <a href="#" className="no-underline text-black font-medium hover:text-green-700 transition-colors text-sm sm:text-base">
              Gamificação
            </a>
            <a href="#" className="no-underline text-black font-medium hover:text-green-700 transition-colors text-sm sm:text-base">
              Página Inicial
            </a>
            <a href="#" className="no-underline text-black font-medium hover:text-green-700 transition-colors text-sm sm:text-base">
              Dashboard
            </a>
          </nav>

          {/* Redes sociais - sempre centralizada */}
          <div className="flex gap-3.5 justify-center">
            <a 
              href="https://www.instagram.com/wastechpsvs/" 
              className="text-gray-700 hover:text-pink-600 transition-colors transform hover:scale-110"
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://youtu.be/ynm53PYm2dc?si=iQBbpWCsZx_AGgyK" 
              className="text-gray-700 hover:text-red-600 transition-colors transform hover:scale-110"
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Linha divisória */}
        <hr className="my-5 border-t border-green-800" />
        
        {/* Seção inferior: direitos autorais e links legais */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm">
          <p className="m-0 text-gray-700 text-center sm:text-left">
            © 2025 WastTech. Todos os Direitos Reservados.
          </p>
          <div className="flex gap-3 sm:gap-3.5">
            <a 
              href="#" 
              className="no-underline text-gray-700 hover:text-green-700 transition-colors whitespace-nowrap"
            >
              Políticas de Privacidade
            </a>
            <a 
              href="#" 
              className="no-underline text-gray-700 hover:text-green-700 transition-colors whitespace-nowrap"
            >
              Termos de Serviço
            </a>
          </div>
        </div>
        
        {/* Texto adicional para mobile (opcional) */}
        <div className="mt-4 sm:hidden text-xs text-gray-500">
          <p>Uma solução completa para gestão de resíduos</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;