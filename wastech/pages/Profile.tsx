import React, { useState, useEffect } from 'react';
import { Header } from '../components/components-dashboard/Header';
import { Navbar } from '../components/components-dashboard/Navbar';
import { useAuth } from '../hooks/useAuth';
import { usePlants } from '../hooks/usePlants';
import { updateProfile } from 'firebase/auth';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { plants, userXP, userLevel, totalSavings } = usePlants();
  
  const [userData, setUserData] = useState({
    name: user?.displayName || 'Usuário',
    level: userLevel || 1,
    xp: userXP || 0,
    plants: plants.length || 0,
    waterSaved: totalSavings || 0,
    completedMissions: 8,
    joinDate: 'Nov 2024',
    dailyStreak: 7
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // 60 AVATARES PRÉ-DEFINIDOS
  const predefinedAvatars = [
    // 🌱 PLANTAS E HORTA (20 avatares)
    { id: 1, url: '🌱', name: 'Muda Verde', category: 'plantas' },
    { id: 2, url: '🌿', name: 'Erva Aromática', category: 'plantas' },
    { id: 3, url: '🍅', name: 'Tomate Feliz', category: 'plantas' },
    { id: 4, url: '🥕', name: 'Cenoura Animada', category: 'plantas' },
    { id: 5, url: '🌻', name: 'Girassol Solar', category: 'plantas' },
    { id: 6, url: '🍓', name: 'Morango Doce', category: 'plantas' },
    { id: 7, url: '🪴', name: 'Vaso de Planta', category: 'plantas' },
    { id: 8, url: '💧', name: 'Gota de Água', category: 'plantas' },
    { id: 9, url: '🌽', name: 'Milho Dourado', category: 'plantas' },
    { id: 10, url: '🥬', name: 'Alface Fresca', category: 'plantas' },
    { id: 11, url: '🥦', name: 'Brócolis Verde', category: 'plantas' },
    { id: 12, url: '🍆', name: 'Beringela Roxa', category: 'plantas' },
    { id: 13, url: '🫑', name: 'Pimentão Colorido', category: 'plantas' },
    { id: 14, url: '🍠', name: 'Batata Doce', category: 'plantas' },
    { id: 15, url: '🥔', name: 'Batata', category: 'plantas' },
    { id: 16, url: '🫘', name: 'Feijão', category: 'plantas' },
    { id: 17, url: '🌰', name: 'Castanha', category: 'plantas' },
    { id: 18, url: '🍋', name: 'Limão Fresco', category: 'plantas' },
    { id: 19, url: '🍊', name: 'Laranja Doce', category: 'plantas' },
    { id: 20, url: '🪷', name: 'Flor de Lótus', category: 'plantas' },

    // 👩 AVATARES FEMININOS (20 avatares)
    { id: 21, url: '👩‍🌾', name: 'Agricultora', category: 'feminino' },
    { id: 22, url: '👩‍🔬', name: 'Cientista', category: 'feminino' },
    { id: 23, url: '👩‍💻', name: 'Tecnóloga', category: 'feminino' },
    { id: 24, url: '🧙‍♀️', name: 'Feiticeira Verde', category: 'feminino' },
    { id: 25, url: '💁‍♀️', name: 'Menina Estilosa', category: 'feminino' },
    { id: 26, url: '🧕', name: 'Mulher com Turbante', category: 'feminino' },
    { id: 27, url: '👸', name: 'Princesa', category: 'feminino' },
    { id: 28, url: '🦸‍♀️', name: 'Super Heroína', category: 'feminino' },
    { id: 29, url: '👩‍🎨', name: 'Artista', category: 'feminino' },
    { id: 30, url: '👩‍🍳', name: 'Chef de Cozinha', category: 'feminino' },
    { id: 31, url: '👩‍🚀', name: 'Astronauta', category: 'feminino' },
    { id: 32, url: '👩‍🚒', name: 'Bombeira', category: 'feminino' },
    { id: 33, url: '👩‍⚕️', name: 'Médica', category: 'feminino' },
    { id: 34, url: '👩‍🏫', name: 'Professora', category: 'feminino' },
    { id: 35, url: '👩‍🎤', name: 'Cantora', category: 'feminino' },
    { id: 36, url: '👩‍🎓', name: 'Formanda', category: 'feminino' },
    { id: 37, url: '💃', name: 'Dançarina', category: 'feminino' },
    { id: 38, url: '🧚‍♀️', name: 'Fada', category: 'feminino' },
    { id: 39, url: '🧜‍♀️', name: 'Sereia', category: 'feminino' },
    { id: 40, url: '👰‍♀️', name: 'Noiva', category: 'feminino' },

    // 👨 AVATARES MASCULINOS (15 avatares)
    { id: 41, url: '👨‍🌾', name: 'Agricultor', category: 'masculino' },
    { id: 42, url: '👨‍🔬', name: 'Cientista', category: 'masculino' },
    { id: 43, url: '👨‍💻', name: 'Tecnólogo', category: 'masculino' },
    { id: 44, url: '🧙‍♂️', name: 'Mago Verde', category: 'masculino' },
    { id: 45, url: '💁‍♂️', name: 'Rapaz Estiloso', category: 'masculino' },
    { id: 46, url: '🦸‍♂️', name: 'Super Herói', category: 'masculino' },
    { id: 47, url: '👨‍🎨', name: 'Artista', category: 'masculino' },
    { id: 48, url: '👨‍🍳', name: 'Chef de Cozinha', category: 'masculino' },
    { id: 49, url: '👨‍🚀', name: 'Astronauta', category: 'masculino' },
    { id: 50, url: '👨‍🚒', name: 'Bombeiro', category: 'masculino' },
    { id: 51, url: '👨‍⚕️', name: 'Médico', category: 'masculino' },
    { id: 52, url: '👨‍🏫', name: 'Professor', category: 'masculino' },
    { id: 53, url: '🕺', name: 'Dançarino', category: 'masculino' },
    { id: 54, url: '🧛‍♂️', name: 'Vampiro', category: 'masculino' },
    { id: 55, url: '🧜‍♂️', name: 'Tritão', category: 'masculino' },

    // 🐛 ANIMAIS E NATUREZA (15 avatares)
    { id: 56, url: '🐝', name: 'Abelha Trabalhadora', category: 'animais' },
    { id: 57, url: '🐞', name: 'Joaninha', category: 'animais' },
    { id: 58, url: '🦋', name: 'Borboleta', category: 'animais' },
    { id: 59, url: '🐢', name: 'Tartaruga', category: 'animais' },
    { id: 60, url: '🐌', name: 'Caracol', category: 'animais' },
    { id: 61, url: '🦔', name: 'Ouriço', category: 'animais' },
    { id: 62, url: '🐸', name: 'Sapo', category: 'animais' },
    { id: 63, url: '🐛', name: 'Lagarta', category: 'animais' },
    { id: 64, url: '🦉', name: 'Coruja Sábia', category: 'animais' },
    { id: 65, url: '🐿️', name: 'Esquilo', category: 'animais' },
    { id: 66, url: '🦊', name: 'Raposa', category: 'animais' },
    { id: 67, url: '🐈', name: 'Gato', category: 'animais' },
    { id: 68, url: '🐕', name: 'Cachorro', category: 'animais' },
    { id: 69, url: '🦥', name: 'Bicho-Preguiça', category: 'animais' },
    { id: 70, url: '🐘', name: 'Elefante', category: 'animais' },

    // 🌟 DIVERSOS E EMOJIS (10 avatares)
    { id: 71, url: '🌎', name: 'Planeta Terra', category: 'diversos' },
    { id: 72, url: '🌈', name: 'Arco-íris', category: 'diversos' },
    { id: 73, url: '⭐', name: 'Estrela', category: 'diversos' },
    { id: 74, url: '🎯', name: 'Alvo', category: 'diversos' },
    { id: 75, url: '🎨', name: 'Paleta de Cores', category: 'diversos' },
    { id: 76, url: '🧩', name: 'Quebra-Cabeça', category: 'diversos' },
    { id: 77, url: '🎭', name: 'Máscaras', category: 'diversos' },
    { id: 78, url: '🪄', name: 'Varinha Mágica', category: 'diversos' },
    { id: 79, url: '🔮', name: 'Bola de Cristal', category: 'diversos' },
    { id: 80, url: '💎', name: 'Diamante', category: 'diversos' }
  ];

  const levels = [
    { level: 1, xpRequired: 0, title: "Iniciante", color: "from-green-400 to-green-500" },
    { level: 2, xpRequired: 100, title: "Aprendiz Verde", color: "from-green-500 to-emerald-500" },
    { level: 3, xpRequired: 300, title: "Jardinheiro", color: "from-emerald-500 to-teal-500" },
    { level: 4, xpRequired: 600, title: "Cultivador", color: "from-teal-500 to-cyan-500" },
    { level: 5, xpRequired: 1000, title: "Agricultor", color: "from-cyan-500 to-blue-500" },
    { level: 6, xpRequired: 1500, title: "Mestre Verde", color: "from-blue-500 to-indigo-500" },
    { level: 7, xpRequired: 2100, title: 'Especialista', color: "from-indigo-500 to-purple-500" },
    { level: 8, xpRequired: 2800, title: "Mestre Jardineiro", color: "from-purple-500 to-pink-500" },
    { level: 9, xpRequired: 3600, title: "Lenda Verde", color: "from-pink-500 to-red-500" },
    { level: 10, xpRequired: 4500, title: "Mestre Supremo", color: "from-red-500 to-yellow-500" }
  ];

  const achievements = [
    { id: 1, name: "Primeiros Passos", icon: "🌱", unlocked: plants.length >= 1, description: "Primeira planta cultivada", xp: 25 },
    { id: 2, name: "Horta em Expansão", icon: "🌿", unlocked: plants.length >= 5, description: "5 plantas cultivadas", xp: 50 },
    { id: 3, name: "Economia Verde", icon: "💰", unlocked: totalSavings >= 100, description: "Economizou R$ 100", xp: 75 },
    { id: 4, name: "Jardinheiro Experiente", icon: "👨‍🌾", unlocked: userLevel >= 3, description: "Nível 3 alcançado", xp: 100 },
    { id: 5, name: "Mestre da Agricultura", icon: "🏆", unlocked: userLevel >= 5, description: "Nível 5 alcançado", xp: 150 },
    { id: 6, name: "Lenda Verde", icon: "🦸", unlocked: userLevel >= 8, description: "Nível 8 alcançado", xp: 200 }
  ];

  const missions = [
    { id: 1, name: "Complete 5 regas esta semana", progress: 3, total: 5, xp: 10, icon: "💦" },
    { id: 2, name: "Economize 10L de água", progress: Math.min(10, Math.floor(totalSavings)), total: 10, xp: 15, icon: "💧" },
    { id: 3, name: "Adicione 2 novas plantas", progress: Math.min(2, plants.length), total: 2, xp: 20, icon: "🌿" }
  ];

  const ranking = [
    { position: 1, name: user?.displayName || "Você", points: userXP, avatar: "👑", level: userLevel },
    { position: 2, name: "Ana Oliveira", points: 1280, avatar: "👩", level: 8 },
    { position: 3, name: "Lucas Mendes", points: 1165, avatar: "👨", level: 7 },
    { position: 4, name: "Mariana Costa", points: 1090, avatar: "👩", level: 7 },
    { position: 5, name: "Carlos Lima", points: 975, avatar: "👨", level: 6 }
  ];

  // Carregar avatar do LocalStorage
  useEffect(() => {
    if (user) {
      const savedAvatar = localStorage.getItem(`user_avatar_${user.uid}`);
      if (savedAvatar) {
        setSelectedAvatar(savedAvatar);
      } else if (user.photoURL) {
        setSelectedAvatar(user.photoURL);
      } else {
        // Avatar padrão
        setSelectedAvatar('👩‍🌾');
      }
    }

    setUserData({
      name: user?.displayName || 'Usuário',
      level: userLevel || 1,
      xp: userXP || 0,
      plants: plants.length || 0,
      waterSaved: totalSavings || 0,
      completedMissions: 8,
      joinDate: 'Nov 2024',
      dailyStreak: 7
    });
  }, [user, userLevel, userXP, plants.length, totalSavings]);

  const currentLevel = levels.find(l => l.level === userData.level) || levels[0];
  const nextLevel = levels.find(l => l.level === userData.level + 1);
  const progressPercentage = nextLevel 
    ? Math.min(100, ((userData.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100)
    : 100;

  // SALVAR AVATAR NO LOCALSTORAGE
  const saveAvatarToLocalStorage = (avatar: string) => {
    if (user) {
      localStorage.setItem(`user_avatar_${user.uid}`, avatar);
      console.log("💾 Avatar salvo no LocalStorage:", avatar);
    }
  };

  const handleSaveProfile = async () => {
    console.log("🎯 Salvamento iniciado");
    
    if (!user) {
      console.error('❌ Usuário não autenticado');
      return;
    }

    setLoading(true);
    setSaveMessage('Salvando...');

    try {
      // 1. SALVAR AVATAR NO LOCALSTORAGE
      saveAvatarToLocalStorage(selectedAvatar);
      setSaveMessage('Avatar salvo!');

      // 2. ATUALIZAR NOME NO FIREBASE (se mudou)
      if (userData.name.trim() !== user.displayName) {
        setSaveMessage('Atualizando nome...');
        await updateProfile(user, {
          displayName: userData.name.trim(),
          photoURL: selectedAvatar
        });
        console.log("✅ Nome atualizado no Firebase");
      } else {
        // Apenas atualizar o avatar no Firebase
        await updateProfile(user, {
          photoURL: selectedAvatar
        });
      }

      setSaveMessage('✅ Perfil atualizado com sucesso!');

      // Fechar modal
      setTimeout(() => {
        setEditModalOpen(false);
        setLoading(false);
      }, 1000);

    } catch (error: any) {
      console.error('❌ Erro ao salvar:', error);
      setSaveMessage('✅ Avatar salvo localmente!');
      setLoading(false);
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setAvatarModalOpen(false);
    setSaveMessage('✅ Avatar selecionado! Clique em Salvar.');
  };

  // Agrupar avatares por categoria
  const avatarsByCategory = predefinedAvatars.reduce((acc, avatar) => {
    if (!acc[avatar.category]) {
      acc[avatar.category] = [];
    }
    acc[avatar.category].push(avatar);
    return acc;
  }, {} as Record<string, typeof predefinedAvatars>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      <Navbar />
      
      {/* Banner Hero do Perfil */}
      <div className={`bg-gradient-to-r ${currentLevel.color} text-white py-12 shadow-lg`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 text-4xl">
                  {selectedAvatar}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                  🔥 {userData.dailyStreak} dias
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{userData.name}</h1>
                <p className="text-white/90 text-lg">Nível {userData.level} - {currentLevel.title}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    🌿 {userData.plants} plantas
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    💰 R$ {userData.waterSaved} economizados
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setEditModalOpen(true)}
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ✏️ Editar Perfil
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6 -mt-6">
        {/* Progresso do Nível */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 rounded-lg mr-3">📈</span>
              Progresso do Nível
            </h2>
            <div className="text-right">
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {userData.xp} XP
              </span>
              <p className="text-sm text-gray-500">Total acumulado</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-green-600">Nível {userData.level}</span>
              <span className="text-emerald-600">{nextLevel ? `Nível ${nextLevel.level}` : 'Nível Máximo'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div 
                className={`bg-gradient-to-r ${currentLevel.color} h-4 rounded-full transition-all duration-1000 shadow-lg`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{userData.xp} XP</span>
              <span>{nextLevel ? `${nextLevel.xpRequired} XP para o próximo` : 'Nível máximo alcançado!'}</span>
            </div>
          </div>
        </div>

        {/* Estatísticas em Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">🌿 Plantas</h3>
                <p className="text-3xl font-bold text-green-600">{userData.plants}</p>
              </div>
              <div className="text-green-400 text-2xl">🌱</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Cultivadas com sucesso</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">💰 Economia</h3>
                <p className="text-3xl font-bold text-blue-600">R$ {userData.waterSaved}</p>
              </div>
              <div className="text-blue-400 text-2xl">💵</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Total economizado</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">🎯 Missões</h3>
                <p className="text-3xl font-bold text-yellow-600">{userData.completedMissions}</p>
              </div>
              <div className="text-yellow-400 text-2xl">⭐</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Completadas</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">🔥 Sequência</h3>
                <p className="text-3xl font-bold text-purple-600">{userData.dailyStreak} dias</p>
              </div>
              <div className="text-purple-400 text-2xl">🔥</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Ativo consecutivamente</p>
          </div>
        </div>

        {/* Missões Diárias */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-lg mr-3">🎯</span>
            Missões Diárias
          </h2>
          <div className="space-y-4">
            {missions.map(mission => (
              <div key={mission.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all">
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-2xl">{mission.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{mission.name}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{mission.progress}/{mission.total}</span>
                    </div>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  +{mission.xp}XP
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conquistas */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white p-2 rounded-lg mr-3">🏆</span>
              Conquistas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    achievement.unlocked 
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg' 
                      : 'border-gray-300 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-2xl ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                      {achievement.icon}
                    </span>
                    <div className="flex-1">
                      <p className={`font-bold ${
                        achievement.unlocked ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs font-semibold ${
                          achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          +{achievement.xp} XP
                        </span>
                        {achievement.unlocked && (
                          <span className="text-green-500 text-xs">✅ Concluída</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking Comunitário */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg mr-3">🥇</span>
              Ranking Comunitário
            </h2>
            <div className="space-y-3">
              {ranking.map((player, index) => (
                <div key={player.position} className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200' : 'hover:bg-green-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold w-6">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'
                    }`}>
                      {player.avatar}
                    </div>
                    <div>
                      <span className={`font-semibold group-hover:text-green-600 transition-colors ${
                        index === 0 ? 'text-yellow-700' : 'text-gray-800'
                      }`}>
                        {player.name}
                      </span>
                      <p className="text-xs text-gray-500">Nível {player.level}</p>
                    </div>
                  </div>
                  <span className={`font-bold px-3 py-1 rounded-full ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-50 text-green-600'
                  }`}>
                    {player.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Editar Perfil</h3>
                <button 
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                  disabled={loading}
                >
                  &times;
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg text-5xl">
                    {selectedAvatar}
                  </div>
                  <button 
                    onClick={() => setAvatarModalOpen(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
                  >
                    🎭 Escolher Avatar
                  </button>
                  <p className="text-xs text-gray-500 mt-2">60 avatares disponíveis</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👤 Nome
                  </label>
                  <input 
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Digite seu nome"
                    disabled={loading}
                  />
                </div>

                {saveMessage && (
                  <div className={`p-3 rounded-xl text-center text-sm font-medium ${
                    saveMessage.includes('❌') 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {saveMessage}
                  </div>
                )}
              </div>

              <div className="flex space-x-4 mt-8">
                <button 
                  onClick={() => setEditModalOpen(false)}
                  disabled={loading}
                  className={`flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                  }`}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold transition-all transform ${
                    loading
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </div>
                  ) : (
                    '💾 Salvar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Avatar */}
      {avatarModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden transform animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Escolha seu Avatar</h3>
                <div className="text-sm text-gray-600">
                  {predefinedAvatars.length} avatares disponíveis
                </div>
                <button 
                  onClick={() => setAvatarModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                >
                  &times;
                </button>
              </div>

              <div className="overflow-y-auto max-h-[60vh] pr-2">
                {Object.entries(avatarsByCategory).map(([category, avatars]) => (
                  <div key={category} className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 capitalize border-b pb-2">
                      {category} ({avatars.length} avatares)
                    </h4>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
                      {avatars.map((avatar) => (
                        <button
                          key={avatar.id}
                          onClick={() => handleAvatarSelect(avatar.url)}
                          className={`flex flex-col items-center p-2 rounded-xl transition-all transform hover:scale-110 ${
                            selectedAvatar === avatar.url 
                              ? 'bg-green-100 border-2 border-green-500 shadow-lg' 
                              : 'bg-gray-50 border border-gray-200 hover:bg-green-50'
                          }`}
                        >
                          <span className="text-2xl mb-1">{avatar.url}</span>
                          <span className="text-[10px] text-gray-600 text-center leading-tight">
                            {avatar.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6 border-t pt-4">
                <button 
                  onClick={() => setAvatarModalOpen(false)}
                  className="bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};