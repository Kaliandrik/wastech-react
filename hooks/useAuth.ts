import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, updateProfile, User } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔥 useAuth: Usuário alterado:", user);
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // NOVA FUNÇÃO: Atualizar foto de perfil
  const updateProfilePhoto = async (photoURL: string) => {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await updateProfile(auth.currentUser, {
        photoURL: photoURL
      });
      
      // Atualizar o estado local do usuário
      setUser({
        ...auth.currentUser,
        photoURL: photoURL
      } as User);

      console.log("✅ Foto de perfil atualizada com sucesso");
    } catch (error) {
      console.error("❌ Erro ao atualizar foto de perfil:", error);
      throw error;
    }
  };

  return { 
    user, 
    loading, 
    updateProfilePhoto // Exportando a nova função
  };
};