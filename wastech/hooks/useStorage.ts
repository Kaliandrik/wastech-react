import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

export const useStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    console.log("🚀 INICIANDO UPLOAD:", { 
      fileName: file.name, 
      fileSize: file.size, 
      fileType: file.type,
      path 
    });

    try {
      setUploading(true);
      setError(null);

      // Verificação básica do arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas imagens são permitidas');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Imagem muito grande (máximo 5MB)');
      }

      console.log("📁 Criando referência no Storage...");
      const storageRef = ref(storage, path);

      console.log("⬆️ Iniciando upload dos bytes...");
      const snapshot = await uploadBytes(storageRef, file);
      console.log("✅ Upload concluído:", snapshot);

      console.log("🔗 Obtendo URL...");
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("🌐 URL obtida:", downloadURL);

      return downloadURL;

    } catch (err: any) {
      console.error("❌ ERRO NO UPLOAD:", err);
      const errorMessage = err?.message || 'Erro desconhecido no upload';
      setError(errorMessage);
      return null;
    } finally {
      console.log("🏁 Finalizando estado de upload");
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
    error
  };
};