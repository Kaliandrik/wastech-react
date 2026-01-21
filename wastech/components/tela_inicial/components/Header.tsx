// dashboard/components/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estilos CSS para a animação
  const slideDownAnimation = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-slideDown {
      animation: slideDown 0.3s ease-out;
    }
  `;

  return (
    <header className="bg-white text-green-600 border-b border-gray-200 shadow-sm sticky top-0 z-50">
      {/* Adicionar estilos CSS globalmente */}
      <style>{slideDownAnimation}</style>
      
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <img 
            src="/Imagens/logoverde.jpeg" 
            alt="WASTECH Logo" 
            className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto"
          />
        </div>

        {/* Contact Info - Desktop */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 mx-4">
          <div className="flex items-center space-x-2 lg:space-x-3 bg-green-50 px-3 lg:px-4 py-2 rounded-lg">
            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            <span className="font-medium text-sm lg:text-base whitespace-nowrap">(88) 93423-4323</span>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-3 bg-green-50 px-3 lg:px-4 py-2 rounded-lg">
            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            <span className="font-medium text-sm lg:text-base whitespace-nowrap truncate max-w-[180px] lg:max-w-none">
              wastech@gmail.com
            </span>
          </div>
        </div>

        {/* Right Section - Desktop */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          <button className="hidden lg:flex items-center space-x-2 bg-green-50 hover:bg-green-100 px-3 lg:px-4 py-2 rounded-lg transition-colors duration-200">
            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            <span className="font-medium text-sm lg:text-base">Notificações</span>
          </button>

          {/* Botões de Autenticação */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link to="/login">
              <button className="bg-green-800 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium text-sm sm:text-base whitespace-nowrap">
                Login
              </button>
            </Link>
            
            <Link to="/cadastro">
              <button className="border border-green-800 text-green-800 px-3 sm:px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-300 font-medium text-sm sm:text-base whitespace-nowrap">
                Cadastrar
              </button>
            </Link>
          </div>

          {/* Ajuda - Desktop */}
          <Link to="/suporte" className="hidden lg:flex items-center space-x-2 text-green-600 hover:text-green-700 px-3 py-2 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium">Ajuda</span>
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Top Bar Mobile */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <img 
              src="/Imagens/logoverde.jpeg" 
              alt="WASTECH Logo" 
              className="h-10 sm:h-12 w-auto"
            />
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Contact Info Icons Mobile */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="flex items-center bg-green-50 p-2 rounded-lg">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
              </div>
              
              <div className="flex items-center bg-green-50 p-2 rounded-lg">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
            </div>

            {/* Botões Mobile */}
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <button className="bg-green-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap">
                  Login
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="px-4 py-3 bg-green-50 border-t border-green-100 animate-slideDown">
            {/* Contact Info Mobile Expanded */}
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3 bg-white p-3 rounded-lg shadow-sm">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span className="font-medium">(88) 93423-4323</span>
              </div>
              
              <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <span className="font-medium truncate">wastech@gmail.com</span>
              </div>
            </div>

            {/* Additional Mobile Menu Items */}
            <div className="space-y-2">
              <Link 
                to="/suporte" 
                className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm hover:bg-green-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">Ajuda</span>
              </Link>

              <button className="w-full flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm hover:bg-green-100 transition-colors text-left">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
                <span className="font-medium">Notificações</span>
              </button>

              <Link 
                to="/cadastro" 
                className="block w-full text-center border border-green-800 text-green-800 px-4 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cadastrar
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};