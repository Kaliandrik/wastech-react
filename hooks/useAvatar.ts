import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useAvatar = () => {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState('👤');

  const loadAvatar = () => {
    if (user) {
      const savedAvatar = localStorage.getItem(`user_avatar_${user.uid}`);
      if (savedAvatar) {
        setAvatar(savedAvatar);
      } else if (user.photoURL) {
        setAvatar(user.photoURL);
      } else {
        setAvatar('👤');
      }
    }
  };

  useEffect(() => {
    loadAvatar();

    // Ouvir mudanças no localStorage (caso o avatar mude em outra aba)
    const handleStorageChange = () => {
      loadAvatar();
    };

    // Ouvir evento customizado (quando avatar é atualizado no Profile)
    const handleAvatarUpdated = () => {
      loadAvatar();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('avatarUpdated', handleAvatarUpdated);
    
    // Verificar a cada 2 segundos (para atualizações na mesma aba)
    const interval = setInterval(loadAvatar, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('avatarUpdated', handleAvatarUpdated);
      clearInterval(interval);
    };
  }, [user]);

  return avatar;
};