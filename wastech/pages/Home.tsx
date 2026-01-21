// Home.tsx ATUALIZADO:
import React from 'react';
import { Header } from '../components/tela_inicial/components/Header';
import HeroBanner from '../components/tela_inicial/components/HeroBanner';
import SecondSection from '../components/tela_inicial/components/SecondSection';
import ImpactSection from '../components/tela_inicial/components/ImpactSection';
import Footer from '../components/tela_inicial/components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <div className="flex flex-col min-h-screen w-full">
        <Header />
        
        <main className="flex-grow w-full">
          <div className="w-full">
            <HeroBanner />
          </div>
          
          <div className="w-full">
            <SecondSection />
          </div>
          
          <div className="w-full">
            <ImpactSection />
          </div>
        </main>
        
        <div className="mt-auto w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;